import type { NextAuthConfig } from 'next-auth';

console.log("AUTH CONFIG: Loading... Force Secure=FALSE");

export const authConfig = {
    // 1. Proxy/Cloud Ortamı İçin Kritik Ayar
    trustHost: true,

    // 2. Sabit Secret
    secret: "SUPER_SECRET_FIXED_KEY_FOR_POC_12345",

    pages: {
        signIn: '/tr/login',
    },

    // 3. Cookie Ayarı (ZORLANMIŞ HTTP)
    cookies: {
        sessionToken: {
            name: `ezgi-dental.session-token`,
            options: {
                httpOnly: true,
                sameSite: 'lax',
                path: '/',
                secure: false, // <--- KESİN: Localhost/HTTP için false
            },
        },
    },

    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnPortal = nextUrl.pathname.includes('/portal');

            if (isOnPortal) {
                if (isLoggedIn) return true;
                return false; // Redirect unauthenticated users to login page
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                // console.log("AUTH DEBUG: JWT Callback - User:", JSON.stringify(user));
                token.role = user.role;
                token.tenantId = user.tenantId;
            }
            return token;
        },
        async session({ session, token }) {
            // console.log("AUTH DEBUG: Session Callback - Token:", JSON.stringify(token));
            if (token && session.user) {
                session.user.role = token.role as any;
                session.user.tenantId = token.tenantId as string;
                session.user.id = token.sub as string; // Ensure ID is mapped from token.sub
            }
            return session;
        }
    },

    providers: [], // Empty here, populated in auth.ts
} satisfies NextAuthConfig;
