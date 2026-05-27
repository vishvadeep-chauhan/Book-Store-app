import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, handleError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await requireAuth();
    const items = await prisma.wishlist.findMany({
      where: { userId: session.user.id },
      include: { book: true },
      orderBy: { createdAt: "desc" },
    });
    return ok(items);
  } catch (e) {
    return handleError(e);
  }
}

const toggleSchema = z.object({ bookId: z.string() });

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { bookId } = toggleSchema.parse(await req.json());
    const existing = await prisma.wishlist.findUnique({
      where: { userId_bookId: { userId: session.user.id, bookId } },
    });
    if (existing) {
      await prisma.wishlist.delete({ where: { id: existing.id } });
      return ok({ inWishlist: false });
    }
    await prisma.wishlist.create({ data: { userId: session.user.id, bookId } });
    return ok({ inWishlist: true });
  } catch (e) {
    return handleError(e);
  }
}
