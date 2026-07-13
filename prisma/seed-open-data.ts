/**
 * Seed script for open-data providers.
 * Run with: npx tsx prisma/seed-open-data.ts
 *
 * Seeds all free/public data providers documented in doc/api-references/open-data/
 * that have free tiers or no authentication required.
 */
import { prisma } from '../src/lib/db/prisma.js';

interface ProviderDef {
  slug: string;
  name: string;
  baseUrl: string;
  authType: string;
  priority: number;
  rateLimitPerMinute: number;
  timeoutMs: number;
  metadata: Record<string, unknown>;
}

const FREE_NO_AUTH_PROVIDERS: ProviderDef[] = [
  {
    slug: 'wikipedia',
    name: 'Wikipedia',
    baseUrl: 'https://en.wikipedia.org',
    authType: 'no_auth',
    priority: 0,
    rateLimitPerMinute: 200,
    timeoutMs: 5000,
    metadata: {
      description: 'Wikipedia REST API — page content, search, random pages',
      docs: 'https://en.wikipedia.org/w/rest.php/v1',
      attribution: 'CC BY-SA 3.0',
      routes: 2,
    },
  },
  {
    slug: 'wikidata',
    name: 'Wikidata',
    baseUrl: 'https://www.wikidata.org',
    authType: 'no_auth',
    priority: 1,
    rateLimitPerMinute: 200,
    timeoutMs: 5000,
    metadata: {
      description: 'Wikidata Action API — entity lookup, SPARQL queries',
      docs: 'https://www.wikidata.org/w/api.php',
      attribution: 'CC0',
      routes: 1,
    },
  },
  {
    slug: 'wikimedia-commons',
    name: 'Wikimedia Commons',
    baseUrl: 'https://commons.wikimedia.org',
    authType: 'no_auth',
    priority: 2,
    rateLimitPerMinute: 200,
    timeoutMs: 5000,
    metadata: {
      description: 'Wikimedia Commons API — image and media search',
      docs: 'https://commons.wikimedia.org/w/api.php',
      attribution: 'CC licenses',
      routes: 1,
    },
  },
  {
    slug: 'archive-org',
    name: 'Archive.org',
    baseUrl: 'https://archive.org',
    authType: 'no_auth',
    priority: 3,
    rateLimitPerMinute: 100,
    timeoutMs: 8000,
    metadata: {
      description: 'Internet Archive — public domain books, media, Wayback Machine',
      docs: 'https://archive.readme.io/reference/getting-started',
      attribution: 'Public domain / CC',
      routes: 8,
    },
  },
  {
    slug: 'nobel-prize',
    name: 'Nobel Prize',
    baseUrl: 'https://api.nobelprize.org/2.1',
    authType: 'no_auth',
    priority: 4,
    rateLimitPerMinute: 100,
    timeoutMs: 5000,
    metadata: {
      description: 'Nobel Prize API — laureates, prizes, history',
      docs: 'https://www.nobelprize.org/about/developer-zone-2/',
      attribution: 'Public data',
      routes: 4,
    },
  },
  {
    slug: 'universities-list',
    name: 'Universities List',
    baseUrl: 'http://universities.hipolabs.com',
    authType: 'no_auth',
    priority: 5,
    rateLimitPerMinute: 100,
    timeoutMs: 5000,
    metadata: {
      description: 'University names, countries and domains',
      docs: 'https://github.com/Hipo/university-domains-list',
      attribution: 'Public data',
      routes: 2,
    },
  },
  {
    slug: 'french-address-search',
    name: 'French Address Search',
    baseUrl: 'https://data.geopf.fr/geocodage',
    authType: 'no_auth',
    priority: 6,
    rateLimitPerMinute: 50,
    timeoutMs: 5000,
    metadata: {
      description: 'French national address geocoding service',
      docs: 'https://geo.api.gouv.fr/adresse',
      attribution: 'Public data (French government)',
      routes: 15,
    },
  },
  {
    slug: 'microlink-io',
    name: 'Microlink.io',
    baseUrl: 'https://api.microlink.io',
    authType: 'no_auth',
    priority: 7,
    rateLimitPerMinute: 50,
    timeoutMs: 5000,
    metadata: {
      description: 'Extract structured data from any website (free: 50 req)',
      docs: 'https://microlink.io/docs/api/getting-started/overview',
      attribution: 'Free tier',
      routes: 1,
    },
  },
  {
    slug: 'callook-info',
    name: 'Callook.info',
    baseUrl: 'https://callook.info',
    authType: 'no_auth',
    priority: 8,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'US amateur radio callsign lookup',
      docs: 'https://callook.info',
      attribution: 'Public data (FCC)',
      routes: 4,
    },
  },
  {
    slug: 'botsarchive',
    name: 'BotsArchive',
    baseUrl: 'https://botsarchive.com',
    authType: 'no_auth',
    priority: 9,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'Bot and automation archive data',
      docs: 'https://botsarchive.com/docs.html',
      attribution: 'Public data',
      routes: 2,
    },
  },
  {
    slug: 'lowy-asia-power-index',
    name: 'Lowy Asia Power Index',
    baseUrl: 'https://github.com/0x0is1/lowy-index-api-docs',
    authType: 'no_auth',
    priority: 10,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'Asia power index data',
      docs: 'https://github.com/0x0is1/lowy-index-api-docs',
      attribution: 'Public data (Lowy Institute)',
      routes: 4,
    },
  },
  {
    slug: 'open-data-minneapolis',
    name: 'Open Data Minneapolis',
    baseUrl: 'https://opendata.minneapolismn.gov',
    authType: 'no_auth',
    priority: 11,
    rateLimitPerMinute: 100,
    timeoutMs: 5000,
    metadata: {
      description: 'Minneapolis open data portal',
      docs: 'https://opendata.minneapolismn.gov/',
      attribution: 'Public data (City of Minneapolis)',
      routes: 16,
    },
  },
  {
    slug: 'openafrica',
    name: 'openAFRICA',
    baseUrl: 'https://africaopendata.org',
    authType: 'no_auth',
    priority: 12,
    rateLimitPerMinute: 100,
    timeoutMs: 5000,
    metadata: {
      description: 'African open data portal',
      docs: 'https://africaopendata.org/',
      attribution: 'Public data',
      routes: 8,
    },
  },
  {
    slug: 'opensanctions',
    name: 'OpenSanctions',
    baseUrl: 'https://www.opensanctions.org',
    authType: 'no_auth',
    priority: 13,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'Sanctions and watchlist data',
      docs: 'https://www.opensanctions.org/docs/api/',
      attribution: 'Public data',
      routes: 5,
    },
  },
  {
    slug: 'ume-open-data',
    name: 'Umeå Open Data',
    baseUrl: 'https://opendata.umea.se',
    authType: 'no_auth',
    priority: 14,
    rateLimitPerMinute: 100,
    timeoutMs: 5000,
    metadata: {
      description: 'Umeå municipality open data',
      docs: 'https://opendata.umea.se/api/',
      attribution: 'Public data (Umeå municipality)',
      routes: 16,
    },
  },
  {
    slug: 'university-of-oslo',
    name: 'University of Oslo',
    baseUrl: 'https://data.uio.no',
    authType: 'no_auth',
    priority: 15,
    rateLimitPerMinute: 100,
    timeoutMs: 5000,
    metadata: {
      description: 'UiO open data portal',
      docs: 'https://data.uio.no/',
      attribution: 'Public data (University of Oslo)',
      routes: 16,
    },
  },
  {
    slug: 'urban-observatory',
    name: 'Urban Observatory',
    baseUrl: 'https://urbanobservatory.ac.uk',
    authType: 'no_auth',
    priority: 16,
    rateLimitPerMinute: 100,
    timeoutMs: 5000,
    metadata: {
      description: 'Urban environment sensor data',
      docs: 'https://urbanobservatory.ac.uk',
      attribution: 'Public data',
      routes: 10,
    },
  },
  {
    slug: 'voidly',
    name: 'Voidly',
    baseUrl: 'https://api.voidly.ai',
    authType: 'no_auth',
    priority: 17,
    rateLimitPerMinute: 100,
    timeoutMs: 5000,
    metadata: {
      description: 'Internet censorship measurements and data (public routes)',
      docs: 'https://voidly.ai/api-docs',
      attribution: 'Public data routes',
      routes: 50,
    },
  },
  {
    slug: 'onyx-bazaar',
    name: 'Onyx Bazaar',
    baseUrl: 'https://onyx-actions.onrender.com',
    authType: 'no_auth',
    priority: 18,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'Marketplace data',
      docs: 'https://onyx-actions.onrender.com/bazaar',
      attribution: 'Public data',
      routes: 1,
    },
  },
  {
    slug: 'modelpartfinder-error-codes',
    name: 'ModelPartFinder Error Codes',
    baseUrl: 'https://modelpartfinder.com',
    authType: 'no_auth',
    priority: 19,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'Error code lookup',
      docs: 'https://modelpartfinder.com/docs/api',
      attribution: 'Public data',
      routes: 2,
    },
  },
];

