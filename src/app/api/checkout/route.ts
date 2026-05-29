import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";
import { ok, fail, handleError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";

export async function POST() {
  try {
    const stripe = getStripe();
    const session = await requireAuth();
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: { include: { book: true } } },
    });
    if (!cart || cart.items.length === 0) return fail("Cart is empty", 400);

    // Verify stock
    for (const item of cart.items) {
      if (item.book.stock < item.quantity) {
        return fail(`Insufficient stock for ${item.book.title}`, 400);
      }
    }

    // Create pending order
    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        totalAmount: cart.totalPrice,
        items: {
          create: cart.items.map((it) => ({
            bookId: it.bookId,
            quantity: it.quantity,
            price: it.book.price,
          })),
        },
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: session.user.email ?? undefined,
      line_items: cart.items.map((it) => ({
        price_data: {
          currency: "inr",
          product_data: { name: it.book.title, images: [it.book.image] },
          unit_amount: Math.round(Number(it.book.price) * 100),
        },
        quantity: it.quantity,
      })),
      metadata: { orderId: order.id, userId: session.user.id },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel?orderId=${order.id}`,
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: checkoutSession.id },
    });

    return ok({ url: checkoutSession.url, sessionId: checkoutSession.id });
  } catch (e) {
    return handleError(e);
  }
}
