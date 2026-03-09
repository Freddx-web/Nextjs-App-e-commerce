'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Home, Package } from 'lucide-react';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any remaining checkout data
    sessionStorage.removeItem('checkoutData');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-green-600" />
          </motion.div>

          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl font-bold text-gray-900 mb-4"
          >
            ¡Pago Confirmado!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-gray-600 mb-8"
          >
            Tu pago móvil ha sido procesado exitosamente y tu pedido está siendo preparado.
          </motion.p>

          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-left"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Package className="w-6 h-6 text-[#60B5FF]" />
              <h2 className="text-xl font-semibold text-gray-900">Resumen del Pedido</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Estado del pago</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Confirmado
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Método de pago</span>
                <span className="font-medium text-gray-900">Pago Móvil</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">Estado del pedido</span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  En Procesamiento
                </span>
              </div>
              
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600">Próximos pasos</span>
                <span className="text-sm text-gray-900 text-right">
                  Recibirás un email con los detalles de envío
                </span>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-4"
          >
            <Button
              onClick={() => router.push('/orders')}
              className="w-full bg-[#60B5FF] hover:bg-[#4A9FE8] py-6 text-lg flex items-center justify-center space-x-2"
            >
              <Package className="w-5 h-5" />
              <span>Ver Mis Pedidos</span>
            </Button>
            
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-4 flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Ir al Inicio</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => router.push('/products')}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 py-4 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Seguir Comprando</span>
              </Button>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-8 bg-blue-50 rounded-xl p-4 text-left"
          >
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">i</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Información importante</p>
                <p>Hemos enviado un email de confirmación a tu dirección de correo electrónico. Guarda el comprobante de pago móvil para cualquier consulta futura.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
