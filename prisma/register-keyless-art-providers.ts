/**
 * Register the art providers the adapter already knows how to read.
 *
 * WHY THIS EXISTS
 * ---------------
 * `art-and-design` had 20 documented providers and not one of them active (every
 * document is keyed or manually blocked), so the category could not answer at all.
 * The adapter, however, is already written against two specific payload shapes —
 * `art-adapter.ts` literally documents them:
 *
 *     // Art Institute: { data: { title: "..." } }
 *     // Met Museum:     { title: "..." }
 *
 * So the support exists and the provider rows never did. These two are keyless and
 * were verified reachable on 2026-10-12 (both HTTP 200). Their documents are not in
 * `doc/api-references/`, so they are declared here rather than invented into the
 * parser: the source of truth is each provider's own public API documentation.
 *
 * The endpoints are single-object routes on purpose — the adapter reads the
 * `data.title` / `title` shape, i.e. one artwork, and a canonical category path
 * carrying an id or query flows through the same `metadata.path` mechanism the
 * weather and environment adapters use.
 *
 * Idempotent: upsert by slug. Run with: npx tsx prisma/register-keyless-art-providers.ts
 */
// The shared client carries the datasource/adapter configuration (Prisma 7 refuses a
// bare `new PrismaClient()`), exactly as prisma/seed-from-docs.ts does it.
import { prisma } from '../src/lib/db/prisma.js';

const CATEGORY = 'art-and-design';

const PROVIDERS = [
  {
    slug: 'art-institute-chicago',
    name: 'Art Institute of Chicago',
    baseUrl: 'https://api.artic.edu',
    path: '/api/v1/artworks/14586', // a documented, public-domain artwork
    docs: 'https://api.artic.edu/docs/',
    note: 'Single-artwork route matching the adapter\'s `data.title` shape; no key required.',
  },
  {
    slug: 'met-museum',
    name: 'The Metropolitan Museum of Art',
    baseUrl: 'https://collectionapi.metmuseum.org',
    path: '/public/collection/v1/objects/45734', // a documented example object
    docs: 'https://metmuseum.github.io/',
    note: 'Single-object route matching the adapter\'s `title` shape; no key required.',
  },
] as const;

async function main() {
  const category = await prisma.providerCategory.upsert({
    where: { slug: CATEGORY },
    update: {},
    create: { slug: CATEGORY, name: 'Art & Design', description: 'Artworks, museums and design collections.' },
  });

  let order = 0;
  for (const p of PROVIDERS) {
    order += 1;
    const metadata = {
      description: `${p.name} — public, keyless artwork API (verified reachable 2026-10-12).`,
      docs: p.docs,
      source: 'register-keyless-art-providers.ts',
      routes: 1,
      category: CATEGORY,
      authentication: 'no_auth',
      basePattern: p.baseUrl,
      endpoints: [{ method: 'GET', path: p.path, baseUrl: p.baseUrl, purpose: 'artwork' }],
      blockedReason: null,
      path: p.path,
      note: p.note,
    };
    const data = {
      slug: p.slug,
      name: p.name,
      baseUrl: p.baseUrl,
      authType: 'no_auth',
      priority: order,
      rateLimitPerMinute: 60,
      timeoutMs: 8000,
      isActive: true,
      healthStatus: 'HEALTHY',
      failureCount: 0,
      metadata: JSON.stringify(metadata),
    };
    const existing = await prisma.providerConnection.findUnique({ where: { slug: p.slug } });
    if (existing) {
      await prisma.providerConnection.update({ where: { id: existing.id }, data: { ...data, categoryId: category.id } });
      console.log(`updated  ${p.slug}`);
    } else {
      await prisma.providerConnection.create({ data: { ...data, categoryId: category.id } });
      console.log(`created  ${p.slug}`);
    }
  }

  const total = await prisma.providerConnection.count({ where: { categoryId: category.id } });
  const active = await prisma.providerConnection.count({ where: { categoryId: category.id, isActive: true } });
  console.log(`\n${CATEGORY}: ${total} providers, ${active} active`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
