import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(10).max(5000),
  author: z.string().min(1).max(100),
  categoryId: z.string().min(1),
  price: z.coerce.number().positive(),
  stock: z.coerce.number().int().nonnegative(),
  image: z.string().url(),
  publishedDate: z.coerce.date().optional(),
  isbn: z.string().optional(),
});
export type BookInput = z.infer<typeof bookSchema>;

export const bookUpdateSchema = bookSchema.partial();

export const bookQuerySchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.enum(["price_asc", "price_desc", "newest", "rating"]).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
});

export const categorySchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().optional(),
});

export const reviewSchema = z.object({
  bookId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export const cartItemSchema = z.object({
  bookId: z.string().min(1),
  quantity: z.number().int().positive().default(1),
});

export const addressSchema = z.object({
  fullName: z.string().min(2),
  line1: z.string().min(2),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  zip: z.string().min(1),
  phone: z.string().min(7),
  isDefault: z.boolean().optional(),
});
