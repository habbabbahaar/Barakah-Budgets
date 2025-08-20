import type { TransactionCategory } from './types';
import {
  ShoppingCart,
  Car,
  Home,
  Heartbeat,
  Ticket,
  GraduationCap,
  Briefcase,
  Gift,
  Landmark,
  PiggyBank,
  FileText,
  Wallet,
} from 'lucide-react';

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  { value: 'Groceries', label: 'Groceries', icon: ShoppingCart },
  { value: 'Transport', label: 'Transport', icon: Car },
  { value: 'Housing', label: 'Housing', icon: Home },
  { value: 'Health', label: 'Health', icon: Heartbeat },
  { value: 'Entertainment', label: 'Entertainment', icon: Ticket },
  { value: 'Education', label: 'Education', icon: GraduationCap },
  { value: 'Salary', label: 'Salary', icon: Landmark },
  { value: 'Freelance', label: 'Freelance', icon: Briefcase },
  { value: 'Gift', label: 'Gift', icon: Gift },
  { value: 'Investment', label: 'Investment', icon: PiggyBank },
  { value: 'Bills', label: 'Bills', icon: FileText },
  { value: 'Other', label: 'Other', icon: Wallet },
];

export const CATEGORY_MAP: Record<string, TransactionCategory> = 
  TRANSACTION_CATEGORIES.reduce((acc, category) => {
    acc[category.value] = category;
    return acc;
  }, {} as Record<string, TransactionCategory>);
