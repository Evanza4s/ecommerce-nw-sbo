import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // Helper: matches both admin roles from mst_roles
  const isAdminRole = userRole === 'admin' || userRole === 'super admin';

  // Define route classifications
  const isAdminRoute = pathname.startsWith('/admin');
  const isProtectedUserRoute =
    pathname.startsWith('/orders') ||
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/cart') ||
    pathname.startsWith('/refund');
  const isAuthRoute =
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/verify');

  // Case 1: Admin routes — require admin or super admin role
  if (isAdminRoute) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!isAdminRole) {
      // customer (or any non-admin) → back to homepage
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Case 2: Protected customer routes — require any authenticated user
  if (isProtectedUserRoute) {
    if (!accessToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Case 3: Guest/Auth routes — redirect away if already logged in
  if (isAuthRoute) {
    if (accessToken) {
      if (isAdminRole) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      // customer → homepage
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

// Matching Paths for optimization
export const config = {
  matcher: [
    '/admin/:path*',
    '/orders/:path*',
    '/checkout/:path*',
    '/account/:path*',
    '/cart/:path*',
    '/refund/:path*',
    '/login',
    '/register',
    '/verify',
  ],
};
