/**
 * Setup script for provider API keys.
 * Reads from .env.providers and updates the database.
 *
 * Usage:
 *   1. Copy .env.providers.example to .env.providers
 *   2. Fill in your API keys
 *   3. Run: npx tsx prisma/setup-provider-keys.ts
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { prisma } from '../src/lib/db/prisma.js';

interface EnvVar {
  key: string;
  providerSlug: string;
  authField: string;  // 'apiKey' | 'username' | 'password' | 'token'
}

const ENV_MAP: EnvVar[] = [
  { key: 'LINKPREVIEW_API_KEY', providerSlug: 'linkpreview', authField: 'apiKey' },
  { key: 'BLACK_HISTORY_FACTS_API_KEY', providerSlug: 'black-history-facts', authField: 'apiKey' },
  { key: 'COLLEGESCORECARD_API_KEY', providerSlug: 'collegescorecard-ed-gov', authField: 'apiKey' },
  { key: 'GENESIS_USERNAME', providerSlug: 'genesis', authField: 'username' },
  { key: 'GENESIS_PASSWORD', providerSlug: 'genesis', authField: 'password' },
  { key: 'JOSHUA_PROJECT_API_KEY', providerSlug: 'joshua-project', authField: 'apiKey' },
  { key: 'KAGGLE_API_KEY', providerSlug: 'kaggle', authField: 'apiKey' },
  { key: 'NASDAQ_DATA_LINK_API_KEY', providerSlug: 'nasdaq-data-link', authField: 'apiKey' },
  { key: 'OPENCORPORATES_API_TOKEN', providerSlug: 'opencorporates', authField: 'apiKey' },
  { key: 'RIDB_API_KEY', providerSlug: 'recreation-information-database', authField: 'apiKey' },
  { key: 'SOCRATA_APP_TOKEN', providerSlug: 'socrata', authField: 'apiKey' },
  { key: 'UPC_DATABASE_API_KEY', providerSlug: 'upc-database', authField: 'apiKey' },
  { key: 'YELP_API_KEY', providerSlug: 'yelp', authField: 'apiKey' },
  { key: 'ENIGMA_PUBLIC_API_KEY', providerSlug: 'enigma-public', authField: 'apiKey' },
];

function parseEnvFile(filePath: string): Record<string, string> {
  const content = readFileSync(filePath, 'utf-8');
  const vars: Record<string, string> = {};

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
    const eqIdx = trimmed.indexOf('=');
    const key = trimmed.slice(0, eqIdx).trim();
    const value = trimmed.slice(eqIdx + 1).trim();
    if (value) vars[key] = value;
  }

  return vars;
}

async function main() {
  const envPath = resolve(process.cwd(), '.env.providers');
  let envVars: Record<string, string>;

  try {
    envVars = parseEnvFile(envPath);
  } catch (err) {
    console.error(`Cannot read .env.providers at ${envPath}`);
    console.error('Copy .env.providers.example to .env.providers and fill in your API keys.');
    process.exit(1);
  }

  let updated = 0;
  let missing = 0;

  for (const mapping of ENV_MAP) {
    const value = envVars[mapping.key];
    if (!value) {
      console.log(`  MISSING ${mapping.key} — skipping ${mapping.providerSlug}`);
      missing++;
      continue;
    }

    const provider = await prisma.providerConnection.findUnique({
      where: { slug: mapping.providerSlug },
    });

    if (!provider) {
      console.log(`  NOT FOUND ${mapping.providerSlug} — not seeded yet`);
      continue;
    }

    // Build authConfig
    const existingConfig: Record<string, unknown> = provider.authConfig
      ? JSON.parse(provider.authConfig as string)
      : {};

    // For GENESIS, we need username+password together
    if (mapping.providerSlug === 'genesis') {
      existingConfig.username = envVars['GENESIS_USERNAME'] || 'GAST';
      existingConfig.password = envVars['GENESIS_PASSWORD'] || 'GAST';
    } else {
      existingConfig[mapping.authField] = value;
    }

    await prisma.providerConnection.update({
      where: { slug: mapping.providerSlug },
      data: {
        authConfig: JSON.stringify(existingConfig),
        isActive: true,
      },
    });

    console.log(`  UPDATED ${mapping.providerSlug} (${mapping.key})`);
    updated++;
  }

  console.log(`\nDone! ${updated} providers configured, ${missing} keys still missing.`);
}

main()
  .catch((e) => {
    console.error('Setup failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
