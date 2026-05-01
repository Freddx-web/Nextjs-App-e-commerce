/**
 * File: /home/ubuntu/ecommerce_app/nextjs_space/app/api/cart/route.ts
 * Description: Endpoint para obtener el carrito de compras
 * Author: Danny Lopez 
 * Date: 2026-01-05
 * Version: 1.0.0
 * License: MIT
 * Copyright: 2026 Juan Pablo Hernández
 * 
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart items
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Bad request - invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cartItemId
 *               - quantity
 *             properties:
 *               cartItemId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Bad request - invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: Cart item ID to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad request - missing cartItemId
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";
// Endpoint para obtener el carrito de compras
export async function GET() {
  try {
    // Verificar sesión de usuario
    const session = await getServerSession(authOptions);
    // Si no hay sesión, retornar no autorizado
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Obtener el ID del usuario desde la sesión
    const userId = (session.user as any).id;
    // Buscar los items del carrito para el usuario
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        Product: {
          include: {
            Category: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Error al obtener carrito" },
      { status: 500 }
    );
  }
}
// Endpoint para agregar un producto al carrito
export async function POST(request: Request) {
  try {
    // Verificar sesión de usuario
    const session = await getServerSession(authOptions);
    // Si no hay sesión, retornar no autorizado
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Obtener el ID del usuario desde la sesión
    const userId = (session.user as any).id;
    const body = await request.json();
    const { productId, quantity } = body;
    // Validar datos de entrada
    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }
    // Verificar si el item ya existe en el carrito
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    // Si existe, actualizar la cantidad, si no, crear un nuevo item
    let cartItem;
    // Actualizar cantidad si el item ya existe
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: existingItem.quantity + quantity,
        },
        include: {
          Product: {
            include: {
              Category: true,
            },
          },
        },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: {
          userId,
          productId,
          quantity,
        },
        include: {
          Product: {
            include: {
              Category: true,
            },
          },
        },
      });
    }

    return NextResponse.json(cartItem, { status: 201 });
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: "Error al agregar al carrito" },
      { status: 500 }
    );
  }
}
// Endpoint para actualizar la cantidad de un producto en el carrito
export async function PUT(request: Request) {
  try {
    // Verificar sesión de usuario
    const session = await getServerSession(authOptions);
    // Si no hay sesión, retornar no autorizado
    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Obtener el ID del usuario desde la sesión
    const userId = (session.user as any).id;
    const body = await request.json();
    const { cartItemId, quantity } = body;
    // Validar datos de entrada
    if (!cartItemId || quantity < 1) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }
    // Actualizar la cantidad del item en el carrito
    const cartItem = await prisma.cartItem.update({
      where: {
        id: cartItemId,
        userId,
      },
      data: {
        quantity,
      },
      include: {
        Product: {
          include: {
            Category: true,
          },
        },
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    console.error("Error updating cart:", error);
    return NextResponse.json(
      { error: "Error al actualizar carrito" },
      { status: 500 }
    );
  }
}
// Endpoint para eliminar un producto del carrito
export async function DELETE(request: Request) {
  // Verificar sesión de usuario
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Obtener el ID del usuario desde la sesión
    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const cartItemId = searchParams.get("cartItemId");
    // Validar datos de entrada
    if (!cartItemId) {
      return NextResponse.json(
        { error: "ID del item requerido" },
        { status: 400 }
      );
    }
    // Eliminar el item del carrito
    await prisma.cartItem.delete({
      where: {
        id: cartItemId,
        userId,
      },
    });

    return NextResponse.json({ message: "Item eliminado del carrito" });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    return NextResponse.json(
      { error: "Error al eliminar item" },
      { status: 500 }
    );
  }
}
