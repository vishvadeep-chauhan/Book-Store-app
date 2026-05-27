import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookSchema, bookQuerySchema } from "@/validations/book";
import { ok, handleError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import type { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const sp = Object.fromEntries(req.nextUrl.searchParams);
    const { q, category, minPrice, maxPrice, sort, page, limit } = bookQuerySchema.parse(sp);

    const where: Prisma.BookWhereInput = {
      AND: [
        q
          ? {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { author: { contains: q, mode: "insensitive" } },
              ],
            }
          : {},
        category ? { category: { slug: category } } : {},
        minPrice !== undefined ? { price: { gte: minPrice } } : {},
        maxPrice !== undefined ? { price: { lte: maxPrice } } : {},
      ],
    };

    const orderBy: Prisma.BookOrderByWithRelationInput =
      sort === "price_asc"
        ? { price: "asc" }
        : sort === "price_desc"
          ? { price: "desc" }
          : sort === "rating"
            ? { rating: "desc" }
            : { createdAt: "desc" };

    const [items, total] = await Promise.all([
      prisma.book.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { category: true },
      }),
      prisma.book.count({ where }),
    ]);

    return ok({ items, total, page, limit, pages: Math.ceil(total / limit) });
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = bookSchema.parse(await req.json());
    const book = await prisma.book.create({ data });
    return ok(book, 201);
  } catch (e) {
    return handleError(e);
  }
}
