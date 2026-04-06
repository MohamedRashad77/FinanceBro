import { useFinanceStore, EXCHANGE_RATES } from "@/store/useFinanceStore";
import { useCallback } from "react";

export function useCurrencyFormatter() {
  const currency = useFinanceStore((state) => state.currency);

  const format = useCallback(
    (amountInUSD: number) => {
      // @ts-ignore
      const rate = EXCHANGE_RATES[currency] || 1;
      const convertedAmount = amountInUSD * rate;

      return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: currency === "JPY" ? 0 : 2,
      }).format(convertedAmount);
    },
    [currency]
  );
  
  const rawFormat = useCallback(
    (amountInUSD: number) => {
        // @ts-ignore
        const rate = EXCHANGE_RATES[currency] || 1;
        return amountInUSD * rate;
    },
    [currency]
  );

  return { format, rawFormat };
}
