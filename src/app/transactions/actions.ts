'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addTransaction(data: {
  type: 'revenue' | 'expense';
  amount: number;
  date: string;
  description: string;
  category?: string;
  roomNumber?: string;
}) {
  const { type, amount, date, description, category, roomNumber } = data;

  let customerData = {};
  if (type === 'revenue' && roomNumber) {
    const customer = await prisma.customer.findFirst({
      where: { roomNumber },
    });
    if (customer) {
      customerData = {
        customerName: customer.name,
        customerId: customer.id,
      };
    }
  }

  await prisma.transaction.create({
    data: {
      type,
      amount,
      date: new Date(date),
      description,
      category: type === 'expense' ? category : undefined,
      roomNumber: type === 'revenue' ? roomNumber : undefined,
      ...customerData,
    },
  });
  
  revalidatePath('/transactions');
  revalidatePath('/');
  revalidatePath('/customers');
}
