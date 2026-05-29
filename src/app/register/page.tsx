"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { registerSchema, type RegisterInput } from "@/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterInput) {
    setLoading(true); setError("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) { setLoading(false); return setError(json.error ?? "Registration failed"); }
    await signIn("credentials", { email: data.email, password: data.password, redirect: false });
    router.push("/");
    router.refresh();
  }

  function signUpWithGoogle() {
    signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="container py-16 flex justify-center">
      <Card className="w-full max-w-md border-white/10 bg-card/80 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Start your reading journey</CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" variant="outline" className="mb-5 w-full rounded-full font-semibold" onClick={signUpWithGoogle}>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-black text-black">G</span>
            Continue with Google
          </Button>
          <div className="mb-5 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" {...register("password")} />
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full rounded-full" disabled={loading}>
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
          <p className="text-sm text-center mt-4">
            Have an account? <a href="/login" className="text-primary hover:underline">Login</a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
