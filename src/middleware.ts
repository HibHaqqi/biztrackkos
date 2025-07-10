import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('session');
  const isLoggedIn = sessionCookie?.value === 'true';
  
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith('/api');
  const isLoginPage = pathname === '/login';
  
  if (isApiRoute) {
    const apiKey = request.headers.get('x-api-key');
    if (apiKey && apiKey === process.env.API_KEY) {
      return NextResponse.next();
    }
    // If it's an API route and not the login API, and the user is not logged in, deny access
    // This assumes API routes other than login require auth.
    if (!isLoggedIn) {
       return new NextResponse('Authentication required', { status: 401 });
    }
    return NextResponse.next();
  }

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Pass the pathname in a header so client components can access it.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-next-pathname', request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
