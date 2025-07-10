"use client";

import { useState } from 'react';
import type { Transaction } from '@/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TransactionsTable } from './transactions-table';
import { TransactionFormDialog } from './transaction-form-dialog';

export function TransactionsView({ transactions }: { transactions: Transaction[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const revenue = transactions.filter(t => t.type === 'revenue');
  const expenses = transactions.filter(t => t.type === 'expense');

  return (
    <>
      <TransactionFormDialog 
        isOpen={isFormOpen}
        onOpenChange={setIsFormOpen}
      />
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="Transactions"
          actions={
            <Button onClick={() => setIsFormOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          }
        />
        <Tabs defaultValue="revenue">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="expense">Expenses</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Transactions</CardTitle>
                <CardDescription>All incoming revenue transactions.</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionsTable transactions={revenue} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="expense">
            <Card>
              <CardHeader>
                <CardTitle>Expense Transactions</CardTitle>
                <CardDescription>All outgoing expense transactions.</CardDescription>
              </CardHeader>
              <CardContent>
                <TransactionsTable transactions={expenses} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
