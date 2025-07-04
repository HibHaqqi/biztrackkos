import { CustomerList } from "@/components/customers/customer-list";
import { customers as initialCustomers, transactions } from "@/lib/data";

export default function CustomersPage() {
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <CustomerList customers={customersWithLastPayment} />
    </div>
  );
}
