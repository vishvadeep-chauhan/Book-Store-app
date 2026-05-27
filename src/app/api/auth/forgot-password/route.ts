import { NextRequest } from "next/server";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/validations/auth";
import { ok, handleError } from "@/lib/api-response";
import { sendMail, emailTemplates } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = forgotPasswordSchema.parse(await req.json());
    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (user) {
      const token = randomBytes(32).toString("hex");
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: token, resetTokenExp: new Date(Date.now() + 3600_000) },
      });
      const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;
      try {
        await sendMail({
          to: email,
          subject: "Reset your password",
          html: emailTemplates.resetPassword(link),
        });
      } catch (mailErr) {
        console.warn("[MAILER] Could not send reset email:", mailErr);
      }
    }
    return ok({ message: "If an account exists, an email has been sent." });
  } catch (e) {
    return handleError(e);
  }
}
