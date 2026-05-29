import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { BookCard } from "@/components/books/book-card";
import { demoBooks } from "@/lib/demo-data";

export const revalidate = 60;

export default async function HomePage() {
  const featured = process.env.DATABASE_URL
    ? await prisma.book
        .findMany({
          take: 8,
          orderBy: { rating: "desc" },
        })
        .catch(() => demoBooks)
    : demoBooks;

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(29,185,84,0.20),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.10),transparent_24rem)]" />
        <div className="container relative grid min-h-[calc(100vh-4rem)] items-center gap-10 py-14 md:grid-cols-[1.05fr_0.95fr] md:py-20">
          <div className="max-w-3xl space-y-7">
            <h1 className="max-w-4xl text-5xl font-black tracking-tight text-white md:text-7xl">
              Find Your Next <span className="text-primary">Favorite Book</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
              Browse a richer book library with top-rated picks, sharp recommendations, and a checkout flow that feels as smooth as pressing play.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/books">
                <Button size="lg" className="rounded-full px-7 font-bold">Shop Books</Button>
              </Link>
              <Link href="/books?sort=rating">
                <Button size="lg" variant="outline" className="rounded-full px-7 font-bold">Top Rated</Button>
              </Link>
            </div>
          </div>

          <div className="relative min-h-[420px]">
            <div className="absolute left-8 top-8 h-72 w-56 rotate-[-10deg] overflow-hidden rounded-md bg-muted shadow-[0_32px_80px_rgba(0,0,0,0.55)] md:left-0">
              {featured[0]?.image && (
                <Image src={featured[0].image} alt={featured[0].title} fill sizes="240px" className="object-cover" priority />
              )}
            </div>
            <div className="absolute right-2 top-0 h-80 w-60 rotate-[8deg] overflow-hidden rounded-md bg-muted shadow-[0_32px_80px_rgba(0,0,0,0.55)] md:right-16">
              {featured[1]?.image && (
                <Image src={featured[1].image} alt={featured[1].title} fill sizes="260px" className="object-cover" priority />
              )}
            </div>
            <div className="absolute bottom-2 left-1/2 h-80 w-60 -translate-x-1/2 overflow-hidden rounded-md bg-muted shadow-[0_34px_90px_rgba(0,0,0,0.65)]">
              {featured[2]?.image && (
                <Image src={featured[2].image} alt={featured[2].title} fill sizes="260px" className="object-cover" priority />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container py-14 md:py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold md:text-3xl">Top Rated</h2>
            <p className="mt-2 text-sm text-muted-foreground">A shelf of reader-loved titles, tuned for quick discovery.</p>
          </div>
          <Link href="/books" className="text-sm font-bold text-primary hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:gap-6">
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
