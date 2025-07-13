import { getCustomers, getTransactions, getRooms } from '@/lib/data';
import type { Customer, Transaction, Room } from '@/types';
import { subMonths } from 'date-fns';

export async function getDashboardData() {
  const customers = await getCustomers();
  const transactions = await getTransactions();
  const rooms = await getRooms();

  const totalRevenue = transactions
    .filter((t) => t.type === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const oneMonthAgo = subMonths(new Date(), 1);
  const occupiedRoomsCount = rooms.filter((room: Room) => room.lastPayment && new Date(room.lastPayment) > oneMonthAgo).length;
  const totalRooms = rooms.length;
  const occupancyRate = totalRooms > 0 ? (occupiedRoomsCount / totalRooms) * 100 : 0;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((t) => ({ ...t, date: new Date(t.date).toISOString().split('T')[0] }));
    
  const recentCustomers = [...customers]
    .sort((a, b) => new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime())
    .slice(0, 5)
    .map((c) => ({ ...c, entryDate: new Date(c.entryDate).toISOString().split('T')[0] }));

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
