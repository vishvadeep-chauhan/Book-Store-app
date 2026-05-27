import { NextRequest } from "next/server";
import { z } from "zod";
import { uploadImage } from "@/lib/cloudinary";
import { ok, handleError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({ image: z.string().min(20) });

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();
    const { image } = schema.parse(await req.json());
    const { url, publicId } = await uploadImage(image);
    return ok({ url, publicId });
  } catch (e) {
    return handleError(e);
  }
}
