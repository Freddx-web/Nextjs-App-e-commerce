'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

// Types
interface Order {
  id: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  total: number;
  shippingName: string;
  shippingEmail: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

// Order Item Type
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    images: string[];
  };
}

// Status Configuration
const statusConfig = {
  PENDING: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Package },
  PROCESSING: { label: 'Procesando', color: 'bg-blue-100 text-blue-800', icon: Package },
  SHIPPED: { label: 'Enviado', color: 'bg-purple-100 text-purple-800', icon: Truck },
  DELIVERED: { label: 'Entregado', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', color: 'bg-red-100 text-red-800', icon: XCircle },
};

// Orders Page Component
export default function OrdersPage() {
  // State Management
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // Load Orders on Component Mount
  useEffect(() => {
    loadOrders();
  }, []);
  // Fetch Orders from API
  const loadOrders = async () => {
    try {
      const response = await fetch('/api/profile/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };
  // Render Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  // Render Orders Page
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingBag className="h-8 w-8" />
        <h1 className="text-3xl font-bold text-gray-900">Mis Pedidos</h1>
      </div>
      
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes pedidos</h3>
            <p className="text-gray-600 text-center">
              Cuando realices tu primer pedido, aparecerá aquí.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {orders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Pedido #{order.id.slice(-8)}</CardTitle>
                        <CardDescription>
                          {new Date(order.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={statusConfig[order.status].color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[order.status].label}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{order.items.length} productos</p>
                        <p className="font-semibold text-lg">{order.total.toFixed(2)} €</p>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Ver detalles
                      </button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Order Details Sidebar */}
          {selectedOrder && (
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Detalles del Pedido</CardTitle>
                    <button
                      onClick={() => setSelectedOrder(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Información de envío</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Nombre:</strong> {selectedOrder.shippingName}</p>
                      <p><strong>Email:</strong> {selectedOrder.shippingEmail}</p>
                      <p><strong>Dirección:</strong> {selectedOrder.shippingAddress}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">Productos</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-md flex-shrink-0">
                            {item.product.images[0] && (
                              <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover rounded-md"
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{item.product.name}</p>
                            <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                          </div>
                          <p className="text-sm font-medium">
                            {(item.price * item.quantity).toFixed(2)} €
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">{selectedOrder.total.toFixed(2)} €</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
