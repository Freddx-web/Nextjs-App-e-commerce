'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
// Interfaces para los usuarios
interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
    createdAt: string;
    _count?: {
        orders: number;
    };
}
// Página de edición de usuario para administradores
export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Función para obtener el usuario desde la API
  const fetchUser = useCallback(async () => {
    try { // Llamada a la API para obtener el usuario
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        toast.error('Error al cargar usuario');
        router.push('/admin/users');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Error al cargar usuario');
    } finally {
      setLoading(false);
    }
  }, [id, router]);
  // Efecto para verificar la sesión y el rol del usuario
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    } // Verificar si el usuario es administrador
    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role;
      if (userRole !== 'ADMIN') {
        router.push('/');
        return;
      }
      fetchUser();
    }
  }, [status, session, id, fetchUser, router]);
  // Función para actualizar el usuario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {// Llamada a la API para actualizar el usuario
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          role: user.role,
        }),
      });
      if (res.ok) {
        toast.success('Usuario actualizado');
        router.push('/admin/users');
      } else {
        toast.error('Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar usuario');
    } finally {
      setSaving(false);
    }
  };
  // Renderizado condicional basado en el estado de carga y la existencia del usuario
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }
  // Si el usuario no existe, mostrar mensaje de error
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/users')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-4xl font-bold text-gray-900">Editar Usuario</h1>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-sm font-semibold text-gray-900">
                Nombre
              </Label>
              <Input
                id="name"
                value={user.name || ''}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-semibold text-gray-900">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={user.email || ''}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="role" className="text-sm font-semibold text-gray-900">
                Rol
              </Label>
              <Select value={user.role} onValueChange={(value) => setUser({ ...user, role: value })}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Cliente</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={saving} className="flex-1">
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/users')}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}