'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

// Instantiate a new Prisma Client directly to bypass any potential caching issues with the shared instance.
const prisma = new PrismaClient();

async function updateRoomAndCustomer(roomNumber: string, date: string) {
  await prisma.room.update({
    where: { roomNumber },
    data: {
      status: 'occupied',
      lastPayment: new Date(date),
    },
  });

  const customer = await prisma.customer.findFirst({
    where: { roomNumber },
  });

  if (customer) {
    await prisma.customer.update({
      where: { id: customer.id },
      data: { lastPayment: new Date(date) },
    });
    return {
      customerName: customer.name,
      customerId: customer.id,
    };
  }
  return {};
}

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
    customerData = await updateRoomAndCustomer(roomNumber, date);
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
  revalidatePath('/rooms');
}

export async function updateTransaction(id: string, data: {
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
    customerData = await updateRoomAndCustomer(roomNumber, date);
  }

  await prisma.transaction.update({
    where: { id },
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
  revalidatePath('/rooms');
}

export async function deleteTransaction(id: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
  });

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  await prisma.transaction.delete({
    where: { id },
  });

  if (transaction.type === 'revenue' && transaction.roomNumber) {
    const lastTransaction = await prisma.transaction.findFirst({
      where: {
        roomNumber: transaction.roomNumber,
        type: 'revenue',
      },
      orderBy: {
        date: 'desc',
      },
    });

    await prisma.room.update({
      where: { roomNumber: transaction.roomNumber },
      data: {
        status: lastTransaction ? 'occupied' : 'vacant',
        lastPayment: lastTransaction ? lastTransaction.date : null,
      },
    });
  }

  revalidatePath('/transactions');
  revalidatePath('/');
  revalidatePath('/customers');
  revalidatePath('/rooms');
}