const FREE_API_KEY_PROVIDERS: ProviderDef[] = [
  {
    slug: 'linkpreview',
    name: 'LinkPreview',
    baseUrl: 'https://api.linkpreview.net',
    authType: 'api_key',
    priority: 20,
    rateLimitPerMinute: 1, // 60/hr = 1/min
    timeoutMs: 5000,
    metadata: {
      description: 'Get JSON formatted summary for any URL (free: 60 req/hr)',
      docs: 'https://www.linkpreview.net/',
      attribution: 'Free tier',
      routes: 2,
      authConfig: { in: 'header', keyName: 'X-Linkpreview-Api-Key' },
    },
  },
  {
    slug: 'black-history-facts',
    name: 'Black History Facts',
    baseUrl: 'https://rest.blackhistoryapi.io/v2',
    authType: 'api_key',
    priority: 21,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'Black history facts database',
      docs: 'https://www.blackhistoryapi.io/docs',
      attribution: 'Free tier',
      routes: 6,
      authConfig: { in: 'header', keyName: 'x-api-key' },
    },
  },
  {
    slug: 'collegescorecard-ed-gov',
    name: 'College ScoreCard',
    baseUrl: 'https://api.data.gov/ed/collegescorecard/v1',
    authType: 'api_key',
    priority: 22,
    rateLimitPerMinute: 16, // 1000/hr
    timeoutMs: 5000,
    metadata: {
      description: 'US college data and statistics (free: 1,000 req/hr)',
      docs: 'https://collegescorecard.ed.gov/data/',
      attribution: 'Public data (US Dept of Education)',
      routes: 1,
      authConfig: { in: 'query', keyName: 'api_key' },
    },
  },
  {
    slug: 'genesis',
    name: 'GENESIS',
    baseUrl: 'https://www-genesis.destatis.de/genesisWS/rest/2020',
    authType: 'api_key',
    priority: 23,
    rateLimitPerMinute: 60,
    timeoutMs: 8000,
    metadata: {
      description: 'German Federal Statistical Office data (free registration)',
      docs: 'https://www-genesis.destatis.de/datenbank/online/#modal=web-service-api',
      attribution: 'Public data (Destatis)',
      routes: 51,
      authConfig: { in: 'header', keyName: 'username', passwordKey: 'password', defaultUser: 'GAST', defaultPass: 'GAST' },
    },
  },
  {
    slug: 'joshua-project',
    name: 'Joshua Project',
    baseUrl: 'https://api.joshuaproject.net/v1',
    authType: 'api_key',
    priority: 24,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'World people groups data (free API key)',
      docs: 'https://api.joshuaproject.net/',
      attribution: 'Free tier',
      routes: 13,
      authConfig: { in: 'query', keyName: 'api_key' },
    },
  },
  {
    slug: 'kaggle',
    name: 'Kaggle',
    baseUrl: 'https://www.kaggle.com/api/v1',
    authType: 'api_key',
    priority: 25,
    rateLimitPerMinute: 60,
    timeoutMs: 8000,
    metadata: {
      description: 'Datasets, competitions, notebooks (free tier)',
      docs: 'https://www.kaggle.com/docs/api',
      attribution: 'Free tier',
      routes: 5,
      authConfig: { in: 'header', keyName: 'Authorization' },
    },
  },
  {
    slug: 'nasdaq-data-link',
    name: 'Nasdaq Data Link',
    baseUrl: 'https://data.nasdaq.com/api/v3',
    authType: 'api_key',
    priority: 26,
    rateLimitPerMinute: 60,
    timeoutMs: 8000,
    metadata: {
      description: 'Financial and economic data (free tier)',
      docs: 'https://docs.data.nasdaq.com/',
      attribution: 'Free tier',
      routes: 29,
      authConfig: { in: 'query', keyName: 'api_key' },
    },
  },
  {
    slug: 'opencorporates',
    name: 'OpenCorporates',
    baseUrl: 'https://api.opencorporates.com/v0.4',
    authType: 'api_key',
    priority: 27,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'Company registry data (free tier)',
      docs: 'https://api.opencorporates.com/documentation/API-Reference',
      attribution: 'Free tier',
      routes: 17,
      authConfig: { in: 'query', keyName: 'api_token' },
    },
  },
  {
    slug: 'recreation-information-database',
    name: 'Recreation Information Database',
    baseUrl: 'https://ridb.recreation.gov/api/v1',
    authType: 'api_key',
    priority: 28,
    rateLimitPerMinute: 50,
    timeoutMs: 8000,
    metadata: {
      description: 'US recreation areas, facilities, permits (free API key)',
      docs: 'https://ridb.recreation.gov/docs',
      attribution: 'Public data (US Government)',
      routes: 62,
      authConfig: { in: 'header', keyName: 'apikey' },
    },
  },
  {
    slug: 'socrata',
    name: 'Socrata',
    baseUrl: 'https://data.cityofchicago.org',
    authType: 'api_key',
    priority: 29,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'Government open data platform (free app token)',
      docs: 'https://dev.socrata.com/',
      attribution: 'Public data',
      routes: 5,
      authConfig: { in: 'header', keyName: 'X-App-Token' },
    },
  },
  {
    slug: 'upc-database',
    name: 'UPC Database',
    baseUrl: 'https://upcdatabase.org/api',
    authType: 'api_key',
    priority: 30,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'Product barcode/UPC lookup (free tier)',
      docs: 'https://upcdatabase.org/api',
      attribution: 'Free tier',
      routes: 10,
      authConfig: { in: 'query', keyName: 'apikey' },
    },
  },
  {
    slug: 'yelp',
    name: 'Yelp',
    baseUrl: 'https://api.yelp.com/v3',
    authType: 'api_key',
    priority: 31,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'Business listings, reviews, search (free tier)',
      docs: 'https://www.yelp.com/developers/documentation/v3',
      attribution: 'Free tier',
      routes: 17,
      authConfig: { in: 'header', keyName: 'Authorization', prefix: 'Bearer ' },
    },
  },
  {
    slug: 'enigma-public',
    name: 'Enigma Public',
    baseUrl: 'https://api.enigma.com',
    authType: 'api_key',
    priority: 32,
    rateLimitPerMinute: 60,
    timeoutMs: 5000,
    metadata: {
      description: 'Public government data (free tier)',
      docs: 'https://developers.enigma.com/docs',
      attribution: 'Free tier',
      routes: 1,
      authConfig: { in: 'query', keyName: 'api_key' },
    },
  },
];

