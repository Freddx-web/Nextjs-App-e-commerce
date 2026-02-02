import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth-options';
import { AdminSidebar } from '@/components/admin-sidebar';

// Layout para el panel de administración
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Obtener la sesión del usuario
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and is admin
  if (!session?.user) {
    redirect('/login');
  }
  // Verificar si el usuario tiene rol de administrador
  if ((session.user as any).role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 transition-all duration-300">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
