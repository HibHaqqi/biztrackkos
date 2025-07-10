import { customers, transactions } from '@/lib/data';

export async function getDashboardData() {
  const totalRevenue = transactions
    .filter(t => t.type === 'revenue')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const occupiedRoomsCount = customers.filter(c => c.roomNumber).length;
  const totalRooms = 10;
  const occupancyRate = totalRooms > 0 ? (occupiedRoomsCount / totalRooms) * 100 : 0;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(t => ({ ...t, date: new Date(t.date).toISOString().split('T')[0] }));
    
  const recentCustomers = [...customers]
    .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
    .slice(0, 5)
    .map(c => ({ ...c, entryDate: new Date(c.entryDate).toISOString().split('T')[0] }));

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
