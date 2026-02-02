'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
// ConditionalLayout component
export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  // Determine the current pathname 
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');
  const isProfileRoute = pathname?.startsWith('/profile');
  // Render children directly for admin and profile routes
  if (isAdminRoute || isProfileRoute) {
    return <>{children}</>;
  }
  // Render standard layout for other routes
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
