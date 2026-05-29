import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";
import { Star } from "lucide-react";
import { AddToCartButton } from "@/components/books/add-to-cart-button";

export const dynamic = "force-dynamic";

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await prisma.book.findUnique({
    where: { id },
    include: {
      category: true,
      reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!book) notFound();

  return (
    <div className="container py-10 grid md:grid-cols-2 gap-10">
      <div className="relative aspect-[2/3] max-w-md mx-auto w-full rounded-lg overflow-hidden bg-muted">
        <Image src={book.image} alt={book.title} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
      </div>
      <div className="space-y-4">
        <Badge>{book.category.name}</Badge>
        <h1 className="text-3xl md:text-4xl font-bold">{book.title}</h1>
        <p className="text-lg text-muted-foreground">by {book.author}</p>
        <div className="flex items-center gap-2 text-yellow-500">
          <Star className="h-5 w-5 fill-current" />
          <span>{book.rating.toFixed(1)}</span>
          <span className="text-muted-foreground text-sm">({book.reviews.length} reviews)</span>
        </div>
        <p className="text-3xl font-bold">{formatPrice(book.price.toString())}</p>
        <p className="text-muted-foreground leading-relaxed">{book.description}</p>
        <p className="text-sm">
          {book.stock > 0 ? (
            <span className="text-green-600">In stock: {book.stock} available</span>
          ) : (
            <span className="text-destructive">Out of stock</span>
          )}
        </p>
        <AddToCartButton
          book={{
            id: book.id,
            title: book.title,
            image: book.image,
            price: Number(book.price),
          }}
          disabled={book.stock <= 0}
        />
        {book.publishedDate && (
          <p className="text-sm text-muted-foreground">Published: {formatDate(book.publishedDate)}</p>
        )}
      </div>

      <section className="md:col-span-2 mt-8">
        <h2 className="text-2xl font-bold mb-4">Reviews</h2>
        {book.reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first!</p>
        ) : (
          <ul className="space-y-4">
            {book.reviews.map((r) => (
              <li key={r.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{r.user.name}</span>
                  <div className="flex text-yellow-500">
                    {Array.from({ length: r.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                {r.comment && <p className="text-sm text-muted-foreground mt-2">{r.comment}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
