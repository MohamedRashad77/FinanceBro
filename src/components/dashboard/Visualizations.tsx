"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { useFinanceStore } from "@/store/useFinanceStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrencyFormatter } from "@/hooks/useCurrencyFormatter";
import { useFilteredTransactions } from "@/hooks/useFilteredTransactions";
import {
  Area,
  AreaChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";
import { LineChart, PieChart as PieChartIcon } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#a855f7"];

export function Visualizations() {
  const transactions = useFilteredTransactions();
  const { format: formatCurrency, rawFormat } = useCurrencyFormatter();

  const trendData = useMemo(() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    let runningBalance = 0;
    return sorted.map((t) => {
      if (t.type === "income") runningBalance += t.amount;
      else runningBalance -= t.amount;

      return {
        date: format(new Date(t.date), "MMM dd"),
        balance: rawFormat(runningBalance),
      };
    });
  }, [transactions, rawFormat]);

  const breakdownData = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "expense");
    const grouped = expenses.reduce(
      (acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value: rawFormat(value) }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, rawFormat]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="grid gap-4 xl:grid-cols-2 h-full"
    >
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-base font-medium">Balance Trend</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-[300px] w-full">
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <AreaChart
                data={trendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis
                  tickFormatter={(val) =>
                    formatCurrency(val).replace(/\.00$/, "")
                  }
                  tick={{fontSize: 12}}
                />
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
              <div className="p-3 rounded-full bg-muted/50">
                <LineChart className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm">No trend data available.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="text-base font-medium">Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 min-h-[300px] flex items-center justify-center">
          {breakdownData.length > 0 ? (
             <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
              <PieChart>
                <Pie
                  data={breakdownData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {breakdownData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", backgroundColor: "hsl(var(--background))", color: "hsl(var(--foreground))" }}
                />
              </PieChart>
             </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full w-full text-muted-foreground space-y-2">
              <div className="p-3 rounded-full bg-muted/50">
                <PieChartIcon className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm">No expenses to break down.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

