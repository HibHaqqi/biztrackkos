import { CustomerList } from "@/components/customers/customer-list";
import { getCustomersData } from "./index";

export default async function CustomersPage() {
  const customersWithLastPayment = await getCustomersData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <CustomerList customers={customersWithLastPayment} />
    </div>
  );
}
