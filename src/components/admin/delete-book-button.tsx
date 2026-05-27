"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeleteBookButton({ id }: { id: string }) {
  const router = useRouter();
  return (
    <Button
      size="sm"
      variant="destructive"
      onClick={async () => {
        if (!confirm("Delete this book?")) return;
        const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
        if (res.ok) router.refresh();
      }}
    >
      Delete
    </Button>
  );
}
