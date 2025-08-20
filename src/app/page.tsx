'use client';

import { useState, useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import { PlusCircle, Wallet } from 'lucide-react';
import FinanceSummaryCard from '@/components/dashboard/FinanceSummaryCard';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import AddTransactionDialog from '@/components/dashboard/AddTransactionDialog';
import { Button } from '@/components/ui/button';

const initialTransactions: Transaction[] = [
  { id: '1', amount: 3000, type: 'income', category: 'Salary', description: 'Monthly paycheck', isShared: true, date: new Date('2023-10-01') },
  { id: '2', amount: 80, type: 'expense', category: 'Groceries', description: 'Weekly groceries', isShared: true, date: new Date('2023-10-05') },
  { id: '3', amount: 50, type: 'expense', category: 'Transport', description: 'Gas for car', isShared: false, date: new Date('2023-10-06') },
  { id: '4', amount: 250, type: 'income', category: 'Freelance', description: 'Side project payment', isShared: false, date: new Date('2023-10-10') },
  { id: '5', amount: 45, type: 'expense', category: 'Entertainment', description: 'Movie tickets', isShared: true, date: new Date('2023-10-12') },
  { id: '6', amount: 1200, type: 'expense', category: 'Bills', description: 'Rent payment', isShared: true, date: new Date('2023-10-01') },
];


export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: new Date().getTime().toString(),
      date: new Date(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const { shared, personal } = useMemo(() => {
    const shared = { income: 0, expenses: 0 };
    const personal = { income: 0, expenses: 0 };

    transactions.forEach(t => {
      const target = t.isShared ? shared : personal;
      if (t.type === 'income') {
        target.income += t.amount;
      } else {
        target.expenses += t.amount;
      }
    });

    return { shared, personal };
  }, [transactions]);


  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto p-4 md:p-8">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline text-primary">
              Barakah Budgets
            </h1>
          </div>
          <AddTransactionDialog onAddTransaction={addTransaction}>
             <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
              </Button>
          </AddTransactionDialog>
        </header>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 mb-8">
          <FinanceSummaryCard
            title="paami acaunt"
            income={shared.income}
            expenses={shared.expenses}
            balance={shared.income - shared.expenses}
          />
          <FinanceSummaryCard
            title="habba acound"
            income={personal.income}
            expenses={personal.expenses}
            balance={personal.income - personal.expenses}
          />
        </div>

        <TransactionHistory transactions={transactions} />
      </main>
    </div>
  );
}
