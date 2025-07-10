import sql from '@/lib/db';
import type { Customer } from "@/types";
import { format } from 'date-fns';

export async function getCustomersData(): Promise<Customer[]> {
  const customers = await sql<any[]>`SELECT * FROM "Customer" ORDER BY name ASC`;

  const transactions = await sql<any[]>`SELECT * FROM "Transaction" WHERE type = 'revenue' ORDER BY date DESC`;

  const customersWithLastPayment = customers.map(customer => {
    if (!customer.roomNumber) {
      return {
        ...customer,
        id: String(customer.id),
        entryDate: format(new Date(customer.entryDate), 'yyyy-MM-dd'),
      };
    }
    
    const lastPayment = transactions.find(t => t.roomNumber === customer.roomNumber);

    return {
      ...customer,
      id: String(customer.id),
      entryDate: format(new Date(customer.entryDate), 'yyyy-MM-dd'),
      lastPaymentDate: lastPayment ? format(new Date(lastPayment.date), 'yyyy-MM-dd') : undefined,
    };
  });
  return customersWithLastPayment as Customer[];
}
