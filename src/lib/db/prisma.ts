import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import Database from 'better-sqlite3';
import path from 'node:path';
import process from 'node:process';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

// Parse DATABASE_URL (e.g., "file:./dev.db" or "file:./test.db") to a filesystem path
// SQLite files are stored relative to the repo root (process.cwd())
const databaseUrl = process.env.DATABASE_URL ?? 'file:./dev.db';
const dbFile = databaseUrl.replace(/^file:/, '');
const dbPath = path.resolve(process.cwd(), dbFile.replace(/^\.\//, ''));

// Shim: accept a Database instance and translate it to the adapter config format
class PrismaBetterSqlite3Shim extends PrismaBetterSqlite3 {
  constructor(db: ReturnType<typeof Database>) {
    const dbName = db.name ?? dbPath;
    const url = dbName === ':memory:' || dbName.startsWith('file:') ? dbName : `file:${dbName}`;
    super({ url });
  }
}

const createPrismaClient = () => {
  const sqliteDb = new Database(dbPath);
  const adapter = new PrismaBetterSqlite3Shim(sqliteDb);
  sqliteDb.close();
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
  });
};

const prismaProxy = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = createPrismaClient();
    }
    const value = (globalForPrisma.prisma as PrismaClient)[prop as keyof PrismaClient];
    return typeof value === 'function' ? value.bind(globalForPrisma.prisma) : value;
  },
  set() {
    return false;
  },
});

export const prisma = prismaProxy;

export default prisma;
