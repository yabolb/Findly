import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ========================================
    // API ROUTE PROTECTION
    // ========================================
    // Protect /api/ingest and /api/cron with header-based authentication
    if (pathname.startsWith('/api/ingest') || pathname.startsWith('/api/cron')) {
        const ingestSecret = request.headers.get('x-ingest-secret');
        const expectedSecret = process.env.INGEST_SECRET_KEY;

        // Validate environment variable
        if (!expectedSecret) {
            console.error('⚠️  INGEST_SECRET_KEY not configured in environment variables');
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Verify secret key
        if (!ingestSecret || ingestSecret !== expectedSecret) {
            return NextResponse.json(
                { error: 'Unauthorized. Valid x-ingest-secret header required.' },
                { status: 401 }
            );
        }
    }

    // ========================================
    // ADMIN ROUTE PROTECTION
    // ========================================
    // Protect /admin/* routes except /admin/login
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
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
    matcher: [
        '/admin/:path*',
        '/api/ingest/:path*',
        '/api/cron/:path*',
    ],
};
