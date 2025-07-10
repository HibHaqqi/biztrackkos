import sql from '@/lib/db';

export async function getDashboardData() {
    const totalRevenueResult = await sql`SELECT SUM(amount) FROM "Transaction" WHERE type = 'revenue'`;
    const totalRevenue = totalRevenueResult[0].sum || 0;

    const totalExpensesResult = await sql`SELECT SUM(amount) FROM "Transaction" WHERE type = 'expense'`;
    const totalExpenses = totalExpensesResult[0].sum || 0;

    const occupiedRoomsCountResult = await sql`SELECT COUNT(*) FROM "Customer" WHERE "roomNumber" IS NOT NULL`;
    const occupiedRoomsCount = occupiedRoomsCountResult[0].count;

    const totalRooms = 10; // Assuming 10 rooms total for occupancy calculation
    const occupancyRate = totalRooms > 0 ? (Number(occupiedRoomsCount) / totalRooms) * 100 : 0;
    
    const recentTransactions = await sql`SELECT * FROM "Transaction" ORDER BY date DESC LIMIT 5`;

    const recentCustomers = await sql`SELECT * FROM "Customer" ORDER BY "entryDate" DESC LIMIT 5`;
    
    const customersCountResult = await sql`SELECT COUNT(*) FROM "Customer"`;
    const customersCount = customersCountResult[0].count;

    return {
        totalRevenue: Number(totalRevenue),
        totalExpenses: Number(totalExpenses),
        occupiedRooms: Number(occupiedRoomsCount),
        totalRooms,
        occupancyRate,
        recentTransactions: recentTransactions.map(t => ({...t, amount: Number(t.amount), date: new Date(t.date).toISOString().split('T')[0]})),
        recentCustomers: recentCustomers.map(c => ({...c, entryDate: new Date(c.entryDate).toISOString().split('T')[0]})),
        customersCount: Number(customersCount),
    };
}
