"use client";

import { useState, useEffect, useTransition } from "react";
import type { Customer } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { CustomerFormDialog } from "./customer-form-dialog";
import { deleteCustomer } from "@/app/customers/actions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

export function CustomerList({ customers }: { customers: Customer[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>(undefined);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const openFormForEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  }

  const openFormForAdd = () => {
    setSelectedCustomer(undefined);
    setIsFormOpen(true);
  }

  const confirmDelete = (customerId: string) => {
    setCustomerToDelete(customerId);
    setIsAlertOpen(true);
  }

  const handleDelete = () => {
    if (!customerToDelete) return;

    startTransition(async () => {
      try {
        await deleteCustomer(customerToDelete);
        toast({ title: "Success", description: "Customer deleted successfully." });
        setIsAlertOpen(false);
        setCustomerToDelete(null);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete customer." });
      }
    });
  }

  return (
    <>
      <CustomerFormDialog 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen}
        customer={selectedCustomer}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => confirmDelete(customer.id)}>Delete</DropdownMenuItem>
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
