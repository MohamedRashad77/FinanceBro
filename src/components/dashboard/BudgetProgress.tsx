"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PencilLine, Target } from "lucide-react";
import { motion } from "framer-motion";
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
import { useState } from "react";

export function BudgetProgress() {
  const transactions = useFilteredTransactions();
  const { monthlyBudgetInUSD, setMonthlyBudget, currency } = useFinanceStore();
  const { format, rawFormat } = useCurrencyFormatter();
  const [open, setOpen] = useState(false);
  const [editBudget, setEditBudget] = useState("");

  const totalExpense = transactions.reduce((acc, curr) => {
    return curr.type === "expense" ? acc + curr.amount : acc;
  }, 0);

  // Use the local currency logic for display, but percentages should remain the same relative
  const percentage = (totalExpense / monthlyBudgetInUSD) * 100;
  const isOverBudget = percentage > 100;

  const handleUpdateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editBudget) return;

    // We must invert it back to USD
    const amountLocal = Number(editBudget);
    const inUSD = amountLocal / rawFormat(1); // Since rate is constant multiplier
    setMonthlyBudget(inUSD);
    setOpen(false);
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Budget Health
            </CardTitle>
            <CardDescription className="text-xs">
              Track your spending against your configured target.
            </CardDescription>
          </div>
          <Dialog
            open={open}
            onOpenChange={(val) => {
              setOpen(val);
              if (val) setEditBudget(rawFormat(monthlyBudgetInUSD).toFixed(2));
            }}
          >
            <DialogTrigger
              render={
                <Button variant="ghost" size="icon-sm">
                  <PencilLine className="h-4 w-4" />
                </Button>
              }
            />
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Update Target Budget</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleUpdateBudget} className="grid py-4 gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="budgetAmount" className="text-right">
                    Amount ({currency})
                  </Label>
                  <Input
                    id="budgetAmount"
                    type="number"
                    step="any"
                    value={editBudget}
                    onChange={(e) => setEditBudget(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Save Settings</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Spent: {format(totalExpense)}
              </span>
              <span className="font-semibold text-foreground">
                Target: {format(monthlyBudgetInUSD)}
              </span>
            </div>
            <Progress
              value={Math.min(percentage, 100)}
              className={
                isOverBudget
                  ? "h-3 [&_[data-slot=progress-indicator]]:bg-destructive"
                  : "h-3"
              }
            />
            <div className="flex justify-between text-xs font-medium">
              {isOverBudget ? (
                <span className="text-destructive">
                  Over budget by {format(totalExpense - monthlyBudgetInUSD)}
                </span>
              ) : (
                <span className="text-green-500">
                  {format(monthlyBudgetInUSD - totalExpense)} remaining
                </span>
              )}
              <span
                className={
                  isOverBudget ? "text-destructive" : "text-muted-foreground"
                }
              >
                {percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
