import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

// PUT: Actualizar una dirección
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    const { name, street, city, postalCode, country, phone, isDefault } = await request.json();

    // Si se marca como default, quitar el default de otras direcciones
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    // Actualizar la dirección
    const updatedAddress = await prisma.address.update({
      where: { id, userId: user.id },
      data: {
        name,
        street,
        city,
        postalCode,
        country,
        phone,
        isDefault,
      },
    });

    return NextResponse.json(updatedAddress);
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// DELETE: Eliminar una dirección
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
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

    // Eliminar la dirección
    await prisma.address.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ message: 'Dirección eliminada' });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}