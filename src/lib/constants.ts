import type { TransactionCategory } from './types';
import {
  ShoppingCart,
  Car,
  Home,
  Heart,
  Ticket,
  GraduationCap,
  Briefcase,
  Gift,
  Landmark,
  PiggyBank,
  FileText,
  Wallet,
  ShoppingBag,
  Utensils,
  Lightbulb,
  Plane,
  Smile,
  HeartHandshake,
} from 'lucide-react';

export const TRANSACTION_CATEGORIES: TransactionCategory[] = [
  { value: 'Groceries', label: 'Groceries', icon: ShoppingCart },
  { value: 'Transport', label: 'Transport', icon: Car },
  { value: 'Housing', label: 'Housing', icon: Home },
  { value: 'Health', label: 'Health', icon: Heart },
  { value: 'Entertainment', label: 'Entertainment', icon: Ticket },
  { value: 'Education', label: 'Education', icon: GraduationCap },
  { value: 'Shopping', label: 'Shopping', icon: ShoppingBag },
  { value: 'Food & Dining', label: 'Food & Dining', icon: Utensils },
  { value: 'Utilities', label: 'Utilities', icon: Lightbulb },
  { value: 'Travel', label: 'Travel', icon: Plane },
  { value: 'Personal Care', label: 'Personal Care', icon: Smile },
  { value: 'Charity', label: 'Charity', icon: HeartHandshake },
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
