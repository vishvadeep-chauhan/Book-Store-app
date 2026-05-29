# 📚 Bookverse — Premium Full-Stack Bookstore

A state-of-the-art, production-ready online bookstore crafted with a premium **Spotify-style Obsidian & Neon-Green** dark branding. Built on **Next.js 15 (App Router)**, **TypeScript**, **Prisma**, **PostgreSQL**, **NextAuth v5 (Auth.js)**, **Stripe Payments**, and **Tailwind CSS**.

Live Deployment: **[https://bookstore-app-nine-green.vercel.app](https://bookstore-app-nine-green.vercel.app)**

---

## 📸 Screenshots & Showcase

### 🎨 Home / Landing Page
*Features a sleek glassmorphic header, immersive branding, and deep obsidian dark backgrounds.*
![Home Page](screenshots/landing-hero.png)

### 🗂️ Spotify-Style Browse Catalog
*Features a responsive sidebar of clickable categories with live book counts, format checklist filters, and an interactive Rupee (₹) price range slider.*
![Browse Books Catalog](screenshots/browse-catalog.png)

### 🛒 Sleek Shopping Cart
*A highly responsive user cart displaying instant quantity increments, persisted database sync, and detailed pricing in Rupees.*
![Shopping Cart](screenshots/cart-summary.png)

### 💳 Stripe Checkout Integration
*Seamless redirection to Stripe Checkout processing secure sandbox transactions natively in Indian Rupees (₹).*
![Stripe Indian Rupee Checkout](screenshots/stripe-checkout.png)

### 🔐 Google OAuth & Email Sign-In
*Secure login portal complete with standard credentials and Google Auth profile avatar support.*
![Google Login](screenshots/google-login.png)

---

## ✨ Features

- 🎨 **Spotify-Style Aesthetic** — Sleek dark-mode obsidian `#0b0c0e` backgrounds, vibrant `#1db954` music-streaming-green accents, subtle micro-animations, and glassmorphic UI elements.
- 🔐 **NextAuth v5 (Auth.js)** — High-security credentials login, one-click **Google OAuth**, custom session hook profile avatars, rate-limited registrations, RBAC (User/Admin), and email verification/password resets.
- 🪙 **Indian Rupee (₹) Core** — Fully localized pricing using the `en-IN` standard (e.g., `₹1,499.00`). Active currency conversion extends to the price slider, card layouts, order history, and backend **Stripe Payment Gateway** checkout.
- 🗂️ **Dynamic Sidebar Filtering** — Interactive categories sidebar showing instant live counts per category, decorative format filters (Paperback, Hardcover, eBook, Audiobook), and range query parameters.
- 📖 **Seed-Driven Bookstore Content** — Preloaded with 12 rich mock books spanning 9 popular genres, complete with **calculated, deterministic rating counts** (e.g., `(23,415) reviews`) based on titles.
- 🛒 **Hybrid Zustand Cart** — Immediate client-side reactive store that automatically synchronizes and persists to the PostgreSQL database upon login.
- 🛡️ **Admin Control Center** — Immersive analytics suite rendering real-time revenue charts (via Recharts), recent orders list, stock counts, and quick-access product CRUD forms.
- 🔒 **Edge Middleware Protection** — Safe middleware protection running on the Vercel Edge Runtime to guard `/admin` and `/dashboard` routes.

---

## 🏗️ Technical Architecture

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router) + React 19 | Fast compilation, Server Components, and client-side transitions. |
| **Styling & Theme** | Tailwind CSS + Lucide Icons + Next-Themes | Consistent CSS custom properties, variables, and dark/light support. |
| **Database ORM** | Prisma Client (v5.22.0) | Multi-schema migrations, safe queries, and edge adapters. |
| **Database Hosting** | Neon Serverless Postgres | Highly scalable cloud-native relational database. |
| **Authentication** | NextAuth.js v5 (Auth.js Beta-25) | Edge-safe configurations (`auth.config.ts`), Google OAuth, and JWT. |
| **Payment Gateway** | Stripe Checkout SDK (v17) | Native Rupee checkout sessions with webhook fulfillment. |
| **File Management** | Cloudinary | Auto-optimized image hosting, uploads, and transformations. |
| **Validation Layer** | Zod + React Hook Form | Strict client-side and server-side type validations. |
| **State Management** | Zustand | Light, highly-performant state store with session sync. |

