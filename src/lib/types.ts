import type { LucideIcon } from "lucide-react";

export type TransactionType = 'income' | 'expense';
export type PaymentMethod = 'cash' | 'online';
export type AccountType = 'wife' | 'husband';

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
  account: AccountType;
  date: Date;
  paymentMethod: PaymentMethod;
  cashInHand?: boolean;
}
