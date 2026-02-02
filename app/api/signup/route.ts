/**
 * File: /home/ubuntu/ecommerce_app/nextjs_space/app/api/signup/route.ts
 * Description: Endpoint para registrar un nuevo usuario
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
// Endpoint para registrar un nuevo usuario
export async function POST(request: Request) {
  // Extraer datos del cuerpo de la solicitud
  try {
    // Parsear el cuerpo de la solicitud
    const body = await request.json();
    const { email, password, name, phone } = body;
    // Validar datos requeridos
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    // Si el usuario ya existe, retornar error
    if (existingUser) {
      return NextResponse.json(
        { error: "El email ya está registrado" },
        { status: 400 }
      );
    }
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    // Crear el nuevo usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        role: "CUSTOMER",
      },
    });
    // Retornar la respuesta con el usuario creado (sin la contraseña)
    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Error al crear usuario" },
      { status: 500 }
    );
  }
}
