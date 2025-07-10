'use server';

import { revalidatePath } from 'next/cache';
import { customers, transactions } from '@/lib/data';
import type { Customer } from '@/types';

export async function addCustomer(data: { name: string; phone: string; nik: string; entryDate: string; roomNumber?: string; }) {
  const newCustomer: Customer = {
    id: String(customers.length + 1),
    ...data,
    roomNumber: data.roomNumber || undefined,
  };
  customers.push(newCustomer);
  revalidatePath('/customers');
  revalidatePath('/');
}

export async function updateCustomer(id: string, data: { name: string; phone: string; nik: string; entryDate: string; roomNumber?: string; }) {
  const customerIndex = customers.findIndex(c => c.id === id);
  if (customerIndex !== -1) {
    customers[customerIndex] = { ...customers[customerIndex], ...data, roomNumber: data.roomNumber || undefined };
  }
  revalidatePath('/customers');
  revalidatePath('/');
}

export async function deleteCustomer(id: string) {
  const customerIndex = customers.findIndex(c => c.id === id);
  if (customerIndex !== -1) {
    const customerName = customers[customerIndex].name;
    customers.splice(customerIndex, 1);
    
    // Also delete associated transactions
    const filteredTransactions = transactions.filter(t => t.customerName !== customerName);
    transactions.length = 0;
    Array.prototype.push.apply(transactions, filteredTransactions);
  }
  revalidatePath('/customers');
  revalidatePath('/');
}
