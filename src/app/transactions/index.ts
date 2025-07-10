import prisma from '@/lib/prisma';

export async function getTransactionsData() {
    return prisma.transaction.findMany({
        orderBy: {
            date: 'desc'
        }
    });
}
