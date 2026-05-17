# Currency-api

Official docs manually reviewed:
- https://github.com/fawazahmed0/currency-api#readme
- https://github.com/fawazahmed0/exchange-api
- https://github.com/fawazahmed0/exchange-api/blob/main/MIGRATION.md

## Overview
The original `currency-api` repository now explicitly declares that it has migrated to `exchange-api`. The reviewed official README on the new repository documents a static JSON HTTP API for exchange rates, served from jsDelivr and mirrored on a Cloudflare Pages fallback host.

- Primary base URL pattern: `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/v1/{endpoint}`
- Official fallback base URL pattern: `https://{date}.currency-api.pages.dev/v1/{endpoint}`
- Auth: none
- Methods confirmed: `GET`
- Response formats: JSON via `.json` and minified JSON via `.min.json`
- Update cadence stated by the official README: daily updated
- Rate-limit statement from the official README: **No Rate limits**

## Authentication
The reviewed official README does not require an API key or bearer token. The documented examples are public CDN/Pages URLs.

## Date and version path model
The official README defines the URL structure as:

```text
https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@{date}/{apiVersion}/{endpoint}
```

Confirmed path variables from the official docs:
- `{date}` — either `latest` or a concrete `YYYY-MM-DD` date
- `{apiVersion}` — the README examples use `v1`
- `{endpoint}` — one of the documented endpoint families below

## Confirmed endpoints
| Method | Path | Purpose | Notes |
|---|---|---|---|
| GET | `/v1/currencies.json` | List all available currency codes and names | also available as `/v1/currencies.min.json` |
| GET | `/v1/currencies/{currencyCode}.json` | Return rates using one base currency | also available as `/v1/currencies/{currencyCode}.min.json` |

Manual route count confirmed from the reviewed official documentation: **2** canonical GET routes.

## Official examples confirmed
The reviewed README explicitly shows examples for:
- `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json`
- `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.min.json`
- `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json`
- `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies/eur.json`
- `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/btc.json`
- `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/btc.min.json`
- `https://latest.currency-api.pages.dev/v1/currencies/eur.json`
- `https://2024-03-06.currency-api.pages.dev/v1/currencies/eur.json`

## Parameters and path variables confirmed
- `currencyCode` — base currency code in the path, e.g. `eur` or `btc`
- output suffix — `.json` for prettified JSON, `.min.json` for minified JSON
- `{date}` — `latest` or `YYYY-MM-DD`

The reviewed README does not document provider-specific query parameters.

## Response-format notes
The official README describes two response encodings only:
- standard JSON (`.json`)
- minified JSON (`.min.json`)

The list endpoint returns available currencies.
The per-currency endpoint returns a base-currency object for the requested date/version.

## Rate limits
The reviewed official README explicitly advertises:
- **No Rate limits**

No quota headers, monthly caps, or API-key plan tiers are documented on the reviewed pages.

## Pagination
No pagination model is documented or needed for the two published endpoint families.

## Errors and reliability notes
The README does not publish a formal error schema.

Important reliability note explicitly stated by the provider:
- clients should include a fallback mechanism so that if `cdn.jsdelivr.net` fails, requests can fall back to `currency-api.pages.dev`

## Migration / product-state note
The original repository page prominently states:
- `THIS REPOSITORY IS MIGRATED TO https://github.com/fawazahmed0/exchange-api`

So the legacy provider file name remains `currency-api`, but the current official documentation source for active usage is the migrated `exchange-api` repository.

## Important usage notes
- This is effectively a static-file HTTP API, not a traditional authenticated REST service.
- The official docs consistently use lowercase currency codes in examples such as `eur` and `btc`.
- The provider exposes the same logical endpoints on both the jsDelivr base host and the Cloudflare Pages fallback host.
- fireROUTE should preserve the requested date/version path rather than hard-coding only `latest`.

## fireROUTE notes
- Treat this provider as a no-auth, GET-only JSON source.
- Canonical routing can be modeled as `list_currencies` and `rates_by_base_currency`.
- Because the provider officially recommends a fallback host, adapters should support host failover between jsDelivr and `currency-api.pages.dev`.
