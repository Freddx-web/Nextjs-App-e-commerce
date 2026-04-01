/**
 * File: /home/ubuntu/ecommerce_app/nextjs_space/app/api/orders/[id]/route.ts
 * Description: Endpoint para obtener una orden
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
// Revalidate every 10 seconds
export const revalidate = 10;
// Cache the response for 10 seconds
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Obtener la sesión del usuario
  try {
    const { id } = await params;
    // Verificar si el usuario está autenticado
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
    // Buscar la orden por ID
    const order = await prisma.order.findUnique({
      where: { id },
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
    });
    // Si no se encuentra la orden, devolver un error 404
    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      );
    }
    // Verificar si el usuario tiene permiso para ver la orden
    if (userRole !== "ADMIN" && order.userId !== userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 403 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Error al obtener orden" },
      { status: 500 }
    );
  }
}
// Endpoint para actualizar el estado de una orden
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Obtener la sesión del usuario
  try {
    const { id } = await params;
    // Verificar si el usuario está autenticado y es ADMIN
    const session = await getServerSession(authOptions);
    // Si no está autenticado o no es ADMIN, devolver un error 401
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Parsear el cuerpo de la solicitud
    const body = await request.json();
    const { status } = body;
    // Validar el estado
    if (!status) {
      return NextResponse.json(
        { error: "Estado requerido" },
        { status: 400 }
      );
    }
    // Actualizar el estado de la orden
    const order = await prisma.order.update({
      where: { id },
      data: { status },
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
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Error al actualizar orden" },
      { status: 500 }
    );
  }
}
