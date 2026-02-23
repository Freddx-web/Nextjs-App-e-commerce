'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { MapPin, Plus, Edit, Trash2 } from 'lucide-react';

// Define the Address interface
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
// Main Addresses Page Component
export default function AddressesPage() {
  // State management
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    isDefault: false,
  });
  // Load addresses on component mount
  useEffect(() => {
    loadAddresses();
  }, []);
  // Function to load addresses from API
  const loadAddresses = async () => {
    try {
      const response = await fetch('/api/profile/addresses');
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // Reset form data
  const resetForm = () => {
    setFormData({
      name: '',
      street: '',
      city: '',
      postalCode: '',
      country: '',
      phone: '',
      isDefault: false,
    });
    setEditingAddress(null);
  };
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  // Handle form submission for adding/editing addresses
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Validate required fields
    try {
      // Prepare request data
      const url = editingAddress 
        ? `/api/profile/addresses/${editingAddress.id}`
        : '/api/profile/addresses';
      // Determine HTTP method
      const method = editingAddress ? 'PUT' : 'POST';
      // Send request to API
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      // Handle response
      if (!response.ok) {
        throw new Error(editingAddress ? 'Error al actualizar la dirección' : 'Error al crear la dirección');
      }
      // Success
      toast.success(editingAddress ? 'Dirección actualizada correctamente' : 'Dirección creada correctamente');
      // Close dialog and reset form
      setIsDialogOpen(false);
      resetForm();
      loadAddresses();
    } catch (error) {
      toast.error(editingAddress ? 'Error al actualizar la dirección' : 'Error al crear la dirección');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Handle editing an address
  const handleEdit = (address: Address) => {
    // Populate form with existing address data
    setEditingAddress(address);
    // Fill form data
    setFormData({
      name: address.name,
      street: address.street,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      phone: address.phone || '',
      isDefault: address.isDefault,
    });
    setIsDialogOpen(true);
  };
  // Handle deleting an address
  const handleDelete = async (addressId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
      return;
    }
    // Proceed with deletion
    try {
      const response = await fetch(`/api/profile/addresses/${addressId}`, {
        method: 'DELETE',
      });
      // Handle response
      if (!response.ok) {
        throw new Error('Error al eliminar la dirección');
      }
      // Success
      toast.success('Dirección eliminada correctamente');
      // Reload addresses
      loadAddresses();
    } catch (error) {
      toast.error('Error al eliminar la dirección');
      console.error(error);
    }
  };
  // Set an address as default
  const setDefaultAddress = async (addressId: string) => {
    // Send request to set default address
    try {
      const response = await fetch(`/api/profile/addresses/${addressId}/default`, {
        method: 'PUT',
      });
      // Handle response
      if (!response.ok) {
        throw new Error('Error al establecer dirección por defecto');
      }
      // Success
      toast.success('Dirección principal actualizada');
      loadAddresses();
    } catch (error) {
      toast.error('Error al establecer dirección principal');
      console.error(error);
    }
  };
  // Render loading state
  if (isLoading && addresses.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  // Render main component
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="h-8 w-8" />
          <h1 className="text-3xl font-bold text-gray-900">Mis Direcciones</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Dirección
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAddress ? 'Editar Dirección' : 'Añadir Nueva Dirección'}
              </DialogTitle>
              <DialogDescription>
                {editingAddress 
                  ? 'Modifica los datos de tu dirección.' 
                  : 'Introduce los datos de tu nueva dirección.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Punto de referencia
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="street" className="text-right">
                    Dirección
                  </Label>
                  <Input
                    id="street"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="city" className="text-right">
                    Ciudad
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="postalCode" className="text-right">
                    Código Postal
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="country" className="text-right">
                    País
                  </Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Teléfono
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes direcciones guardadas</h3>
            <p className="text-gray-600 text-center mb-4">
              Añade tu primera dirección para facilitar tus próximos pedidos.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Dirección
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-lg">{address.name}</CardTitle>
                      {address.isDefault && (
                        <Badge className="bg-green-100 text-green-800 mt-1">
                          Dirección principal
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!address.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultAddress(address.id)}
                      >
                        Establecer como principal
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p>{address.street}</p>
                  <p>{address.city}, {address.postalCode}</p>
                  <p>{address.country}</p>
                  {address.phone && <p>Tel: {address.phone}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
