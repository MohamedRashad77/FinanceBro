"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  
  ComposedChart,
  Area,
  Line
} from "recharts";

export function DetailedInsightsCharts() {
  const transactions = useFilteredTransactions();
  const { format: formatCurrency, rawFormat } = useCurrencyFormatter();

  const categoryData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const grouped = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: rawFormat(value) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, rawFormat]);

  const cashFlowData = useMemo(() => {
    const grouped = transactions.reduce((acc, curr) => {
      const dateKey = format(new Date(curr.date), "MMM dd");
      if (!acc[dateKey]) acc[dateKey] = { date: dateKey, income: 0, expense: 0 };
      if (curr.type === "income") acc[dateKey].income += curr.amount;
      else acc[dateKey].expense += curr.amount;
      return acc;
    }, {} as Record<string, { date: string; income: number; expense: number }>);

    return Object.values(grouped).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    ).map(d => ({ ...d, income: rawFormat(d.income), expense: rawFormat(d.expense) }));
  }, [transactions, rawFormat]);

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Daily comparison of cash flow</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {cashFlowData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <ComposedChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tickFormatter={(val) => formatCurrency(val).replace(/\.00$/, "")} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(Number(value))}
                    contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="income" fill="#22c55e" stroke="#22c55e" fillOpacity={0.2} name="Income" />
                  <Line type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2} name="Expense" />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
               <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                 No cash flow data available.
               </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="h-[400px] flex flex-col">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Highest spending areas</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(val) => formatCurrency(val).replace(/\.00$/, "")} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(Number(value))}
                    cursor={{ fill: "hsl(var(--muted))" }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Amount" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                 No category data available.
               </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
