import type { IronSessionOptions } from 'iron-session';

export interface SessionData {
  userId: string;
  isLoggedIn: boolean;
}

if (!process.env.SECRET_COOKIE_PASSWORD) {
  throw new Error('SECRET_COOKIE_PASSWORD environment variable is not set');
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD,
  cookieName: 'biztrack-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};