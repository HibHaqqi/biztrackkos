import { TransactionsView } from "@/components/transactions/transactions-view";
import { getTransactionsData } from "./index";
import type { Transaction } from "@/types";

export default async function TransactionsPage() {
  const transactions = await getTransactionsData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <TransactionsView transactions={transactions} />
    </div>
  );
}
