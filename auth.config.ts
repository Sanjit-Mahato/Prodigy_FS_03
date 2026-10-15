import type { NextAuthConfig } from 'next-auth';

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtected =
        nextUrl.pathname.startsWith('/orders') ||
        nextUrl.pathname.startsWith('/profile');

      if (isOnProtected) {
        if (isLoggedIn) return true;
        return false; // Redirects unauthenticated users to signIn page
      }
      return true;
    },
  },
  providers: [], // Configured in lib/auth.ts with database & credentials
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
