# Autochess VNG

## Overview
- Provider: `Autochess VNG`
- Category: `Games & Comics`
- Indexed official docs URL: `https://github.com/didadadida93/autochess-vng-api`
- Canonical repository reached in this shard: `https://github.com/namakurohman93/autochess-vng-api`
- Preferred base URL: no public production host is documented in the official repository; the official source only confirms app-root-relative routes for a self-hosted Koa service
- Confirmed route count: `4`
- Manual status: `manually_documented`
- Auth: none documented or implemented in the inspected router/middleware
- HTTPS: deployment-dependent; the official repository does not publish a canonical hosted API origin
- Response format: JSON
- Pagination: none documented or implemented
- Rate limits: `120` requests per IP within `1 day`, with `RateLimit-Remaining` and `RateLimit-Reset` response headers; reset time is documented as `UTC+0`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/` | none | Redirects to `https://github.com/didadadida93/autochess-vng-api` according to `src/router.ts`. The indexed repository URL itself now redirects to the maintained `namakurohman93` repository. |
| GET | `/heroes` | none | Returns all heroes. The router joins each hero with its `class` object and `races` array. |
| GET | `/classes` | none | Returns all class records. |
| GET | `/races` | none | Returns all race records. |

## Parameter details
The official README and router source do not document or implement any query parameters, path parameters, request bodies, or headers for the confirmed routes.

## Response format details
All confirmed API routes return JSON.

### `GET /heroes`
The official README sample shows an array of hero objects with these documented fields:
- `id`
- `title`
- `name`
- `quality`
- `cost`
- `races[]`
  - `name`
  - `synergies[]`
  - `icon`
- `class`
  - `name`
  - `synergies[]`
  - `icon`
- `stats`
  - `hp[]`
  - `armor[]`
  - `magicResistence[]`
  - `atk[]`
  - `atkRate[]`
  - `atkRange[]`
- `ability`
  - `name`
  - `picture`
  - `descriptions[]`
- `picture[]`

The inspected router excludes the internal `classId` column from the response and eagerly includes the associated `class` and `race` records.

### `GET /classes`
The official README sample shows an array of class objects with:
- `id`
- `name`
- `synergies[]`
- `icon`

### `GET /races`
The official README sample shows an array of race objects with:
- `id`
- `name`
- `synergies[]`
- `icon`

## Auth, rate limits, and CORS
- No API key, token, OAuth flow, or session auth is documented in the README or implemented in the inspected route/middleware files.
- The app enables CORS globally through `@koa/cors`.
- The official README states every IP is limited to `120` requests within `1 day`.
- The rate-limiter middleware adds:
  - `RateLimit-Remaining`
  - `RateLimit-Reset`
- The README explicitly says `RateLimit-Reset` is expressed in `UTC+0`.

## Pagination
- No pagination parameters or paging behavior are documented for `/heroes`, `/classes`, or `/races`.
- The inspected router uses plain `findAll()` calls and exposes full collections.

## Error handling
The inspected application code confirms these non-success behaviors:
- Unknown routes return HTTP `404` with JSON body:
  - `{"error": true, "message": "not found"}`
- If the rate limiter is exceeded, the middleware returns HTTP `429` with JSON body:
  - `{"error": true, "message": "too many requests"}`
  - and a `RateLimit-Reset` header
- If the rate-limiter middleware throws a regular application error, it returns HTTP `500` with JSON body:
  - `{"error": true, "message": "internal server error"}`

## Important usage notes
- The official source is a GitHub repository, not a hosted API portal. It documents route behavior but does not publish a stable public base URL for consumers.
- Treat this provider as a self-hostable contract unless a separately verified production deployment is identified later from official sources.
- The router's `/` redirect still points at `https://github.com/didadadida93/autochess-vng-api`, while the current repository page redirects to `https://github.com/namakurohman93/autochess-vng-api`.
- The repository includes `.env.template` variables for `PORT`, `HTTP_PORT`, `RATE_LIMITER_POINTS`, `RATE_LIMITER_DURATION`, and `REDIS_URI`, which indicates deployers configure host/port and limiter settings at runtime.

## Integration notes for fireROUTE
- Model this provider as a small unauthenticated JSON API with three data endpoints plus one root redirect route.
- Do not assume a public hosted origin exists; the official repo only confirms relative route paths.
- Do not add pagination or filter parameters that are not present in the official README/router.
- Preserve the documented rate-limit headers and `404` / `429` / `500` JSON error shapes.

## Sources inspected in this shard
- `https://github.com/didadadida93/autochess-vng-api`
- `https://github.com/namakurohman93/autochess-vng-api#readme`
- `https://raw.githubusercontent.com/namakurohman93/autochess-vng-api/master/readme.md`
- `https://raw.githubusercontent.com/namakurohman93/autochess-vng-api/master/src/router.ts`
- `https://raw.githubusercontent.com/namakurohman93/autochess-vng-api/master/src/app.ts`
- `https://raw.githubusercontent.com/namakurohman93/autochess-vng-api/master/src/middlewares/request-limiter.ts`
- `https://raw.githubusercontent.com/namakurohman93/autochess-vng-api/master/src/rate-limiter.ts`
- `https://raw.githubusercontent.com/namakurohman93/autochess-vng-api/master/.env.template`
- `https://raw.githubusercontent.com/namakurohman93/autochess-vng-api/master/package.json`
