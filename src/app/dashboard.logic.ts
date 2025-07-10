import prisma from '@/lib/prisma';

export async function getDashboardData() {
    const totalRevenueResult = await prisma.transaction.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            type: 'revenue',
        },
    });
    const totalRevenue = totalRevenueResult._sum.amount || 0;

    const totalExpensesResult = await prisma.transaction.aggregate({
        _sum: {
            amount: true,
        },
        where: {
            type: 'expense',
        },
    });
    const totalExpenses = totalExpensesResult._sum.amount || 0;

    const occupiedRoomsCount = await prisma.customer.count({
        where: {
            roomNumber: {
                not: null,
            },
        },
    });
    const totalRooms = 10; // Assuming 10 rooms total for occupancy calculation
    const occupancyRate = totalRooms > 0 ? (occupiedRoomsCount / totalRooms) * 100 : 0;
    
    const recentTransactions = await prisma.transaction.findMany({
        take: 5,
        orderBy: {
            date: 'desc',
        },
    });

    const recentCustomers = await prisma.customer.findMany({
        take: 5,
        orderBy: {
            entryDate: 'desc',
        },
    });
    
    const customersCount = await prisma.customer.count();

    return {
        totalRevenue,
        totalExpenses,
        occupiedRooms: occupiedRoomsCount,
        totalRooms,
        occupancyRate,
        recentTransactions: recentTransactions.map(t => ({...t, date: t.date.toISOString().split('T')[0]})),
        recentCustomers: recentCustomers.map(c => ({...c, entryDate: c.entryDate.toISOString().split('T')[0]})),
        customersCount,
    };
}
