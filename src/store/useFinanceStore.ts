import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays, subDays } from "date-fns";

export type Role = "Admin" | "Viewer";
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
}

export interface FinanceState {
  role: Role;
  transactions: Transaction[];
  setRole: (role: Role) => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, updated: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

const generateId = () => Math.random().toString(36).substr(2, 9);

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    date: subDays(new Date(), 2).toISOString(),
    amount: 5000,
    category: "Salary",
    type: "income",
  },
  {
    id: "2",
    date: subDays(new Date(), 1).toISOString(),
    amount: 150,
    category: "Groceries",
    type: "expense",
  },
  {
    id: "3",
    date: new Date().toISOString(),
    amount: 50,
    category: "Entertainment",
    type: "expense",
  },
  {
    id: "4",
    date: addDays(new Date(), 1).toISOString(),
    amount: 200,
    category: "Utilities",
    type: "expense",
  },
];

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      role: "Viewer",
      transactions: MOCK_TRANSACTIONS,
      setRole: (role) => set({ role }),
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
    }),
    {
      name: "finance-storage",
    },
  ),
);
