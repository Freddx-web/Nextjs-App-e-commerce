'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
// Importa aquí cualquier otra dependencia necesaria
export default function ForgotPasswordPage() {
  // Estado para el email, carga y envío
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Aquí deberías llamar a tu API para enviar el email de recuperación
      // Por ahora solo simulamos el envío
      await new Promise((res) => setTimeout(res, 1200));
      setSubmitted(true);
      toast.success('Si el correo existe, se ha enviado un enlace de recuperación');
    } catch {
      console.error('Error requesting password reset:');
      toast.error('Error al solicitar restablecimiento de contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-br from-[#60B5FF] to-[#4A9FE8] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Recuperar Contraseña</h1>
            <p className="text-gray-600 mt-2">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
          </div>
          {submitted ? (
            <div className="text-center text-green-600 font-medium py-8">
              Si el correo existe, se ha enviado un enlace de recuperación.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="tu@email.com"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#60B5FF] hover:bg-[#4A9FE8] py-6 text-lg"
              >
                {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
