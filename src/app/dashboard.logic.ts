import { getCustomers, getTransactions } from '@/lib/data';
import type { Customer, Transaction } from '@/types';

export async function getDashboardData() {
  const customers: Customer[] = await getCustomers();
  const transactions: Transaction[] = await getTransactions();

  const totalRevenue = transactions
    .filter((t: Transaction) => t.type === 'revenue')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t: Transaction) => t.type === 'expense')
    .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

  const occupiedRoomsCount = customers.filter((c: Customer) => c.roomNumber).length;
  const totalRooms = 10; // This can be made dynamic later
  const occupancyRate = totalRooms > 0 ? (occupiedRoomsCount / totalRooms) * 100 : 0;

  const recentTransactions = [...transactions]
    .sort((a: Transaction, b: Transaction) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((t: Transaction) => ({ ...t, date: new Date(t.date).toISOString().split('T')[0] }));
    
  const recentCustomers = [...customers]
    .sort((a: Customer, b: Customer) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
    .slice(0, 5)
    .map((c: Customer) => ({ ...c, entryDate: new Date(c.entryDate).toISOString().split('T')[0] }));

  const customersCount = customers.length;

  return {
    totalRevenue,
    totalExpenses,
    occupiedRooms: occupiedRoomsCount,
    totalRooms,
    occupancyRate,
    recentTransactions,
    recentCustomers,
    customersCount,
  };
}
