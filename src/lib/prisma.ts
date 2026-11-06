import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

// On Vercel (serverless, read-only FS) copy the bundled seeded SQLite db
// into the writable /tmp dir on cold start, then point Prisma at it.
function resolveDbUrl(): string | undefined {
  if (!process.env.VERCEL) return process.env.DATABASE_URL
  try {
    const tmpDb = '/tmp/dev.db'
    if (!fs.existsSync(tmpDb)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.join(process.cwd(), '.next', 'server', 'prisma', 'dev.db'),
        path.join('/var/task', 'prisma', 'dev.db'),
      ]
      const src = candidates.find((p) => fs.existsSync(p))
      if (src) fs.copyFileSync(src, tmpDb)
    }
    return 'file:' + tmpDb
  } catch {
    return process.env.DATABASE_URL
  }
}

const dbUrl = resolveDbUrl()

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(dbUrl ? { datasources: { db: { url: dbUrl } } } : undefined)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
