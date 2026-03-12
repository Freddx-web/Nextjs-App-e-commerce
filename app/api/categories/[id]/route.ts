/**
 * File: /home/ubuntu/ecommerce_app/nextjs_space/app/api/categories/[id]/route.ts
 * Description: Endpoint para actualizar una categoría
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
// Endpoint para actualizar una categoría
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Verificar sesión y rol de usuario
    const session = await getServerSession(authOptions);
    // Verificar si el usuario tiene rol de ADMIN
    if (!session || (session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Obtener datos del cuerpo de la solicitud
    const body = await request.json();
    const { name, description } = body;
    // Construir objeto de actualización
    const updateData: any = {};
    // Actualizar nombre y slug si se proporciona un nuevo nombre
    if (name) {
      updateData.name = name;
      updateData.slug = name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
    }
    // Actualizar descripción si se proporciona
    if (description !== undefined) {
      updateData.description = description || null;
    }
    //
    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Error al actualizar categoría" },
      { status: 500 }
    );
  }
}
// Endpoint para eliminar una categoría
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Eliminar una categoría
  try {
    const { id } = await params;
    // Verificar sesión y rol de usuario
    const session = await getServerSession(authOptions);
    // Verificar si el usuario tiene rol de ADMIN
    if (!session || (session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Eliminar la categoría
    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Categoría eliminada" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Error al eliminar categoría" },
      { status: 500 }
    );
  }
}
