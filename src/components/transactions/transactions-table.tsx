import type { Transaction } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No transactions found.</div>;
  }
  
  const isRevenue = transactions[0]?.type === 'revenue';

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          {isRevenue ? <TableHead>Room</TableHead> : <TableHead>Category</TableHead>}
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map(transaction => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.date}</TableCell>
            <TableCell className="font-medium">{transaction.description}</TableCell>
            {isRevenue ? <TableCell>{transaction.roomNumber}</TableCell> : <TableCell><Badge variant="outline">{transaction.category}</Badge></TableCell>}
            <TableCell className="text-right">IDR {transaction.amount.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
