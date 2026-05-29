import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { BookCard } from "@/components/books/book-card";

export const dynamic = "force-dynamic";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) return null;
  const items = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: { book: true },
  });

  return (
    <div className="container py-10 space-y-6">
      <h1 className="text-3xl font-bold">Your Wishlist</h1>
      {items.length === 0 ? (
        <p className="text-muted-foreground">No saved books yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map(({ book }) => (
            <BookCard key={book.id} book={{ ...book, price: book.price.toString() }} />
          ))}
        </div>
      )}
    </div>
  );
}
