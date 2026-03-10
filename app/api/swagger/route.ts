import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// This route redirects to the API documentation page.
export async function GET() {
  // Check if user is authenticated and is an admin
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  const userRole = (session.user as any)?.role;
  if (userRole !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Admin access required' },
      { status: 403 }
    );
  }

  return NextResponse.redirect(new URL('/docs', process.env.NEXTAUTH_URL || 'http://localhost:3000'));
}
