'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addRoom(data: { roomNumber: string }) {
  const { roomNumber } = data;
  await prisma.room.create({
    data: {
      roomNumber,
      status: 'vacant',
    },
  });
  revalidatePath('/rooms');
  revalidatePath('/');
}

export async function updateRoom(id: string, data: { roomNumber: string }) {
  const { roomNumber } = data;
  await prisma.room.update({
    where: { id },
    data: { roomNumber },
  });
  revalidatePath('/rooms');
  revalidatePath('/');
}

export async function deleteRoom(id: string) {
  await prisma.room.delete({
    where: { id },
  });
  revalidatePath('/rooms');
  revalidatePath('/');
}