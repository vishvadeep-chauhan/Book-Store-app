"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { bookSchema, type BookInput } from "@/validations/book";

type Props = {
  categories: { id: string; name: string }[];
  initial?: Partial<BookInput> & { id?: string };
};

export function BookForm({ categories, initial }: Props) {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<BookInput>({
    resolver: zodResolver(bookSchema),
    defaultValues: initial,
  });

  async function onSubmit(data: BookInput) {
    const url = initial?.id ? `/api/books/${initial.id}` : "/api/books";
    const method = initial?.id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) router.push("/admin/books");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4 max-w-3xl">
      <div className="space-y-2 md:col-span-2">
        <Label>Title</Label>
        <Input {...register("title")} />
        {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Description</Label>
        <textarea
          className="w-full min-h-24 rounded-md border bg-background px-3 py-2 text-sm"
          {...register("description")}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Author</Label>
        <Input {...register("author")} />
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <select className="w-full h-10 rounded-md border bg-background px-3 text-sm" {...register("categoryId")}>
          <option value="">Select category</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="space-y-2">
        <Label>Price</Label>
        <Input type="number" step="0.01" {...register("price")} />
      </div>
      <div className="space-y-2">
        <Label>Stock</Label>
        <Input type="number" {...register("stock")} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label>Image URL</Label>
        <Input {...register("image")} placeholder="https://..." />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : initial?.id ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
}
