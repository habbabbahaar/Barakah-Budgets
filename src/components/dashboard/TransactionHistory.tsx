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
import { TrendingUp, TrendingDown, User, CreditCard, Banknote, Hand, MoreVertical, Pencil, Trash2 } from 'lucide-react';
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
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

export default function TransactionHistory({ transactions, isLoading, onEdit, onDelete }: TransactionHistoryProps) {
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

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-headline">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
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
                const accountName = t.account === 'wife' ? "Her's" : "His";

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
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={t.account === 'wife' ? 'default' : 'secondary'} className="cursor-default capitalize">
                                <User className="h-3 w-3 mr-1" />
                                {accountName}
                            </Badge>
                            <Badge variant="outline" className="cursor-default capitalize">
                              {t.paymentMethod === 'online' ? <CreditCard className="h-3 w-3 mr-1" /> : <Banknote className="h-3 w-3 mr-1" />}
                              {t.paymentMethod}
                            </Badge>
                            {t.cashInHand && (
                              <Badge variant="outline" className="cursor-default capitalize">
                                  <Hand className="h-3 w-3 mr-1" />
                                  In Hand
                              </Badge>
                            )}
                          </div>
                      </div>
                    </TableCell>
                    <TableCell>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">Open menu</span>
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(t)}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    <span>Edit</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setTransactionToDelete(t)} className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Delete</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {!isLoading && transactions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                  No transactions yet. Add one to get started!
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
