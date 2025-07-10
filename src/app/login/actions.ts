'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

const FAKE_USER = {
  email: 'admin@example.com',
  password: 'password',
};

export async function login(formData: { email: string, password: string }): Promise<string | null> {
  const { email, password } = formData;

  if (email === FAKE_USER.email && password === FAKE_USER.password) {
    cookies().set('session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // One week
      path: '/',
    });
    // Revalidate the root path to ensure the layout re-renders with the new session
    revalidatePath('/', 'layout');
    return null;
  }

  return 'Invalid email or password.';
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
}
