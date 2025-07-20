import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { getSession } from './lib/session';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const isLoggedIn = !!session;

  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith('/api');
  const isLoginPage = pathname === '/login';
  const isRegisterPage = pathname === '/register';

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-next-pathname', request.nextUrl.pathname);

  if (session?.userId) {
    requestHeaders.set('x-user-id', session.userId);
  }

  if (isApiRoute) {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey && apiKey === process.env.API_KEY) {
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    }
    if (!isLoggedIn) {
      return new NextResponse('Authentication required', { status: 401 });
    }
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  if (!isLoggedIn && !isLoginPage && !isRegisterPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isLoggedIn && (isLoginPage || isRegisterPage)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