async function main() {
  console.log('Seeding open-data providers...');

  // Ensure the open-data category exists
  let category = await prisma.providerCategory.findUnique({
    where: { slug: 'open-data' },
  });

  if (!category) {
    category = await prisma.providerCategory.create({
      data: {
        slug: 'open-data',
        name: 'Open Data',
        description: 'Free public data APIs — no authentication or free tier for read operations.',
      },
    });
    console.log(`Created category: ${category.slug}`);
  } else {
    console.log(`Category already exists: ${category.slug}`);
  }

  const allProviders = [...FREE_NO_AUTH_PROVIDERS, ...FREE_API_KEY_PROVIDERS];
  let created = 0;
  let skipped = 0;

  for (const provider of allProviders) {
    const existing = await prisma.providerConnection.findUnique({
      where: { slug: provider.slug },
    });

    if (existing) {
      console.log(`  SKIP ${provider.slug} (already exists)`);
      skipped++;
      continue;
    }

    const { metadata, ...providerData } = provider;

    await prisma.providerConnection.create({
      data: {
        ...providerData,
        categoryId: category.id,
        authConfig: metadata.authConfig ? JSON.stringify(metadata.authConfig) : null,
        healthStatus: 'HEALTHY',
        failureCount: 0,
        isActive: true,
        metadata: JSON.stringify(metadata),
      },
    });
    console.log(`  CREATED ${provider.slug} (${provider.authType})`);
    created++;
  }

  // Create fallback config for open-data category
  const existingFallback = await prisma.categoryFallbackConfig.findUnique({
    where: { categoryId: category.id },
  });

  if (!existingFallback) {
    await prisma.categoryFallbackConfig.create({
      data: {
        categoryId: category.id,
        strategy: 'priority',
        maxRetries: 2,
        retryDelayMs: 1000,
        timeoutMs: 10000,
        circuitBreakerThreshold: 3,
        cooldownMinutes: 5,
        canaryIntervalMs: 300000,
      },
    });
    console.log('Created fallback config for open-data');
  }

  console.log(`\nDone! ${created} created, ${skipped} skipped (${allProviders.length} total)`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
