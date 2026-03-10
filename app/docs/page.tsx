import SwaggerUI from '@/components/swagger-ui';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';

// This page serves as the main entry point for the API documentation, rendering the Swagger UI component.
export const metadata: Metadata = {
  title: 'API Documentation - E-Commerce',
  description: 'Interactive API documentation for the E-Commerce application',
};

// Server-side check to ensure only administrators can access the API documentation
async function checkAdminAccess() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login?callbackUrl=/docs');
  }
  
  const userRole = (session.user as any)?.role;
  if (userRole !== 'ADMIN') {
    redirect('/?error=access_denied');
  }
}

// 
export default async function DocsPage() {
  // Check admin access before rendering the page
  await checkAdminAccess();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">API Documentation</h1>
          <p className="text-gray-600 mt-1">
            Interactive API documentation for the E-Commerce application (Admin Only)
          </p>
        </div>
      </div>
      <SwaggerUI />
    </div>
  );
}
