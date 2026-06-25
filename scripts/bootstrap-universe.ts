import { PrismaClient } from "@prisma/client";
import { bootstrapChildUniverse } from "../src/lib/series-bootstrap";

const prisma = new PrismaClient();

async function main() {
  const children = await prisma.childProfile.findMany({
    where: {
      series: { none: {} }
    }
  });

  console.log(`Found ${children.length} children without series.`);

  for (const child of children) {
    console.log(`Bootstrapping universe for ${child.name} (${child.id})...`);
    try {
      await bootstrapChildUniverse(prisma, child.id, child.name);
      console.log(`  OK.`);
    } catch (err) {
      console.error(`  FAILED: ${(err as Error).message}`);
    }
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
