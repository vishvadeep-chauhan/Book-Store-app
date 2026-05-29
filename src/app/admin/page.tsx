import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { SalesChart } from "@/components/admin/sales-chart";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalUsers, totalBooks, totalOrders, paidOrders, recentOrders] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.order.count(),
    prisma.order.findMany({ where: { status: "PAID" }, select: { totalAmount: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);
  const revenue = paidOrders.reduce((s, o) => s + Number(o.totalAmount), 0);

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const recent = await prisma.order.findMany({
    where: { status: "PAID", createdAt: { gte: since } },
    select: { totalAmount: true, createdAt: true },
  });
  const map = new Map<string, number>();
  for (const o of recent) {
    const k = o.createdAt.toISOString().slice(0, 10);
    map.set(k, (map.get(k) ?? 0) + Number(o.totalAmount));
  }
  const data = Array.from(map.entries()).map(([date, total]) => ({ date, total }));

  const stats = [
    { label: "Users", value: totalUsers },
    { label: "Books", value: totalBooks },
    { label: "Orders", value: totalOrders },
    { label: "Revenue", value: formatPrice(revenue) },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Sales (last 7 days)</h2>
        <SalesChart data={data} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
        <div className="space-y-2">
          {recentOrders.map((o) => (
            <div key={o.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <p className="font-medium">{o.user.name}</p>
                <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
              </div>
              <div className="text-right">
                <p>{formatPrice(o.totalAmount.toString())}</p>
                <Badge>{o.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
