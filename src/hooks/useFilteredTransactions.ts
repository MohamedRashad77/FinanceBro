import { useMemo } from "react";
import { useFinanceStore, Transaction } from "@/store/useFinanceStore";
import { subDays, startOfMonth, endOfMonth, isWithinInterval, subMonths } from "date-fns";

export function useFilteredTransactions() {
  const transactions = useFinanceStore((state) => state.transactions);
  const dateRange = useFinanceStore((state) => state.dateRange);

  return useMemo(() => {
    if (dateRange === "all") return transactions;

    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    if (dateRange === "7d") {
      startDate = subDays(now, 7);
    } else if (dateRange === "30d") {
      startDate = subDays(now, 30);
    } else if (dateRange === "this-month") {
      startDate = startOfMonth(now);
      endDate = endOfMonth(now);
    } else if (dateRange === "last-month") {
      const lastMonth = subMonths(now, 1);
      startDate = startOfMonth(lastMonth);
      endDate = endOfMonth(lastMonth);
    } else {
      return transactions;
    }

    return transactions.filter((t) => {
      const txDate = new Date(t.date);
      return isWithinInterval(txDate, { start: startDate, end: endDate });
    });
  }, [transactions, dateRange]);
}