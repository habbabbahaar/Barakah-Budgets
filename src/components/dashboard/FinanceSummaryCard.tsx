import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Landmark, User, Users, HandCoins, type LucideIcon } from 'lucide-react';

interface FinanceSummaryCardProps {
  title: string;
  income?: number;
  expenses?: number;
  balance: number;
  isCashSummary?: boolean;
  wifeBalance?: number;
  husbandBalance?: number;
  balanceIcon?: LucideIcon;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function FinanceSummaryCard({ 
  title, 
  income, 
  expenses, 
  balance,
  isCashSummary = false,
  wifeBalance,
  husbandBalance,
  balanceIcon: BalanceIcon = Landmark,
}: FinanceSummaryCardProps) {
  const balanceColor = balance >= 0 ? 'text-accent' : 'text-destructive';

  return (
    <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isCashSummary ? (
          <>
            <div className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>her</span>
              </div>
              <span className="font-semibold">{formatCurrency(wifeBalance ?? 0)}</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>His</span>
              </div>
              <span className="font-semibold">{formatCurrency(husbandBalance ?? 0)}</span>
            </div>
          </>
        ) : (
          <>
            {income !== undefined && (
              <div className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp className="h-5 w-5" />
                  <span>Income</span>
                </div>
                <span className="font-semibold">{formatCurrency(income)}</span>
              </div>
            )}
            {expenses !== undefined && (
              <div className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2 text-red-600">
                  <TrendingDown className="h-5 w-5" />
                  <span>Expenses</span>
                </div>
                <span className="font-semibold">{formatCurrency(expenses)}</span>
              </div>
            )}
          </>
        )}
        
        <div className="border-t pt-4 flex items-center justify-between text-xl font-bold">
          <div className="flex items-center gap-2">
            <BalanceIcon className="h-6 w-6" />
            <span>Balance</span>
          </div>
          <span className={balanceColor}>{formatCurrency(balance)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
