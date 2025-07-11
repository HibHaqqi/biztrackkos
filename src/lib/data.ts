import prisma from './db';
import { format } from 'date-fns';
import type { Customer, Transaction } from '@/types';

export async function getCustomers() {
  const customers = await prisma.customer.findMany();
  return customers.map((customer: Customer) => ({
    ...customer,
    entryDate: format(new Date(customer.entryDate), 'yyyy-MM-dd'),
  }));
}

export async function getTransactions() {
  const transactions = await prisma.transaction.findMany({
    orderBy: {
      date: 'desc',
    },
  });
  return transactions.map((transaction: Transaction) => ({
    ...transaction,
    date: format(new Date(transaction.date), 'yyyy-MM-dd'),
    type: transaction.type as 'revenue' | 'expense',
  }));
}
