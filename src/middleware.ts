import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session';
import { SessionData, sessionOptions } from './lib/session';

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(request.cookies, sessionOptions);
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith('/api');
  const isLoginPage = pathname === '/login';

  if (!session.isLoggedIn) {
    if (isApiRoute) {
      // Allow API key access for external services like n8n
      const apiKey = request.headers.get('x-api-key');
      if (apiKey === process.env.API_KEY) {
        return NextResponse.next();
      }
      return new NextResponse(JSON.stringify({ message: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    
    if (!isLoginPage) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    if (isLoginPage) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
