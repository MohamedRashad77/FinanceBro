"use client";

import { useFinanceStore } from "@/store/useFinanceStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Coins } from "lucide-react";
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { useMemo } from "react";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export function SummaryCards() {
  const transactions = useFilteredTransactions();
  const { format } = useCurrencyFormatter();

  const { income, expense, balance } = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === "income") {
          acc.income += curr.amount;
        } else {
          acc.expense += curr.amount;
        }
        acc.balance = acc.income - acc.expense;
        return acc;
      },
      { income: 0, expense: 0, balance: 0 },
    );
  }, [transactions]);

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-3"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {},
      }}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
        <Card className="transition-all duration-300 hover:shadow-lg hover:border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <Coins className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              {format(balance)}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
        <Card className="transition-all duration-300 hover:shadow-lg hover:border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {format(income)}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <motion.div variants={itemVariants} whileHover={{ y: -5, transition: { duration: 0.2 } }}>
        <Card className="transition-all duration-300 hover:shadow-lg hover:border-red-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {format(expense)}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

