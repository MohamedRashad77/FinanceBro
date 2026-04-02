"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardControls } from "@/components/dashboard/DashboardControls";
import { Insights } from "@/components/dashboard/Insights";
import { motion } from "framer-motion";
import { DetailedInsightsCharts } from "@/components/dashboard/DetailedInsightsCharts";

export default function InsightsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Insights & Analytics</h1>
            <p className="text-muted-foreground mt-2">
              Deep dive into your spending habits and financial health
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
          
          <div>
             <h2 className="text-xl font-bold tracking-tight mb-4">Performance Metrics</h2>
             <Insights />
          </div>

          <DetailedInsightsCharts />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}