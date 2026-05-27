import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container py-8 grid md:grid-cols-[220px_1fr] gap-8">
      <aside className="space-y-1">
        <h2 className="font-semibold mb-3">Admin</h2>
        <nav className="space-y-1 text-sm">
          <Link href="/admin" className="block px-3 py-2 rounded hover:bg-accent">Dashboard</Link>
          <Link href="/admin/books" className="block px-3 py-2 rounded hover:bg-accent">Books</Link>
          <Link href="/admin/categories" className="block px-3 py-2 rounded hover:bg-accent">Categories</Link>
          <Link href="/admin/orders" className="block px-3 py-2 rounded hover:bg-accent">Orders</Link>
          <Link href="/admin/users" className="block px-3 py-2 rounded hover:bg-accent">Users</Link>
        </nav>
      </aside>
      <Card>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
