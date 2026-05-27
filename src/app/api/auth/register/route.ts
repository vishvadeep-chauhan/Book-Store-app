import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/validations/auth";
import { ok, fail, handleError } from "@/lib/api-response";
import { sendMail, emailTemplates } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "anon";
    const rl = rateLimit(`register:${ip}`, 5, 60_000);
    if (!rl.ok) return fail("Too many requests", 429);

    const body = await req.json();
    const data = registerSchema.parse(body);

    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) return fail("Email already in use", 409);

    const hashed = await bcrypt.hash(data.password, 10);
    const verifyToken = randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashed,
        verifyToken,
      },
      select: { id: true, email: true, name: true },
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${verifyToken}`;
    try {
      await sendMail({
        to: user.email,
        subject: "Verify your email",
        html: emailTemplates.verify(verifyUrl),
      });
    } catch (mailErr) {
      // Non-fatal: account is created; email config may be missing in dev
      console.warn("[MAILER] Could not send verification email:", mailErr);
    }

    return ok({ user }, 201);
  } catch (e) {
    return handleError(e);
  }
}
