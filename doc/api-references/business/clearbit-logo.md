# Clearbit Logo

## Provider metadata
- Category: `Business`
- Provider slug: `clearbit-logo`
- Official pages manually reviewed in this pass:
  - `https://clearbit.com/docs#logo-api`
  - `https://www.logo.dev/docs/introduction`
  - `https://www.logo.dev/docs/migrations/clearbit`
  - `https://www.logo.dev/docs/logo-images/get`
  - `https://www.logo.dev/docs/logo-images/ticker`
  - `https://www.logo.dev/docs/logo-images/crypto`
  - `https://www.logo.dev/docs/logo-images/isin`
  - `https://www.logo.dev/docs/logo-images/name`
  - `https://www.logo.dev/docs/brand-search/introduction`
  - `https://www.logo.dev/docs/describe/introduction`
  - `https://www.logo.dev/docs/platform/api-keys`
  - `https://www.logo.dev/docs/platform/rate-limits`
- Current first-party status confirmed from the reviewed pages: legacy Clearbit Logo has been shut down, and Clearbit / HubSpot now point developers to Logo.dev as the official migration path.
- Manually confirmed route count: `7` operations across `7` unique `GET` route templates

## Current provider status
The old `logo.clearbit.com` product is no longer the live first-party integration surface. The current first-party docs explicitly say `Clearbit Logo has been shutdown`, and the official migration guide says `Logo.dev is the official migration path recommended by Clearbit / HubSpot`.

Because the current official technical surface is now Logo.dev, this file documents the live successor routes that Clearbit users are now told to adopt.

## Base URLs and surfaces

| Surface | Base URL / host | Auth model | Notes |
|---|---|---|---|
| Legacy Clearbit Logo | `https://logo.clearbit.com/` | retired | migration guide says this legacy base will stop working |
| Logo image CDN | `https://img.logo.dev` | publishable key via `token` query parameter | one-to-one Clearbit replacement for logo delivery |
| Brand Search API | `https://api.logo.dev` | bearer secret key (`sk_...`) | search by brand name |
| Describe API | docs example shows `http://api.logo.dev/describe/{domain}` | bearer secret key (`sk_...`) | official docs currently show an `http://` example for the describe route while other API examples use `https://api.logo.dev/...` |

## Authentication

### Image CDN routes
- Auth uses a publishable key (`pk_...`).
- The key is passed as query parameter `token`.
- Publishable keys only work with `img.logo.dev`.
- Logo.dev says publishable keys are safe for client-side use and are automatically protected.
- Optional domain restrictions can be enabled for publishable keys using the `Referer` header.

### Search and Describe routes
- These routes require a secret key (`sk_...`).
- Auth header: `Authorization: Bearer LOGO_DEV_SECRET_KEY`
- The docs explicitly say secret keys are server-side only and must never be exposed publicly.

## Confirmed route inventory

### 1) Logo image CDN (`5` `GET` routes)
Base: `https://img.logo.dev`

| Method | Path | Official purpose |
|---|---|---|
| `GET` | `/{domain}` | fetch logo by company domain |
| `GET` | `/ticker/{ticker}` | fetch logo by stock ticker |
| `GET` | `/crypto/{symbol}` | fetch logo by cryptocurrency symbol |
| `GET` | `/isin/{isin}` | fetch logo by ISIN |
| `GET` | `/name/{brand_name}` | fetch logo by brand name using the top Brand Search result |

Confirmed image parameters from the reviewed docs:
- `token` (required publishable key)
- `size` (integer, default `128`)
- `format` (docs describe `png`, `jpg`, and `webp`; default shown as `jpg`)
- `greyscale` (boolean, default `false`)
- `theme` (string, default `auto`)
- `retina` (boolean, default `false`)
- `fallback` (string, default `monogram`)

Important image-route notes confirmed from the docs:
- the migration guide says Logo.dev is intended as a one-to-one Clearbit base-URL replacement
- stock-ticker lookups default to US exchanges unless an exchange shortcode is appended after the ticker
- crypto coverage is described as roughly `20,000` tokens
- name lookups are a convenience wrapper over Brand Search and return the first match
- brand names with spaces or special characters must be URL-encoded on `/name/{brand_name}`

### 2) Brand Search API (`1` `GET` route)
Base: `https://api.logo.dev`

| Method | Path | Official purpose |
|---|---|---|
| `GET` | `/search` | search company domains by brand name |

Confirmed parameters:
- `q` (required brand-name query)
- `strategy` (optional; `typeahead` by default, or `match` for exact / near-exact ranking)

Confirmed response / pagination notes:
- returns a JSON array of objects with at least `name` and `domain`
- the docs say there is currently a maximum of `10` results
- no pagination parameters are documented on this route

### 3) Describe / Brand data API (`1` `GET` route)
Base in the reviewed docs example: `http://api.logo.dev`

| Method | Path | Official purpose |
|---|---|---|
| `GET` | `/describe/{domain}` | return brand metadata for a domain |

Confirmed response fields from the reviewed docs example:
- `name`
- `domain`
- `description`
- `indexed_at`
- `socials`
- `logo`
- `blurhash`
- `colors`

Confirmed usage notes:
- the docs say Describe is available on paid plans
- the docs list supported social keys including `facebook`, `github`, `instagram`, `linkedin`, `pinterest`, `reddit`, `snapchat`, `telegram`, `tumblr`, `twitter`, `wechat`, `whatsapp`, and `youtube`
- the docs present Describe as the route to go from domain to brand data

## Rate limits
Official rate-limit page details reviewed in this pass:

| Plan | Requests / month | Enforcement |
|---|---:|---|
| Free | `500,000` | proactive |
| Startup | `1,000,000` | proactive |
| Pro | `5,000,000` | soft limit |
| Enterprise | `5,000,000+` | soft limit |

Additional officially stated limit notes:
- limits are monthly request counts, not per-second or per-minute quotas
- the docs explicitly say service is not stopped without notification
- each image request, Brand Search request, stock-ticker request, and Describe request counts as one request

## Response-format and error notes
- Image CDN routes return image content rather than JSON.
- Search returns JSON arrays.
- Describe returns a JSON object.
- The reviewed docs do not publish a canonical JSON error envelope or status-code table.
- The docs do publish fallback behavior for image lookups via the `fallback` parameter, but the reviewed pages did not expose a complete error-schema table.

## Important migration / usage notes
- The migration guide says Clearbit Logo API is shutting down on `2025-12-08`.
- The official migration step is to replace the legacy Clearbit base with `https://img.logo.dev/` and append `?token=LOGO_DEV_PUBLISHABLE_KEY`.
- Free-tier use requires attribution back to Logo.dev; the migration guide says paid plans can remove attribution.
- Publishable keys can be restricted to approved domains, and requests without a matching `Referer` header will be blocked when that feature is enabled.
- The Describe page currently shows an `http://api.logo.dev/describe/...` example while Search uses `https://api.logo.dev/search`; treat the path as confirmed, but note the docs’ current scheme inconsistency.

## fireROUTE normalization notes
- Treat this provider as a migrated successor surface rather than a still-live legacy Clearbit host.
- Prefer the currently documented Logo.dev routes over archived `logo.clearbit.com` examples.
- Keep the provider slug as `clearbit-logo`, but document the live first-party route surface that Clearbit now officially sends users toward.
- Do not backfill additional historical Clearbit-only endpoints from stale blog posts or unofficial SDKs.
