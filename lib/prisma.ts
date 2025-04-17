// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => new PrismaClient();

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// 1. Instantiate or reuse a single Prisma client
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// 2. In development, attach to globalThis to survive hot reloads
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

/**
 * Ensures a TTL index on the `expiresAt` field of the `Invite` collection.
 * Uses MongoDB's single-field TTL index feature (expireAfterSeconds: 0).
 */
async function ensureTTLIndex() {
  await prisma.$runCommandRaw({
    createIndexes: 'Invite',           // MongoDB collection name
    indexes: [
      {
        key: { expiresAt: 1 },         // single-field index on expiresAt
        name: 'expiresAt_ttl_index',
        expireAfterSeconds: 0,         // expire exactly at the stored date
      },
    ],
  });
}

// 3. Kick off TTL-index creation on import (idempotent)
ensureTTLIndex().catch((err) => {
  console.error('❌ Failed to ensure TTL index:', err);
});

export default prisma;
export { ensureTTLIndex };

// Ensure the prisma instance is reused across hot reloads in development
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;