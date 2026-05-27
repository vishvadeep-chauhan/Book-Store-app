"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useSession } from "next-auth/react";

export function AddToCartButton({
  book,
  disabled,
}: {
  book: { id: string; title: string; image: string; price: number };
  disabled?: boolean;
}) {
  const { data: session } = useSession();
  const addLocal = useCart((s) => s.addLocal);
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    setLoading(true);
    addLocal({
      id: book.id,
      bookId: book.id,
      title: book.title,
      image: book.image,
      price: book.price,
      quantity: 1,
    });
    if (session?.user) {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id, quantity: 1 }),
      });
    }
    setLoading(false);
  }

  return (
    <Button size="lg" onClick={handleAdd} disabled={disabled || loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  );
}
