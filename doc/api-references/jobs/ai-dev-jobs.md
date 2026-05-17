# AI Dev Jobs

## Provider metadata
- Category: `Jobs`
- Provider slug: `ai-dev-jobs`
- Official docs page used: `https://aidevboard.com/openapi.yaml`
- Current public API base URL: `https://aidevboard.com/api/v1`
- Response format: JSON
- Auth model:
  - many discovery/read endpoints are publicly reachable
  - protected endpoints use header `X-API-Key`
- Manually confirmed route count: `21`

## Authentication and quota notes
- The official OpenAPI description says read endpoints are anonymously reachable for discovery and small trials.
- The docs warn that billable reads share a monthly anonymous quota and may return `quota_exceeded` after the anonymous allowance is exhausted.
- Authenticated endpoints use API-key auth via header `X-API-Key`.
- Registration endpoints exist for developer and company keys.
- The Pro tier upgrade docs say developer keys can be upgraded to `5,000 req/hr` through the `/developer/subscribe` flow.

## Shared request/response notes
- JSON request and response bodies throughout.
- Job listing pagination uses `page` (1-indexed) and `limit`.
- Search/list responses commonly return pagination metadata such as `total`, `page`, `per_page`, `total_pages`, and `has_next`.
- Notable error responses documented in the spec include `400`, `402`, `404`, and `501` depending on endpoint.

## Canonical endpoints

### Public jobs and discovery
1. `GET /jobs`
   - Search/list AI developer jobs.
   - Query params: `q`, `tags`, `location`, `workplace`, `type`, `level`, `salary_min`, `salary_max`, `salary_floor_min`, `posted_within_days`, `limit`, `page`.

2. `GET /jobs/{id_or_slug}`
   - Get one job by ID or slug.
   - Path param: `id_or_slug`.

3. `GET /jobs/{id_or_slug}/similar`
   - Get similar jobs.
   - Path param: `id_or_slug`.
   - Query param: `limit` (default `5`, max `20`).

4. `POST /jobs/match`
   - Match jobs to a candidate profile.
   - Request JSON supports `skills` (required), `salary_min`, `salary_max`, `workplace`, `level`, `limit`.
   - The docs call this the recommended endpoint for agentic job search.

5. `GET /tags`
   - Return popular tags with job counts.

6. `GET /stats`
   - Return market statistics and salary benchmarks.

7. `GET /companies`
   - List companies with active jobs.

8. `GET /companies/{slug}`
   - Get one company, active jobs, and engagement stats.
   - Path param: `slug`.

9. `GET /analytics/searches`
   - Usage/search analytics.
   - Query param: `days` (default `30`, max `365`).

10. `GET /pricing`
    - Public pricing tiers for employer job listings.

11. `GET /catalog`
    - Agent-readable commerce catalog.

12. `POST /quote`
    - Create a deterministic commerce quote.
    - Optional request body fields: `product_id`, `tier`, `sku`.

13. `POST /checkout`
    - Create checkout handoff.
    - Request body fields documented: `product_id`, `payment_mode`, `job_id`, `buyer_email`, `shared_payment_granted_token`, `metadata`.
    - `payment_mode` enum: `stripe_checkout`, `stripe`, `stripe_link`, `link`, `stripe_spt`.
    - Documented responses: `200`, `400`, `402`, `501`.

14. `POST /subscribe`
    - Subscribe to newsletter.
    - Request body: `email` required; optional `name`, `tags`, `frequency`.
    - `frequency` enum: `daily`, `weekly`, `monthly`.

15. `GET /salary-trends`
    - Historical salary trend snapshots.
    - Query param: `days` (default `90`, max `365`).

16. `GET /trending/companies`
    - Companies hiring most aggressively in trailing N days.
    - Query params: `days` (default `7`, max `30`), `limit` (default `10`, max `25`).

### Registration and authenticated developer/company actions
17. `POST /register`
    - Register for a free developer API key.
    - Request JSON requires `name`, `email`.
    - Response: `201`.

18. `POST /register/developer`
    - Legacy alias for developer API-key registration.
    - Request JSON requires `name`, `email`.
    - Response: `201`.

19. `POST /register/company`
    - Register a company for posting jobs.
    - Request JSON requires `name`, `email`; optional `website`.
    - Response: `201`.

20. `POST /developer/apply/{job_id}`
    - Apply to a job.
    - Requires `X-API-Key`.
    - Path param: `job_id`.
    - Optional request fields: `cover_letter`, `skills`, `experience_years`, `github_url`.
    - Response: `201`.

21. `POST /developer/subscribe`
    - Upgrade an API key to Pro tier.
    - Requires `X-API-Key`.
    - Response: `200` for checkout/autoupgrade flow; `400` if already on Pro.

## Request-body and schema highlights
### Core `Job` schema fields documented
- `id` (UUID)
- `title`
- `company_name`
- `description`
- `requirements`
- `location`
- `workplace` (`remote`, `hybrid`, `onsite`)
- `job_type`
- `experience_level`
- `salary_min`
- `salary_max`
- `tags`
- `apply_url`
- `slug`
- `quality_score`
- `created_at`

### Job list response shape
```json
{
  "jobs": [],
  "total": 0,
  "page": 1,
  "per_page": 20,
  "total_pages": 0,
  "has_next": false
}
```

### Job match response includes
- `matches[]`
- nested job fields
- `match_score`
- `matched_tags`
- `match_reasons`
- `total_scored`
- `total_matches`

## fireROUTE normalization notes
- Provider mixes public read endpoints with authenticated write/account actions.
- Pagination is conventional page/limit rather than cursor based.
- `X-API-Key` is the only documented security scheme.
- Several commerce-related endpoints (`/catalog`, `/quote`, `/checkout`) are outside pure job-search flows and should likely live in an auxiliary capability group.
