import type { LucideIcon } from "lucide-react";

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = {
  value: string;
  label: string;
  icon: LucideIcon;
};

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  isShared: boolean;
  date: Date;
}
