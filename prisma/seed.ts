import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Categories
  const categoryData = [
    { name: "Fiction", slug: "fiction" },
    { name: "Non-Fiction", slug: "non-fiction" },
    { name: "Science", slug: "science" },
    { name: "Technology", slug: "technology" },
    { name: "Biography", slug: "biography" },
  ];

  for (const c of categoryData) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  // Admin user
  const adminPassword = await bcrypt.hash("Admin@1234", 10);
  await prisma.user.upsert({
    where: { email: "admin@bookstore.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@bookstore.com",
      password: adminPassword,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
  });

  // Demo user
  const userPassword = await bcrypt.hash("User@1234", 10);
  await prisma.user.upsert({
    where: { email: "user@bookstore.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "user@bookstore.com",
      password: userPassword,
      emailVerified: new Date(),
    },
  });

  const fiction = await prisma.category.findUnique({ where: { slug: "fiction" } });
  const tech = await prisma.category.findUnique({ where: { slug: "technology" } });

  if (fiction && tech) {
    const sampleBooks = [
      {
        title: "The Pragmatic Programmer",
        description: "Classic software engineering wisdom.",
        author: "Andrew Hunt, David Thomas",
        price: 39.99,
        stock: 50,
        image: "https://covers.openlibrary.org/b/id/8231996-L.jpg",
        rating: 4.8,
        categoryId: tech.id,
      },
      {
        title: "Clean Code",
        description: "A handbook of agile software craftsmanship.",
        author: "Robert C. Martin",
        price: 34.99,
        stock: 30,
        image: "https://covers.openlibrary.org/b/id/8231891-L.jpg",
        rating: 4.7,
        categoryId: tech.id,
      },
      {
        title: "1984",
        description: "Dystopian classic by George Orwell.",
        author: "George Orwell",
        price: 14.99,
        stock: 100,
        image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
        rating: 4.6,
        categoryId: fiction.id,
      },
    ];
    for (const b of sampleBooks) {
      await prisma.book.upsert({
        where: { isbn: b.title },
        update: {},
        create: { ...b, isbn: b.title },
      });
    }
  }

  console.log("✅ Seed complete. Admin: admin@bookstore.com / Admin@1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
