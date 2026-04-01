import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// Mock payment methods storage since payment methods are not in the schema
// In a real app, you would add a PaymentMethod model to the schema
type PaymentMethod = {
  id: string;
  userId: string;
  type: string;
  brand: string;
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  holderName: string;
  isDefault: boolean;
  createdAt: string;
};

const paymentMethods: PaymentMethod[] = [];
// Example PaymentMethod structure:
export async function GET() {
  // Fetch user session
  try {
    // Fetch user session
    const session = await getServerSession(authOptions);
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
      },
    });
    // If user not found, return error
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
// Create a new payment method
export async function POST(request: NextRequest) {
  // Fetch user session
  try {
    // Fetch user session
    const session = await getServerSession(authOptions);
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
      },
    });
    // If user not found, return error
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    // Parse request body
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
    // Add to mock storage
    paymentMethods.push(newPaymentMethod);
    return NextResponse.json(newPaymentMethod);
  } catch (error) {
    console.error('Error creating payment method:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
