"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFinanceStore, Transaction, EXCHANGE_RATES } from "@/store/useFinanceStore";

interface TransactionFormDialogProps {
  transaction?: Transaction;
  triggerLabel?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function TransactionFormDialog({
  transaction,
  triggerLabel = "Add Transaction",
  variant = "default",
  size = "default",
}: TransactionFormDialogProps) {
  const [open, setOpen] = useState(false);
  const currency = useFinanceStore((state) => state.currency);
  const addTransaction = useFinanceStore((state) => state.addTransaction);
  const editTransaction = useFinanceStore((state) => state.editTransaction);
  const deleteTransaction = useFinanceStore((state) => state.deleteTransaction);

  const isEdit = !!transaction;

  // Convert USD to local currency for editing
  const initialLocalAmount = transaction 
    ? (transaction.amount * (EXCHANGE_RATES[currency] || 1)).toFixed(2)
    : "";

  const [amount, setAmount] = useState(initialLocalAmount);
  const [category, setCategory] = useState(transaction?.category || "");
  const [type, setType] = useState<"income" | "expense">(
    transaction?.type || "expense",
  );
  const [date, setDate] = useState(
    transaction?.date.split("T")[0] || new Date().toISOString().split("T")[0],
  );

  // Update initial amount if dialog opens and currency changed while closed
  useEffect(() => {
    if (open && transaction) {
      setAmount((transaction.amount * (EXCHANGE_RATES[currency] || 1)).toFixed(2));
    } else if (!open && !isEdit) {
      setAmount("");
    }
  }, [open, currency, transaction, isEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !date) return;

    // Convert local currency back to USD for storage
    const rate = EXCHANGE_RATES[currency] || 1;
    const amountInUSD = Number(amount) / rate;

    if (isEdit) {
      editTransaction(transaction.id, {
        amount: amountInUSD,
        category,
        type,
        date: new Date(date).toISOString(),
      });
    } else {
      addTransaction({
        amount: amountInUSD,
        category,
        type,
        date: new Date(date).toISOString(),
      });
    }
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    if (!isEdit) {
      setAmount("");
      setCategory("");
      setType("expense");
      setDate(new Date().toISOString().split("T")[0]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={variant} size={size}>
            {!isEdit && <Plus className="mr-2 h-4 w-4" />}
            {triggerLabel}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Transaction" : "New Transaction"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="date" className="text-right">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount ({currency})
            </Label>
            <Input
              id="amount"
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              Category
            </Label>
            <Input
              id="category"
              placeholder="e.g. Groceries"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right">
              Type
            </Label>
            <Select
              value={type}
              onValueChange={(v) => {
                if (v) setType(v as "income" | "expense");
              }}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            {isEdit && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  deleteTransaction(transaction.id);
                  setOpen(false);
                }}
              >
                Delete
              </Button>
            )}
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}