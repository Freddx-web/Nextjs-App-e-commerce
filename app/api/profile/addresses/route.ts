import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// Mock address storage since addresses are not in the schema
// In a real app, you would add an Address model to the schema
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

    // Obtener las direcciones del usuario desde la base de datos
    const userAddresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(userAddresses);
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
    const { name, street, city, postalCode, country, phone, isDefault } = await request.json();
    
    // Validar datos requeridos
    if (!name || !street || !city || !postalCode || !country) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    // Si se marca como default, quitar el default de otras direcciones
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    // Crear la nueva dirección
    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        name,
        street,
        city,
        postalCode,
        country,
        phone,
        isDefault: isDefault || false,
      },
    });

    return NextResponse.json(newAddress);
  } catch (error) {
    console.error('Error creating address:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
