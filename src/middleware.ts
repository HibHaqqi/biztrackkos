import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const isLoggedIn = sessionCookie && sessionCookie.value === 'true';
  
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith('/api');
  const isLoginPage = pathname === '/login';
  
  // Allow API key access for external services
  if (isApiRoute) {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey && apiKey === process.env.API_KEY) {
      return NextResponse.next();
    }
  }

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
