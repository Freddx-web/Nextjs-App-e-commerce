/**
 * File: /home/ubuntu/ecommerce_app/nextjs_space/app/api/orders/route.ts
 * Description: Endpoint para obtener las órdenes
 * Author: Danny Lopez 
 * Date: 2026-01-05
 * Version: 1.0.0
 * License: MIT
 * Copyright: 2026
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";
// Endpoint para obtener las órdenes
export async function GET() {
  // Obtener la sesión del usuario
  try {
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
    // Si no está autenticado, devolver un error 401
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Obtener el ID y rol del usuario de la sesión
    const userId = session.user.id;
    const userRole = session.user.role;
    // Construir la condición de búsqueda según el rol del usuario
    const where = userRole === "ADMIN" ? {} : { userId };
    // Buscar las órdenes
    const orders = await prisma.order.findMany({
      where,
      include: {
        OrderItem: {
          include: {
            Product: true,
          },
        },
        User: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Error al obtener órdenes" },
      { status: 500 }
    );
  }
}
// Endpoint para crear una orden
export async function POST(request: Request) {
  // Obtener la sesión del usuario
  try {
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
    // Si no está autenticado, devolver un error 401
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Obtener el ID del usuario de la sesión
    const userId = session.user.id;
    const body = await request.json();
    const { shippingName, shippingEmail, shippingAddress, items } = body;
    // Validar los datos recibidos
    if (!shippingName || !shippingEmail || !shippingAddress || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Faltan datos requeridos" },
        { status: 400 }
      );
    }
    // Calcular el total de la orden y preparar los items
    let total = 0;
    const orderItems = [];
    // Procesar cada item
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      // Si el producto no existe, devolver un error
      if (!product) {
        return NextResponse.json(
          { error: `Producto ${item.productId} no encontrado` },
          { status: 404 }
        );
      }
      // Calcular el total
      const itemTotal = product.price * item.quantity;
      total += itemTotal;
      // Preparar el item para la orden
      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: product.price,
      });
    }
    // Crear la orden en la base de datos
    const order = await prisma.order.create({
      data: {
        userId,
        total,
        shippingName,
        shippingEmail,
        shippingAddress,
        status: "PENDING",
        OrderItem: {
          create: orderItems,
        },
      },
      include: {
        OrderItem: {
          include: {
            Product: true,
          },
        },
      },
    });

    // Clear cart after order
    await prisma.cartItem.deleteMany({
      where: { userId },
    });
    // Devolver la orden creada
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error al crear orden" },
      { status: 500 }
    );
  }
}
