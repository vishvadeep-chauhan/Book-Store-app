import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookForm } from "@/components/admin/book-form";

export default async function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [book, categories] = await Promise.all([
    prisma.book.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!book) notFound();
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Book</h1>
      <BookForm
        categories={categories}
        initial={{
          ...book,
          price: Number(book.price),
          isbn: book.isbn ?? undefined,
          publishedDate: book.publishedDate ?? undefined,
        }}
      />
    </div>
  );
}
