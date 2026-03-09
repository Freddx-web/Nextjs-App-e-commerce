'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CreditCard, Smartphone } from 'lucide-react';

export default function PaymentSelectionPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'mobile' | null>(null);
  // Handle payment method selection
  const handlePaymentMethodSelect = (method: 'card' | 'mobile') => {
    setSelectedMethod(method);
  };
  // Handle continue button click based on selected payment method
  const handleContinue = () => {
    if (selectedMethod === 'card') {
      // Redirect to card payment processing
      router.push('/payment/card');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Seleccionar Método de Pago</h1>
          <p className="text-gray-600 mb-8">Elige cómo deseas pagar tu pedido</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          {/* Card Payment Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handlePaymentMethodSelect('card')}
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-2 transition-all ${
              selectedMethod === 'card' 
                ? 'border-[#60B5FF] shadow-xl' 
                : 'border-transparent hover:border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <CreditCard className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Tarjeta de Crédito</h3>
                <p className="text-gray-600">Paga con Visa o Mastercard</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm text-gray-500">Aceptamos:</span>
                  <div className="flex space-x-2">
                    <span className="text-sm font-medium text-blue-600">Visa</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm font-medium text-orange-600">Mastercard</span>
                  </div>
                </div>
              </div>
              {selectedMethod === 'card' && (
                <div className="w-6 h-6 bg-[#60B5FF] rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Mobile Payment Option */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/payment/qr-scan')}
            className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer border-2 transition-all hover:border-gray-200`}
          >
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Smartphone className="w-8 h-8 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900">Pago Móvil</h3>
                <p className="text-gray-600">Paga desde tu banco Venezuela</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-sm text-gray-500">Disponible para:</span>
                  <span className="text-sm font-medium text-green-600">Banco Venezuela</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Button
            onClick={handleContinue}
            disabled={!selectedMethod}
            className="w-full bg-[#60B5FF] hover:bg-[#4A9FE8] py-6 text-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {selectedMethod ? 'Continuar' : 'Selecciona un método de pago'}
          </Button>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => router.back()}
              className="text-gray-600 hover:text-gray-800 text-sm underline"
            >
              Volver al checkout
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 bg-blue-50 rounded-xl p-4"
        >
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Información de seguridad</p>
              <p>Todos tus pagos son procesados de forma segura. Tus datos están protegidos con encriptación de extremo a extremo.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
