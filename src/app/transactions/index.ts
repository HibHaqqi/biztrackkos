import sql from '@/lib/db';

export async function getTransactionsData() {
    if (!sql) {
        console.log("Database not configured. Returning empty transaction list.");
        return [];
    }
    const results = await sql<any[]>`SELECT * FROM "Transaction" ORDER BY date DESC`;
    return results.map(t => ({...t, amount: Number(t.amount)}));
}
