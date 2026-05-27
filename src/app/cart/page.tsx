"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setItems = useCart((s) => s.setItems);
  const total = useCart((s) => s.total());
  const [loading, setLoading] = useState(false);

  function updateQty(bookId: string, delta: number) {
    const updated = items
      .map((i) => (i.bookId === bookId ? { ...i, quantity: i.quantity + delta } : i))
      .filter((i) => i.quantity > 0);
    setItems(updated);
  }

  async function checkout() {
    if (!session?.user) return router.push("/login?callbackUrl=/cart");
    setLoading(true);
    // Sync cart to backend first
    for (const item of items) {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: item.bookId, quantity: item.quantity }),
      });
    }
    const res = await fetch("/api/checkout", { method: "POST" });
    const json = await res.json();
    setLoading(false);
    if (json.data?.url) window.location.href = json.data.url;
  }

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/books"><Button>Browse Books</Button></Link>
      </div>
    );
  }

  return (
    <div className="container py-10 grid lg:grid-cols-[1fr_360px] gap-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Your Cart</h1>
        {items.map((it) => (
          <Card key={it.id}>
            <CardContent className="p-4 flex gap-4 items-center">
              <div className="relative h-24 w-16 shrink-0">
                <Image src={it.image} alt={it.title} fill className="object-cover rounded" sizes="64px" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">{it.title}</p>
                <p className="text-sm text-muted-foreground">{formatPrice(it.price)}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button size="icon" variant="outline" onClick={() => updateQty(it.bookId, -1)}><Minus className="h-3 w-3" /></Button>
                <span className="w-8 text-center">{it.quantity}</span>
                <Button size="icon" variant="outline" onClick={() => updateQty(it.bookId, 1)}><Plus className="h-3 w-3" /></Button>
              </div>
              <Button size="icon" variant="ghost" onClick={() => remove(it.id)}><Trash2 className="h-4 w-4" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="h-fit sticky top-20">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-bold">Summary</h2>
          <div className="flex justify-between text-sm"><span>Subtotal</span><span>{formatPrice(total)}</span></div>
          <div className="flex justify-between text-sm"><span>Shipping</span><span>Free</span></div>
          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span><span>{formatPrice(total)}</span>
          </div>
          <Button className="w-full" size="lg" onClick={checkout} disabled={loading}>
            {loading ? "Processing..." : "Checkout"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
