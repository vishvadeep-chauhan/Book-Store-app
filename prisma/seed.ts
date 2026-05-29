import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Categories
  const categoryData = [
    { name: "Fiction", slug: "fiction" },
    { name: "Non-Fiction", slug: "non-fiction" },
    { name: "Science Fiction", slug: "science-fiction" },
    { name: "Fantasy", slug: "fantasy" },
    { name: "Mystery & Thriller", slug: "mystery-thriller" },
    { name: "Romance", slug: "romance" },
    { name: "Young Adult", slug: "young-adult" },
    { name: "Biography", slug: "biography" },
    { name: "Technology", slug: "technology" },
  ];

  const categoriesMap: Record<string, string> = {};
  for (const c of categoryData) {
    const category = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categoriesMap[c.slug] = category.id;
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

  const sampleBooks = [
    {
      title: "The Seven Husbands of Evelyn Hugo",
      description: "Monique Gomez is a struggling indie writer who is chosen by Evelyn Hugo, an aging and reclusive Hollywood star, to write her biography.",
      author: "Taylor Jenkins Reid",
      price: 16.99,
      stock: 50,
      image: "https://covers.openlibrary.org/b/id/12596489-L.jpg",
      rating: 4.7,
      categoryId: categoriesMap["fiction"],
    },
    {
      title: "Project Hail Mary",
      description: "A lone astronaut must save the earth from disaster in this incredible science fiction adventure.",
      author: "Andy Weir",
      price: 15.99,
      stock: 40,
      image: "https://covers.openlibrary.org/b/id/10526017-L.jpg",
      rating: 4.8,
      categoryId: categoriesMap["science-fiction"],
    },
    {
      title: "The Nightingale",
      description: "Two sisters in France during World War II struggle to survive and resist the German occupation.",
      author: "Kristin Hannah",
      price: 14.99,
      stock: 35,
      image: "https://covers.openlibrary.org/b/id/12711002-L.jpg",
      rating: 4.7,
      categoryId: categoriesMap["fiction"],
    },
    {
      title: "The Hobbit",
      description: "Bilbo Baggins, a hobbit, is swept into a quest to reclaim a lost treasure guarded by a dragon.",
      author: "J.R.R. Tolkien",
      price: 13.99,
      stock: 60,
      image: "https://covers.openlibrary.org/b/id/8406757-L.jpg",
      rating: 4.8,
      categoryId: categoriesMap["fantasy"],
    },
    {
      title: "Where the Crawdads Sing",
      description: "For years, rumors of the 'Marsh Girl' have haunted Barkley Cove, a quiet town on the North Carolina coast.",
      author: "Delia Owens",
      price: 14.99,
      stock: 45,
      image: "https://covers.openlibrary.org/b/id/12836262-L.jpg",
      rating: 4.6,
      categoryId: categoriesMap["fiction"],
    },
    {
      title: "Sapiens",
      description: "A brief history of humankind, tracing the rise and impact of our species from ancient times to today.",
      author: "Yuval Noah Harari",
      price: 18.99,
      stock: 30,
      image: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
      rating: 4.6,
      categoryId: categoriesMap["non-fiction"],
    },
    {
      title: "Fourth Wing",
      description: "Enter the brutal world of a military college for dragon riders, where only the strongest survive.",
      author: "Rebecca Yarros",
      price: 16.99,
      stock: 25,
      image: "https://covers.openlibrary.org/b/id/13247012-L.jpg",
      rating: 4.7,
      categoryId: categoriesMap["fantasy"],
    },
    {
      title: "It Ends with Us",
      description: "A deeply moving and personal story about love, loss, and the resilience of the human heart.",
      author: "Colleen Hoover",
      price: 14.49,
      stock: 80,
      image: "https://covers.openlibrary.org/b/id/12850989-L.jpg",
      rating: 4.6,
      categoryId: categoriesMap["romance"],
    },
    {
      title: "The Maid",
      description: "A hotel maid discovers a wealthy guest dead in his bed, thrusting her into a chaotic murder mystery.",
      author: "Nita Prose",
      price: 13.99,
      stock: 40,
      image: "https://covers.openlibrary.org/b/id/12613146-L.jpg",
      rating: 4.5,
      categoryId: categoriesMap["mystery-thriller"],
    },
    {
      title: "Black Cake",
      description: "Two estranged siblings must put aside their differences to uncover their mother's hidden past.",
      author: "Charmaine Wilkerson",
      price: 15.49,
      stock: 30,
      image: "https://covers.openlibrary.org/b/id/12629671-L.jpg",
      rating: 4.4,
      categoryId: categoriesMap["fiction"],
    },
    {
      title: "Dune",
      description: "The epic masterpiece set on the desert planet Arrakis, a world of spice, intrigue, and destiny.",
      author: "Frank Herbert",
      price: 15.99,
      stock: 55,
      image: "https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg",
      rating: 4.8,
      categoryId: categoriesMap["science-fiction"],
    },
    {
      title: "The Silent Patient",
      description: "A woman shoots her husband and never speaks another word; a psychotherapist becomes obsessed with uncovering the truth.",
      author: "Alex Michaelides",
      price: 13.49,
      stock: 70,
      image: "https://covers.openlibrary.org/b/id/8739191-L.jpg",
      rating: 4.5,
      categoryId: categoriesMap["mystery-thriller"],
    },
    {
      title: "The Pragmatic Programmer",
      description: "Classic software engineering wisdom.",
      author: "Andrew Hunt, David Thomas",
      price: 39.99,
      stock: 50,
      image: "https://covers.openlibrary.org/b/id/8231996-L.jpg",
      rating: 4.8,
      categoryId: categoriesMap["technology"],
    },
    {
      title: "Clean Code",
      description: "A handbook of agile software craftsmanship.",
      author: "Robert C. Martin",
      price: 34.99,
      stock: 30,
      image: "https://covers.openlibrary.org/b/id/8231891-L.jpg",
      rating: 4.7,
      categoryId: categoriesMap["technology"],
    },
    {
      title: "1984",
      description: "Dystopian classic by George Orwell.",
      author: "George Orwell",
      price: 14.99,
      stock: 100,
      image: "https://covers.openlibrary.org/b/id/7222246-L.jpg",
      rating: 4.6,
      categoryId: categoriesMap["fiction"],
    },
  ];

  for (const b of sampleBooks) {
    if (!b.categoryId) continue;
    await prisma.book.upsert({
      where: { isbn: b.title },
      update: {
        author: b.author,
        price: b.price,
        image: b.image,
        rating: b.rating,
        categoryId: b.categoryId,
      },
      create: { ...b, isbn: b.title },
    });
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
