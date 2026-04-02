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
import { ArrowUpDown, Download } from "lucide-react";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter";

type SortField = keyof Transaction;

export function TransactionsTable() {
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
              {sortedAndFiltered.length ? (
                sortedAndFiltered.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium p-4">
                      {format(new Date(transaction.date), "PPP")}
                    </TableCell>
                    <TableCell className="p-4">{transaction.category}</TableCell>
                    <TableCell className="p-4">
                      <Badge
                        variant={
                          transaction.type === "income"
                            ? "default"
                            : "destructive"
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right p-4">
                      {formatCurrency(transaction.amount)}
                    </TableCell>
                    {role === "Admin" && (
                      <TableCell className="text-right p-4">
                        <TransactionFormDialog
                          transaction={transaction}
                          triggerLabel="Edit"
                          variant="outline"
                          size="sm"
                        />
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}