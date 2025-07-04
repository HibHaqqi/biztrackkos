import { TransactionsView } from "@/components/transactions/transactions-view";
import { transactions } from "@/lib/data";

export default function TransactionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <TransactionsView transactions={transactions} />
    </div>
  );
}
