# xkcd

## Overview
- Provider: xkcd JSON interface
- Category: Games & Comics
- Official docs: `https://xkcd.com/json.html`
- Base URL: `https://xkcd.com`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: none documented
- Rate limits: no numeric rate limit documented on the official page

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/info.0.json` | none | Returns metadata for the current/latest comic. |
| GET | `/{comicNumber}/info.0.json` | `comicNumber` path | Returns metadata for a specific numbered comic. |

## Response format
The official `json.html` page states that the JSON files contain comic titles, URLs, post dates, transcripts when available, and other metadata.

Observed fields from the current-comic and comic-614 JSON responses:
- `month`
- `num`
- `link`
- `year`
- `news`
- `safe_title`
- `transcript`
- `alt`
- `img`
- `title`
- `day`

## Usage notes
- The docs page explicitly presents `/info.0.json` as the current comic route and `/{comicNumber}/info.0.json` as the general pattern for numbered comics.
- The `img` field points to the comic image hosted on `https://imgs.xkcd.com/`.
- `transcript` may be empty for some comics.
- The service is read-only; no write/update routes are documented.

## Error handling
- The official JSON interface page does not publish a formal error schema.
- No authentication or quota failure model is documented.
- Missing comic numbers should be handled as ordinary HTTP failures rather than expecting a structured JSON error contract.

## Integration notes for fireROUTE
- Model this provider as a two-route read-only JSON API.
- Keep `comicNumber` as a path variable rather than a query parameter.
- Do not treat image URLs under `imgs.xkcd.com` as primary API routes; they are asset URLs returned by the JSON interface.

## Sources inspected
- `https://xkcd.com/json.html`
- `https://xkcd.com/info.0.json`
- `https://xkcd.com/614/info.0.json`
