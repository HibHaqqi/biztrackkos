import prisma from '@/lib/prisma';
import type { Customer } from "@/types";

export async function getCustomersData(): Promise<Customer[]> {
  const customers = await prisma.customer.findMany({
    orderBy: {
      name: 'asc'
    }
  });

  const transactions = await prisma.transaction.findMany({
    where: { type: 'revenue' },
    orderBy: { date: 'desc' }
  });

  const customersWithLastPayment = customers.map(customer => {
    if (!customer.roomNumber) {
      return {
        ...customer,
        entryDate: customer.entryDate.toISOString().split('T')[0],
      };
    }
    
    const lastPayment = transactions.find(t => t.roomNumber === customer.roomNumber);

    return {
      ...customer,
      entryDate: customer.entryDate.toISOString().split('T')[0],
      lastPaymentDate: lastPayment?.date.toISOString().split('T')[0],
    };
  });
  return customersWithLastPayment;
}
