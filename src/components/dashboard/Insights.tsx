"use client";

import { useMemo } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingDown, TrendingUp, AlertCircle, CalendarClock } from "lucide-react";
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter";
import { subMonths, isWithinInterval, startOfMonth, endOfMonth } from "date-fns";
import { motion } from "framer-motion";

export function Insights() {
  const allTransactions = useFinanceStore((state) => state.transactions);
  const transactions = useFilteredTransactions();
  const { format } = useCurrencyFormatter();

  const insights = useMemo(() => {
    if (transactions.length === 0) return null;

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryExpenses: Record<string, number> = {};
    let largestExpense = transactions[0];

    transactions.forEach((t) => {
      if (t.type === "income") {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
        categoryExpenses[t.category] =
          (categoryExpenses[t.category] || 0) + t.amount;
        if (!largestExpense || (t.amount > largestExpense.amount && t.type === "expense")) {
          largestExpense = t;
        }
      }
    });

    let highestCategory = { name: "N/A", amount: 0 };
    for (const [name, amount] of Object.entries(categoryExpenses)) {
      if (amount > highestCategory.amount) {
        highestCategory = { name, amount };
      }
    }

    const savingsRate =
      totalIncome > 0
        ? Math.max(0, ((totalIncome - totalExpense) / totalIncome) * 100).toFixed(1)
        : "0.0";

    // Calculate Month-over-Month
    const today = new Date();
    const currMonthStart = startOfMonth(today);
    const currMonthEnd = endOfMonth(today);
    const lastMonthStart = startOfMonth(subMonths(today, 1));
    const lastMonthEnd = endOfMonth(subMonths(today, 1));

    let currMonthExpense = 0;
    let lastMonthExpense = 0;

    allTransactions.forEach(t => {
      if (t.type === "expense") {
        const d = new Date(t.date);
        if (isWithinInterval(d, { start: currMonthStart, end: currMonthEnd })) {
           currMonthExpense += t.amount;
        } else if (isWithinInterval(d, { start: lastMonthStart, end: lastMonthEnd })) {
           lastMonthExpense += t.amount;
        }
      }
    });
    
    let momChange = 0;
    if (lastMonthExpense > 0) {
       momChange = ((currMonthExpense - lastMonthExpense) / lastMonthExpense) * 100;
    } else if (currMonthExpense > 0) {
       momChange = 100;
    }

    return {
      highestCategory,
      largestExpense: largestExpense?.type === "expense" ? largestExpense : null,
      savingsRate,
      momChange,
    };
  }, [transactions, allTransactions]);

  if (!insights) {
    return (
      <Card>
        <CardContent className="flex h-32 items-center justify-center text-muted-foreground">
          No data available for insights.
        </CardContent>
      </Card>
    );
  }

  const isMoMIncreased = insights.momChange > 0;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {},
      }}
      className="grid gap-4 md:grid-cols-4"
    >
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Expense Category</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.highestCategory.name}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {format(insights.highestCategory.amount)} total
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.savingsRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Of total income saved
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Largest Single Expense</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.largestExpense ? format(insights.largestExpense.amount) : format(0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {insights.largestExpense ? `${insights.largestExpense.category} on ${new Date(insights.largestExpense.date).toLocaleDateString()}` : "No expenses"}
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MoM Spending</CardTitle>
            <CalendarClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${isMoMIncreased ? "text-red-500" : "text-green-500"}`}>
              {isMoMIncreased ? "+" : ""}{Math.round(insights.momChange)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Compared to last month
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

