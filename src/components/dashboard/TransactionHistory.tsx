'use client';

import { useState } from 'react';
import type { Transaction } from '@/lib/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, User, CreditCard, Banknote, Hand, MoreVertical, Pencil, Trash2, Download } from 'lucide-react';
import { CATEGORY_MAP } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
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

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (transaction: Transaction) => Promise<void>;
  onDelete: (transactionId: string) => Promise<void>;
  onDownloadPdf: () => void;
  isPdfDisabled: boolean;
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

export default function TransactionHistory({ transactions, isLoading, onEdit, onDelete, onDownloadPdf, isPdfDisabled }: TransactionHistoryProps) {
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

  const renderSkeleton = (count: number) => Array.from({ length: count }).map((_, index) => (
    <div key={index} className="flex items-center space-x-4 p-4 border-b">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-8 w-8" />
    </div>
  ));

  return (
    <>
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-headline">Transaction History</CardTitle>
          <Button variant="outline" onClick={onDownloadPdf} disabled={isPdfDisabled}>
            <Download className="mr-2 h-4 w-4" /> Download Monthly PDF
          </Button>
        </CardHeader>
        <CardContent>
          {/* Desktop View */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-5 rounded-full" /></TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/4 mt-1" />
                      </TableCell>
                      <TableCell><Skeleton className="h-4 w-1/2" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-4 w-1/2 ml-auto" /></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))
                ) : transactions.map((t) => {
                  const CategoryIcon = CATEGORY_MAP[t.category]?.icon || TrendingDown;
                  const isIncome = t.type === 'income';

                  return (
                    <TableRow key={t.id} className="transition-colors hover:bg-secondary/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                            {isIncome ? <TrendingUp className="h-5 w-5 text-accent" /> : <TrendingDown className="h-5 w-5 text-destructive" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{t.description}</div>
                        <div className="text-sm text-muted-foreground">{t.date.toLocaleDateString()}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                           <CategoryIcon className="h-4 w-4 text-muted-foreground" />
                            <span>{t.category}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-col items-end">
                            <span className={`font-semibold ${isIncome ? 'text-accent' : ''}`}>
                                {isIncome ? '+' : '-'} {formatCurrency(t.amount)}
                            </span>
                            <div className="mt-1">
                                <TransactionDetailsBadges transaction={t} />
                            </div>
                        </div>
                      </TableCell>
                      <TableCell>
                          <TransactionActions transaction={t} onEdit={handleEdit} onDelete={setTransactionToDelete} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {/* Mobile View */}
          <div className="md:hidden">
            {isLoading ? renderSkeleton(5) : (
                <div className="space-y-4">
                    {transactions.map(t => {
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
                                            <p className="text-sm text-muted-foreground">{t.date.toLocaleDateString()}</p>
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
            )}
          </div>

          {!isLoading && transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                  No transactions for this day. Add one or pick another date!
              </div>
          )}
        </CardContent>
      </Card>
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
