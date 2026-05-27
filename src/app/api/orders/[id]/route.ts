import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, handleError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireAuth();
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { book: true } }, user: true },
    });
    if (!order) return fail("Not found", 404);
    if (order.userId !== session.user.id && session.user.role !== "ADMIN") {
      return fail("Forbidden", 403);
    }
    return ok(order);
  } catch (e) {
    return handleError(e);
  }
}
