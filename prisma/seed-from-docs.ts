/**
 * Seed providers from the research documents in `doc/api-references/`.
 *
 * WHY THIS EXISTS
 * ---------------
 * `doc/api-references/<category>/<provider>.md` already holds a per-provider
 * spec (slug, official docs, confirmed public base patterns, authentication
 * model, and a table of manually confirmed endpoints) for 50+ categories — but
 * only `open-data` and `environment` had hand-written seeds, so every other
 * adapter answered with zero providers and every call fell over to the
 * client's own fallback path.
 *
 * The category rows themselves are created elsewhere in the app from the same
 * directory listing; this script attaches the PROVIDERS and is safe to re-run.
 *
 * RULES (deliberate, not incidental):
 *   * `baseUrl` is the scheme+host of the first "Confirmed public API base
 *     patterns" entry — the documents are the source of truth, nothing is
 *     invented here.
 *   * A provider is ACTIVE only when it needs no credential, at least one base
 *     pattern exists, and at least one endpoint was confirmed. Everything else
 *     lands inactive with the reason recorded in `metadata.blockedReason`, so a
 *     keyed provider is one env var away rather than silently missing.
 *   * `metadata.path` carries the provider's primary confirmed endpoint, which
 *     is what the adapters read to translate a canonical category path into a
 *     provider-specific one.
 *   * Idempotent: upsert by slug. A slug documented under several categories is
 *     claimed once (first category wins) and reported.
 *
 * Usage: npx tsx prisma/seed-from-docs.ts [--dry-run]
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import { prisma } from '../src/lib/db/prisma.js';

const DOC_ROOT = join(process.cwd(), 'doc', 'api-references');
const DRY_RUN = process.argv.includes('--dry-run');

interface ParsedProvider {
  category: string;
  slug: string;
  name: string;
  baseUrl: string | null;
  basePattern: string | null;
  docsUrl: string | null;
  authType: string;
  authProse: string;
  reviewOutcome: string | null;
  routes: number;
  routeEvidence: number;
  endpoints: Endpoint[];
  sourceFile: string;
}

/**
 * Provider request contracts — the part of a provider's API that its document
 * describes but that the request cannot guess: which selector parameter makes it
 * return measurements, and what it calls the coordinate parameters. Verified by
 * calling each provider directly (Open-Meteo returned 25 °C / Rainy / 95 % with
 * `current=…` and nulls without it). Declared here so the data lives in the
 * database, never in the adapter code — the adapters read `metadata.queryDefaults`
 * and `metadata.paramAliases` generically.
 */
const PROVIDER_QUERY_CONTRACT: Record<
  string,
  {
    queryDefaults?: Record<string, string>;
    paramAliases?: Record<string, string>;
    /** Some providers document several endpoints; this is the machine-readable one. */
    pathOverride?: string;
  }
> = {
  'open-meteo': {
    queryDefaults: {
      current:
        'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code',
    },
  },
  '7timer': {
    // api.pl requires product + output, names its coordinates lon/lat, and is the
    // machine-readable endpoint (the first documented one, astro.php, is an image
    // API — calling it returned 404 and the pool correctly failed over).
    queryDefaults: { product: 'civil', output: 'json' },
    paramAliases: { latitude: 'lat', longitude: 'lon' },
    pathOverride: '/bin/api.pl',
  },
};

const KEYLESS_RE =
  /no (api )?key|no authentication|without (an )?(api )?key|keyless|no registration|freely accessible|open access|public api|not require (an? )?(api )?key|does not require|do not require|no sign ?-?up/i;
const KEYED_RE =
  /api key|apikey|api_key|token|access key|client id|client secret|username|password|oauth|appid|app id|subscription|sign ?up|register|credential/i;

function readDoc(file: string): string {
  return readFileSync(file, 'utf8');
}

/**
 * The documents come from two generator passes:
 *   new — `## Provider metadata` with `- Provider slug:` and
 *         `- Confirmed public API base patterns:`
 *   old — `## Overview` with `- Base URL:` and `- Auth:`
 * Both are parsed; neither is invented.
 */
function labelledValue(text: string, labels: RegExp[]): string | null {
  for (const line of text.split('\n')) {
    for (const label of labels) {
      const m = line.match(label);
      if (m) return (m[1] ?? '').replace(/`/g, '').trim();
    }
  }
  return null;
}

/** First https?:// URL inside a block of the form "- Label:\n  - `url`". */
function firstUrlInBlock(text: string, label: RegExp): string | null {
  const lines = text.split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    if (!label.test(lines[i])) continue;
    for (let j = i + 1; j < lines.length && j < i + 12; j += 1) {
      const line = lines[j];
      if (/^- [A-Z]/.test(line)) break; // next metadata bullet
      const m = line.match(/https?:\/\/[^\s`)\]"']+/);
      if (m) return m[0].replace(/[.,;]$/, '');
    }
  }
  return null;
}


