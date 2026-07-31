import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add the routes you want to protect here
const protectedRoutes = ['/search', '/library', '/analytics', '/ai-insights'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const jwt = request.cookies.get('jwt');
  const path = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // If the route is protected and the user is not authenticated, redirect to /login
  if (isProtectedRoute && !jwt) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is authenticated and tries to access /login or /register, redirect to /search
  if (isAuthRoute && jwt) {
    return NextResponse.redirect(new URL('/search', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/search/:path*', '/library/:path*', '/analytics/:path*', '/ai-insights/:path*', '/login', '/register'],
};
