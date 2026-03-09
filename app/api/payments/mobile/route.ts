import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/lib/auth';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get the current session
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Usuario no autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      transactionId,
      phoneNumber,
      bankAccount,
      accountHolder,
      amount,
      checkoutData
    } = body;

    // Validate required fields
    if (!transactionId || !phoneNumber || !bankAccount || !accountHolder || !amount || !checkoutData) {
      return NextResponse.json(
        { message: 'Faltan datos requeridos para procesar el pago' },
        { status: 400 }
      );
    }

    // Create the order first
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        total: amount,
        shippingName: checkoutData.shippingName,
        shippingEmail: checkoutData.shippingEmail,
        shippingAddress: checkoutData.shippingAddress,
        status: 'PENDING',
      },
    });

    // Create order items
    const orderItems = checkoutData.items.map((item: any) => ({
      orderId: order.id,
      productId: item.id || item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    await prisma.orderItem.createMany({
      data: orderItems,
    });

    // Create mobile payment transaction
    const mobilePayment = await prisma.mobilePaymentTransaction.create({
      data: {
        orderId: order.id,
        transactionId: transactionId.trim(),
        phoneNumber,
        bankAccount,
        accountHolder,
        amount,
        status: 'CONFIRMED',
        confirmationDate: new Date(),
      },
    });

    // Update order status to PROCESSING since payment is confirmed
    await prisma.order.update({
      where: { id: order.id },
      data: { status: 'PROCESSING' },
    });

    // Clear user's cart after successful payment
    await prisma.cartItem.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      message: 'Pago confirmado exitosamente',
      orderId: order.id,
      transactionId: mobilePayment.transactionId,
    });

  } catch (error) {
    console.error('Error processing mobile payment:', error);
    
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { message: 'El número de transacción ya ha sido utilizado' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Error al procesar el pago móvil' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
