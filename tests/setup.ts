import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { beforeAll, afterAll } from 'vitest';

process.env['NODE_ENV'] = 'test';
const workerId =
  process.env['VITEST_POOL_ID'] ??
  process.env['VITEST_WORKER_ID'] ??
  process.pid.toString();
const testDbFile = `test-${workerId}.db`;
const testDbUrl = `file:./${testDbFile}`;
process.env['DATABASE_URL'] = testDbUrl;
process.env['LOG_LEVEL'] = 'silent';
process.env['PORT'] = '0';

beforeAll(async () => {
  const testDbPath = path.resolve(process.cwd(), testDbFile);
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }

  execSync('npx prisma db push --accept-data-loss', {
    env: { ...process.env, DATABASE_URL: testDbUrl },
    cwd: process.cwd(),
    stdio: 'pipe',
  });
});

afterAll(async () => {
  const testDbPath = path.resolve(process.cwd(), testDbFile);
  if (fs.existsSync(testDbPath)) {
    try {
      fs.unlinkSync(testDbPath);
    } catch {
      // ignore
    }
  }
});
