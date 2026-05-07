import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Demo parent
  const parent = await prisma.user.upsert({
    where: { email: "demo@inklings.shop" },
    update: {},
    create: {
      email: "demo@inklings.shop",
      name: "Maya Rivera",
      subscriptionTier: "premium",
      subscriptionStatus: "active",
    },
  });

  // Two children
  const eli = await prisma.childProfile.upsert({
    where: { id: "demo-child-eli" },
    update: {},
    create: { id: "demo-child-eli", parentId: parent.id, name: "Eli", age: 5 },
  });
  const nora = await prisma.childProfile.upsert({
    where: { id: "demo-child-nora" },
    update: {},
    create: { id: "demo-child-nora", parentId: parent.id, name: "Nora", age: 7 },
  });

  // World
  const meadowlands = await prisma.world.upsert({
    where: { id: "demo-world-meadowlands" },
    update: {},
    create: {
      id: "demo-world-meadowlands",
      childId: eli.id,
      name: "The Meadowlands",
      description: "A bright valley where animals live in cottages built into hills.",
      visualTheme: "warm pastel storybook",
      weather: "soft golden afternoons",
    },
  });

  // Approved characters (sandboxMode=false)
  const biscuit = await prisma.character.upsert({
    where: { id: "demo-char-biscuit" },
    update: {},
    create: {
      id: "demo-char-biscuit",
      childId: eli.id,
      name: "Biscuit",
      nickname: "Bisc",
      species: "golden retriever puppy",
      pronouns: "he/him",
      role: "best friend",
      personalityTraits: ["loyal", "silly", "brave when it matters"],
      imageSeed: "biscuit-puppy-warm",
      sandboxMode: false,
      parentApprovedAt: new Date(),
    },
  });
  const saffron = await prisma.character.upsert({
    where: { id: "demo-char-saffron" },
    update: {},
    create: {
      id: "demo-char-saffron",
      childId: eli.id,
      name: "Saffron",
      species: "small magical fox",
      pronouns: "she/her",
      role: "guide",
      personalityTraits: ["curious", "wise", "patient"],
      imageSeed: "saffron-fox-magical",
      sandboxMode: false,
      parentApprovedAt: new Date(),
    },
  });

  // A SANDBOX-mode character (pending parent approval — shows up in /portal/approvals)
  await prisma.character.upsert({
    where: { id: "demo-char-pending-mira" },
    update: {},
    create: {
      id: "demo-char-pending-mira",
      childId: nora.id,
      name: "Mira the Mapmaker",
      species: "owl",
      pronouns: "she/her",
      role: "navigator",
      personalityTraits: ["careful", "kind", "good at directions"],
      imageSeed: "mira-owl-warm",
      sandboxMode: true, // not yet approved
    },
  });

  // Series
  const series = await prisma.series.upsert({
    where: { id: "demo-series-bisc-and-saff" },
    update: {},
    create: {
      id: "demo-series-bisc-and-saff",
      childId: eli.id,
      worldId: meadowlands.id,
      title: "Biscuit and Saffron",
      description: "Adventures of a puppy and a magical fox in the Meadowlands.",
    },
  });

  // Approved book (status='approved') — for /portal/orders to look real
  const approvedBook = await prisma.book.upsert({
    where: { id: "demo-book-lost-bell" },
    update: {},
    create: {
      id: "demo-book-lost-bell",
      childId: eli.id,
      seriesId: series.id,
      title: "Biscuit and the Lost Bell",
      subtitle: "A story by Eli",
      status: "approved",
      parentApprovedAt: new Date(),
      kdpReady: true,
      storyJson: { acts: 5, beats: 7 },
    },
  });

  // 7 pages for the approved book (matches the 5-act / 7-beat sparky flow)
  const PAGES = [
    { num: 1, act: "beginning", text: "Biscuit woke up in the Meadowlands. The light was soft and gold." },
    { num: 2, act: "beginning", text: "It felt like sunny and silly — the kind of day where anything could happen." },
    { num: 3, act: "problem", text: "Then something changed. Biscuit's favorite red bell was nowhere to be found." },
    { num: 4, act: "adventure", text: "Biscuit and Saffron headed deep into the forest, listening for any tiny chime." },
    { num: 5, act: "adventure", text: "Suddenly — a tricky puzzle! A bridge made of stones that needed three jumps in the right order." },
    { num: 6, act: "resolution", text: "Biscuit chose teamwork. Saffron called the directions, Biscuit jumped — and the bell rang from the other side." },
    { num: 7, act: "celebration", text: "That night they had a big feast, and Biscuit fell asleep smiling, with the bell tucked under his paw." },
  ];
  for (const p of PAGES) {
    await prisma.bookPage.upsert({
      where: { bookId_pageNumber: { bookId: approvedBook.id, pageNumber: p.num } },
      update: {},
      create: {
        bookId: approvedBook.id,
        pageNumber: p.num,
        act: p.act,
        textContent: p.text,
        imageApproved: true,
        layoutTemplate: "centered",
      },
    });
  }

  // A book PENDING parent approval — populates /portal/approvals
  const pendingBook = await prisma.book.upsert({
    where: { id: "demo-book-mira-pending" },
    update: {},
    create: {
      id: "demo-book-mira-pending",
      childId: nora.id,
      title: "Mira and the Map of Maybe",
      status: "awaiting_parent",
    },
  });
  for (let i = 1; i <= 5; i++) {
    await prisma.bookPage.upsert({
      where: { bookId_pageNumber: { bookId: pendingBook.id, pageNumber: i } },
      update: {},
      create: {
        bookId: pendingBook.id,
        pageNumber: i,
        act: i === 1 ? "beginning" : i === 2 ? "problem" : i <= 4 ? "adventure" : "resolution",
        textContent: `Page ${i} of Mira's adventure — pending parent review.`,
        imageApproved: false,
        layoutTemplate: "centered",
      },
    });
  }

  // A completed order — populates /portal/orders
  await prisma.order.upsert({
    where: { stripePaymentIntent: "demo-pi-bisc-bell" },
    update: {},
    create: {
      stripePaymentIntent: "demo-pi-bisc-bell",
      userId: parent.id,
      bookId: approvedBook.id,
      quantity: 1,
      unitPriceCents: 1999,
      status: "fulfilled",
    },
  });

  console.log("Seed complete:");
  console.log("  parent:", parent.email);
  console.log("  children:", eli.name, "+", nora.name);
  console.log("  approved characters: Biscuit, Saffron");
  console.log("  pending characters: Mira the Mapmaker (sandbox)");
  console.log("  approved book: Biscuit and the Lost Bell (7 pages)");
  console.log("  pending book: Mira and the Map of Maybe (5 pages, awaiting parent)");
  console.log("  fulfilled order: 1× Biscuit and the Lost Bell @ $19.99");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
