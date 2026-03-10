/**
 * File: /home/ubuntu/ecommerce_app/nextjs_space/app/api/products/route.ts
 * Description: Endpoint para obtener los productos
 * 
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name or description
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               stock:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Bad request - missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized - admin access required
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
// Endpoint para obtener los productos
export async function GET(request: Request) {
  // Obtener parámetros de consulta
  try 
    // Parsear URL para obtener parámetros de búsqueda
  {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const search = searchParams.get("search");
    // Construir objeto 'where' para filtros dinámicos
    const where: any = {};
    // Agregar filtro por categoría si se proporciona
    if (categoryId) {
      where.categoryId = categoryId;
    }
    // Agregar filtro de búsqueda si se proporciona
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }
    // Consultar productos en la base de datos con filtros aplicados
    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    // Retornar productos como respuesta JSON
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
// Endpoint para crear un producto
export async function POST(request: Request) {
  // Verificar sesión y rol de usuario
  try {
    // Obtener sesión del usuario
    const session = await getServerSession(authOptions);
    // Verificar si el usuario es administrador
    if (!session || (session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Parsear cuerpo de la solicitud
    const body = await request.json();
    const { name, description, price, categoryId, images, stock } = body;
    // Validar campos requeridos
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }
    // Crear nuevo producto en la base de datos
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId,
        images: images || [],
        stock: stock ? parseInt(stock) : 0,
      },
      include: {
        category: true,
      },
    });
    // Retornar el producto creado como respuesta JSON
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}
