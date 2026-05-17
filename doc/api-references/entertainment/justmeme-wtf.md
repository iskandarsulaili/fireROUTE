# justmeme.wtf

## Manual review status
- Category: Entertainment
- Official pages reviewed:
  - `https://justmeme.wtf/api-docs`
- Manual review outcome: `manually_documented`
- Confirmed route count: `7`

## API overview
- Base URL: `https://justmeme.wtf/api/v1`
- Authentication: none required
- Response format: JSON with `Content-Type: application/json`
- CORS: full CORS support is explicitly advertised
- Rate limit: `60 requests per minute per IP`

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/api/v1/templates` | List meme templates with pagination and optional category filtering. |
| GET | `/api/v1/templates/search` | Search templates by name using `q`. |
| GET | `/api/v1/templates/{slug}` | Fetch one template by slug. |
| GET | `/api/v1/trending` | Return the top `20` trending templates. |
| GET | `/api/v1/categories` | List all categories with counts. |
| POST | `/api/v1/ai-generate` | Generate a meme with AI from a prompt; this route shares the same rate limit and can return `503` when the AI service is down. |
| GET | `/api/v1/random` | Return one random template. |

## Confirmed parameters and request fields
### `GET /api/v1/templates`
- `page` - integer page number, default `1`
- `limit` - integer page size, default `20`, maximum `100`
- `category` - optional category slug filter

### `GET /api/v1/templates/search`
- `q` - search string used to match template names

### `GET /api/v1/templates/{slug}`
- `slug` - template slug path parameter

### `POST /api/v1/ai-generate`
- JSON request body shown on the official page includes:
  - `prompt` - text prompt for meme generation

## Confirmed response fields
### Template-list example
- `success` - boolean
- `templates` - array of template objects
- `total` - total matching templates
- `page` - current page
- `limit` - current page size

### Template object fields shown in the official example
- `id`
- `name`
- `slug`
- `url`
- `categories`

### Error format
- The official page documents a shared error shape:
  - `success` - `false`
  - `error` - human-readable error description

## Response, pagination, and errors
- List routes return JSON.
- Pagination is explicitly documented on `/api/v1/templates` with `page` and `limit`.
- Documented error statuses:
  - `400 Bad Request` - missing or invalid parameters
  - `404 Not Found` - template or endpoint not found
  - `429 Too Many Requests` - rate limit exceeded
  - `500 Server Error` - server-side failure
  - `503 Service Unavailable` - AI service temporarily down

## Important usage notes
- The docs market the API as free for personal and commercial use.
- The FAQ asks for attribution to `justmeme.wtf` when possible.
- The docs say trending templates are refreshed every `6` hours from Imgflip.
- The FAQ also says higher limits can be requested by opening an issue on GitHub.

## Sources inspected
- `https://justmeme.wtf/api-docs`
