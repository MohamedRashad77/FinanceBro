"use client";

import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardControls } from "@/components/dashboard/DashboardControls";
import { motion } from "framer-motion";

export default function TransactionsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground mt-2">
              View, search, and manage your complete transaction history
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col gap-8"
        >
          <DashboardControls />
          <TransactionsTable />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}