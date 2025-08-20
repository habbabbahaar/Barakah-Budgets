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
import { TrendingUp, TrendingDown, User, Users } from 'lucide-react';
import { CATEGORY_MAP } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

export default function TransactionHistory({ transactions, isLoading }: TransactionHistoryProps) {
  return (
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
                        <Badge variant={t.isShared ? 'default' : 'secondary'} className="mt-1 cursor-default">
                            {t.isShared ? <Users className="h-3 w-3 mr-1" /> : <User className="h-3 w-3 mr-1" />}
                            {t.isShared ? 'Shared' : 'Personal'}
                        </Badge>
                    </div>
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
  );
}
