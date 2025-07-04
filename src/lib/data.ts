import type { Customer, Transaction } from '@/types';

export const customers: Customer[] = [
  { id: '1', name: 'John Doe', entryDate: '2023-01-15', phone: '123-456-7890', nik: '1234567890123456', roomNumber: '101' },
  { id: '2', name: 'Jane Smith', entryDate: '2023-02-20', phone: '234-567-8901', nik: '2345678901234567', roomNumber: '102' },
  { id: '3', name: 'Alice Johnson', entryDate: '2023-03-10', phone: '345-678-9012', nik: '3456789012345678', roomNumber: '201' },
  { id: '4', name: 'Bob Brown', entryDate: '2023-04-05', phone: '456-789-0123', nik: '4567890123456789', roomNumber: '202' },
  { id: '5', name: 'Charlie Davis', entryDate: '2023-05-12', phone: '567-890-1234', nik: '5678901234567890' },
];

export const transactions: Transaction[] = [
  { id: 't1', type: 'revenue', amount: 1200, date: '2024-05-15', description: 'Monthly Rent', roomNumber: '101', customerName: 'John Doe' },
  { id: 't2', type: 'expense', amount: 50, date: '2024-05-16', description: 'Plumbing repair', category: 'Maintenance' },
  { id: 't3', type: 'revenue', amount: 1250, date: '2024-04-20', description: 'Monthly Rent', roomNumber: '102', customerName: 'Jane Smith' },
  { id: 't4', type: 'expense', amount: 200, date: '2024-04-25', description: 'New furniture for lobby', category: 'Capital' },
  { id: 't5', type: 'revenue', amount: 1100, date: '2024-03-10', description: 'Monthly Rent', roomNumber: '201', customerName: 'Alice Johnson' },
  { id: 't6', type: 'expense', amount: 75, date: '2024-03-12', description: 'Internet bill', category: 'Utilities' },
  { id: 't7', type: 'revenue', amount: 1150, date: '2024-02-05', description: 'Monthly Rent', roomNumber: '202', customerName: 'Bob Brown' },
  { id: 't8', type: 'expense', amount: 150, date: '2024-02-10', description: 'Window replacement', category: 'Maintenance' },
];
