"use client";

import { useFinanceStore, DateRangeFilter } from "@/store/useFinanceStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarDays } from "lucide-react";

export function DashboardControls() {
  const { dateRange, setDateRange } = useFinanceStore();

  return (
    <div className="flex items-center gap-3 bg-white/50 dark:bg-zinc-900/50 p-2 rounded-lg border shadow-sm">
      <div className="flex flex-col">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1 px-1">
          Date Range
        </span>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <Select
            value={dateRange}
            onValueChange={(val: DateRangeFilter | null) => {
              if (val) setDateRange(val as DateRangeFilter);
            }}
          >
            <SelectTrigger className="w-[160px] h-8 text-sm">
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

