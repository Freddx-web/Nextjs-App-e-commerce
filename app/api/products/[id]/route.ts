/**
 * File: /home/ubuntu/ecommerce_app/nextjs_space/app/api/products/[id]/route.ts
 * Description: Endpoint para obtener un producto
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";
// Endpoint para obtener un producto
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Obtener el producto por ID
  try {
    const { id } = await params;
    // Buscar el producto en la base de datos
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        Category: true,
      },
    });
    // Si no se encuentra el producto, devolver un error 404
    if (!product) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }
    // Devolver el producto encontrado
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}
// Endpoint para actualizar un producto
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Actualizar el producto por ID
  try {
    const { id } = await params;
    // Verificar la sesión del usuario
    const session = await getServerSession(authOptions);
    // Solo los administradores pueden actualizar productos
    if (!session || (session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Obtener los datos del cuerpo de la solicitud
    const body = await request.json();
    const { name, description, price, categoryId, images, stock } = body;
    // Actualizar el producto en la base de datos
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(price) }),
        ...(categoryId && { categoryId }),
        ...(images && { images }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
      },
      include: {
        Category: true,
      },
    });
    // Devolver el producto actualizado
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}
// Endpoint para eliminar un producto
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Eliminar el producto por ID
  try {
    const { id } = await params;
    // Verificar la sesión del usuario
    const session = await getServerSession(authOptions);
    // Solo los administradores pueden eliminar productos
    if (!session || (session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Eliminar el producto de la base de datos
    await prisma.product.delete({
      where: { id },
    });
    // Devolver una respuesta de éxito
    return NextResponse.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
