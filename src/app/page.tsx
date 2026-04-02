"use client";

import { useEffect } from "react";
import { useFinanceStore } from "@/store/useFinanceStore";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { Visualizations } from "@/components/dashboard/Visualizations";
import { Insights } from "@/components/dashboard/Insights";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardControls } from "@/components/dashboard/DashboardControls";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { isLoading, fetchData } = useFinanceStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Finance Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track your income, expenses, and financial insights
            </p>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4"
            >
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Fetching latest local data...</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col gap-8"
            >
              <DashboardControls />

              <SummaryCards />

              <div className="grid gap-4 md:grid-cols-[1fr_300px]">
                 <div className="md:col-span-1 border rounded-lg p-0 border-none bg-transparent">
                   <Visualizations />
                 </div>
                 <div className="md:col-span-1">
                   <BudgetProgress />
                 </div>
              </div>

              <div>
                 <h2 className="text-xl font-bold tracking-tight mb-4">Financial Insights</h2>
                 <Insights />
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight mb-4">Transactions</h2>
                <TransactionsTable />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}