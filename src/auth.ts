// Force AUTH_URL for localhost to ensure secure: false default behavior
process.env.AUTH_URL = "http://localhost:3000";

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

export const { auth, handlers, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                // Lazy import to avoid circular dependency issues during build if any
                const { db } = await import('@/lib/db');

                const user = await db.user.findUnique({
                    where: { email: credentials.email as string }
                });

                if (user && user.password === credentials.password) {
                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        tenantId: user.tenantId,
                    };
                }
                return null;
            },
        }),
    ],
});
