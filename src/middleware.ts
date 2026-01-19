import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for Admin Authentication
 * Protects all /admin/* routes except /admin/login
 * Checks for admin-auth cookie set by the login API
 */
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin routes
    if (pathname.startsWith('/admin')) {
        // Allow access to the login page
        if (pathname === '/admin/login') {
            // If already authenticated, redirect to admin status
            const authCookie = request.cookies.get('admin-auth');
            if (authCookie?.value === 'authenticated') {
                return NextResponse.redirect(new URL('/admin/status', request.url));
            }
            return NextResponse.next();
        }

        // Check for authentication cookie
        const authCookie = request.cookies.get('admin-auth');

        if (!authCookie || authCookie.value !== 'authenticated') {
            // Redirect to login with the original URL as redirect param
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Configure which routes the middleware applies to
export const config = {
    matcher: ['/admin/:path*'],
};
