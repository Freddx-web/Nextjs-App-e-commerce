import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// Mock address storage since addresses are not in the schema
// In a real app, you would add an Address model to the schema
const addresses: any[] = [];

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
    console.error('Error fetching addresses:', error);
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

    const addressData = await request.json();
    
    // For demo purposes, just return the data
    // In a real app, you would save to the database
    const newAddress = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      ...addressData,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