---

## 📂 Codebase Directory Structure

```text
src/
├── app/
│   ├── api/                  # REST Route Handlers (auth, books, checkout, wishlist, webhooks)
│   ├── admin/                # RBAC-secured Admin dashboard & analytics
│   ├── dashboard/            # User account orders & wishlist dashboard
│   ├── books/                # Interactive catalog, search, and dynamic product details
│   ├── cart/                 # Zustand-driven shopping cart view
│   ├── login/, register/     # Sleek credentials and Google OAuth portals
│   ├── layout.tsx, page.tsx  # Landing layouts & index route
├── components/
│   ├── ui/                   # Modular Radix UI components (Badge, Button, Card, Input)
│   ├── layout/               # Dynamic Navbar (Google Avatar active) and Footer
│   ├── books/                # BookCard, AddToCartButton
├── lib/                      # Stripe, Auth, Prisma, Cloudinary, Mailer, & API utils
├── store/                    # Reactive Zustand cart store
├── validations/              # Strict schema validations (auth, product details)
├── middleware.ts             # Vercel Edge routing guard
prisma/
├── schema.prisma             # Full relational schema models
└── seed.ts                   # Premium seeded mock catalog & accounts
screenshots/                  # Local copies of repository images for GitHub rendering
```

---

## 🚀 Installation & Local Configuration

### 1. Install Project Dependencies
```bash
npm install
```

### 2. Configure Environment File
Create a `.env` file in the root directory by copying the template:
```bash
cp .env.example .env
```
Fill in the following variables:
```env
# Database Connections (Neon Serverless Postgres)
DATABASE_URL="postgresql://username:password@hostname/dbname?sslmode=require"

# NextAuth v5 Configurations
NEXTAUTH_URL="http://localhost:3002"
NEXT_PUBLIC_APP_URL="http://localhost:3002"
NEXTAUTH_SECRET="your-32-byte-secure-random-secret"
AUTH_SECRET="your-32-byte-secure-random-secret"
AUTH_TRUST_HOST="true"

# Google OAuth Web Application Credentials
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-client-secret"

# Stripe Gateway Credentials
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 3. Generate secure Auth Secrets
Generate random 32-byte tokens using the OpenSSL CLI tool:
```bash
openssl rand -base64 32
```

### 4. Build and Seed Database
Sync your local models to the PostgreSQL database and populate the demo catalog:
```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

**Default Test Credentials:**
* **Administrator**: Email: `admin@bookstore.com` | Password: `Admin@1234`
* **Standard User**: Email: `user@bookstore.com` | Password: `User@1234`

### 5. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3002](http://localhost:3002)** in your browser!

---

## 🚢 Live Production Deployment (Vercel)

1. **Deploy Repository**: Push your code to a remote GitHub repository and connect it to your **[Vercel Dashboard](https://vercel.com)**.
2. **Add Environment Settings**: Setup the live variables under **Vercel Project Settings ➜ Environment Variables**, updating `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to your production domain (e.g. `https://bookstore-app-nine-green.vercel.app`).
3. **Configure Google Console Client**: Add your production domain under **Authorized Javascript Origins** and the callback domain (`https://your-domain.vercel.app/api/auth/callback/google`) under **Authorized redirect URIs**.
4. **Trigger Vercel Build**: The project will compile automatically and create fully optimized, serverless routing endpoints on production!

---

## 🛡️ Enterprise Security Suite

* **Secure Bcrypt Hashes**: Passwords are securely hashed locally using 10 bcrypt salt rounds.
* **Strict Zod Boundaries**: Multi-field validations shield the database from corrupt inputs.
* **Middlewares Guarding RBAC**: Edge routing middleware acts as a high-speed firewall protecting routes.
* **Signature Verification**: Stripe webhook events require verification of keys via cryptographic signatures.
* **HTTP-Only Session Cookies**: NextAuth cookies are securely marked as HTTP-Only to safeguard against XSS attacks.

---

## 📄 License

This project is licensed under the MIT License.
