'use client';

import { UserSidebar } from '@/components/user-sidebar';
import { cn } from '@/lib/utils';

interface UserProfileLayoutProps {
  children: React.ReactNode;
}

export function UserProfileLayout({ children }: UserProfileLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <UserSidebar />
      <main className={cn(
        'transition-all duration-300 min-h-screen',
        'lg:ml-64'
      )}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
