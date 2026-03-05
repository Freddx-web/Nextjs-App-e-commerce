'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowLeft, Smartphone, Copy, CheckCircle } from 'lucide-react';
import Image from 'next/image';

export default function QRScanPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const phoneNumber = '+58 414-123-4567';
  const bankAccount = '0134-0000-0000-0000';
  const accountHolder = 'Juan Pérez';
  const amount = 'Bs. 150,00';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Pago Móvil</h1>
          </div>
          <p className="text-gray-600 mb-8">Escanea el código QR o usa los datos para completar tu pago</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          {/* QR Code Section */}
          <div className="text-center mb-8">
            <div className="bg-gray-100 rounded-xl p-8 inline-block">
              <Image
                src="/QR-PAGOMOVIL.jpeg"
                alt="Código QR para Pago Móvil"
                width={256}
                height={256}
                className="rounded-lg"
              />
            </div>
            <p className="text-gray-600 mt-4">Escanea este código con la app de tu banco</p>
          </div>

          {/* Payment Details */}
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Datos del Pago</h3>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Número de teléfono</p>
                  <p className="font-medium text-gray-900">{phoneNumber}</p>
                </div>
                <button
                  onClick={() => handleCopy(phoneNumber)}
                  className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                >
                  {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Número de cuenta</p>
                  <p className="font-medium text-gray-900">{bankAccount}</p>
                </div>
                <button
                  onClick={() => handleCopy(bankAccount)}
                  className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Titular de la cuenta</p>
                  <p className="font-medium text-gray-900">{accountHolder}</p>
                </div>
                <button
                  onClick={() => handleCopy(accountHolder)}
                  className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Monto a pagar</p>
                  <p className="font-medium text-gray-900">{amount}</p>
                </div>
                <button
                  onClick={() => handleCopy(amount)}
                  className="p-2 rounded-lg bg-white hover:bg-gray-100 transition-colors"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-blue-50 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs">i</span>
              </div>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Instrucciones</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Abre la app de tu banco</li>
                  <li>Selecciona la opción de Pago Móvil</li>
                  <li>Escanea el código QR o ingresa los datos manualmente</li>
                  <li>Confirma el pago</li>
                  <li>Guarda el comprobante de pago</li>
                </ol>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 space-y-4"
        >
          <Button
            onClick={() => router.push('/payment/confirmation')}
            className="w-full bg-[#60B5FF] hover:bg-[#4A9FE8] py-6 text-lg"
          >
            Ya realicé el pago
          </Button>
          
          <Button
            variant="outline"
            onClick={() => router.push('/payment')}
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-6 text-lg"
          >
            Elegir otro método de pago
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
