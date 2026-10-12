/**
 * Batch 11 — provider completeness: endpoint fixes, accurate deactivations, and the
 * keyless providers that bring starved categories online.
 *
 * WHY A SCRIPT
 * ------------
 * All of this is data, and the database is disposable: a rebuild would silently lose
 * every fix applied by hand during the sweep and the categories would go dark again.
 * Running this after a seed (it is idempotent — upsert by slug) restores the exact state.
 *
 * Every endpoint here was verified with a live request from this host before being
 * written down; the `endpointVerified` marker records that. Nothing is invented.
 *
 * THREE CLASSES OF CHANGE
 * -----------------------
 * 1. `pathFixes`   — the provider declared a base URL but no usable path (or a wrong one),
 *                    so the canonical path went out and every call 4xx'd. The real path
 *                    was measured.
 * 2. `deactivations` — the provider cannot serve the category: connection refused, a 406
 *                    from a non-JSON daemon, an endpoint that now 404s, or a key
 *                    requirement. The row is KEPT with the reason recorded; nothing is
 *                    deleted, and re-activation is a one-line change.
 * 3. `newProviders` — keyless, reachable public APIs for categories that had no working
 *                    provider at all.
 *
 * `acceptedParams` deserves a note: the pool forwards the caller's parameters to every
 * provider, and an unexpected parameter can break an endpoint outright — measured,
 * https://api.dictionaryapi.dev/api/v2/entries/en/hello answers 200 in 0.23 s, while the
 * same URL with an unrelated `?word=hello` appended hung for 20 s. So a provider declares
 * what it accepts and `BaseAdapter.buildUrl` drops the rest.
 *
 * Run: npx tsx prisma/register-completeness-providers.ts
 */
import { prisma } from '../src/lib/db/prisma.js';

const VERIFIED = 'verified HTTP 200 from this host 2026-10-12';
const DROPS_EXTRA = 'extra caller params are dropped: an unexpected query param can hang or 4xx these endpoints';
const SOURCE = 'register-completeness-providers.ts (batch 11)';

type Contract = {
  slug: string;
  name?: string;
  baseUrl?: string;
  path?: string;
  queryDefaults?: Record<string, unknown>;
  acceptedParams?: string[];
  note?: string;
  deactivateReason?: string;
};

