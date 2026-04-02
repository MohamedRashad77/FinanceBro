"use client";

import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { Visualizations } from "@/components/dashboard/Visualizations";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Finance Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Track your income, expenses, and financial insights
          </p>
        </div>

        <SummaryCards />

        <Visualizations />

        <div>
          <h2 className="text-xl font-bold tracking-tight mb-4">Transactions</h2>
          <TransactionsTable />
        </div>
      </div>
    </DashboardLayout>
  );
}