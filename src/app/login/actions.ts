'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSession } from '@/lib/session';
import prisma from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function login(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    await createSession();
    // Redirect must be called outside of a try/catch block.
    redirect('/');
  }

  return { error: 'Invalid email or password.' };
}

export async function logout() {
  const cookieStore = cookies();
  cookieStore.set('session', '', { expires: new Date(0) });
  redirect('/login');
}
