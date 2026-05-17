# Brazil Receita WS

## Provider metadata
- Category: `Government`
- Provider slug: `brazil-receita-ws`
- Official docs/pages used:
  - `https://www.receitaws.com.br/`
  - `https://developers.receitaws.com.br/`
  - `https://developers.receitaws.com.br/receitaws.yaml`
- Current documented API base URL: `https://receitaws.com.br/v1`
- Auth model: public read route is unauthenticated; commercial and account routes require HTTP bearer auth
- Response format: JSON
- Rate limits: public route allows `3` queries per minute; commercial usage is quota-based and the reviewed spec did not publish a separate per-minute ceiling
- Pagination: none documented on the confirmed routes; `account/calls/report` returns the latest 10,000 calls and does not document paging parameters
- Error format: no single shared error envelope; several routes document HTTP-only error codes, while some `200` responses can still carry JSON objects with `status: ERROR`
- Manually confirmed route count: `6`

## Official usage notes
- The official landing page links to the Stoplight docs at `developers.receitaws.com.br` and shows the public CNPJ lookup path format.
- The official Stoplight page declares `https://receitaws.com.br/v1` as the live server and exposes the canonical OpenAPI document at `/receitaws.yaml`.
- The API is split into an unauthenticated public cache-only route and bearer-authenticated commercial/account routes.
- Commercial lookups first check Receita WS cache data, then may fall back to a real-time upstream query depending on the `days` path parameter and optional `fallback` query parameter.
- The reviewed spec explicitly documents quota exhaustion as HTTP `402` and real-time timeout as HTTP `504` after 50 seconds.

## Canonical endpoints confirmed from the official site
1. `GET /cnpj/{cnpj}`
   - Base URL: `https://receitaws.com.br/v1`
   - Tag: `API Pública`
   - Auth: none
   - Purpose: return Receita Federal company data for a cached CNPJ
   - Path parameters:
     - `cnpj` - required 14-digit CNPJ without formatting
   - Documented behavior:
     - public access only returns records already present in Receita WS cache
     - rate limit is `3` requests per minute
     - documented HTTP errors: `429` when the public limit is exceeded, `504` when data is not available from cache/timeouts occur
   - Response notes:
     - `200` may return a success company payload, `resultInvalidCNPJ`, or `rfResultRejected`
     - company responses include fields such as `nome`, `fantasia`, `atividade_principal`, `atividades_secundarias`, `ultima_atualizacao`, and `billing`

2. `GET /cnpj/{cnpj}/days/{days}`
   - Base URL: `https://receitaws.com.br/v1`
   - Tag: `API Comercial`
   - Auth: `Authorization: Bearer <token>`
   - Purpose: return Receita Federal company data while honoring a maximum staleness window
   - Path parameters:
     - `cnpj` - required 14-digit CNPJ without formatting
     - `days` - required non-negative maximum staleness in days
   - Query parameters:
     - `fallback` - optional; `cacheOnError` or `noCache`, default `cacheOnError`
   - Documented errors:
     - `402` when the account lacks the needed quota
     - `504` when the real-time query does not resolve within 50 seconds
   - Response notes:
     - `200` may return the same company schema as the public route or an error-shaped `status: ERROR` payload for invalid/rejected CNPJs

3. `GET /ccc/{cnpj}/days/{days}`
   - Base URL: `https://receitaws.com.br/v1`
   - Tag: `API Comercial`
   - Auth: `Authorization: Bearer <token>`
   - Purpose: return Cadastro Centralizado de Contribuinte / state registration data for a company
   - Path parameters:
     - `cnpj` - required 14-digit CNPJ without formatting
     - `days` - required non-negative maximum staleness in days
   - Query parameters:
     - `fallback` - optional; `cacheOnError` or `noCache`, default `cacheOnError`
   - Response notes:
     - success responses include `registros` entries with `uf`, `ie`, `tipo_ie`, `situacao_ie`, `data_situacao`, `regime_icms`, `situacao_cnpj`, and `data_atualizacao`
     - documented HTTP errors: `402`, `504`

4. `GET /simples/{cnpj}/days/{days}`
   - Base URL: `https://receitaws.com.br/v1`
   - Tag: `API Comercial`
   - Auth: `Authorization: Bearer <token>`
   - Purpose: return Simples Nacional enrollment data for a company
   - Path parameters:
     - `cnpj` - required 14-digit numeric CNPJ
     - `days` - required non-negative maximum staleness in days
   - Query parameters:
     - `fallback` - optional; `cacheOnError` or `noCache`, default `cacheOnError`
   - Response notes:
     - success responses include `simples` and `simei` objects plus `ultima_atualizacao` and `billing`
     - documented HTTP errors: `402`, `504`

5. `GET /account/quota`
   - Base URL: `https://receitaws.com.br/v1`
   - Tag: `API Comercial`
   - Auth: `Authorization: Bearer <token>`
   - Purpose: return the account's remaining query quota for cache and real-time calls
   - Response notes:
     - success responses include top-level `status` and nested `quota` fields
     - the reviewed schema exposes `from_database`, `from_external`, and `next_renewal_date`

6. `GET /account/calls/report`
   - Base URL: `https://receitaws.com.br/v1`
   - Tag: `API Comercial`
   - Auth: `Authorization: Bearer <token>`
   - Purpose: return a report of recent API calls made by the account
   - Official notes:
     - returns the most recent `10mil` / 10,000 requests
     - excludes calls made in the last 2 minutes
   - Response notes:
     - success responses include top-level `status` and a `calls` array
     - reviewed schema fields include `id`, `start`, `end`, `token`, `cnpj`, `days`, `type`, and `invalid`

## Parameters, pagination, and format notes
- All confirmed routes return JSON.
- The bearer token routes use the same `fallback` query model on the commercial lookup endpoints: `cacheOnError` or `noCache`.
- `days` controls the maximum accepted age of cached data before Receita WS attempts a real-time refresh.
- No cursor/page-number pagination was documented for any confirmed route.
- `account/calls/report` is capped by a fixed recent-history window instead of documented pagination parameters.

## Error, auth, and access notes
- Public `GET /cnpj/{cnpj}` requires no token.
- Commercial lookup and account routes use the OpenAPI `BearerAuth` security scheme.
- The reviewed spec explicitly documents HTTP `429` for the public-rate-limit breach, HTTP `402` for insufficient commercial quota, and HTTP `504` for real-time timeouts.
- Invalid or rejected CNPJs are modeled as JSON objects with `status: ERROR` and `message` fields rather than separate non-200 HTTP codes in the reviewed schema.
- The official docs do not publish a general monthly or per-minute commercial throttle beyond the plan/quota model shown on the public pricing page.

## fireROUTE normalization notes
- Treat `https://receitaws.com.br/v1` as the canonical API base URL.
- Keep the public route separate from the bearer-authenticated commercial/account routes.
- Preserve the `days` path segment on the commercial lookup routes; it is part of the canonical path, not an optional query parameter.
- Preserve `fallback` as an optional query parameter only on the three commercial lookup routes.
- Do not invent pagination for `account/calls/report`; the official docs only describe a fixed recent-call report window.
