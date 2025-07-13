import { TransactionsView } from "@/components/transactions/transactions-view";
import { getTransactionsData, getRoomsData } from "./index";
import type { Transaction, Room } from "@/types";

export default async function TransactionsPage() {
  const transactions = await getTransactionsData();
  const rooms = await getRoomsData();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <TransactionsView transactions={transactions} rooms={rooms} />
    </div>
  );
}