/** scheme://host[:port] of a URL — providers route by base, not by full path. */
function originOf(url: string): string | null {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return null;
  }
}

type Endpoint = { method: string; path: string; baseUrl: string | null; purpose: string };

/**
 * Rows of an endpoint table. Two layouts exist:
 *   | Method | Path | Purpose | …                     (older docs)
 *   | Method | Path | Base URL | Purpose | …          (newer docs)
 * The header row is read so the columns are mapped by name, never by position.
 */
function parseEndpoints(text: string): Endpoint[] {
  const out: Endpoint[] = [];
  let inTable = false;
  let col: Record<string, number> = {};
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (/^##\s+(Manually confirmed endpoints|Confirmed endpoints|Confirmed routes)/i.test(line)) {
      inTable = true;
      continue;
    }
    if (inTable && /^##\s/.test(line)) break;
    if (!inTable || !line.startsWith('|')) continue;
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((c) => c.trim());
    if (cells.length < 2) continue;

    const isHeader = cells.some((c) => /^method$/i.test(c));
    if (isHeader) {
      col = {};
      cells.forEach((c, i) => {
        col[c.toLowerCase().replace(/\s+/g, ' ')] = i;
      });
      continue;
    }
    const methodIdx = col['method'] ?? 0;
    const pathIdx = col['path'] ?? 1;
    const baseIdx =
      col['base url'] ?? col['base url pattern'] ?? col['base'] ?? col['endpoint base url'];
    const purposeIdx = col['purpose'] ?? col['notes'] ?? col['parameters'] ?? 2;

    const method = cells[methodIdx] ?? '';
    const path = (cells[pathIdx] ?? '').replace(/`/g, '');
    if (!/^[A-Z]{3,7}$/.test(method)) continue;
    if (!path.startsWith('/')) continue;
    const baseCell = baseIdx !== undefined ? (cells[baseIdx] ?? '').replace(/`/g, '') : '';
    const baseUrl = /^https?:\/\//.test(baseCell) ? baseCell : null;
    out.push({
      method,
      path,
      baseUrl,
      purpose: (cells[purposeIdx] ?? '').replace(/\s+/g, ' '),
    });
    if (out.length >= 8) break;
  }
  return out;
}

function slugFromPath(file: string): string {
  return file.split('/').pop()!.replace(/\.md$/, '');
}

