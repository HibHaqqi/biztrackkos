import { getTransactions, getRooms } from '@/lib/data';
import type { Transaction, Room } from '@/types';

export async function getTransactionsData() {
    return await getTransactions();
}

export async function getRoomsData(): Promise<Room[]> {
    return await getRooms();
}
