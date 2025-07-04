"use client";

import { useState, useEffect } from "react";
import type { Customer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CustomerFormDialog } from "./customer-form-dialog";

const MonthsOccupied = ({ entryDate }: { entryDate: string }) => {
  const [months, setMonths] = useState(0);

  useEffect(() => {
    if (!entryDate) {
      setMonths(0);
      return;
    }
    const start = new Date(entryDate);
    const now = new Date();

    if (isNaN(start.getTime())) {
      setMonths(0);
      return;
    }

    let calculatedMonths = (now.getFullYear() - start.getFullYear()) * 12;
    calculatedMonths -= start.getMonth();
    calculatedMonths += now.getMonth();

    setMonths(calculatedMonths <= 0 ? 1 : calculatedMonths + 1);
  }, [entryDate]);

  if (!months) {
      return <>-</>;
  }

  return <>{months}</>;
};

export function CustomerList({ customers: initialCustomers }: { customers: Customer[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);

  const handleSaveCustomer = (customer: Customer) => {
    if (selectedCustomer) {
      setCustomers(customers.map(c => c.id === customer.id ? customer : c));
    } else {
      setCustomers([...customers, { ...customer, id: (customers.length + 1).toString() }]);
    }
  };

  const openFormForEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  }

  const openFormForAdd = () => {
    setSelectedCustomer(undefined);
    setIsFormOpen(true);
  }

  const handleDelete = (customerId: string) => {
    setCustomers(customers.filter(c => c.id !== customerId));
  }

  return (
    <>
      <CustomerFormDialog 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSave={handleSaveCustomer}
        customer={selectedCustomer}
      />
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Customers"
          actions={
            <Button onClick={openFormForAdd}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          }
        />
        <Card>
          <CardHeader>
            <CardTitle>Customer Management</CardTitle>
            <CardDescription>View, edit, or delete existing customer entries.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Entry Date</TableHead>
                  <TableHead>Last Payment</TableHead>
                  <TableHead>Months Occupied</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.entryDate}</TableCell>
                    <TableCell>{customer.lastPaymentDate || 'N/A'}</TableCell>
                    <TableCell><MonthsOccupied entryDate={customer.entryDate} /></TableCell>
                    <TableCell>{customer.roomNumber || 'N/A'}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openFormForEdit(customer)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(customer.id)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
