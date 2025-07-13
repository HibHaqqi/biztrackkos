"use client";

import type { Room } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useState, useTransition } from 'react';
import { RoomFormDialog } from './room-form-dialog';
import { deleteRoom } from '@/app/rooms/actions';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export function RoomsTable({ rooms }: { rooms: Room[] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAdd = () => {
    setSelectedRoom(null);
    setIsFormOpen(true);
  };

  const handleEdit = (room: Room) => {
    setSelectedRoom(room);
    setIsFormOpen(true);
  };

  const handleDelete = (room: Room) => {
    setSelectedRoom(room);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (selectedRoom) {
      startTransition(async () => {
        try {
          await deleteRoom(selectedRoom.id);
          toast({ title: "Success", description: "Room deleted successfully." });
          setIsAlertOpen(false);
          setSelectedRoom(null);
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: "Something went wrong." });
        }
      });
    }
  };
  
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd}>Add Room</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Room Number</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms.map(room => (
            <TableRow key={room.id}>
              <TableCell className="font-medium">{room.roomNumber}</TableCell>
              <TableCell>{room.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(room)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(room)} className="text-red-600">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <RoomFormDialog 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen}
        room={selectedRoom}
      />
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the room.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}