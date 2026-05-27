import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/book-card";

export const revalidate = 60;

export default async function HomePage() {
  const featured = await prisma.book.findMany({
    take: 8,
    orderBy: { rating: "desc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="container py-20 md:py-32 text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in">
            Find Your Next <span className="text-primary">Favorite Book</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover thousands of books across genres. Curated. Affordable. Delivered fast.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/books">
              <Button size="lg">Shop Books</Button>
            </Link>
            <Link href="/categories">
              <Button size="lg" variant="outline">Browse Categories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="container py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Top Rated</h2>
          <Link href="/books" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((b) => (
            <BookCard
              key={b.id}
              book={{
                id: b.id,
                title: b.title,
                author: b.author,
                price: b.price.toString(),
                image: b.image,
                rating: b.rating,
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
