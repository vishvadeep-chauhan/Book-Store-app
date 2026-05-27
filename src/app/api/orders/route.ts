import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, handleError } from "@/lib/api-response";
import { requireAuth, requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await requireAuth();
    const isAdmin = session.user.role === "ADMIN";
    const allParam = req.nextUrl.searchParams.get("all");

    const orders = await prisma.order.findMany({
      where: isAdmin && allParam === "true" ? {} : { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: { items: { include: { book: true } }, user: { select: { name: true, email: true } } },
    });
    return ok(orders);
  } catch (e) {
    return handleError(e);
  }
}

// Admin: update status
export async function PATCH(req: NextRequest) {
  try {
    await requireAdmin();
    const { orderId, status } = await req.json();
    const order = await prisma.order.update({ where: { id: orderId }, data: { status } });
    return ok(order);
  } catch (e) {
    return handleError(e);
  }
}
