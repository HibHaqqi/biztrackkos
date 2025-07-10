import sql from '@/lib/db';

export async function getTransactionsData() {
    const results = await sql<any[]>`SELECT * FROM "Transaction" ORDER BY date DESC`;
    return results.map(t => ({...t, amount: Number(t.amount)}));
}
