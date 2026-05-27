"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  return (
    <form
      className="flex gap-2 max-w-md"
      onSubmit={async (e) => {
        e.preventDefault();
        const res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (res.ok) {
          setName("");
          router.refresh();
        }
      }}
    >
      <Input placeholder="New category name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Button>Add</Button>
    </form>
  );
}
