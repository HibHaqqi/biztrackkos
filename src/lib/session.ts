import type { IronSessionOptions } from 'iron-session';
import 'dotenv/config';

export interface SessionData {
  userId: string;
  isLoggedIn: boolean;
}

export const sessionOptions: IronSessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD as string,
  cookieName: 'biztrack-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};
