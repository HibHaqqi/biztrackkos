'use server';

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import sql from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SessionData, sessionOptions } from '@/lib/session';

export async function login(formData: { email: string, password: string }): Promise<string | null> {
  const { email, password } = formData;

  if (!sql) {
    return 'Database not configured.';
  }

  try {
    const users = await sql`SELECT * FROM "User" WHERE email = ${email}`;
    const user = users[0];

    if (!user) {
      return 'Invalid email or password.';
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return 'Invalid email or password.';
    }

    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    session.userId = user.id;
    session.isLoggedIn = true;
    await session.save();

    return null;
  } catch (error) {
    console.error('Login error:', error);
    return 'An unexpected error occurred.';
  }
}

export async function logout() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  session.destroy();
}
