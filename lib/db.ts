import { PrismaClient } from "@prisma/client";
import { catalogStore } from "./catalog-store";
import { crmStore } from "./crm-store";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

// Check if PostgreSQL DATABASE_URL is provided and non-dummy
const hasValidDatabaseUrl = Boolean(
  process.env.DATABASE_URL &&
  !process.env.DATABASE_URL.includes("dummy") &&
  process.env.DATABASE_URL.startsWith("postgresql://")
);

export const prisma =
  globalForPrisma.prisma ||
  (hasValidDatabaseUrl
    ? new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      })
    : (null as unknown as PrismaClient));

if (process.env.NODE_ENV !== "production" && hasValidDatabaseUrl) {
  globalForPrisma.prisma = prisma;
}

export const db = { ...catalogStore(prisma), ...crmStore(prisma) };
export { hasValidDatabaseUrl };
