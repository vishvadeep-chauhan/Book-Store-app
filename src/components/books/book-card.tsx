"use client";
import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";

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

  // Generate a realistic, deterministic review count based on title and rating
  const seed = book.title.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const ratingCount = Math.floor(((seed * 73) % 95000) + 1200);
  const formattedCount = ratingCount.toLocaleString();

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-white/5 bg-[#121316]/50 p-4 transition-all duration-300 hover:-translate-y-1.5 hover:bg-[#18191f]/75 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
      <div>
        {/* Cover Image */}
        <Link href={`/books/${book.id}`}>
          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-secondary shadow-[0_12px_32px_rgba(0,0,0,0.45)] transition-shadow group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.65)]">
            <Image
              src={book.image}
              alt={book.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              priority
            />
          </div>
        </Link>

        {/* Text Details */}
        <div className="mt-4 space-y-1.5">
          <Link
            href={`/books/${book.id}`}
            className="line-clamp-1 block text-sm font-extrabold tracking-tight text-white hover:text-primary transition-colors"
          >
            {book.title}
          </Link>
          <p className="line-clamp-1 text-xs font-semibold text-muted-foreground">{book.author}</p>
        </div>
      </div>

      {/* Stats and Action */}
      <div className="mt-3 flex items-center justify-between">
        <div className="space-y-1">
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs font-extrabold text-primary">
            <Star className="h-3.5 w-3.5 fill-current" />
            <span>{Number(book.rating).toFixed(1)}</span>
            <span className="font-semibold text-muted-foreground">({formattedCount})</span>
          </div>

          {/* Price */}
          <p className="text-sm font-black text-white">{formatPrice(book.price)}</p>
        </div>

        {/* Green Circle Shopping Cart Button */}
        <button
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
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-90 shadow-[0_4px_12px_rgba(29,185,84,0.3)] outline-none transition-all duration-200 hover:scale-105 hover:opacity-100 active:scale-95 group-hover:translate-y-0"
          aria-label="Add to cart"
        >
          <ShoppingCart className="h-4.5 w-4.5" />
        </button>
      </div>
    </div>
  );
}
