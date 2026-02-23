import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// PUT: Establecer una dirección como default
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    // Quitar el default de todas las direcciones del usuario
    await prisma.address.updateMany({
      where: { userId: user.id },
      data: { isDefault: false },
    });

    // Establecer la dirección específica como default
    const updatedAddress = await prisma.address.update({
      where: { id: params.id, userId: user.id },
      data: { isDefault: true },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Error setting default address:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}