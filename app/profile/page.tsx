'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
// Definición de la interfaz del perfil de usuario
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string; // esta propiedad almacena la dirección formateada
  createdAt: string;
  image?: string;
}

// Reutilizamos la misma definición de dirección que en la sección de direcciones
interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}
// Extender la interfaz User para incluir el id y role
interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  // Direcciones guardadas del usuario (se cargan desde /api/profile/addresses)
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  // Helper para formatear una dirección completa a texto legible
  const formatAddress = (addr: Address) => {
    return `${addr.street}, ${addr.city}, ${addr.postalCode}, ${addr.country}`;
  };

  // Cargar direcciones del usuario
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await fetch('/api/profile/addresses');
        if (res.ok) {
          const data = await res.json();
          setAddresses(data);

          // si ya tenemos una dirección en el perfil, intentar seleccionar la coincidente
          if (profile?.address) {
            const match = data.find((a: Address) => formatAddress(a) === profile.address);
            if (match) {
              setSelectedAddressId(match.id);
            }
          }
        }
      } catch (err) {
        console.error('Error loading addresses:', err);
      }
    };

    loadAddresses();
  }, [profile]);

  // Maneja la selección de una dirección guardada
  const handleAddressSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedAddressId(id);
    if (id === '') {
      setFormData(prev => ({ ...prev, address: '' }));
      return;
    }
    const addr = addresses.find(a => a.id === id);
    if (addr) {
      setFormData(prev => ({ ...prev, address: formatAddress(addr) }));
    }
  };
  // Cargar los datos del perfil cuando la sesión esté disponible
  useEffect(() => {
    if (session?.user) {
      const user = session.user as ExtendedUser;
      // Si ya hay un perfil cargado (por edición), no sobrescribir los datos editados
      setProfile(prev => ({
        id: user.id || '',
        name: user.name || prev?.name || '',
        email: user.email || '',
        phone: prev?.phone || '',
        address: prev?.address || '',
        createdAt: prev?.createdAt || new Date().toISOString(),
        image: user.image || '',
      }));
    }
  }, [session]);
  // Actualizar los datos del formulario cuando el perfil cambie
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });

      // sincronizar selección de dirección si la dirección coincide con alguna guardada
      if (profile.address && addresses.length > 0) {
        const match = addresses.find(a => formatAddress(a) === profile.address);
        if (match) {
          setSelectedAddressId(match.id);
        } else {
          setSelectedAddressId('');
        }
      }
    }
  }, [profile, addresses]);
  // Manejar cambios en los campos del formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Manejar el envío del formulario de edición
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setFormData({
        name: updatedProfile.name || '',
        phone: updatedProfile.phone || '',
        address: updatedProfile.address || '',
      });

      // actualizar selección si coincide con alguna dirección guardada
      if (updatedProfile.address) {
        const match = addresses.find(a => formatAddress(a) === updatedProfile.address);
        if (match) {
          setSelectedAddressId(match.id);
        } else {
          setSelectedAddressId('');
        }
      }

      // Update session (solo nombre e imagen, el resto no está en session por defecto)
      await update({
        ...session,
        user: {
          ...session?.user,
          name: updatedProfile.name,
          image: updatedProfile.image,
        }
      });

      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Manejar la cancelación de la edición
  const handleCancel = () => {
    // Restaurar los datos actuales del perfil al formulario
    setFormData({
      name: profile?.name || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
    });
    // sin selección cuando se cancela
    setSelectedAddressId('');
    setIsEditing(false);
  };
  // Mostrar un indicador de carga si el perfil no está disponible
  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)}>
            Editar Perfil
          </Button>
        )}
      </div>

      {/* Profile Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.image} alt={profile.name} />
              <AvatarFallback className="text-lg">
                {profile.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-semibold">{profile.name}</h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Teléfono</p>
                  <p className="font-medium">{profile.phone || 'No especificado'}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Dirección</p>
                  <p className="font-medium">{profile.address || 'No especificada'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Miembro desde</p>
                  <p className="font-medium">
                    {new Date(profile.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Form */}
      {isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Editar Información Personal</CardTitle>
            <CardDescription>
              Actualiza tu información personal. Tu email no puede ser cambiado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+34 600 000 000"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Dirección</Label>
                <select
                  id="address"
                  name="address"
                  value={selectedAddressId}
                  onChange={handleAddressSelect}
                  className="block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="">-- Selecciona una dirección --</option>
                  {addresses.map(addr => (
                    <option key={addr.id} value={addr.id}>
                      {formatAddress(addr)}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500">
                  <a href="/profile/addresses" className="text-blue-600 underline">
                    Gestionar mis direcciones
                  </a>
                </p>
                {/* hidden input used by handleSubmit in case no selection was chosen */}
                <input type="hidden" name="address" value={formData.address} />
              </div>
              <Separator />
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
