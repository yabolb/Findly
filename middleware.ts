import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect /admin/* routes except /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        // Check if user has valid auth cookie
        const authCookie = request.cookies.get('admin-auth');

        if (!authCookie || authCookie.value !== 'authenticated') {
            // Redirect to login page
            const loginUrl = new URL('/admin/login', request.url);
            loginUrl.searchParams.set('redirect', pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
    matcher: '/admin/:path*',
};
