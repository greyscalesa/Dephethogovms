import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const session = request.cookies.get('session');
    const path = request.nextUrl.pathname;

    // Allow static files and API routes related to auth
    if (
        path.startsWith('/_next') ||
        path.includes('/favicon.ico') ||
        path.startsWith('/api/auth/login')
    ) {
        return NextResponse.next();
    }

    // Redirect to login if no session and not on login page
    if (!session && path !== '/login') {
        // If it's an API route, return 401 instead of redirecting to HTML login page
        if (path.startsWith('/api/') && !path.startsWith('/api/auth/')) {
            // Stats and Validate are exempt for now for scanning convenience
            if (!path.startsWith('/api/stats') && !path.startsWith('/api/validate-checkin')) {
                return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
            }
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // Redirect to dashboard if session exists and on login page
    if (session && path === '/login') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api/auth/login).*)'],
};
