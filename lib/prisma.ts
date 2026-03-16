import { PrismaClient } from "@/lib/generated/prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient
  __sessionsPurged?: boolean
}

function createPrismaClient() {
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Purge all sessions on server (re)start so users must log in again
if (!globalForPrisma.__sessionsPurged) {
  globalForPrisma.__sessionsPurged = true
  prisma.session.deleteMany().catch(() => {})
}
