import { auth } from '@/auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { authConfig } from './auth.config';

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const { pathname } = req.nextUrl;

    // 1. Protect /portal routes
    // Check if path contains /portal (handling locale prefix)
    const isPortalRoute = pathname.includes('/portal');
    if (isPortalRoute && !isLoggedIn) {
        return Response.redirect(new URL('/login', req.nextUrl));
    }

    // 2. Redirect logged-in users away from /login
    const isLoginRoute = pathname.includes('/login');
    if (isLoginRoute && isLoggedIn) {
        return Response.redirect(new URL('/portal', req.nextUrl));
    }

    return intlMiddleware(req);
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
