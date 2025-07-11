import { getTransactions } from '@/lib/data';
import type { Transaction } from '@/types';

export async function getTransactionsData(): Promise<Transaction[]> {
    return await getTransactions();
}
