'use server';

import sql from '@/lib/db';
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

  let customerName = null;
  if (type === 'revenue' && roomNumber) {
    const customerResult = await sql`SELECT name FROM "Customer" WHERE "roomNumber" = ${roomNumber}`;
    if (customerResult.length > 0) {
      customerName = customerResult[0].name;
    }
  }

  await sql`
    INSERT INTO "Transaction" (type, amount, date, description, category, "roomNumber", "customerName")
    VALUES (${type}, ${amount}, ${new Date(date)}, ${description}, ${type === 'expense' ? category : null}, ${type === 'revenue' ? roomNumber : null}, ${customerName})
  `;
  
  revalidatePath('/transactions');
  revalidatePath('/');
  revalidatePath('/customers');
}
