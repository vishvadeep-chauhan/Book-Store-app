import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { bookUpdateSchema } from "@/validations/book";
import { ok, fail, handleError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: { include: { user: { select: { name: true, profileImage: true } } } },
      },
    });
    if (!book) return fail("Not found", 404);
    return ok(book);
  } catch (e) {
    return handleError(e);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const data = bookUpdateSchema.parse(await req.json());
    const book = await prisma.book.update({ where: { id }, data });
    return ok(book);
  } catch (e) {
    return handleError(e);
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.book.delete({ where: { id } });
    return ok({ message: "Deleted" });
  } catch (e) {
    return handleError(e);
  }
}
