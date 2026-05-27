# 📚 Online Bookstore — Next.js Full Stack

A production-ready online bookstore built with **Next.js 15 (App Router)**, **TypeScript**, **Prisma**, **PostgreSQL**, **NextAuth v5**, **Stripe**, **Cloudinary**, **Tailwind**, and **Shadcn UI**.

## ✨ Features

- 🔐 **Authentication** — Email/password with JWT sessions (NextAuth.js), email verification, password reset, RBAC (User/Admin)
- 📖 **Book management** — CRUD, image hosting via Cloudinary, stock tracking
- 🗂️ **Categories** with slug routing
- 🔎 **Search & filters** — by title/author, category, price range, sorting, pagination
- 🛒 **Cart** — Zustand store + persisted DB cart on login
- 💳 **Stripe Checkout** — sessions + webhook for order fulfillment & stock decrement
- 📦 **Order management** — user history, admin status updates (Pending → Paid → Shipped → Delivered)
- ⭐ **Reviews & ratings** — average rating auto-calculated
- ❤️ **Wishlist**
- 🛡️ **Admin dashboard** — stats, revenue chart (Recharts), recent orders, low-stock alerts
- 🌓 **Dark/light mode** (next-themes)
- 🔒 **Security** — middleware route protection, in-memory rate limiting, Zod validation everywhere, bcrypt password hashing, secure HTTP-only NextAuth cookies
- ✅ **Type-safe** end to end (TypeScript + Zod + Prisma)

## 🏗️ Tech Stack

| Layer            | Tech                                         |
| ---------------- | -------------------------------------------- |
| Frontend         | Next.js 15 (App Router), React 19, Tailwind  |
| UI Components    | Shadcn-style (Radix UI + CVA)                |
| Backend          | Next.js Route Handlers                       |
| Database         | PostgreSQL + Prisma ORM                      |
| Auth             | NextAuth.js v5 (JWT + Prisma adapter)        |
| Payments         | Stripe Checkout + Webhooks                   |
| File Uploads     | Cloudinary                                   |
| Forms/Validation | React Hook Form + Zod                        |
| State            | Zustand                                      |
| Charts           | Recharts                                     |
| Email            | Nodemailer                                   |
| Testing          | Jest + RTL                                   |

## 📂 Project Structure

```
src/
├── app/
│   ├── api/                  # Route handlers (auth, books, cart, orders, checkout, webhooks)
│   ├── admin/                # Admin pages (RBAC enforced)
│   ├── dashboard/            # User pages
│   ├── books/, cart/, checkout/, login/, register/, ...
│   ├── layout.tsx, page.tsx, globals.css
├── components/
│   ├── ui/                   # Button, Card, Input, Label, Badge (Shadcn-style)
│   ├── layout/               # Navbar, Footer
│   ├── books/                # BookCard, AddToCartButton
│   └── admin/                # BookForm, SalesChart, etc.
├── lib/                      # prisma, auth, stripe, cloudinary, mailer, utils, rate-limit
├── hooks/                    # useDebounce
├── store/                    # cart.ts (Zustand)
├── validations/              # auth.ts, book.ts (Zod)
├── middleware.ts             # RBAC route protection
prisma/
├── schema.prisma             # Full data model
└── seed.ts                   # Demo categories, books, admin/user
```

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in values:

```bash
cp .env.example .env
```

Generate `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 3. Setup database

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

**Default credentials (after seed):**
- Admin → `admin@bookstore.com` / `Admin@1234`
- User  → `user@bookstore.com` / `User@1234`

### 4. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Stripe webhook (local testing)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the `whsec_...` value into `STRIPE_WEBHOOK_SECRET` in `.env`.

## 🧪 Testing

```bash
npm test
```

## 🚢 Deployment (Vercel)

1. Push to GitHub.
2. Import the repo on [Vercel](https://vercel.com).
3. Add all environment variables from `.env.example`.
4. Set up a managed Postgres (Neon / Supabase / Vercel Postgres).
5. Run migrations: Vercel build hook will execute `prisma generate` via the `build` script. Run `prisma migrate deploy` from CI or locally targeting the prod URL.
6. Configure Stripe webhook to point to `https://your-domain/api/webhooks/stripe`.

## 🔑 API Routes

| Method | Endpoint                          | Description                |
| ------ | --------------------------------- | -------------------------- |
| POST   | `/api/auth/register`              | Create account             |
| POST   | `/api/auth/forgot-password`       | Send reset email           |
| POST   | `/api/auth/reset-password`        | Reset password             |
| GET    | `/api/auth/verify-email?token=`   | Verify email               |
| GET    | `/api/books`                      | List + search + filter     |
| POST   | `/api/books`                      | Create book (admin)        |
| GET    | `/api/books/:id`                  | Book details               |
| PATCH  | `/api/books/:id`                  | Update book (admin)        |
| DELETE | `/api/books/:id`                  | Delete book (admin)        |
| GET    | `/api/categories`                 | List categories            |
| POST   | `/api/categories`                 | Create category (admin)    |
| GET    | `/api/cart`                       | Get user cart              |
| POST   | `/api/cart`                       | Add item                   |
| PATCH  | `/api/cart/:itemId`               | Update quantity            |
| DELETE | `/api/cart/:itemId`               | Remove item                |
| GET    | `/api/orders`                     | Order history              |
| PATCH  | `/api/orders`                     | Update status (admin)      |
| GET    | `/api/orders/:id`                 | Order detail               |
| POST   | `/api/checkout`                   | Stripe checkout session    |
| POST   | `/api/webhooks/stripe`            | Stripe webhook             |
| POST   | `/api/reviews`                    | Add/update review          |
| GET/POST | `/api/wishlist`                 | Wishlist toggle/list       |
| POST   | `/api/upload`                     | Cloudinary upload (admin)  |
| GET    | `/api/admin/stats`                | Admin dashboard data       |

## 🛡️ Security

- ✅ Bcrypt password hashing (10 rounds)
- ✅ Input validation via Zod at every API boundary
- ✅ Middleware-based RBAC (`/admin` requires `ADMIN` role)
- ✅ Email enumeration protection on forgot-password
- ✅ Stripe webhook signature verification
- ✅ Rate limiting on register endpoint
- ✅ HTTP-only secure cookies via NextAuth

## 📝 Notes / Extending

- **Rate limiting** uses an in-memory bucket — swap for [Upstash Redis](https://upstash.com/) in production.
- **Email** logs to console when SMTP isn't configured (dev-friendly).
- **Image uploads** are admin-only via Cloudinary base64; integrate a presigned upload widget for direct browser uploads.
- **Swagger/OpenAPI** — wire `next-swagger-doc` to generate `/api/docs`.
- **Coupons / Recommendations / Recently viewed** are intentionally left as extension points — schema supports them via additional models.

## 📄 License

MIT
