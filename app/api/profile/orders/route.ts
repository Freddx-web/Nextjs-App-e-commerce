import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";
// This route handles fetching the authenticated user's orders.
export async function GET() {
  // Get the current user's session
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    // If no session or user email, return unauthorized
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    // Fetch the user from the database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
      },
    });
    // If user not found, return not found
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    // Fetch the user's orders with related items and product details
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        OrderItem: {
          include: {
            Product: {
              select: {
                name: true,
                images: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // Return the orders as a JSON response
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
