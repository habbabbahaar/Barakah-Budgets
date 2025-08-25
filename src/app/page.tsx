'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Transaction } from '@/lib/types';
import { PlusCircle, Wallet, HandCoins, Download } from 'lucide-react';
import FinanceSummaryCard from '@/components/dashboard/FinanceSummaryCard';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import AddTransactionDialog from '@/components/dashboard/AddTransactionDialog';
import { Button } from '@/components/ui/button';
import { getTransactions, addTransaction as addTransactionService, updateTransaction as updateTransactionService, deleteTransaction as deleteTransactionService } from '@/services/transactions';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [selectedDay, setSelectedDay] = useState<string>('all');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const fetchedTransactions = await getTransactions();
        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast({
            title: "Error",
            description: "Failed to fetch transactions.",
            variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [toast]);

  const addTransaction = async (transaction: Omit<Transaction, 'id' | 'date'>) => {
    try {
      const newTransaction = await addTransactionService(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction.",
        variant: "destructive",
      });
    }
  };

  const updateTransaction = async (transaction: Transaction) => {
    try {
      await updateTransactionService(transaction);
      setTransactions(prev => prev.map(t => t.id === transaction.id ? transaction : t));
    } catch (error) {
        console.error("Error updating transaction:", error);
        toast({
            title: "Error",
            description: "Failed to update transaction.",
            variant: "destructive",
        });
    }
  };

  const deleteTransaction = async (transactionId: string) => {
    try {
        await deleteTransactionService(transactionId);
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
    } catch (error) {
        console.error("Error deleting transaction:", error);
        toast({
            title: "Error",
            description: "Failed to delete transaction.",
            variant: "destructive",
        });
    }
  };

  const downloadPdf = async () => {
    const { generatePdf } = await import('@/lib/pdf');
    generatePdf(transactions);
  };

  const { years, months, days } = useMemo(() => {
    const years = [...new Set(transactions.map(t => t.date.getFullYear()))].sort((a, b) => b - a);
    const months = [...new Set(transactions.filter(t => selectedYear === 'all' || t.date.getFullYear() === parseInt(selectedYear)).map(t => t.date.getMonth()))].sort((a, b) => a - b);
    const days = [...new Set(transactions.filter(t => 
        (selectedYear === 'all' || t.date.getFullYear() === parseInt(selectedYear)) &&
        (selectedMonth === 'all' || t.date.getMonth() === parseInt(selectedMonth))
    ).map(t => t.date.getDate()))].sort((a, b) => a - b);
    return { years, months, days };
  }, [transactions, selectedYear, selectedMonth]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
        const yearMatch = selectedYear === 'all' || t.date.getFullYear() === parseInt(selectedYear);
        const monthMatch = selectedMonth === 'all' || t.date.getMonth() === parseInt(selectedMonth);
        const dayMatch = selectedDay === 'all' || t.date.getDate() === parseInt(selectedDay);
        return yearMatch && monthMatch && dayMatch;
    });
  }, [transactions, selectedYear, selectedMonth, selectedDay]);


  const { wife, husband, cashInHand } = useMemo(() => {
    const wife = { income: 0, expenses: 0 };
    const husband = { income: 0, expenses: 0 };
    const cashInHand = { wife: 0, husband: 0 };

    filteredTransactions.forEach(t => {
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
  }, [filteredTransactions]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


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
          <div className='flex items-center gap-2'>
            <Button variant="outline" onClick={downloadPdf} disabled={transactions.length === 0}>
                <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
            <AddTransactionDialog onSave={addTransaction}>
               <Button>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
            </AddTransactionDialog>
          </div>
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
              title="Pamii Account"
              income={wife.income}
              expenses={wife.expenses}
              balance={wife.income - wife.expenses}
            />
            <FinanceSummaryCard
              title="Habba Account"
              income={husband.income}
              expenses={husband.expenses}
              balance={husband.income - husband.expenses}
            />
             <FinanceSummaryCard
              title="Cash on Hand"
              balanceIcon={HandCoins}
              wifeBalance={cashInHand.wife}
              husbandBalance={cashInHand.husband}
              balance={cashInHand.wife + cashInHand.husband}
              isCashSummary
            />
          </div>
        )}

        <div className="mb-4 flex flex-col md:flex-row gap-4">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Year" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Years</SelectItem>
                    {years.map(year => <SelectItem key={year} value={String(year)}>{year}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={selectedYear === 'all'}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Month" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Months</SelectItem>
                    {months.map(month => <SelectItem key={month} value={String(month)}>{monthNames[month]}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select value={selectedDay} onValueChange={setSelectedDay} disabled={selectedMonth === 'all'}>
                <SelectTrigger>
                    <SelectValue placeholder="Select Day" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Days</SelectItem>
                    {days.map(day => <SelectItem key={day} value={String(day)}>{day}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>

        <TransactionHistory 
          transactions={filteredTransactions} 
          isLoading={loading}
          onEdit={updateTransaction}
          onDelete={deleteTransaction}
        />
      </main>
    </div>
  );
}
