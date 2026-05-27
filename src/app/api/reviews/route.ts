import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/validations/book";
import { ok, handleError } from "@/lib/api-response";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await requireAuth();
    const data = reviewSchema.parse(await req.json());

    const review = await prisma.review.upsert({
      where: { userId_bookId: { userId: session.user.id, bookId: data.bookId } },
      update: { rating: data.rating, comment: data.comment },
      create: { ...data, userId: session.user.id },
    });

    // Recalculate average rating
    const agg = await prisma.review.aggregate({
      where: { bookId: data.bookId },
      _avg: { rating: true },
    });
    await prisma.book.update({
      where: { id: data.bookId },
      data: { rating: agg._avg.rating ?? 0 },
    });

    return ok(review, 201);
  } catch (e) {
    return handleError(e);
  }
}
