'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Define the structure of a cart item
interface CartItem {
  id: string;
  quantity: number;
  Product: {
    id: string;
    name: string;
    price: number;
  };
}

// Define the structure of a saved address
interface SavedAddress {
  id: string;
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export default function CheckoutPage() {
  // State and hooks
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // Shipping information state
  const [shippingName, setShippingName] = useState('');
  const [shippingEmail, setShippingEmail] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isCustomAddress, setIsCustomAddress] = useState(false);

  // Function to fetch cart items
  const fetchCart = useCallback(async () => {
    try { 
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCartItems(data || []);
        if (data?.length === 0) {
          toast.error('Tu carrito está vacío');
          router.push('/cart');
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error('Error al cargar el carrito');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Function to fetch saved addresses
  const fetchSavedAddresses = useCallback(async () => {
    try {
      const res = await fetch('/api/profile/addresses'); // Corrected endpoint
      if (res.ok) {
        const data = await res.json();
        setSavedAddresses(data || []);
        // Pre-set with default address
        const defaultAddr = data.find((addr: SavedAddress) => addr.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
          setShippingAddress(formatAddress(defaultAddr));
        }
      }
    } catch (error) {
      console.error('Error fetching saved addresses:', error);
      toast.error('Error al cargar direcciones guardadas');
    }
  }, []);

  // Redirect unauthenticated users and fetch cart and addresses on authentication
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    // Fetch cart items and saved addresses when authenticated
    if (status === 'authenticated') {
      fetchCart();
      fetchSavedAddresses();
      fetchUserProfile();
      setShippingEmail(session?.user?.email || '');
      setShippingName(session?.user?.name || '');
    }
  }, [status, router, session, fetchCart, fetchSavedAddresses]);

  // Function to fetch user profile
  const fetchUserProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const data = await res.json();
        setShippingPhone(data.phone || '');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Function to format address
  const formatAddress = (addr: SavedAddress) => {
    return `${addr.street}, ${addr.city}, ${addr.postalCode}, ${addr.country}`;
  };

  // Handle address selection
  const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    setSelectedAddressId(selectedId);
    if (selectedId === 'custom') {
      setIsCustomAddress(true);
      setShippingAddress('');
    } else {
      setIsCustomAddress(false);
      const selectedAddr = savedAddresses.find(addr => addr.id === selectedId);
      setShippingAddress(selectedAddr ? formatAddress(selectedAddr) : '');
    }
  };

  // Handle form submission to redirect to payment selection
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Store checkout data in sessionStorage for payment page
      sessionStorage.setItem('checkoutData', JSON.stringify({
        items: cartItems?.map?.(item => ({
          id: item?.Product?.id,
          productId: item?.Product?.id,
          name: item?.Product?.name ?? 'Producto',
          description: (item?.Product as any)?.description ?? '',
          price: item?.Product?.price ?? 0,
          quantity: item?.quantity ?? 1,
          images: (item?.Product as any)?.images ?? [],
        })) ?? [],
        shippingName,
        shippingEmail,
        shippingPhone,
        shippingAddress,
        total
      }));
      
      // Redirect to payment selection page
      router.push('/payment');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar el checkout');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate total amount
  const total = cartItems?.reduce?.(
    (sum, item) => sum + (item?.Product?.price ?? 0) * (item?.quantity ?? 0),
    0
  ) ?? 0;

  // Render loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <div>
            <h2 className="text-2xl font-semibold mb-6">Información de Envío</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo
                </label>
                <Input
                  type="text"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  required
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={shippingEmail}
                  onChange={(e) => setShippingEmail(e.target.value)}
                  required
                  placeholder="tu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <Input
                  type="tel"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección de Envío
                </label>
                {savedAddresses.length > 0 && (
                  <select
                    value={selectedAddressId}
                    onChange={handleAddressChange}
                    className="w-full p-3 border border-gray-300 rounded-md mb-4"
                  >
                    <option value="">Selecciona una dirección</option>
                    {savedAddresses.map((addr) => (
                      <option key={addr.id} value={addr.id}>
                        {addr.name} - {formatAddress(addr)}
                      </option>
                    ))}
                    <option value="custom">Usar dirección personalizada</option>
                  </select>
                )}
                {isCustomAddress || savedAddresses.length === 0 ? (
                  <Input
                    type="text"
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    required
                    placeholder="Tu dirección completa"
                  />
                ) : (
                  <div className="p-3 border border-gray-300 rounded-md bg-gray-50">
                    {shippingAddress}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">Resumen del Pedido</h2>
            <div className="space-y-2">
              {cartItems?.map?.(item => (
                <div key={item.id} className="flex justify-between text-gray-700">
                  <span>
                    {item?.Product?.name} x {item?.quantity}
                  </span>
                  <span>
                    ${((item?.Product?.price ?? 0) * (item?.quantity ?? 0)).toFixed(2)}
                  </span>
                </div>
              )) || null}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[#60B5FF]">
                    ${total?.toFixed?.(2) ?? '0.00'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#60B5FF] hover:bg-[#4A9FE8] py-6 text-lg"
          >
            {submitting ? 'Redirigiendo...' : 'Seleccionar Método de Pago'}
          </Button>
          <p className="text-sm text-gray-500 text-center">
            Serás redirigido para seleccionar tu método de pago preferido.
          </p>
        </motion.form>
      </div>
    </div>
  );
}
