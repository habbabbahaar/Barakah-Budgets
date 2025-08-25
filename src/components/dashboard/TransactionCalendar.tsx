'use client';

import { useState, useMemo } from 'react';
import type { Transaction } from '@/lib/types';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, User, CreditCard, Banknote, Hand, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { CATEGORY_MAP } from '@/lib/constants';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AddTransactionDialog from './AddTransactionDialog';
import { Button } from '../ui/button';
import { format } from 'date-fns';

interface TransactionCalendarProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => Promise<void>;
  onDelete: (transactionId: string) => Promise<void>;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
};

const TransactionActions = ({ transaction, onEdit, onDelete }: { transaction: Transaction, onEdit: (t: Transaction) => void, onDelete: (t: Transaction) => void }) => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="h-4 w-4" />
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(transaction)}>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(transaction)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
);

const TransactionDetailsBadges = ({ transaction }: { transaction: Transaction }) => {
    const accountName = transaction.account === 'wife' ? "Her" : "His";
    return (
        <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={transaction.account === 'wife' ? 'default' : 'secondary'} className="cursor-default capitalize">
                <User className="h-3 w-3 mr-1" />
                {accountName}
            </Badge>
            <Badge variant="outline" className="cursor-default capitalize">
              {transaction.paymentMethod === 'online' ? <CreditCard className="h-3 w-3 mr-1" /> : <Banknote className="h-3 w-3 mr-1" />}
              {transaction.paymentMethod}
            </Badge>
            {transaction.cashInHand && (
              <Badge variant="outline" className="cursor-default capitalize">
                  <Hand className="h-3 w-3 mr-1" />
                  In Hand
              </Badge>
            )}
        </div>
    );
};


export default function TransactionCalendar({ transactions, onEdit, onDelete }: TransactionCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | undefined>(undefined);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | undefined>(undefined);

  const handleEdit = (transaction: Transaction) => {
    setTransactionToEdit(transaction);
  };

  const handleDeleteConfirm = async () => {
    if (transactionToDelete) {
      await onDelete(transactionToDelete.id);
      setTransactionToDelete(undefined);
    }
  };

  const transactionsByDate = useMemo(() => {
    const map = new Map<string, Transaction[]>();
    transactions.forEach(t => {
      const day = format(t.date, 'yyyy-MM-dd');
      if (!map.has(day)) {
        map.set(day, []);
      }
      map.get(day)?.push(t);
    });
    return map;
  }, [transactions]);

  const selectedDayTransactions = useMemo(() => {
    if (!selectedDate) return [];
    const day = format(selectedDate, 'yyyy-MM-dd');
    return transactionsByDate.get(day) || [];
  }, [selectedDate, transactionsByDate]);

  const transactionDays = useMemo(() => {
    return Array.from(transactionsByDate.keys()).map(dateStr => new Date(dateStr + 'T00:00:00'));
  }, [transactionsByDate]);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="shadow-md">
            <CardContent className="p-2 md:p-4">
                <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    modifiers={{ withTransactions: transactionDays }}
                    modifiersStyles={{
                        withTransactions: {
                            fontWeight: 'bold',
                            color: 'hsl(var(--primary))',
                        },
                    }}
                    className="rounded-md"
                />
            </CardContent>
        </Card>
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl font-headline">
                    Transactions for {selectedDate ? format(selectedDate, 'PPP') : 'selected date'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {selectedDayTransactions.length > 0 ? (
                     <div className="space-y-4">
                     {selectedDayTransactions.map(t => {
                         const CategoryIcon = CATEGORY_MAP[t.category]?.icon || TrendingDown;
                         const isIncome = t.type === 'income';
                         return (
                             <div key={t.id} className="p-4 border rounded-lg flex items-start gap-4">
                                 <div className="flex-shrink-0 pt-1">
                                     {isIncome ? <TrendingUp className="h-6 w-6 text-accent" /> : <TrendingDown className="h-6 w-6 text-destructive" />}
                                 </div>
                                 <div className="flex-1 space-y-2">
                                     <div className="flex justify-between items-start">
                                         <div>
                                             <p className="font-semibold">{t.description}</p>
                                         </div>
                                         <div className="flex-shrink-0 ml-2">
                                             <TransactionActions transaction={t} onEdit={handleEdit} onDelete={setTransactionToDelete} />
                                         </div>
                                     </div>
                                     <div className={`font-bold text-lg ${isIncome ? 'text-accent' : ''}`}>
                                         {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
                                     </div>
                                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CategoryIcon className="h-4 w-4" />
                                        <span>{t.category}</span>
                                     </div>
                                     <TransactionDetailsBadges transaction={t} />
                                 </div>
                             </div>
                         )
                     })}
                 </div>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No transactions on this day.
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
       {transactionToEdit && (
        <AddTransactionDialog 
            transactionToEdit={transactionToEdit}
            onSave={onEdit}
            onClose={() => setTransactionToEdit(undefined)}
        >
          <></>
        </AddTransactionDialog>
      )}
      <AlertDialog open={!!transactionToDelete} onOpenChange={(open) => !open && setTransactionToDelete(undefined)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the transaction.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
