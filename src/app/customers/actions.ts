'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addCustomer(data: { name: string; phone: string; nik: string; entryDate: string; roomNumber?: string; }) {
  await prisma.customer.create({
    data: {
      ...data,
      entryDate: new Date(data.entryDate),
    },
  });
  revalidatePath('/customers');
  revalidatePath('/');
}

export async function updateCustomer(id: string, data: { name: string; phone: string; nik: string; entryDate: string; roomNumber?: string; }) {
  await prisma.customer.update({
    where: { id },
    data: {
      ...data,
      entryDate: new Date(data.entryDate),
    },
  });
  revalidatePath('/customers');
  revalidatePath('/');
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({
    where: { id },
  });
  revalidatePath('/customers');
  revalidatePath('/');
}
