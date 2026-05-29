import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, sig ?? "", process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch (err) {
    console.error("Webhook signature verification failed", err);
    return new NextResponse("Bad signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const sess = event.data.object as Stripe.Checkout.Session;
        const orderId = sess.metadata?.orderId;
        const userId = sess.metadata?.userId;
        if (orderId) {
          const order = await prisma.order.update({
            where: { id: orderId },
            data: { status: "PAID", stripePaymentId: sess.payment_intent as string },
            include: { items: true },
          });
          // Decrement stock
          for (const it of order.items) {
            await prisma.book.update({
              where: { id: it.bookId },
              data: { stock: { decrement: it.quantity } },
            });
          }
          // Clear user's cart
          if (userId) {
            const cart = await prisma.cart.findUnique({ where: { userId } });
            if (cart) {
              await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
              await prisma.cart.update({ where: { id: cart.id }, data: { totalPrice: 0 } });
            }
          }
        }
        break;
      }
      case "checkout.session.expired":
      case "checkout.session.async_payment_failed": {
        const sess = event.data.object as Stripe.Checkout.Session;
        const orderId = sess.metadata?.orderId;
        if (orderId) {
          await prisma.order.update({ where: { id: orderId }, data: { status: "CANCELLED" } });
        }
        break;
      }
    }
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[STRIPE_WEBHOOK]", err);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
