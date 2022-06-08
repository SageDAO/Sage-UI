import NextAuth, { DefaultSession } from 'next-auth';

export declare module 'next-auth/react' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      padd: string;
    } & DefaultSession['user'];
    address: string;
  }
}
