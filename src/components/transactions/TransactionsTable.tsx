"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { useFinanceStore, Transaction } from "@/store/useFinanceStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Download, ReceiptText } from "lucide-react";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter";
import { motion, AnimatePresence } from "framer-motion";

type SortField = keyof Transaction;

export function TransactionsTable({ limit, hideControls }: { limit?: number; hideControls?: boolean }) {
  const transactions = useFinanceStore((state) => state.transactions);
  const role = useFinanceStore((state) => state.role);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const { format: formatCurrency, rawFormat } = useCurrencyFormatter();

  const sortedAndFiltered = useMemo(() => {
    let result = transactions.filter((t) =>
      t.category.toLowerCase().includes(filter.toLowerCase()),
    );

    result = result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === "date") {
        aValue = new Date(a.date).getTime();
        bValue = new Date(b.date).getTime();
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [transactions, filter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const exportCSV = () => {
    const headers = ["Date,Category,Type,Amount"];
    const rows = sortedAndFiltered.map(
      (t) => `${new Date(t.date).toISOString().split("T")[0]},${t.category},${t.type},${rawFormat(t.amount)}`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Transactions</CardTitle>
        <div className="flex items-center gap-2">
           <Button variant="outline" size="sm" onClick={exportCSV}>
             <Download className="mr-2 h-4 w-4" />
             Export CSV
           </Button>
           {role === "Admin" && <TransactionFormDialog />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter categories..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                   <Button variant="ghost" onClick={() => handleSort("date")}>
                     Date
                     <ArrowUpDown className="ml-2 h-4 w-4" />
                   </Button>
                </TableHead>
                <TableHead>
                   <Button variant="ghost" onClick={() => handleSort("category")}>
                     Category
                     <ArrowUpDown className="ml-2 h-4 w-4" />
                   </Button>
                </TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">
                   <Button variant="ghost" className="ml-auto" onClick={() => handleSort("amount")}>
                     Amount
                     <ArrowUpDown className="ml-2 h-4 w-4" />
                   </Button>
                </TableHead>
                {role === "Admin" && (
                  <TableHead className="text-right">Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence initial={false}>
                {sortedAndFiltered.length ? (
                  sortedAndFiltered.map((transaction) => (
                    <motion.tr
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      key={transaction.id}
                      className="border-b transition-colors hover:bg-muted/50 cursor-pointer"
                    >
                      <TableCell className="font-medium p-4">
                        {format(new Date(transaction.date), "PPP")}
                      </TableCell>
                      <TableCell className="p-4 text-muted-foreground">{transaction.category}</TableCell>
                      <TableCell className="p-4">
                        <Badge
                          variant={
                            transaction.type === "income"
                              ? "default"
                              : "destructive"
                          }
                          className={transaction.type === "income" ? "bg-green-500/10 text-green-500 hover:bg-green-500/20" : "bg-red-500/10 text-red-500 hover:bg-red-500/20"}
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right p-4 font-bold">
                        {formatCurrency(transaction.amount)}
                      </TableCell>
                      {role === "Admin" && (
                        <TableCell className="text-right p-4">
                          <TransactionFormDialog
                            transaction={transaction}
                            triggerLabel="Edit"
                            variant="ghost"
                            size="sm"
                          />
                        </TableCell>
                      )}
                    </motion.tr>
                  ))
                ) : (
                  <motion.tr
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <TableCell colSpan={5} className="h-[300px] text-center">
                      <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                        <div className="p-4 rounded-full bg-muted/50">
                          <ReceiptText className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-medium">No transactions found</p>
                        <p className="text-xs max-w-[200px] mx-auto">
                          Adjust your date range or filters to see more results.
                        </p>
                      </div>
                    </TableCell>
                  </motion.tr>
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}