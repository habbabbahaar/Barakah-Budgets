'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Transaction } from '@/lib/types';
import { PlusCircle, Wallet, HandCoins } from 'lucide-react';
import FinanceSummaryCard from '@/components/dashboard/FinanceSummaryCard';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import AddTransactionDialog from '@/components/dashboard/AddTransactionDialog';
import { Button } from '@/components/ui/button';
import { getTransactions, addTransaction as addTransactionService } from '@/services/transactions';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const fetchedTransactions = await getTransactions();
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        // Optionally, show a toast notification to the user
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      const newTransaction = await addTransactionService(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error("Error adding transaction:", error);
       // Optionally, show a toast notification to the user
    }
  };

  const { wife, husband, cashInHand } = useMemo(() => {
    const wife = { income: 0, expenses: 0 };
    const husband = { income: 0, expenses: 0 };
    const cashInHand = { wife: 0, husband: 0 };

    transactions.forEach(t => {
      if (t.cashInHand) {
        const cashTarget = t.account === 'wife' ? 'wife' : 'husband';
        if (t.type === 'income') {
          cashInHand[cashTarget] += t.amount;
        } else {
          cashInHand[cashTarget] -= t.amount;
        }
      } else {
        const target = t.account === 'wife' ? wife : husband;
        if (t.type === 'income') {
          target.income += t.amount;
        } else {
          target.expenses += t.amount;
        }
      }
    });

    return { wife, husband, cashInHand };
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
        
        {loading ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <FinanceSummaryCard
              title="Wife's Account"
              income={wife.income}
              expenses={wife.expenses}
              balance={wife.income - wife.expenses}
            />
            <FinanceSummaryCard
              title="Husband's Account"
              income={husband.income}
              expenses={husband.expenses}
              balance={husband.income - husband.expenses}
            />
             <FinanceSummaryCard
              title="Cash on Hand"
              balanceIcon={HandCoins}
              income={cashInHand.wife}
              incomeLabel="Wife"
              expenses={cashInHand.husband}
              expensesLabel="Husband"
              balance={cashInHand.wife + cashInHand.husband}
              isCashSummary
            />
          </div>
        )}

        <TransactionHistory transactions={transactions} isLoading={loading} />
      </main>
    </div>
  );
}
