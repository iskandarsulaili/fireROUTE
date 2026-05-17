# Vedic Society

Official pages manually reviewed:
- https://aninditabasu.github.io/indica/
- https://aninditabasu.github.io/indica/topics/api_vs.html
- https://aninditabasu.github.io/indica/topics/openapi_vs.html

## Overview
- Primary base URL documented in the reviewed reference page and OpenAPI sandbox: `https://indica-1hwj.onrender.com/vs/v2/`
- Supported method on all documented endpoints: `GET`
- Response format documented by the reference page and OpenAPI spec: JSON arrays of noun-definition objects; the OpenAPI response description also says unmatched queries return a plain-text message instead of JSON
- Authentication: none documented in the reviewed official pages
- Rate-limit note from the reviewed official pages: no rate-limit policy was published
- Product scope described in the reviewed official pages: noun definitions from Vedic literature, including flora, fauna, geography, food, social roles, and other categories, excluding proper nouns

Manual route count confirmed from the reviewed official docs: **3**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/words/{word}` | Search transliterated Sanskrit nouns by Roman-script substring |
| GET | `/descriptions/{description}` | Search meanings/definitions by phrase |
| GET | `/categories/{category}` | List all nouns in one published category |

## Confirmed parameters

### `GET /words/{word}`
- Required path parameter:
  - `word` — Roman-script search string for the noun itself
- The official docs say this search is partial-match and case-insensitive.
- The prose reference page uses `shat` as an example that can match words such as `kshatriya`, `prishat`, or `shatapati`.

### `GET /descriptions/{description}`
- Required path parameter:
  - `description` — phrase to search inside the noun meaning/definition
- The official docs say this search is partial-match and case-insensitive.
- The prose reference page explicitly distinguishes this from `/words/{word}`: use `/descriptions/...` to search English meanings, but `/words/...` for Sanskrit noun forms.

### `GET /categories/{category}`
- Required path parameter:
  - `category` — one of the published noun categories
- Categories published in the official reference/OpenAPI pages:
  - Flora: `grass`, `plant`, `tree`
  - Fauna: `animal`, `bird`, `cattle`, `fish`, `insect`, `snake`, `worm`
  - Things: `building`, `chariot`, `food`, `grain`, `metal`, `object`, `ship`, `weapon`, `war`
  - Measurements: `number`, `distance`, `time`, `weight`
  - Geography: `mountain`, `place`, `river`
  - Knowledge: `astronomy`, `disease`, `literature`, `medicine`, `poison`, `subject`
  - Entertainment: `dicing`, `games`, `music`
  - Toilette: `clothing`, `hair`, `ornament`
  - Legal: `law`, `morals`
  - Societal: `agriculture`, `caste`, `family`, `occupation`, `priest`, `royalty`, `trade`, `tribe`
- The official docs also note that one noun can belong to more than one category.

## Auth and rate limits
- The reviewed official pages do not document any API key, OAuth flow, bearer token, or account requirement.
- The example requests only send `accept: application/json`.
- No published rate-limit, quota, billing, or retry policy was found in the reviewed official pages.

## Pagination, errors, and response notes
- No pagination parameters or cursor/page mechanics are documented.
- The reference page and OpenAPI sandbox describe one repeated response shape with these fields:
  - `nagari`
  - `word`
  - `description`
  - `category`
- `nagari` is the noun in Nagari script, while `word` is the transliterated Roman-script form.
- The OpenAPI `200` response description says successful matches return JSON, while unmatched queries return a plain-text message from the API app.
- A live fetch of the official example-style route `GET https://indica-1hwj.onrender.com/vs/v2/words/ash` returned a JSON array with 109 rows, matching the documented schema.

## Important usage notes
- The official docs describe this as a definitions API for nouns from Vedic literature, not a general Sanskrit dictionary.
- Proper nouns are explicitly excluded from the collection.
- `/words/{word}` and `/descriptions/{description}` search different fields and should not be treated as synonyms.
- The provider now documents this API from the live Indica root and topic pages even though the older indexed `html/vs.html` page is gone.

## fireROUTE notes
- Treat the provider as manually documented from the current Indica root plus the live reference/OpenAPI pages, not from the stale `html/vs.html` path.
- Preserve the distinction between noun-form search and meaning-text search in route descriptions.
- Expose category values exactly as published because the API uses category names directly in the path.