import { prisma } from "@/lib/prisma";
import { BookForm } from "@/components/admin/book-form";

export const dynamic = "force-dynamic";

export default async function NewBookPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Add Book</h1>
      <BookForm categories={categories} />
    </div>
  );
}
