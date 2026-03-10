import { NextResponse } from 'next/server';
import { getApiDocs } from '@/lib/swagger';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

// This route serves the OpenAPI specification for the API documentation.
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

  // Get the OpenAPI specification
  const spec = await getApiDocs();
  // Return the specification as JSON
  return NextResponse.json(spec);
}
