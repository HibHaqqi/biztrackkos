import type { Customer } from "@/types";
import { customers, transactions } from '@/lib/data';
import { format } from 'date-fns';

export async function getCustomersData(): Promise<Customer[]> {
  const customersWithLastPayment = customers.map(customer => {
    if (!customer.roomNumber) {
      return {
        ...customer,
        entryDate: format(new Date(customer.entryDate), 'yyyy-MM-dd'),
      };
    }
    
    const lastPayment = transactions
      .filter(t => t.type === 'revenue' && t.roomNumber === customer.roomNumber)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    return {
      ...customer,
      entryDate: format(new Date(customer.entryDate), 'yyyy-MM-dd'),
      lastPaymentDate: lastPayment ? format(new Date(lastPayment.date), 'yyyy-MM-dd') : undefined,
    };
  });
  return customersWithLastPayment;
}
