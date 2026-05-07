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
    create: {
      id: "demo-child-eli",
      parentId: parent.id,
      name: "Eli",
      age: 5,
    },
  });

  const nora = await prisma.childProfile.upsert({
    where: { id: "demo-child-nora" },
    update: {},
    create: {
      id: "demo-child-nora",
      parentId: parent.id,
      name: "Nora",
      age: 7,
    },
  });

  // A world
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

  // Two characters — Eli's puppy + a magical fox helper
  await prisma.character.upsert({
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
      sandboxMode: false,
      parentApprovedAt: new Date(),
    },
  });

  await prisma.character.upsert({
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
      sandboxMode: false,
      parentApprovedAt: new Date(),
    },
  });

  console.log("Seed complete:", { parent: parent.email, world: meadowlands.name });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