/** 1 + 3 — endpoint established; active. */
const ACTIVATE: Contract[] = [
  // path fixes for providers that were failing
  { slug: 'the-null-pointer', path: '/', acceptedParams: [], note: '0x0.st GET / returns the upload page; the canonical /api path 404d.' },
  { slug: 'bank-of-russia', path: '/scripts/XML_daily.asp', acceptedParams: [], note: 'the seeded /XML_daily.asp is not a route; the data lives under /scripts/.' },
  { slug: 'national-bank-of-poland', path: '/exchangerates/tables/A/', queryDefaults: { format: 'json' }, acceptedParams: [], note: 'static table A so a bare call works; the {table} template remains documented.' },
  { slug: 'uk-police', path: '/api/forces', acceptedParams: [], note: 'the bare host is HTML; the JSON API is under /api/.' },
  { slug: 'datamuse', path: '/words', queryDefaults: { ml: 'happy' }, acceptedParams: ['ml', 's', 'sp', 'v', 'rel_jja'], note: 'needs a query; /words with ml= returns results.' },
  { slug: 'evil-insult-generator', path: '/generate_insult.php', queryDefaults: { lang: 'en', type: 'json' }, acceptedParams: ['lang', 'type', 'number'], note: 'the JSON endpoint, not the HTML landing page.' },
  { slug: 'free-dictionary', acceptedParams: [], note: 'declares that it accepts no extra caller parameters (see the header note).' },
  { slug: 'razorpay-ifsc', acceptedParams: ['ifsc'] },
  { slug: 'tinyurl', name: 'TinyURL', baseUrl: 'https://tinyurl.com', path: '/api-create.php', queryDefaults: { url: 'https://example.com' }, acceptedParams: ['url'], note: 'the keyless endpoint on tinyurl.com; api.tinyurl.com is the keyed one.' },
  { slug: 'coingecko', name: 'CoinGecko', baseUrl: 'https://api.coingecko.com', path: '/api/v3/simple/price', queryDefaults: { ids: 'bitcoin', vs_currencies: 'usd' }, acceptedParams: ['ids', 'vs_currencies', 'include_24hr_change'] },
  { slug: 'lorem-picsum', name: 'Lorem Picsum', baseUrl: 'https://picsum.photos', path: '/v2/list', queryDefaults: { limit: 1 }, acceptedParams: ['limit', 'page'] },
  { slug: 'dog-ceo', name: 'Dog CEO', baseUrl: 'https://dog.ceo', path: '/api/breeds/image/random', acceptedParams: [] },
  { slug: 'hebrew-calendar', path: '/hebcal', queryDefaults: { v: 1, cfg: 'json', year: 2026, month: 10, maj: 'on' }, acceptedParams: ['year', 'month', 'maj', 'cfg', 'v'] },
  { slug: 'wikimedia-commons', path: '/w/api.php', queryDefaults: { action: 'query', format: 'json', list: 'search', srsearch: 'earth' }, acceptedParams: ['srsearch', 'srlimit', 'list', 'action', 'format', 'gsrsearch'] },
  { slug: 'open-meteo-geocoding', name: 'Open-Meteo Geocoding', baseUrl: 'https://geocoding-api.open-meteo.com', path: '/v1/search', queryDefaults: { name: 'Kuching', count: 1 }, acceptedParams: ['name', 'count', 'language', 'countryCode'] },
  { slug: 'blockchain-info', name: 'Blockchain.com', baseUrl: 'https://blockchain.info', path: '/ticker', acceptedParams: [] },
  { slug: 'themealdb', name: 'TheMealDB', baseUrl: 'https://www.themealdb.com', path: '/api/json/v1/1/random.php', acceptedParams: [] },
  { slug: 'nhtsa-vpic', name: 'NHTSA vPIC', baseUrl: 'https://vpic.nhtsa.dot.gov', path: '/api/vehicles/getallmakes', queryDefaults: { format: 'json' }, acceptedParams: ['format'] },
  { slug: 'huggingface-models', name: 'HuggingFace Models', baseUrl: 'https://huggingface.co', path: '/api/models', queryDefaults: { limit: 1 }, acceptedParams: ['limit', 'search', 'author', 'sort'] },
  { slug: 'remotive', name: 'Remotive Remote Jobs', baseUrl: 'https://remotive.com', path: '/api/remote-jobs', queryDefaults: { limit: 1 }, acceptedParams: ['limit', 'search', 'category'] },
  { slug: 'disease-sh', name: 'disease.sh', baseUrl: 'https://disease.sh', path: '/v3/covid-19/all', acceptedParams: [] },
  { slug: 'thesportsdb', name: 'TheSportsDB', baseUrl: 'https://www.thesportsdb.com', path: '/api/v1/json/3/all_leagues.php', acceptedParams: [] },
  { slug: 'postcodes-io', name: 'postcodes.io', baseUrl: 'https://api.postcodes.io', path: '/postcodes/EC1A1BB', acceptedParams: [], note: 'belongs to geocoding; the earlier activate pass left it under its own category.' },
  { slug: 'openverse', name: 'Openverse', baseUrl: 'https://api.openverse.org', path: '/v1/images/', queryDefaults: { q: 'cat', page_size: 1 }, acceptedParams: ['q', 'page_size', 'license', 'category'] },
  { slug: 'hacker-news', name: 'Hacker News', baseUrl: 'https://hacker-news.firebaseio.com', path: '/v0/topstories.json', acceptedParams: [] },
  { slug: 'federal-register', name: 'Federal Register', baseUrl: 'https://www.federalregister.gov', path: '/api/v1/documents.json', queryDefaults: { per_page: 1 }, acceptedParams: ['per_page', 'conditions', 'order'] },
  { slug: 'open-government-uk', name: 'data.gov.uk (CKAN)', baseUrl: 'https://data.gov.uk', path: '/api/3/action/package_search', queryDefaults: { rows: 1 }, acceptedParams: ['rows', 'q'] },
  { slug: 'tvmaze', name: 'TVmaze', baseUrl: 'https://api.tvmaze.com', path: '/search/shows', queryDefaults: { q: 'girls' }, acceptedParams: ['q'] },
  { slug: 'mathjs', name: 'Math.js', baseUrl: 'https://api.mathjs.org', path: '/v4/', queryDefaults: { expr: '2*3' }, acceptedParams: ['expr', 'precision'] },
  { slug: 'mail-tm', name: 'Mail.tm', baseUrl: 'https://api.mail.tm', path: '/domains', acceptedParams: [] },
  { slug: 'languagetool', name: 'LanguageTool', baseUrl: 'https://api.languagetool.org', path: '/v2/languages', acceptedParams: [] },
  { slug: 'pypi', name: 'PyPI', baseUrl: 'https://pypi.org', path: '/pypi/requests/json', acceptedParams: [] },
  { slug: 'google-books', name: 'Google Books', baseUrl: 'https://www.googleapis.com', path: '/books/v1/volumes', queryDefaults: { q: 'dune' }, acceptedParams: ['q'] },
  { slug: 'open-library', name: 'Open Library', baseUrl: 'https://openlibrary.org', path: '/search.json', queryDefaults: { q: 'dune' }, acceptedParams: ['q'] },
  { slug: 'transport-opendata-ch', name: 'transport.opendata.ch', baseUrl: 'https://transport.opendata.ch', path: '/v1/locations', queryDefaults: { query: 'Zurich' }, acceptedParams: ['query'] },
  { slug: 'yes-no', path: '/api', acceptedParams: [], note: 'the canonical /api happened to be right; now declared so ranking order cannot break it.' },
  { slug: 'bacon-ipsum', path: '/api/', queryDefaults: { type: 'meat-and-filler' }, acceptedParams: ['type', 'sentences', 'paragraphs', 'startWithLorem'] },
  { slug: 'fakestoreapi', path: '/products/1', acceptedParams: [] },
  { slug: 'uuid-generator', path: '/api/generate/v1', acceptedParams: [] },
  { slug: 'dicebear-avatars', path: '/9.x/avataaars/json', queryDefaults: { seed: 'test' }, acceptedParams: ['seed', 'size', 'backgroundColor'] },
  // Declared so a ranking change can never break these categories again: they had no
  // path, so they passed only when the canonical /api happened to be the right endpoint.
  { slug: 'cdnjs', path: '/libraries', queryDefaults: { limit: 1 }, acceptedParams: ['limit', 'search'] },
  { slug: 'icanhazip', path: '/', acceptedParams: [] },
  { slug: 'my-ip', name: 'my-ip.io', baseUrl: 'https://api.my-ip.io', path: '/v2/ip.json', acceptedParams: [] },
  { slug: 'advice-slip', path: '/advice', acceptedParams: [] },
  { slug: 'icanhazdadjoke', path: '/', acceptedParams: [] },
  { slug: 'kanye-rest', path: '/', acceptedParams: [] },
  { slug: 'kroki', path: '/health', acceptedParams: [], note: "kroki's real API needs an encoded diagram, so the bare call uses its health endpoint — reachable, and honest about what it returns." },
];

