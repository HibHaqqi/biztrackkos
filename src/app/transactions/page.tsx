import { TransactionsView } from "@/components/transactions/transactions-view";
import { getTransactionsData } from "./index";
import type { Transaction } from "@prisma/client";

export default async function TransactionsPage() {
  const transactions = await getTransactionsData();
  const formattedTransactions = transactions.map(t => ({
    ...t,
    date: t.date.toISOString().split('T')[0]
  })) as unknown as Transaction[];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <TransactionsView transactions={formattedTransactions} />
    </div>
  );
}
