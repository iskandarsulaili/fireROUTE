# Healthcare.gov

## Provider metadata
- Category: `Health`
- Provider slug: `healthcare-gov`
- Official docs/pages used:
  - `https://www.healthcare.gov/developers/`
  - `https://www.healthcare.gov/accessibility.json`
  - `https://www.healthcare.gov/api/glossary.json`
  - `https://www.healthcare.gov/api/index.json`
- Current public API base URL: `https://www.healthcare.gov`
- Auth model: no authentication required
- Response format: JSON, with optional JSONP wrapping via `callback`
- CORS: officially documented as enabled for cross-domain requests
- Public rate-limit note: no numeric rate limit was published on the reviewed developer page
- Manually confirmed route count: `3`

## Authentication and access
- The developer page explicitly says everyone can use the API to embed content from HealthCare.gov.
- The published API is read-only and documented around HTTP `GET` requests.
- The docs explicitly describe both CORS-enabled requests and JSONP support.

## Canonical endpoints
1. `GET /{post-path}.json` - fetch one content object as JSON for any HealthCare.gov post path
2. `GET /api/{content-type}.json` - fetch a content collection by type
3. `GET /api/index.json` - fetch the site-wide abridged content index

## Parameters and path notes
### Path parameters
- `post-path` - the published post path with the trailing slash replaced by `.json`; the docs describe this as replacing the trailing slash on a post URL with `.json`
- `content-type` - one of the officially listed collection types: `articles`, `blog`, `questions`, `glossary`, `states`, or `topics`

### Query parameters
- `callback` - optional JSONP wrapper name; when present, the API wraps the response in the callback value instead of returning plain JSON

## Response, pagination, and error notes
- Content-object responses may include fields such as `url`, `title`, `content`, `author`, `date`, `lang`, `categories`, `tags`, `topics`, `layout`, and `order`.
- Collection responses return an object keyed by the requested content type, with the value set to an array of post objects.
- Index responses return an array of summary objects with fields such as `tags`, `categories`, `topics`, `title`, `es-title`, `url`, `bite`, `es-bite`, and `state`.
- The reviewed docs do not publish page-number, cursor, or offset pagination.
- The reviewed docs do not publish a structured error schema or numeric quota.

## Usage notes from the official docs
- HealthCare.gov describes the API as machine-readable educational Marketplace content intended for reuse by partners, innovators, and developers.
- The page explicitly says content updates on HealthCare.gov automatically flow through to sites using the API.
- The docs present `https://www.healthcare.gov/accessibility.json` and `https://www.healthcare.gov/api/glossary.json` as canonical examples.
- Client-side cross-origin integrations are officially supported through CORS, with JSONP retained as an alternate legacy integration pattern.

## fireROUTE normalization notes
- Normalize this provider as a public, unauthenticated, read-only JSON content API rooted at `https://www.healthcare.gov`.
- Preserve the distinction between single-object lookups (`/{post-path}.json`), typed collections (`/api/{content-type}.json`), and the global content index (`/api/index.json`).
- Model `callback` as an optional response-wrapping flag rather than as a filtering parameter.
- Do not infer undocumented pagination, mutation routes, or private Marketplace workflows from this public content API.