function parseProvider(category: string, file: string): ParsedProvider | null {
  const text = readDoc(file);
  const nameMatch = text.match(/^#\s+(.+)$/m);
  if (!nameMatch) return null;
  const name = nameMatch[1].trim().replace(/\*\*/g, '');

  const slug =
    labelledValue(text, [/^\s*-\s*Provider slug:\s*(.+)$/, /^\s*-\s*Slug:\s*(.+)$/]) ||
    slugFromPath(file);

  const patterns = firstUrlInBlock(text, /Confirmed public API base patterns:/i);
  const baseUrlValue = labelledValue(text, [
    /^\s*-\s*Base URL:\s*(.+)$/,
    /^\s*-\s*Base URL pattern:\s*(.+)$/,
    /^\s*-\s*Canonical base URL:\s*(.+)$/,
    /^\s*-\s*Official base URL:\s*(.+)$/,
    /^\s*-\s*API base URL:\s*(.+)$/,
    /^\s*-\s*API base:\s*(.+)$/,
  ]);
  const docsUrl =
    firstUrlInBlock(text, /Official docs( used manually|\/site checked manually)?:/i) ??
    labelledValue(text, [/^\s*-\s*Official docs URL from index:\s*(.+)$/, /^\s*-\s*Official docs:\s*(.+)$/]) ??
    patterns ??
    (baseUrlValue && /^https?:/.test(baseUrlValue) ? baseUrlValue : null);

  const authProse =
    labelledValue(text, [/^\s*-\s*Authentication model:\s*(.+)$/, /^\s*-\s*Auth:\s*(.+)$/]) ||
    (text.match(/##\s+Authentication\s+([\s\S]{0,400})/)?.[1] ?? '').replace(/\s+/g, ' ').trim();

  const reviewOutcome = labelledValue(text, [/^\s*-\s*Manual review outcome:\s*(.+)$/]);
  const routesRaw =
    labelledValue(text, [
      /^\s*-\s*Manually confirmed routes in this pass:\s*(.+)$/,
      /^\s*-\s*Manually confirmed API route count in this pass:\s*(.+)$/,
      /^\s*-\s*Route count confirmed:\s*(.+)$/,
    ]) ?? '0';
  const routes = Number.parseInt(routesRaw.replace(/[^0-9]/g, ''), 10) || 0;

  const endpoints = parseEndpoints(text);
  // Base URL precedence: the explicit patterns bullet, then a `Base URL:` bullet,
  // then the Base URL column of the confirmed-routes table (newer documents).
  const tableBase = endpoints.find((e) => e.baseUrl)?.baseUrl ?? null;
  const basePattern =
    patterns ??
    (baseUrlValue && /^https?:/.test(baseUrlValue) ? baseUrlValue : null) ??
    tableBase;
  const baseUrl = basePattern ? originOf(basePattern) : null;

  // Auth: the documents state the public-endpoint model in prose, so a provider
  // is only ACTIVE when the document says keyless in a way that is not hedged,
  // and never when it says a credential is required. Anything ambiguous stays
  // inactive with its reason recorded — a wrongly-active provider costs failed
  // requests, a wrongly-inactive one costs nothing.
  const authLower = authProse.toLowerCase();
  // Split into sentences so "no API key required" cannot be read as "key required".
  const authSentences = authLower
    .split(/[.;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const keylessIdx = authSentences.findIndex(
    (s) =>
      /^(no|none)\b/.test(s) ||
      /no (api[ -]?)?key|keyless|without (an? )?(api[ -]?)?key|no authentication|freely accessible|no registration|open access|public api|no credentials|not require (an? )?(api[ -]?)?key|does not require|do not require|no sign ?-?up|free (of charge )?(for|tier|access)/.test(
        s,
      ),
  );
  const keyedIdx = authSentences.findIndex(
    (s) =>
      /(api[ -]?key|token|client id|client secret|username|password|oauth|appid|subscription)[^.]{0,30}\b(required|needed|mandatory)\b|requires? (an? )?(api[ -]?key|token|credential|account|subscription)|sign ?up (is )?required|registration (is )?required/.test(
        s,
      ) &&
      !/^(no|none)\b/.test(s) &&
      !/\bnot\b|without|optional/.test(s),
  );

  // Both statements can appear in one document ("keyless for public endpoints;
  // a key is required for the commercial tier"). Whichever the document states
  // FIRST describes the public access model, and a caveat marked "optional" is
  // not a requirement — those two rules decide it.
  let authType = 'unknown';
  if (keylessIdx >= 0 && (keyedIdx < 0 || keylessIdx < keyedIdx)) authType = 'no_auth';
  else if (keyedIdx >= 0) authType = 'api_key';
  else if (KEYLESS_RE.test(authLower)) authType = 'no_auth';
  else if (KEYED_RE.test(authLower)) authType = 'api_key';
  // No route count label (older documents) → the confirmed endpoint table is the
  // evidence that the provider was actually exercised.
  const routeEvidence = routes > 0 ? routes : endpoints.length;

  return {
    category,
    slug,
    name,
    baseUrl,
    basePattern,
    docsUrl,
    authType,
    authProse: authProse.slice(0, 400),
    reviewOutcome,
    routes,
    routeEvidence,
    endpoints,
    sourceFile: file.replace(process.cwd() + '/', ''),
  };
}

async function ensureCategory(slug: string): Promise<string> {
  const existing = await prisma.providerCategory.findUnique({ where: { slug } });
  if (existing) return existing.id;
  const pretty = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  const created = await prisma.providerCategory.create({
    data: { slug, name: pretty, description: `Providers for ${pretty}, from doc/api-references/` },
  });
  return created.id;
}

async function main(): Promise<void> {
  console.log(`Scanning ${DOC_ROOT}${DRY_RUN ? ' (dry run)' : ''} ...`);

  const categories = readdirSync(DOC_ROOT).filter((d) => statSync(join(DOC_ROOT, d)).isDirectory());
  const seen = new Map<string, string>(); // slug -> category that claimed it
  const stats = {
    docs: 0,
    parsed: 0,
    seededActive: 0,
    seededInactive: 0,
    skippedNoBase: 0,
    skippedDuplicate: 0,
    categories: 0,
  };
  const perCategory = new Map<string, { docs: number; active: number; inactive: number }>();
  const duplicates: string[] = [];
  const noBase: string[] = [];

  for (const category of categories.sort()) {
    const dir = join(DOC_ROOT, category);
    const files = readdirSync(dir).filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md');
    if (files.length === 0) continue;
    stats.categories += 1;
    const cat = perCategory.get(category) ?? { docs: 0, active: 0, inactive: 0 };

    let order = 0;
    for (const file of files.sort()) {
      stats.docs += 1;
      cat.docs += 1;
      const parsed = parseProvider(category, join(dir, file));
      if (!parsed) continue;
      stats.parsed += 1;

      if (seen.has(parsed.slug)) {
        stats.skippedDuplicate += 1;
        duplicates.push(`${parsed.slug}: ${seen.get(parsed.slug)} vs ${category}`);
        continue;
      }
      seen.set(parsed.slug, category);

      const hasBase = Boolean(parsed.baseUrl);
      if (!hasBase) {
        stats.skippedNoBase += 1;
        noBase.push(`${category}/${parsed.slug}`);
      }

      const isActive = hasBase && parsed.authType === 'no_auth' && parsed.routeEvidence > 0;
      const blockedReason = isActive
        ? null
        : parsed.reviewOutcome === 'manual_blocked'
          ? 'Manual review marked this provider blocked — see the source document for what was checked.'
          : !hasBase
            ? 'No public base URL in the provider document — not routable yet.'
            : parsed.authType !== 'no_auth'
              ? `Requires credentials (${parsed.authType}) — set the provider key in .env.providers and run setup-provider-keys.ts.`
              : 'No endpoint was confirmed in this documentation pass.';

      const metadata: Record<string, unknown> = {
        description: `${parsed.name} — documented in ${parsed.sourceFile}`,
        docs: parsed.docsUrl,
        source: parsed.sourceFile,
        routes: parsed.routeEvidence,
        category,
        authentication: parsed.authProse,
        basePattern: parsed.basePattern,
        endpoints: parsed.endpoints,
        blockedReason,
      };
      if (parsed.endpoints[0]) {
        // The adapters read metadata.path to map a canonical category path onto
        // the provider's real endpoint.
        metadata['path'] = parsed.endpoints[0].path;
      }
      const contract = PROVIDER_QUERY_CONTRACT[parsed.slug];
      if (contract && isActive) {
        if (contract.queryDefaults) metadata['queryDefaults'] = contract.queryDefaults;
        if (contract.paramAliases) metadata['paramAliases'] = contract.paramAliases;
        // The adapters route through metadata.path, so a provider whose usable
        // endpoint is not its first documented one declares that here.
        if (contract.pathOverride) metadata['path'] = contract.pathOverride;
      }

      const priority = isActive ? order++ : 100 + order++;
      const data = {
        slug: parsed.slug,
        name: parsed.name,
        baseUrl: parsed.baseUrl ?? parsed.basePattern ?? '',
        authType: parsed.authType,
        priority,
        rateLimitPerMinute: isActive ? 60 : 10,
        timeoutMs: 8000,
        isActive,
        healthStatus: 'HEALTHY',
        failureCount: 0,
        metadata: JSON.stringify(metadata),
      };

      if (DRY_RUN) {
        if (isActive) cat.active += 1;
        else cat.inactive += 1;
        perCategory.set(category, cat);
        continue;
      }

      const categoryId = await ensureCategory(category);
      const existing = await prisma.providerConnection.findUnique({ where: { slug: parsed.slug } });
      if (existing) {
        await prisma.providerConnection.update({
          where: { id: existing.id },
          data: { ...data, categoryId },
        });
      } else {
        await prisma.providerConnection.create({ data: { ...data, categoryId } });
      }
      if (isActive) {
        stats.seededActive += 1;
        cat.active += 1;
      } else {
        stats.seededInactive += 1;
        cat.inactive += 1;
      }
      perCategory.set(category, cat);
    }
  }

  console.log('\n=== per category (docs / active / inactive) ===');
  for (const [c, v] of [...perCategory.entries()].sort()) {
    console.log(`  ${c.padEnd(34)} ${String(v.docs).padStart(4)} / ${String(v.active).padStart(3)} / ${String(v.inactive).padStart(4)}`);
  }
  console.log('\n=== summary ===');
  console.log(JSON.stringify(stats, null, 1));
  console.log(`duplicate slugs skipped: ${duplicates.length}`);
  duplicates.slice(0, 12).forEach((d) => console.log('   ', d));
  console.log(`no-base-pattern providers: ${noBase.length}`);
  noBase.slice(0, 12).forEach((d) => console.log('   ', d));
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
