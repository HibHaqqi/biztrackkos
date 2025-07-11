"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useTransition } from "react";
import { addTransaction } from "@/app/transactions/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  type: z.enum(["revenue", "expense"]),
  amount: z.coerce.number().min(0.01, "Amount must be positive."),
  date: z.string().min(1, "Date is required."),
  description: z.string().min(2, "Description is required."),
  category: z.string().optional(),
  roomNumber: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.type === 'expense' && !data.category) {
    ctx.addIssue({
      code: "custom",
      path: ["category"],
      message: "Category is required for expenses.",
    });
  }
  if (data.type === 'revenue' && !data.roomNumber) {
    ctx.addIssue({
      code: "custom",
      path: ["roomNumber"],
      message: "Room number is required for revenue.",
    });
  }
});

type FormValues = z.infer<typeof formSchema>;

type TransactionFormDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

const expenseCategories = ["Maintenance", "Utilities", "Capital", "Marketing", "Salaries"];

export function TransactionFormDialog({ isOpen, onOpenChange }: TransactionFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "revenue",
      date: new Date().toISOString().split('T')[0],
      description: "",
    },
  });

  const transactionType = form.watch("type");

  useEffect(() => {
    if(isOpen) {
      form.reset({
        type: "revenue",
        date: new Date().toISOString().split('T')[0],
        description: "",
        amount: undefined,
        category: undefined,
        roomNumber: undefined,
      });
    }
  }, [isOpen, form]);

  const onSubmit = (data: FormValues) => {
    startTransition(async () => {
      try {
        await addTransaction(data);
        toast({ title: "Success", description: "Transaction added successfully." });
        onOpenChange(false);
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
          <DialogDescription>
            Select transaction type and fill in the details.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Transaction Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex space-x-4"
                    >
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="revenue" />
                        </FormControl>
                        <FormLabel className="font-normal">Revenue</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="expense" />
                        </FormControl>
                        <FormLabel className="font-normal">Expense</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl><Input placeholder="e.g. Monthly Rent" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (IDR)</FormLabel>
                  <FormControl><Input type="number" step="0.01" placeholder="0.00" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {transactionType === 'revenue' && (
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Number</FormLabel>
                    <FormControl><Input placeholder="e.g. 101" {...field} value={field.value ?? ''} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {transactionType === 'expense' && (
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

             <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl><Input type="date" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Transaction"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
