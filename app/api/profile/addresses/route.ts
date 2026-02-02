import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// Mock address storage since addresses are not in the schema
// In a real app, you would add an Address model to the schema
const addresses: any[] = [];
// Endpoint para obtener las direcciones del usuario
export async function GET() {
  // Verificar sesión del usuario
  try {
    // Obtener sesión del usuario
    const session = await getServerSession(authOptions);
    // Verificar si el usuario está autenticado
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    // Obtener el usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
      },
    });
    // Verificar si el usuario existe
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
// Endpoint para crear una nueva dirección
export async function POST(request: NextRequest) {
  // Verificar sesión del usuario
  try {
    // Obtener sesión del usuario
    const session = await getServerSession(authOptions);
    // Verificar si el usuario está autenticado
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    // Obtener el usuario desde la base de datos
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
      },
    });
    // Verificar si el usuario existe
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    // Parsear el cuerpo de la solicitud para obtener los datos de la dirección
    const addressData = await request.json();
    
    // For demo purposes, just return the data
    // In a real app, you would save to the database
    const newAddress = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      ...addressData,
      createdAt: new Date().toISOString(),
    };
    // Agregar la nueva dirección al almacenamiento simulado
    addresses.push(newAddress);
    return NextResponse.json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