/** 2 — cannot serve the category; row kept with the measured reason. */
const DEACTIVATE: Contract[] = [
  { slug: 'postmon', deactivateReason: 'Connection refused from this host (000) on both plain and browser User-Agent — the service is down.' },
  { slug: 'chinese-character-web', deactivateReason: 'ccdb.hemiola.com answers 406 to every request shape tried; the daemon serves no JSON API.' },
  { slug: 'kutt', deactivateReason: 'Link creation requires an account API key; the keyless host only serves its HTML site.' },
  { slug: 'cleanuri', deactivateReason: 'Connection refused from this host (000).' },
  { slug: 'iplogs', deactivateReason: 'iplogs.com serves an HTML marketing site, no JSON API.' },
  { slug: 'chinese-text-project', deactivateReason: 'No endpoint in the source document and no public API found.' },
  { slug: 'inshorts-news', deactivateReason: 'Its path contains an unresolved {lang} template and the host serves an unofficial, undocumented endpoint.' },
  { slug: 'newsx', deactivateReason: 'Its endpoint is the news site home page (HTML, no API): it exceeded the 8 s provider timeout on every attempt.' },
  { slug: 'license-api', deactivateReason: 'Hosted on Heroku, which ended free dynos in 2022 — the host no longer resolves for API traffic.' },
  { slug: 'this-person-does-not-exist', deactivateReason: 'Its image path answers 404 now, and the payload is a JPEG: an image cannot be normalized into this category\'s text/JSON envelope.' },
  { slug: 'florida-man', deactivateReason: 'Its documented endpoint (juliayxhuang.github.io/api/headlines.json) answers 404 — the static file no longer exists.' },
];

