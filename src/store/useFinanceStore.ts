import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays, subDays } from "date-fns";

export type Role = "Admin" | "Viewer";
export type TransactionType = "income" | "expense";
export type CurrencyCode = "USD" | "EUR" | "GBP" | "JPY" | "INR";
export type DateRangeFilter = "all" | "7d" | "30d" | "this-month" | "last-month";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export interface FinanceState {
  role: Role;
  currency: CurrencyCode;
  dateRange: DateRangeFilter;
  transactions: Transaction[];
  monthlyBudgetInUSD: number;
  isLoading: boolean;
  
  // Actions
  setRole: (role: Role) => void;
  setCurrency: (currency: CurrencyCode) => void;
  setDateRange: (range: DateRangeFilter) => void;
  setMonthlyBudget: (budget: number) => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, updated: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  
  // Async Mock Load
  fetchData: () => Promise<void>;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

// Mock data generator for a more realistic distribution
const generateMockData = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const now = new Date();
  
  const addTx = (daysOffset: number, amount: number, category: string, type: TransactionType) => {
    transactions.push({
      id: generateId(),
      date: subDays(now, daysOffset).toISOString(),
      amount,
      category,
      type
    });
  };

  // Salary over couple of months
  addTx(1, 5000, "Salary", "income");
  addTx(31, 5000, "Salary", "income");
  addTx(62, 4800, "Salary", "income");
  
  // Side Hustle
  addTx(12, 1200, "Freelance", "income");
  addTx(45, 800, "Freelance", "income");

  // Groceries (Regular)
  addTx(2, 150, "Groceries", "expense");
  addTx(9, 120, "Groceries", "expense");
  addTx(16, 140, "Groceries", "expense");
  addTx(23, 200, "Groceries", "expense");
  addTx(30, 160, "Groceries", "expense");
  addTx(38, 110, "Groceries", "expense");

  // Entertainment
  addTx(4, 50, "Entertainment", "expense");
  addTx(14, 120, "Entertainment", "expense");
  addTx(25, 45, "Entertainment", "expense");
  addTx(35, 80, "Entertainment", "expense");
  addTx(50, 200, "Entertainment", "expense");

  // Utilities & Bills
  addTx(5, 200, "Utilities", "expense");
  addTx(33, 195, "Utilities", "expense");
  addTx(65, 210, "Utilities", "expense");
  addTx(10, 60, "Internet", "expense");
  addTx(40, 60, "Internet", "expense");

  // Rent
  addTx(1, 1500, "Rent", "expense");
  addTx(30, 1500, "Rent", "expense");
  addTx(60, 1500, "Rent", "expense");

  // Shopping / Tech
  addTx(18, 950, "Electronics", "expense");
  addTx(42, 60, "Clothing", "expense");
  addTx(55, 120, "Clothing", "expense");

  // Travel & Transport
  addTx(6, 40, "Transport", "expense");
  addTx(15, 35, "Transport", "expense");
  addTx(22, 50, "Transport", "expense");
  addTx(28, 450, "Travel", "expense");

  // Sort logically primarily for initial load (newest first)
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const EXCHANGE_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 153.20,
  INR: 83.50,
};

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      role: "Viewer",
      currency: "USD",
      dateRange: "30d",
      transactions: generateMockData(),
      monthlyBudgetInUSD: 3000,
      isLoading: true, // Starts loading to trigger initial skeleton
      
      setRole: (role) => set({ role }),
      setCurrency: (currency) => set({ currency }),
      setDateRange: (dateRange) => set({ dateRange }),
      setMonthlyBudget: (monthlyBudgetInUSD) => set({ monthlyBudgetInUSD }),
      
      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            { ...transaction, id: generateId() },
            ...state.transactions,
          ],
        })),
        
      editTransaction: (id, updated) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updated } : t,
          ),
        })),
        
      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),
        
      fetchData: async () => {
        // Only fetch if we're technically just starting up/re-hydrated
        set({ isLoading: true });
        
        // Mock network delay (e.g. 1 second)
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // In a real app we would load 'data' from API here instead of having it
        // initialized in 'generateMockData'. We'll just complete the loading state.
        set({ isLoading: false });
      }
    }),
    {
      name: "finance-storage",
      partialize: (state) => ({
        role: state.role,
        currency: state.currency,
        dateRange: state.dateRange,
        transactions: state.transactions,
        monthlyBudgetInUSD: state.monthlyBudgetInUSD,
      }), // Ignore isLoading so it always restarts fresh
    },
  ),
);
