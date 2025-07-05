import { customers, transactions } from "@/lib/data";

export function getDashboardData() {
    const totalRevenue = transactions
        .filter((t) => t.type === 'revenue')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const occupiedRooms = customers.filter((c) => c.roomNumber).length;
    const totalRooms = 10; // Assuming 10 rooms total for occupancy calculation
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
    const recentCustomers = [...customers]
        .sort((a, b) => new Date(b.entryDate).getTime() - new Date(a.entryDate).getTime())
        .slice(0, 5);
    
    return {
        totalRevenue,
        totalExpenses,
        occupiedRooms,
        totalRooms,
        occupancyRate,
        recentTransactions,
        recentCustomers,
        customers,
    };
}
