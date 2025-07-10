'use server';

import sql from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addCustomer(data: { name: string; phone: string; nik: string; entryDate: string; roomNumber?: string; }) {
  if (!sql) {
    console.log("Database not configured. Skipping addCustomer.");
    revalidatePath('/customers');
    revalidatePath('/');
    return;
  }
  const { name, phone, nik, entryDate, roomNumber } = data;
  await sql`
    INSERT INTO "Customer" (name, phone, nik, "entryDate", "roomNumber")
    VALUES (${name}, ${phone}, ${nik}, ${new Date(entryDate)}, ${roomNumber || null})
  `;
  revalidatePath('/customers');
  revalidatePath('/');
}

export async function updateCustomer(id: string, data: { name: string; phone: string; nik: string; entryDate: string; roomNumber?: string; }) {
   if (!sql) {
    console.log("Database not configured. Skipping updateCustomer.");
    revalidatePath('/customers');
    revalidatePath('/');
    return;
  }
  const { name, phone, nik, entryDate, roomNumber } = data;
  await sql`
    UPDATE "Customer"
    SET name = ${name}, phone = ${phone}, nik = ${nik}, "entryDate" = ${new Date(entryDate)}, "roomNumber" = ${roomNumber || null}
    WHERE id = ${id}
  `;
  revalidatePath('/customers');
  revalidatePath('/');
}

export async function deleteCustomer(id: string) {
   if (!sql) {
    console.log("Database not configured. Skipping deleteCustomer.");
    revalidatePath('/customers');
    revalidatePath('/');
    return;
  }
  await sql`DELETE FROM "Transaction" WHERE "customerName" = (SELECT name FROM "Customer" WHERE id = ${id})`;
  await sql`DELETE FROM "Customer" WHERE id = ${id}`;
  revalidatePath('/customers');
  revalidatePath('/');
}
