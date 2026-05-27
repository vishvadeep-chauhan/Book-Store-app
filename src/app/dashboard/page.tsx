import Link from "next/link";
import { auth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();
  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/dashboard/orders">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
            <CardContent>View your order history</CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/wishlist">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardHeader><CardTitle>Wishlist</CardTitle></CardHeader>
            <CardContent>Books you saved for later</CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/profile">
          <Card className="hover:shadow-lg transition cursor-pointer">
            <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
            <CardContent>Manage your account</CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
