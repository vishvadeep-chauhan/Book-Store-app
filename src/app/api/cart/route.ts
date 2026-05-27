import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { cartItemSchema } from "@/validations/book";
import { ok, fail, handleError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";

async function getOrCreateCart(userId: string) {
  return prisma.cart.upsert({
    where: { userId },
    update: {},
    create: { userId },
    include: { items: { include: { book: true } } },
  });
}

async function recalcCart(cartId: string) {
  const items = await prisma.cartItem.findMany({
    where: { cartId },
    include: { book: true },
  });
  const total = items.reduce((sum, it) => sum + Number(it.book.price) * it.quantity, 0);
  await prisma.cart.update({ where: { id: cartId }, data: { totalPrice: total } });
}

export async function GET() {
  try {
    const session = await requireAuth();
    const cart = await getOrCreateCart(session.user.id);
    return ok(cart);
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const { bookId, quantity } = cartItemSchema.parse(await req.json());

    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book) return fail("Book not found", 404);
    if (book.stock < quantity) return fail("Insufficient stock", 400);

    const cart = await getOrCreateCart(session.user.id);
    await prisma.cartItem.upsert({
      where: { cartId_bookId: { cartId: cart.id, bookId } },
      update: { quantity: { increment: quantity } },
      create: { cartId: cart.id, bookId, quantity },
    });
    await recalcCart(cart.id);

    const updated = await prisma.cart.findUnique({
      where: { id: cart.id },
      include: { items: { include: { book: true } } },
    });
    return ok(updated);
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE() {
  try {
    const session = await requireAuth();
    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (cart) {
      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      await prisma.cart.update({ where: { id: cart.id }, data: { totalPrice: 0 } });
    }
    return ok({ message: "Cart cleared" });
  } catch (e) {
    return handleError(e);
  }
}
