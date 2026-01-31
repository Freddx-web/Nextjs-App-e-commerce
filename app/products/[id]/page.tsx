'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { ProductPhotoAlbum } from '@/components/product-photo-album';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: {
    name: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession() || {};
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (params?.id) {
      fetchProduct();
    }
  }, [params?.id]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params?.id}`);
      if (res.ok) {
        const data = await res.json();
        setProduct(data);
      } else {
        toast.error('Producto no encontrado');
        router.push('/');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Error al cargar producto');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id,
          quantity,
        }),
      });

      if (res.ok) {
        toast.success('Producto agregado al carrito');
        router.push('/cart');
      } else {
        toast.error('Error al agregar al carrito');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al agregar al carrito');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Photo Album Gallery */}
          <div>
            <ProductPhotoAlbum
              images={product.images || []}
              productName={product.name}
              initialIndex={0}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-[#60B5FF] font-medium uppercase mb-2">
                {product?.category?.name}
              </p>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-[#60B5FF]">
                ${product.price?.toFixed?.(2) ?? '0.00'}
              </p>
            </div>

            <div className="border-t border-b py-6">
              <h2 className="text-lg font-semibold mb-2">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Cantidad
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="text-xl font-semibold px-6">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              <Button
                onClick={addToCart}
                className="w-full bg-[#60B5FF] hover:bg-[#4A9FE8] py-6 text-lg gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Agregar al Carrito
              </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Stock disponible:</span>{' '}
                {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
