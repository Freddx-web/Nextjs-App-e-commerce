/**
 * Description: Actualizar Usuarios del Administrador
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";
//  Obtener Usuario del Administrador
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
    // Verificar si el usuario es administrador
    if (!session || (session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Obtener el usuario de la base de datos
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    // Retornar la respuesta con el usuario
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Error al obtener usuario" },
      { status: 500 }
    );
  }
}

//  Actualizar Usuarios del Administrador
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Autorización y Validación
  try {
    const { id } = await params;
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
    // Verificar si el usuario es administrador
    if (!session || (session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Parsear el cuerpo de la solicitud
    const body = await request.json();
    const { role, name, email } = body;
    // Validar el rol si se proporciona
    if (role && (role !== "CUSTOMER" && role !== "ADMIN")) {
      return NextResponse.json(
        { error: "Rol inválido" },
        { status: 400 }
      );
    }
    // Preparar los datos para actualizar
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role !== undefined) updateData.role = role;
    // Actualizar el usuario en la base de datos
    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    // Retornar la respuesta con el usuario actualizado
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Error al actualizar usuario" },
      { status: 500 }
    );
  }
}

// Eliminar Usuario del Administrador
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
    // Verificar si el usuario es administrador
    if (!session || (session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Eliminar el usuario de la base de datos
    await prisma.user.delete({
      where: { id },
    });
    // Retornar la respuesta de éxito
    return NextResponse.json({ message: "Usuario eliminado" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Error al eliminar usuario" },
      { status: 500 }
    );
  }
}
