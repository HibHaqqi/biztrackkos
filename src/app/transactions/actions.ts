'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

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

import { getSession } from '@/lib/session';

export async function addTransaction(data: {
  type: 'revenue' | 'expense';
  amount: number;
  date: string;
  description: string;
  category?: string;
  roomNumber?: string;
}) {
  const { type, amount, date, description, category, roomNumber } = data;
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Unauthorized');
  }
  const userId = session.userId;

  let customerData: { customerId?: string; customerName?: string } = {};
  if (type === 'revenue' && roomNumber) {
    const customerInfo = await updateRoomAndCustomer(roomNumber, date);
    if (customerInfo.customerId && customerInfo.customerName) {
      customerData = customerInfo;
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
      ...(customerData.customerId && { customerId: customerData.customerId }),
      ...(customerData.customerName && {
        customerName: customerData.customerName,
      }),
      userId,
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
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Unauthorized');
  }
  const userId = session.userId;

  let customerData: { customerId?: string; customerName?: string } = {};
  if (type === 'revenue' && roomNumber) {
    const customerInfo = await updateRoomAndCustomer(roomNumber, date);
    if (customerInfo.customerId && customerInfo.customerName) {
      customerData = customerInfo;
    }
  }

  await prisma.transaction.update({
    where: { id, userId },
    data: {
      type,
      amount,
      date: new Date(date),
      description,
      category: type === 'expense' ? category : undefined,
      roomNumber: type === 'revenue' ? roomNumber : undefined,
      ...(customerData.customerId && { customerId: customerData.customerId }),
      ...(customerData.customerName && {
        customerName: customerData.customerName,
      }),
    },
  });

  revalidatePath('/transactions');
  revalidatePath('/');
  revalidatePath('/customers');
  revalidatePath('/rooms');
}

export async function deleteTransaction(id: string) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Unauthorized');
  }
  const userId = session.userId;

  const transaction = await prisma.transaction.findUnique({
    where: { id, userId },
  });

  if (!transaction) {
    throw new Error('Transaction not found');
  }

  await prisma.transaction.delete({
    where: { id, userId },
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
