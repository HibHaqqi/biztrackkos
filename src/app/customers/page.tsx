import { CustomerList } from "@/components/customers/customer-list";
import { customers } from "@/lib/data";

export default function CustomersPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <CustomerList customers={customers} />
    </div>
  );
}
