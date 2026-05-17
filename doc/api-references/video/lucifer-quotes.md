# Lucifer Quotes

## Provider metadata
- Category: `Video`
- Provider slug: `lucifer-quotes`
- Official docs pages used:
  - `https://github.com/shadowoff09/lucifer-quotes`
  - `https://raw.githubusercontent.com/shadowoff09/lucifer-quotes/main/README.md`
  - `https://raw.githubusercontent.com/shadowoff09/lucifer-quotes/main/src/server.js`
  - `https://raw.githubusercontent.com/shadowoff09/lucifer-quotes/main/src/quotesRepository.js`
- Main API base URL: `https://lucifer-quotes.vercel.app`
- Auth model: none
- Supported request method: `GET`
- Response format: JSON array of quote objects
- Manually confirmed route count: `4`

## Authentication
- The official README presents the service as public and unauthenticated.
- No token, API key, OAuth flow, or account setup is documented in the reviewed official sources.

## Canonical endpoints

### 1) Get one random English quote
- Method: `GET`
- Path: `/api/quotes`
- Purpose: return one random English quote wrapped in an array

### 2) Get multiple random English quotes
- Method: `GET`
- Path: `/api/quotes/{number}`
- Purpose: return `{number}` random English quotes

Path parameters:
- `number` - requested number of quotes; the server parses it as an integer and defaults to `1` when omitted or invalid

### 3) Get one random quote for a language code
- Method: `GET`
- Path: `/api/{lang}/quotes`
- Purpose: return one random quote for the requested two-letter language code

Path parameters:
- `lang` - two-letter lowercase language code matched by `/^[a-z]{2}$/`; invalid values fall back to `en`

### 4) Get multiple random quotes for a language code
- Method: `GET`
- Path: `/api/{lang}/quotes/{number}`
- Purpose: return `{number}` random quotes for the selected language

Path parameters:
- `lang` - two-letter lowercase language code
- `number` - requested quote count; defaults to `1` when omitted or invalid

## Language and behavior notes
- The repository source includes the default English quote file and an additional `quotes.fr.js` file; French is the only extra language file that was directly confirmed from the reviewed official source tree.
- When a requested language file does not exist, the repository falls back to the English dataset.
- The quote repository prevents duplicates within one response array and caps the output length to the dataset size.

## Request and response notes
- Responses are arrays of objects with `quote` and `author` fields.
- The Express app sets `Access-Control-Allow-Origin: *` for all routes.
- The site root `/` serves the documentation page, but the API surface confirmed from the official sources is the four `/api/...` routes above.

## Pagination, rate limits, and errors
- No pagination model is documented.
- No numeric rate limit is documented in the reviewed official sources.
- No formal error envelope is documented; invalid or unsupported language input falls back to English instead of returning a specialized error body.

## fireROUTE normalization notes
- Preserve the provider's array response shape even for single-quote requests.
- Treat `lang` as an optional provider-specific localization dimension instead of folding it into the quote count route.
- Clients should not assume stable quote IDs or deterministic ordering from the reviewed official sources.
