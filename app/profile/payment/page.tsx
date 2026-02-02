'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { CreditCard, Plus, Edit, Trash2, Shield } from 'lucide-react';

// Define the PaymentMethod interface
interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit';
  brand: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  holderName: string;
  isDefault: boolean;
}
// Main PaymentPage component
export default function PaymentPage() {
  // State variables
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
  const [formData, setFormData] = useState({
    type: 'credit' as 'credit' | 'debit',
    brand: 'visa' as 'visa' | 'mastercard' | 'amex',
    cardNumber: '',
    holderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    isDefault: false,
  });
  // Load payment methods on component mount
  useEffect(() => {
    loadPaymentMethods();
  }, []);
  // Function to load payment methods from the server
  const loadPaymentMethods = async () => {
    try {
      const response = await fetch('/api/profile/payment');
      if (response.ok) {
        const data = await response.json();
        setPaymentMethods(data);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // Function to reset the form
  const resetForm = () => {
    setFormData({
      type: 'credit',
      brand: 'visa',
      cardNumber: '',
      holderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      isDefault: false,
    });
    setEditingMethod(null);
  };
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (formData.cardNumber.replace(/\s/g, '').length < 13) {
      toast.error('El número de tarjeta no es válido');
      setIsLoading(false);
      return;
    }
    // Additional validations can be added here
    if (formData.cvv.length < 3) {
      toast.error('El CVV no es válido');
      setIsLoading(false);
      return;
    }
    // Prepare data to send
    const payload = {
      type: formData.type,
      brand: formData.brand,
      cardNumber: formData.cardNumber.replace(/\s/g, ''),
      holderName: formData.holderName,
      expiryMonth: parseInt(formData.expiryMonth, 10),
      expiryYear: parseInt(formData.expiryYear, 10),
      cvv: formData.cvv,
      isDefault: formData.isDefault,
    };
    // Send data to server
    try {
      // Determine URL and method based on whether we're editing or adding
      const url = editingMethod 
        ? `/api/profile/payment/${editingMethod.id}`
        : '/api/profile/payment';
        
      const method = editingMethod ? 'PUT' : 'POST';
      // Make the API request
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      // Handle response
      if (!response.ok) {
        throw new Error(editingMethod ? 'Error al actualizar el método de pago' : 'Error al añadir el método de pago');
      }
      // Success
      toast.success(editingMethod ? 'Método de pago actualizado correctamente' : 'Método de pago añadido correctamente');
      // Close dialog and refresh list
      setIsDialogOpen(false);
      resetForm();
      loadPaymentMethods();
    } catch (error) {
      toast.error(editingMethod ? 'Error al actualizar el método de pago' : 'Error al añadir el método de pago');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Handle editing a payment method
  const handleEdit = (method: PaymentMethod) => {
    // Populate form with existing data
    setEditingMethod(method);
    setFormData({
      type: method.type,
      brand: method.brand,
      cardNumber: `**** **** **** ${method.last4}`,
      holderName: method.holderName,
      expiryMonth: method.expiryMonth.toString(),
      expiryYear: method.expiryYear.toString(),
      cvv: '',
      isDefault: method.isDefault,
    });
    setIsDialogOpen(true);
  };
  // Handle deleting a payment method
  const handleDelete = async (methodId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este método de pago?')) {
      return;
    }
    // Proceed with deletion
    try {
      // Make DELETE request to server
      const response = await fetch(`/api/profile/payment/${methodId}`, {
        method: 'DELETE',
      });
      // Handle response
      if (!response.ok) {
        throw new Error('Error al eliminar el método de pago');
      }
      // Success
      toast.success('Método de pago eliminado correctamente');
      // Refresh payment methods list
      loadPaymentMethods();
    } catch (error) {
      toast.error('Error al eliminar el método de pago');
      console.error(error);
    }
  };
  // Set a payment method as default
  const setDefaultMethod = async (methodId: string) => {
    // Make API request to set default method
    try {
      const response = await fetch(`/api/profile/payment/${methodId}/default`, {
        method: 'PUT',
      });
      // Handle response
      if (!response.ok) {
        throw new Error('Error al establecer método de pago por defecto');
      }
      // Success
      toast.success('Método de pago principal actualizado');
      // Refresh payment methods list
      loadPaymentMethods();
    } catch (error) {
      toast.error('Error al establecer método de pago principal');
      console.error(error);
    }
  };
  // Format card number for display
  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters and format in groups of 4
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    // Split the card number into parts of 4 digits
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    // Join parts with spaces
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };
  // Get card icon based on brand
  const getCardIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      default:
        return '💳';
    }
  };
  // Render loading state
  if (isLoading && paymentMethods.length === 0) {
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
          <CreditCard className="h-8 w-8" />
          <h1 className="text-3xl font-bold text-gray-900">Métodos de Pago</h1>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Tarjeta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? 'Editar Tarjeta' : 'Añadir Nueva Tarjeta'}
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Tus datos están encriptados y seguros</span>
                </div>
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Tipo de Tarjeta</Label>
                    <Select value={formData.type} onValueChange={(value) => handleSelectChange('type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit">Crédito</SelectItem>
                        <SelectItem value="debit">Débito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Select value={formData.brand} onValueChange={(value) => handleSelectChange('brand', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="visa">Visa</SelectItem>
                        <SelectItem value="mastercard">Mastercard</SelectItem>
                        <SelectItem value="amex">American Express</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={formatCardNumber(formData.cardNumber)}
                    onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: e.target.value }))}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="holderName">Nombre del Titular</Label>
                  <Input
                    id="holderName"
                    name="holderName"
                    value={formData.holderName}
                    onChange={handleInputChange}
                    placeholder="Juan Pérez"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiryMonth">Mes</Label>
                    <Select value={formData.expiryMonth} onValueChange={(value) => handleSelectChange('expiryMonth', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="MM" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                            {(i + 1).toString().padStart(2, '0')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryYear">Año</Label>
                    <Select value={formData.expiryYear} onValueChange={(value) => handleSelectChange('expiryYear', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="AA" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => (
                          <SelectItem key={i} value={(new Date().getFullYear() + i).toString()}>
                            {new Date().getFullYear() + i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      name="cvv"
                      type="password"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      maxLength={4}
                      required
                    />
                  </div>
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

      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CreditCard className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes métodos de pago guardados</h3>
            <p className="text-gray-600 text-center mb-4">
              Añade tu primera tarjeta para facilitar tus próximos pedidos.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Añadir Tarjeta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className={method.isDefault ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getCardIcon(method.brand)}</span>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {method.brand.charAt(0).toUpperCase() + method.brand.slice(1)} •••• {method.last4}
                        {method.isDefault && (
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                            Principal
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {method.type === 'credit' ? 'Crédito' : 'Débito'} • Expira {method.expiryMonth}/{method.expiryYear}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDefaultMethod(method.id)}
                      >
                        Establecer como principal
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(method)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(method.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Titular: {method.holderName}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
