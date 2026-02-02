'use client';

import { SessionProvider } from 'next-auth/react';
// import other providers if needed
export function Providers({ children }: { children: React.ReactNode }) {
  // You can wrap other providers here as needed
  return <SessionProvider>{children}</SessionProvider>;
}
