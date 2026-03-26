/**
 * File: /home/ubuntu/ecommerce_app/nextjs_space/app/api/create-checkout-session/route.ts
 * Description: Endpoint para crear una sesión de pago
 * Author: Danny Lopez 
 * Date: 2026-01-05
 * Version: 1.0.0
 * License: MIT
 * Copyright: 2026
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import Stripe from 'stripe';

// Endpoint para crear una sesión de pago
export async function POST(request: Request) {
  try {
    // Initialize Stripe client inside the function
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-02-25.clover',
    });
    // Verificar sesión de usuario
    const session = await getServerSession(authOptions);
    // Si no hay sesión, retornar error de no autorizado
    if (!session?.user) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    // Obtener datos del cuerpo de la solicitud
    const body = await request.json();
    // Desestructurar los datos necesarios
    const { items, shippingName, shippingEmail, shippingAddress } = body;
    // Validar que haya items en el carrito
    if (!items || items?.length === 0) {
      return NextResponse.json(
        { error: 'Items requeridos' },
        { status: 400 }
      );
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: item.description || '',
          images: item.images || [],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Get origin from headers for dynamic URLs
    const origin = request.headers.get('origin') || 'http://localhost:3000';

    // Create Stripe checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout`,
      customer_email: shippingEmail,
      metadata: {
        userId: (session.user as any).id,
        shippingName,
        shippingEmail,
        shippingAddress,
      },
    });

    return NextResponse.json({ sessionId: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error al crear sesión de pago' },
      { status: 500 }
    );
  }
}
