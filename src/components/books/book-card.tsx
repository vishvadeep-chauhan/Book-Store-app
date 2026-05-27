"use client";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/store/cart";

type Props = {
  book: {
    id: string;
    title: string;
    author: string;
    price: number | string;
    image: string;
    rating: number;
  };
};

export function BookCard({ book }: Props) {
  const addLocal = useCart((s) => s.addLocal);
  return (
    <Card className="group overflow-hidden transition hover:shadow-lg">
      <Link href={`/books/${book.id}`}>
        <div className="relative aspect-[2/3] overflow-hidden bg-muted">
          <Image
            src={book.image}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4 space-y-1">
        <Link href={`/books/${book.id}`} className="font-semibold line-clamp-1 hover:underline">
          {book.title}
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-xs ml-1">{Number(book.rating).toFixed(1)}</span>
          </div>
          <span className="text-sm font-bold ml-auto">{formatPrice(book.price)}</span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          size="sm"
          onClick={() =>
            addLocal({
              id: book.id,
              bookId: book.id,
              title: book.title,
              image: book.image,
              price: Number(book.price),
              quantity: 1,
            })
          }
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
