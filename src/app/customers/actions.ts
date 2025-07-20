'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';

export async function addCustomer(data: { name: string; phone: string; nik: string; entryDate: string; roomNumber?: string; }) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Unauthorized');
  }
  await prisma.customer.create({
    data: {
      ...data,
      entryDate: new Date(data.entryDate),
      userId: session.userId,
    },
  });
  revalidatePath('/customers');
  revalidatePath('/');
}

export async function updateCustomer(id: string, data: { name: string; phone: string; nik: string; entryDate: string; roomNumber?: string; }) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Unauthorized');
  }
  await prisma.customer.update({
    where: { id, userId: session.userId },
    data: {
      ...data,
      entryDate: new Date(data.entryDate),
    },
  });
  revalidatePath('/customers');
  revalidatePath('/');
}

export async function deleteCustomer(id: string) {
  const session = await getSession();
  if (!session?.userId) {
    throw new Error('Unauthorized');
  }
  await prisma.customer.delete({
    where: { id, userId: session.userId },
  });
  revalidatePath('/customers');
  revalidatePath('/');
}
