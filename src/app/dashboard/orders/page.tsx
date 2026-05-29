import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) return null;

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { book: true } } },
  });

  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold">Order History</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground">No orders yet.</p>
      ) : (
        orders.map((o) => (
          <Card key={o.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Order #{o.id.slice(-8)}</CardTitle>
                <p className="text-sm text-muted-foreground">{formatDate(o.createdAt)}</p>
              </div>
              <Badge>{o.status}</Badge>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {o.items.map((it) => (
                  <li key={it.id} className="flex justify-between">
                    <span>{it.book.title} × {it.quantity}</span>
                    <span>{formatPrice(Number(it.price) * it.quantity)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-right font-semibold">Total: {formatPrice(o.totalAmount.toString())}</p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
