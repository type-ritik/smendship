import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
// 💡 1. Update this import path to point to your Prisma 7 generated client location
import { PrismaClient } from "@prisma/client";

// Extend the NodeJS global type declaration to store the prisma instance safely
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Setup the physical connection pooler using standard PostgreSQL drivers
const pool = new Pool({
  // 💡 2. Changed from DATABASE_URL to DB to match your environment variable
  connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);

// Reuse the global client or instantiate the new engine via Driver Adapters
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: adapter,
    log: ["query", "info", "warn", "error"],
  });

// Save the instance to the global context ONLY when we are not running in production
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
