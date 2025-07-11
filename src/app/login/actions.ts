'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createSession } from '@/lib/session';

const FAKE_USER = {
  email: 'admin@example.com',
  password: 'password',
};

export async function login(
  prevState: { error: string | null },
  formData: FormData
): Promise<{ error: string | null }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (email === FAKE_USER.email && password === FAKE_USER.password) {
    await createSession();
    // Redirect must be called outside of a try/catch block.
    redirect('/');
  }

  return { error: 'Invalid email or password.' };
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/login');
}
