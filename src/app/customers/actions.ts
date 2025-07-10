
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addCustomer(data: { name: string; phone: string; nik: string; entryDate: string; roomNumber?: string; }) {
  await prisma.customer.create({
    data: {
      name: data.name,
      phone: data.phone,
      nik: data.nik,
      entryDate: new Date(data.entryDate),
      roomNumber: data.roomNumber || null,
    },
  });
  revalidatePath('/customers');
  revalidatePath('/');
}

export async function updateCustomer(id: string, data: { name: string; phone: string; nik: string; entryDate: string; roomNumber?: string; }) {
  await prisma.customer.update({
    where: { id },
    data: {
      name: data.name,
      phone: data.phone,
      nik: data.nik,
      entryDate: new Date(data.entryDate),
      roomNumber: data.roomNumber || null,
    },
  });
  revalidatePath('/customers');
  revalidatePath('/');
}

export async function deleteCustomer(id: string) {
  await prisma.customer.delete({ where: { id } });
  revalidatePath('/customers');
  revalidatePath('/');
}