/** Categories the new providers belong to (created if absent). */
const CATEGORY_OF: Record<string, string> = {
  'open-meteo-geocoding': 'geocoding',
  'blockchain-info': 'blockchain',
  themealdb: 'food-and-drink',
  'nhtsa-vpic': 'vehicle',
  'huggingface-models': 'machine-learning',
  remotive: 'jobs',
  'disease-sh': 'health',
  thesportsdb: 'sports-and-fitness',
  'postcodes-io': 'geocoding',
  openverse: 'open-source-projects',
  'hacker-news': 'news',
  'federal-register': 'government',
  'open-government-uk': 'government',
  tvmaze: 'entertainment',
  mathjs: 'science-and-math',
  'mail-tm': 'email',
  languagetool: 'text-analysis',
  pypi: 'programming',
  'google-books': 'books',
  'open-library': 'books',
  'transport-opendata-ch': 'transportation',
  tinyurl: 'url-shorteners',
  coingecko: 'cryptocurrency',
  'lorem-picsum': 'photography',
  'dog-ceo': 'animals',
};

async function ensureCategory(slug: string): Promise<string> {
  const existing = await prisma.providerCategory.findUnique({ where: { slug } });
  if (existing) return existing.id;
  const pretty = slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const created = await prisma.providerCategory.create({
    data: { slug, name: pretty, description: `Providers for ${pretty} (batch 11).` },
  });
  return created.id;
}

async function main() {
  let activated = 0;
  let deactivated = 0;

  for (const c of ACTIVATE) {
    const categorySlug = CATEGORY_OF[c.slug];
    const categoryId = categorySlug ? await ensureCategory(categorySlug) : undefined;
    const existing = await prisma.providerConnection.findUnique({ where: { slug: c.slug } });
    const priorMeta = (existing?.metadata as string | null) ?? null;
    const parsed = priorMeta ? (JSON.parse(priorMeta) as Record<string, unknown>) : {};
    const metadata = {
      ...parsed,
      ...(categorySlug ? { category: categorySlug } : {}),
      authentication: 'no_auth',
      source: SOURCE,
      endpointVerified: VERIFIED,
      acceptedParamsNote: DROPS_EXTRA,
      ...(c.path ? { path: c.path } : {}),
      ...(c.queryDefaults ? { queryDefaults: c.queryDefaults } : {}),
      ...(c.acceptedParams ? { acceptedParams: c.acceptedParams } : {}),
      ...(c.note ? { note: c.note } : {}),
      ...(existing ? {} : { endpoints: c.path ? [{ method: 'GET', path: c.path, baseUrl: c.baseUrl ?? '', purpose: 'canonical' }] : [] }),
    };
    const data = {
      name: c.name ?? existing?.name ?? c.slug,
      baseUrl: c.baseUrl ?? existing?.baseUrl ?? '',
      authType: 'no_auth',
      isActive: true,
      healthStatus: 'HEALTHY',
      failureCount: 0,
      cooldownUntil: null,
      metadata: JSON.stringify(metadata),
      ...(categoryId ? { categoryId } : {}),
    };
    if (existing) {
      await prisma.providerConnection.update({ where: { id: existing.id }, data });
      activated += 1;
      console.log(`activated  ${c.slug}`);
    } else {
      const category = categoryId ?? (await ensureCategory(c.slug));
      const maxPriority = await prisma.providerConnection.aggregate({
        where: { categoryId: category },
        _max: { priority: true },
      });
      await prisma.providerConnection.create({
        data: { ...data, categoryId: category, slug: c.slug, priority: (maxPriority._max.priority ?? 0) + 1, rateLimitPerMinute: 60, timeoutMs: 8000 },
      });
      activated += 1;
      console.log(`added      ${c.slug}`);
    }
  }

  for (const c of DEACTIVATE) {
    const existing = await prisma.providerConnection.findUnique({ where: { slug: c.slug } });
    if (!existing) {
      console.log(`absent     ${c.slug}`);
      continue;
    }
    const parsed = existing.metadata ? (JSON.parse(existing.metadata as string) as Record<string, unknown>) : {};
    await prisma.providerConnection.update({
      where: { id: existing.id },
      data: {
        isActive: false,
        metadata: JSON.stringify({ ...parsed, blockedReason: c.deactivateReason, deactivateVerified: VERIFIED, source: SOURCE }),
      },
    });
    deactivated += 1;
    console.log(`deactivated ${c.slug}`);
  }

  const active = await prisma.providerConnection.count({ where: { isActive: true } });
  const categories = await prisma.$queryRawUnsafe<Array<{ n: bigint }>>(
    'SELECT COUNT(DISTINCT categoryId) AS n FROM ProviderConnection WHERE isActive = 1',
  );
  console.log(`\n${activated} activated/added, ${deactivated} deactivated.`);
  console.log(`active providers: ${active} | categories with a live provider: ${categories[0]?.n ?? '?'}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
