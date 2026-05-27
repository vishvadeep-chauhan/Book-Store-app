import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, fail, handleError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";

const updateSchema = z.object({ quantity: z.number().int().positive() });

async function recalcCart(cartId: string) {
  const items = await prisma.cartItem.findMany({
    where: { cartId },
    include: { book: true },
  });
  const total = items.reduce((sum, it) => sum + Number(it.book.price) * it.quantity, 0);
  await prisma.cart.update({ where: { id: cartId }, data: { totalPrice: total } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const session = await requireAuth();
    const { itemId } = await params;
    const { quantity } = updateSchema.parse(await req.json());

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });
    if (!item || item.cart.userId !== session.user.id) return fail("Not found", 404);

    await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    await recalcCart(item.cartId);
    return ok({ message: "Updated" });
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ itemId: string }> }) {
  try {
    const session = await requireAuth();
    const { itemId } = await params;
    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });
    if (!item || item.cart.userId !== session.user.id) return fail("Not found", 404);
    await prisma.cartItem.delete({ where: { id: itemId } });
    await recalcCart(item.cartId);
    return ok({ message: "Removed" });
  } catch (e) {
    return handleError(e);
  }
}
