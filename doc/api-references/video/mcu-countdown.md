# MCU Countdown

## Provider metadata
- Category: `Video`
- Provider slug: `mcu-countdown`
- Official docs pages used:
  - `https://github.com/DiljotSG/MCU-Countdown`
  - `https://github.com/DiljotSG/MCU-Countdown/blob/main/docs/API.md`
- Main site base URL: `https://www.whenisthenextmcufilm.com`
- JSON API base URL: `https://www.whenisthenextmcufilm.com/api`
- Auth model: none
- Supported request method: `GET`
- Response formats documented: `JSON` on `/api`, `HTML` on named countdown routes
- Manually confirmed route count: `5`

## Authentication
- The official docs present the countdown as a public read-only API.
- No API key, bearer token, or OAuth flow is documented.

## Canonical endpoints

### 1) Default MCU countdown page
- Method: `GET`
- Path: `/`
- Purpose: render the Marvel Cinematic Universe countdown page as HTML

Query parameters:
- `date` - optional ISO date `YYYY-MM-DD`; the docs say named routes can be used with `?date=`

### 2) Star Wars countdown page
- Method: `GET`
- Path: `/star-wars`
- Purpose: render the Star Wars countdown page as HTML

Query parameters:
- `date` - optional ISO date `YYYY-MM-DD`

### 3) DC Universe countdown page
- Method: `GET`
- Path: `/dc`
- Purpose: render the DC Universe countdown page as HTML

Query parameters:
- `date` - optional ISO date `YYYY-MM-DD`

### 4) Batman universe countdown page
- Method: `GET`
- Path: `/batman`
- Purpose: render the Matt Reeves Batman universe countdown page as HTML

Query parameters:
- `date` - optional ISO date `YYYY-MM-DD`

### 5) Countdown API
- Method: `GET`
- Path: `/api`
- Purpose: return JSON describing the next production from a TMDB list

Query parameters:
- `date` - optional ISO-formatted date `YYYY-MM-DD`; finds the next production after that date; defaults to today
- `list_id` - optional TMDB list ID; defaults to the MCU list `140624`

Documented response fields:
- `id`
- `days_until`
- `overview`
- `poster_url`
- `release_date`
- `title`
- `type`
- `following_production` with the same nested fields for the next item

## Usage notes
- Named routes are convenience routes for popular lists.
- Named routes do **not** accept `list_id`; the docs explicitly say they always use their predefined list.
- Named routes return HTML only.
- For JSON with arbitrary TMDB lists, the docs direct clients to `/api?list_id=X`.

## Caching, pagination, and rate limits
- No pagination is documented; the API returns only the next production plus one `following_production` object.
- The docs say all endpoints include `Cache-Control: public, max-age=3600`.
- The docs say TMDB responses are cached in memory for one hour by default.
- The docs say this API is subject to TMDB's rate limits; no separate numeric fireROUTE-facing limit is published.

## Error/format notes
- The reviewed docs provide a JSON success example for `/api` but do not publish a structured error schema.
- `/api` is the only JSON endpoint documented on the API page reviewed.

## fireROUTE normalization notes
- Treat `/api` as the machine-consumable route and the named routes as human-facing HTML pages.
- `list_id` should remain a provider-specific escape hatch for arbitrary TMDB lists.
- `following_production` is a meaningful nested relation and should be preserved instead of flattened away.
