'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

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
    cookies().set('session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    });
    // Redirect must be called outside of a try/catch block.
    redirect('/');
  }

  return { error: 'Invalid email or password.' };
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/login');
}
