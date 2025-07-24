import { StatCard } from '@/components/dashboard/stat-card';
import { DollarSign, Users, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getDashboardData } from './dashboard.logic';

export default async function DashboardPage() {
  const {
    totalRevenue,
    totalExpenses,
    occupiedRooms,
    totalRooms,
    occupancyRate,
    recentTransactions,
    recentCustomers,
    customersCount,
  } = await getDashboardData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <PageHeader title="Dashboard" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`IDR ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          description="All time revenue"
        />
        <StatCard
          title="Total Expenses"
          value={`IDR ${totalExpenses.toLocaleString()}`}
          icon={TrendingDown}
          description="All time expenses"
        />
        <StatCard
          title="Net Result"
          value={`IDR ${(totalRevenue - totalExpenses).toLocaleString()}`}
          icon={TrendingUp}
          description="Revenue - Expenses"
      
        />
        <StatCard
          title="Active Customers"
          value={`+${customersCount}`}
          icon={Users}
          description="Total customers"
        />
        <StatCard
          title="Occupancy Rate"
          value={`${occupancyRate.toFixed(0)}%`}
          icon={TrendingUp}
          description={`${occupiedRooms} of ${totalRooms} rooms`}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              A list of the 5 most recent transactions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.type === 'revenue'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {transaction.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.description}
                    </TableCell>
                    <TableCell className="text-right">
                      IDR {transaction.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>New Customers</CardTitle>
            <CardDescription>A list of the 5 newest customers.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCustomers.map((customer) => (
                <div key={customer.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>
                      {customer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {customer.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    Room {customer.roomNumber || 'N/A'}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
