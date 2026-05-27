import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { ok, fail, handleError } from "@/lib/api-response";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");
    if (!token) return fail("Missing token", 400);
    const user = await prisma.user.findUnique({ where: { verifyToken: token } });
    if (!user) return fail("Invalid token", 400);
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date(), verifyToken: null },
    });
    return ok({ message: "Email verified" });
  } catch (e) {
    return handleError(e);
  }
}
