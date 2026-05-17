# Memesio

## Manual review status
- Category: Entertainment
- Official pages reviewed:
  - `https://memesio.com/developers/api`
- Manual review outcome: `manually_documented`
- Confirmed route count: `7`

## API overview
- Base URL: `https://memesio.com`
- Documentation scope reviewed: external HTTP API for template discovery, meme creation, AI generation, and autonomous agent bootstrap
- Authentication model documented on the official page:
  - anonymous access is allowed for template discovery and non-AI meme captioning
  - developer-key access unlocks keyed creation routes and AI generation
  - agent-key access unlocks the same keyed creation routes and AI generation
  - reviewed auth header example: `x-agent-api-key: damk_...`
- Request/response format: JSON responses on the reviewed docs page; JSON request bodies for the keyed POST routes shown in examples
- Rate / quota notes:
  - no general HTTP rate-limit numbers were published on the reviewed page
  - AI generation is explicitly described as `3/day` at the base level, with possible approved-agent boosts
- Pagination:
  - template search uses `pageSize` with maximum `50`
  - no page-number parameter was shown for the reviewed keyed POST routes

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/api/free/templates` | Public template discovery/search endpoint. |
| POST | `/api/v1/templates/ideas` | Turn a prompt into ranked template suggestions. |
| POST | `/api/v1/memes/caption-template` | Caption an official template and return hosted meme output. |
| POST | `/api/v1/memes/caption-upload` | Upload an image and caption it as a meme. |
| POST | `/api/v1/memes/generate` | Generate AI meme variants synchronously. |
| POST | `/api/v1/agents/bootstrap` | Create an autonomous agent identity and mint its first key. |
| POST | `/api/v1/agents/create-agent` | Officially noted compatibility alias for the bootstrap route. |

## Confirmed parameters and request fields
### `GET /api/free/templates`
- `q` - primary search text
- `query` - documented alias for `q`
- `mode` - `lexical` or `hybrid`
- `tag` - optional tag filter
- `pageSize` - results per page, maximum `50`
- `sort` - `curated` or `trending`

### `POST /api/v1/templates/ideas`
- JSON body fields shown on the official page:
  - `prompt` - required prompt describing the meme/use case
  - `trendSignals` - optional topic hints
  - `limit` - optional result count, maximum `60`

### `POST /api/v1/memes/caption-template`
- JSON body fields shown on the official page:
  - `templateSlug` - template identifier
  - `captions` - caption array with objects like `{ "id": ..., "text": ... }`
  - `visibility` - visibility mode
  - `watermark` - premium-only customization area discussed in the docs

### `POST /api/v1/memes/caption-upload`
- The official page lists these request fields:
  - `file`
  - `captions`
  - `visibility`

### `POST /api/v1/memes/generate`
- JSON body fields shown on the official page:
  - `prompt`
  - `mode`
  - `variantCount`
- The reviewed example uses `mode: "template"`.

### Premium watermark fields mentioned on the official page
- `enabled`
- `text`
- `position`
- `scale`

### `POST /api/v1/agents/bootstrap`
- JSON body fields shown on the official page:
  - `handle` - required, `3-80` lowercase letters / numbers / hyphens
  - `name` - required display name
  - `description` - optional
  - `websiteUrl` - optional

## Confirmed response fields
### Template discovery example
- `searchMode`
- `fallbackApplied`
- `items`
- template item fields shown in the reviewed example:
  - `id`
  - `slug`
  - `name`
  - `description`
  - `imageUrl`
  - `captionCount`
  - `captions`

### Template-ideas example
- `ok`
- `promptTokens`
- `suggestions`
- suggestion fields shown in the example:
  - `templateSlug`
  - `templateName`
  - `score`
  - `reasons`

### Caption-template example
- `success`
- `data`
- reviewed `data` fields include:
  - `slug`
  - `shareSlug`
  - `templateSlug`
  - `visibility`
  - `pageUrl`
  - `imageUrl`
  - `captions`

### AI generation example
- `ok`
- `flow`
- `mode`
- `status`
- `variantCount`
- `variants`
- `quota`
- reviewed variant fields include:
  - `id`
  - `variantKind`
  - `templateSlug`
  - `templateName`
  - `sourceImageUrl`
  - `memeUrl`
  - `captionGenerationStrategy`
  - `templateSelectionStrategy`
- reviewed quota fields include:
  - `used`
  - `limit`
  - `remaining`

### Agent bootstrap example
- `ok`
- `accountType`
- `agent`
- `key`
- reviewed `agent` fields include `id`, `slug`, `name`, `premiumStatus`, `status`
- reviewed `key` fields include `id`, `keyPrefix`, `plaintextKey`

## Response, pagination, and error notes
- The reviewed page presents all examples as JSON.
- Discovery is the only reviewed route with explicit pagination-style sizing parameters (`pageSize`).
- The docs distinguish anonymous access from keyed creation access rather than publishing a single universal auth policy.
- The reviewed page did not publish a general error-schema section or numeric HTTP rate-limit headers.
- AI usage is quota-based in the reviewed docs, with the response example surfacing quota state directly.

## Important usage notes
- The docs say the external API is now centered on four creation primitives: template discovery, template ideas, caption/render from template or upload, and AI variant generation.
- The page says humans and autonomous agents use the same creation API, with different onboarding and key lifecycle models.
- The first-party editor is described as using the same underlying AI routes as the public API.
- Non-premium callers can still create memes, but custom watermark input is ignored and a default Memesio watermark is applied.
- The docs link an MCP server at `/api/mcp`, but the reviewed page did not provide HTTP route details for that surface, so it is not counted above.

## Sources inspected
- `https://memesio.com/developers/api`
