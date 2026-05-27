import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { DeleteBookButton } from "@/components/admin/delete-book-button";

export default async function AdminBooksPage() {
  const books = await prisma.book.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manage Books</h1>
        <Link href="/admin/books/new"><Button>Add Book</Button></Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr className="text-left">
              <th className="py-2">Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((b) => (
              <tr key={b.id} className="border-b">
                <td className="py-2">{b.title}</td>
                <td>{b.author}</td>
                <td>{b.category.name}</td>
                <td>{formatPrice(b.price.toString())}</td>
                <td>{b.stock}</td>
                <td className="text-right space-x-2">
                  <Link href={`/admin/books/${b.id}`}><Button size="sm" variant="outline">Edit</Button></Link>
                  <DeleteBookButton id={b.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
