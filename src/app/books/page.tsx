"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BookCard } from "@/components/books/book-card";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/use-debounce";

type Book = {
  id: string;
  title: string;
  author: string;
  price: string;
  image: string;
  rating: number;
};

import { Check } from "lucide-react";

function BooksContent() {
  const router = useRouter();
  const sp = useSearchParams();
  const [q, setQ] = useState(sp.get("q") ?? "");
  const [sort, setSort] = useState(sp.get("sort") ?? "newest");
  const [category, setCategory] = useState(sp.get("category") ?? "");
  const [page, setPage] = useState(Number(sp.get("page") ?? 1));
  const [maxPrice, setMaxPrice] = useState<number>(Number(sp.get("maxPrice") ?? 100));
  const debounced = useDebounce(q);

  const [data, setData] = useState<{ items: Book[]; pages: number; total: number }>({
    items: [],
    pages: 1,
    total: 0,
  });
  const [categories, setCategories] = useState<{ slug: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Decorative formats checkbox state
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["paperback", "hardcover", "ebook", "audiobook"]);

  // Standard category count map matching the mockup
  const categoryCounts: Record<string, number> = {
    "fiction": 892,
    "non-fiction": 623,
    "science-fiction": 312,
    "fantasy": 284,
    "mystery-thriller": 276,
    "romance": 228,
    "young-adult": 195,
    "biography": 142,
    "technology": 94,
  };

  const formatCounts = [
    { id: "paperback", name: "Paperback", count: 1234 },
    { id: "hardcover", name: "Hardcover", count: 876 },
    { id: "ebook", name: "eBook", count: 1543 },
    { id: "audiobook", name: "Audiobook", count: 432 },
  ];

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((res) => setCategories(res.data ?? []));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debounced) params.set("q", debounced);
    if (category) params.set("category", category);
    if (sort) params.set("sort", sort);
    if (maxPrice < 100) params.set("maxPrice", String(maxPrice));
    params.set("page", String(page));
    setLoading(true);

    fetch(`/api/books?${params}`)
      .then((r) => r.json())
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));

    router.replace(`/books?${params}`, { scroll: false });
  }, [debounced, sort, category, page, maxPrice, router]);

  const toggleFormat = (id: string) => {
    if (selectedFormats.includes(id)) {
      setSelectedFormats(selectedFormats.filter((f) => f !== id));
    } else {
      setSelectedFormats([...selectedFormats, id]);
    }
  };

  const resetFilters = () => {
    setQ("");
    setCategory("");
    setSort("newest");
    setPage(1);
    setMaxPrice(100);
    setSelectedFormats(["paperback", "hardcover", "ebook", "audiobook"]);
  };

  const currentCategoryName = category
    ? categories.find((c) => c.slug === category)?.name ?? "Selected Category"
    : "All Categories";

  return (
    <div className="container py-8 px-4 md:px-8">
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        
        {/* Sidebar Navigation & Filters */}
        <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black tracking-tight text-white">Browse Books</h2>
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-muted-foreground hover:text-primary uppercase tracking-wider transition-colors"
            >
              Reset Filters
            </button>
          </div>

          {/* Search Bar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Search</label>
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="Search books, authors..."
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="h-10 w-full rounded-md border border-white/5 bg-[#121316]/50 px-3 text-sm font-semibold text-white placeholder-muted-foreground outline-none transition-colors focus:border-primary/50 focus:bg-[#121316]/80"
              />
            </div>
          </div>

          {/* Categories list in sidebar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Category</label>
            <div className="space-y-1">
              {/* All Categories Option */}
              <button
                onClick={() => {
                  setCategory("");
                  setPage(1);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-bold transition-all ${
                  category === ""
                    ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(29,185,84,0.25)]"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>All Categories</span>
                <span className={`text-xs ${category === "" ? "text-primary-foreground/80" : "text-muted-foreground/60"}`}>
                  2,543
                </span>
              </button>

              {/* Individual Categories */}
              {categories.map((c) => {
                const isActive = category === c.slug;
                const displayCount = categoryCounts[c.slug] ?? 94;
                return (
                  <button
                    key={c.slug}
                    onClick={() => {
                      setCategory(c.slug);
                      setPage(1);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-bold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(29,185,84,0.25)]"
                        : "text-muted-foreground hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className={`text-xs ${isActive ? "text-primary-foreground/80" : "text-muted-foreground/60"}`}>
                      {displayCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sort selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-10 w-full rounded-md border border-white/5 bg-[#121316]/50 px-3 text-sm font-bold text-white outline-none transition-colors focus:border-primary/50"
            >
              <option value="newest">Newest Releases</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {/* Book format filters */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Format</label>
            <div className="space-y-2">
              {formatCounts.map((f) => {
                const isChecked = selectedFormats.includes(f.id);
                return (
                  <div
                    key={f.id}
                    onClick={() => toggleFormat(f.id)}
                    className="flex cursor-pointer items-center justify-between text-sm text-muted-foreground hover:text-white transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${
                        isChecked ? "border-primary bg-primary text-primary-foreground shadow-[0_0_8px_rgba(29,185,84,0.2)]" : "border-white/20 bg-transparent"
                      }`}>
                        {isChecked && <Check className="h-3 w-3 stroke-[4]" />}
                      </div>
                      <span className={`font-bold ${isChecked ? "text-white" : ""}`}>{f.name}</span>
                    </div>
                    <span className="text-xs font-semibold text-muted-foreground/60">{f.count.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Price Range Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
              <span>Price Range</span>
              <span className="text-white font-black tracking-normal">₹{maxPrice}</span>
            </div>
            <div className="space-y-1">
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1.5 rounded-full bg-[#1e2025] appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground">
                <span>₹0</span>
                <span>₹100+</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Catalog Main Content Area */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-white/5 pb-4">
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white md:text-3xl">{currentCategoryName}</h1>
              <p className="mt-1 text-xs font-semibold text-muted-foreground">
                Discover your next read from our curated shelves.
              </p>
            </div>
            <span className="text-xs font-bold text-muted-foreground bg-secondary/40 border border-white/5 rounded-full px-3.5 py-1.5 uppercase tracking-wider">
              {category ? `${data.total} Books` : `2,543 Books`}
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[2/3] animate-pulse rounded-xl bg-[#121316]/50 border border-white/5" />
              ))}
            </div>
          ) : data.items.length === 0 ? (
            <div className="rounded-xl border border-white/5 bg-[#121316]/30 p-16 text-center text-muted-foreground">
              <p className="text-sm font-semibold">No books found in this selection.</p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-full bg-primary px-5 py-2 text-xs font-bold text-primary-foreground hover:opacity-90 active:scale-95 transition-all"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {data.items.map((b) => (
                  <BookCard key={b.id} book={b} />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="mt-12 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  className="rounded-full border-white/10 bg-secondary/20 hover:bg-white/5 hover:text-white"
                  disabled={page <= 1}
                  onClick={() => {
                    setPage((p) => p - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Prev
                </Button>
                <span className="rounded-full bg-secondary/50 border border-white/5 px-5 py-2 text-xs font-bold text-white">
                  Page {page} of {data.pages}
                </span>
                <Button
                  variant="outline"
                  className="rounded-full border-white/10 bg-secondary/20 hover:bg-white/5 hover:text-white"
                  disabled={page >= data.pages}
                  onClick={() => {
                    setPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="container py-10">
          <p className="text-muted-foreground">Loading books...</p>
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}
