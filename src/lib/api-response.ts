import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

export function handleError(error: unknown) {
  console.error("[API_ERROR]", error);
  if (error instanceof ZodError) {
    return fail("Validation error", 400, error.flatten());
  }
  if (error instanceof Error) {
    return fail(error.message, 500);
  }
  return fail("Internal server error", 500);
}
