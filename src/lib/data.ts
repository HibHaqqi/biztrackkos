import type { Customer, Transaction } from "@/types";
import { subDays, format } from 'date-fns';

export const customers: Customer[] = [
    { id: '1', name: 'Alice Johnson', entryDate: format(subDays(new Date(), 45), 'yyyy-MM-dd'), phone: '555-0101', nik: '1234567890123456', roomNumber: '101' },
    { id: '2', name: 'Bob Williams', entryDate: format(subDays(new Date(), 90), 'yyyy-MM-dd'), phone: '555-0102', nik: '2345678901234567', roomNumber: '102' },
    { id: '3', name: 'Charlie Brown', entryDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'), phone: '555-0103', nik: '3456789012345678', roomNumber: '103' },
];

export const transactions: Transaction[] = [
    { id: '1', type: 'revenue', amount: 500, date: format(subDays(new Date(), 30), 'yyyy-MM-dd'), description: 'Monthly Rent', roomNumber: '101', customerName: 'Alice Johnson' },
    { id: '2', type: 'revenue', amount: 550, date: format(subDays(new Date(), 60), 'yyyy-MM-dd'), description: 'Monthly Rent', roomNumber: '102', customerName: 'Bob Williams' },
    { id: '3', type: 'expense', amount: 75, date: format(subDays(new Date(), 5), 'yyyy-MM-dd'), description: 'Plumbing repair', category: 'Maintenance' },
    { id: '4', type: 'revenue', amount: 500, date: format(subDays(new Date(), 10), 'yyyy-MM-dd'), description: 'Monthly Rent', roomNumber: '103', customerName: 'Charlie Brown' },
    { id: '5', type: 'expense', amount: 200, date: format(subDays(new Date(), 20), 'yyyy-MM-dd'), description: 'Electricity Bill', category: 'Utilities' },
];
