/**
 * File: /home/ubuntu/ecommerce_app/nextjs_space/app/api/admin/stats/route.ts
 * Description: Endpoint para obtener las estadísticas del panel de administración
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

export const dynamic = "force-dynamic";
// Endpoint para obtener las estadísticas del panel de administración
export async function GET() {
  // Verificar sesión y rol de usuario
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session?.user as any)?.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Total revenue
    const orders = await prisma.order.findMany({
      where: {
        status: {
          not: "CANCELLED",
        },
      },
    });

    // Calcular el total de ingresos
    const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
    // Total orders
    const totalOrders = await prisma.order.count();
    // Total products
    const totalProducts = await prisma.product.count();
    // Total users
    const totalUsers = await prisma.user.count();

    // Top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: "desc",
        },
      },
      take: 5,
    });
    // Fetch product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            images: true,
          },
        });
        return {
          ...product,
          totalSold: item._sum?.quantity ?? 0,
        };
      })
    );

    // Recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        User: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Sales by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });
    // Formatear los resultados de ordersByStatus
    const formattedOrdersByStatus: { [key: string]: number } = {};
    ordersByStatus.forEach((item: any) => {
      formattedOrdersByStatus[item.status] = item._count.id;
    });
    // Construir el objeto de estadísticas
    const stats = {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalUsers,
      topProducts: topProductsWithDetails,
      recentOrders,
      ordersByStatus: formattedOrdersByStatus,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    );
  }
}
