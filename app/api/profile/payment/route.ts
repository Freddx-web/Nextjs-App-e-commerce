import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// Mock payment methods storage since payment methods are not in the schema
// In a real app, you would add a PaymentMethod model to the schema
const paymentMethods: any[] = [];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // For demo purposes, return mock data
    // In a real app, you would query from the database
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const paymentData = await request.json();
    
    // Extract last 4 digits from card number
    const last4 = paymentData.cardNumber.replace(/\s/g, '').slice(-4);
    
    // For demo purposes, just return the data
    // In a real app, you would save to the database and encrypt sensitive data
    const newPaymentMethod = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: paymentData.type,
      brand: paymentData.brand,
      last4,
      expiryMonth: parseInt(paymentData.expiryMonth),
      expiryYear: parseInt(paymentData.expiryYear),
      holderName: paymentData.holderName,
      isDefault: paymentData.isDefault || false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newPaymentMethod);
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
