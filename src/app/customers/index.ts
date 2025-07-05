import { customers as initialCustomers, transactions } from "@/lib/data";
import type { Customer } from "@/types";

export function getCustomersData(): Customer[] {
    const customersWithLastPayment = initialCustomers.map(customer => {
        if (!customer.roomNumber) {
          return customer;
        }
        
        const customerTransactions = transactions
        .filter(t => t.type === 'revenue' && t.roomNumber === customer.roomNumber)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const lastPaymentDate = customerTransactions.length > 0 ? customerTransactions[0].date : undefined;
        
        return { ...customer, lastPaymentDate };
    });
    return customersWithLastPayment;
}
