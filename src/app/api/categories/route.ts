import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/validations/book";
import { ok, handleError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { demoCategories } from "@/lib/demo-data";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL) {
      return ok(demoCategories);
    }

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { books: true } } },
    });
    return ok(categories);
  } catch (e) {
    return handleError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const data = categorySchema.parse(await req.json());
    const category = await prisma.category.create({
      data: { ...data, slug: slugify(data.name) },
    });
    return ok(category, 201);
  } catch (e) {
    return handleError(e);
  }
}
