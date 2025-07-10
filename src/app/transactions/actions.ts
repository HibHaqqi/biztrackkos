'use server';

import { revalidatePath } from 'next/cache';
import { customers, transactions } from '@/lib/data';
import type { Transaction } from '@/types';

export async function addTransaction(data: {
  type: 'revenue' | 'expense';
  amount: number;
  date: string;
  description: string;
  category?: string;
  roomNumber?: string;
}) {
  const { type, amount, date, description, category, roomNumber } = data;

  let customerName: string | undefined = undefined;
  if (type === 'revenue' && roomNumber) {
    const customer = customers.find(c => c.roomNumber === roomNumber);
    if (customer) {
      customerName = customer.name;
    }
  }

  const newTransaction: Transaction = {
    id: String(transactions.length + 1),
    type,
    amount,
    date,
    description,
    category: type === 'expense' ? category : undefined,
    roomNumber: type === 'revenue' ? roomNumber : undefined,
    customerName,
  };

  transactions.push(newTransaction);
  
  revalidatePath('/transactions');
  revalidatePath('/');
  revalidatePath('/customers');
}
