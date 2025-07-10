
'use server';

import prisma from '@/lib/prisma';
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

  const transactionData: any = {
    type,
    amount,
    date: new Date(date),
    description,
  };

  if (type === 'revenue' && roomNumber) {
    const customer = await prisma.customer.findFirst({ where: { roomNumber } });
    if (customer) {
      transactionData.customerName = customer.name;
      transactionData.roomNumber = roomNumber;
    }
  } else if (type === 'expense') {
    transactionData.category = category;
  }

  await prisma.transaction.create({ data: transactionData });
  
  revalidatePath('/transactions');
  revalidatePath('/');
  revalidatePath('/customers');
}
