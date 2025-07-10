import { transactions } from '@/lib/data';
import type { Transaction } from '@/types';

export async function getTransactionsData(): Promise<Transaction[]> {
    return JSON.parse(JSON.stringify(transactions));
}
