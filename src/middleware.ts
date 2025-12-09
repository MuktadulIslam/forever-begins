import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;

  // Helper function to validate token
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded = JSON.parse(
        Buffer.from(token, 'base64').toString('utf-8')
      );
      return decoded.exp && decoded.exp >= Date.now();
    } catch {
      return false;
    }
  };

  // If user is trying to access login page and is already authenticated
  if (pathname.startsWith('/user/auth/login')) {
    if (token && isTokenValid(token)) {
      // Already logged in, redirect to admin dashboard
      return NextResponse.redirect(new URL('/user/admin', request.url));
    }
    // Not logged in, allow access to login page
    return NextResponse.next();
  }

  // Check if the request is for the admin dashboard
  if (pathname.startsWith('/user/admin')) {
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/user/auth/login', request.url));
    }

    if (!isTokenValid(token)) {
      // Invalid or expired token, redirect to login
      const response = NextResponse.redirect(
        new URL('/user/auth/login', request.url)
      );
      response.cookies.delete('admin_token');
      return response;
    }

    // Token is valid, allow access
    return NextResponse.next();
  }

  // For all other routes, continue normally
  return NextResponse.next();
}

export const config = {
  matcher: ['/user/admin/:path*', '/user/auth/login'],
};
