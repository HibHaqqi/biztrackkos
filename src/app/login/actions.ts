'use server';

import { cookies } from 'next/headers';

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
    return null;
  }

  return 'Invalid email or password.';
}

export async function logout() {
  cookies().set('session', '', { expires: new Date(0) });
}
