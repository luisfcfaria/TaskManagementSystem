import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  return await prisma.user.createMany({
    data: [
      {
        username: "manager",
        email: "manager@company.com",
        password: await bcrypt.hash("password123", 10),
        role: "MANAGER",
      },
      {
        username: "tech1",
        email: "tech1@company.com",
        password: await bcrypt.hash("password123", 10),
        role: "TECHNICIAN",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.log("❌ Seed failed: ", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
