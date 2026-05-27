import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
});

export async function sendMail(opts: { to: string; subject: string; html: string }) {
  if (!process.env.SMTP_HOST) {
    console.log("[MAILER:DEV]", opts);
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "noreply@bookstore.com",
    ...opts,
  });
}

export const emailTemplates = {
  verify: (link: string) => `
    <h2>Verify your email</h2>
    <p>Click below to verify your account:</p>
    <a href="${link}" style="display:inline-block;padding:10px 20px;background:#000;color:#fff;border-radius:4px;text-decoration:none">Verify Email</a>
  `,
  resetPassword: (link: string) => `
    <h2>Reset your password</h2>
    <p>Click below to reset (valid for 1 hour):</p>
    <a href="${link}" style="display:inline-block;padding:10px 20px;background:#000;color:#fff;border-radius:4px;text-decoration:none">Reset Password</a>
  `,
};
