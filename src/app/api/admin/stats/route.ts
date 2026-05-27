import { prisma } from "@/lib/prisma";
import { ok, handleError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await requireAdmin();
    const [totalUsers, totalBooks, totalOrders, paidOrders, recentOrders, lowStock] =
      await Promise.all([
        prisma.user.count(),
        prisma.book.count(),
        prisma.order.count(),
        prisma.order.findMany({ where: { status: "PAID" }, select: { totalAmount: true } }),
        prisma.order.findMany({
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { user: { select: { name: true, email: true } } },
        }),
        prisma.book.findMany({ where: { stock: { lt: 10 } }, take: 10 }),
      ]);

    const revenue = paidOrders.reduce((s, o) => s + Number(o.totalAmount), 0);

    // Sales over last 7 days
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recent = await prisma.order.findMany({
      where: { status: "PAID", createdAt: { gte: since } },
      select: { totalAmount: true, createdAt: true },
    });
    const dailyMap = new Map<string, number>();
    for (const o of recent) {
      const k = o.createdAt.toISOString().slice(0, 10);
      dailyMap.set(k, (dailyMap.get(k) ?? 0) + Number(o.totalAmount));
    }
    const salesChart = Array.from(dailyMap.entries()).map(([date, total]) => ({ date, total }));

    return ok({
      totalUsers,
      totalBooks,
      totalOrders,
      revenue,
      recentOrders,
      lowStock,
      salesChart,
    });
  } catch (e) {
    return handleError(e);
  }
}
