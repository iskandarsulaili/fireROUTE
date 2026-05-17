# Scryfall

## Overview
- Provider: Scryfall API
- Category: Games & Comics
- Official docs: `https://scryfall.com/docs/api`
- Base URL: `https://api.scryfall.com`
- Auth: no API key required
- HTTPS: required; plaintext HTTP is not honored
- CORS: supported for `GET`, `HEAD`, `POST`, and `OPTIONS` when the request includes a matching `Origin` header
- Required headers: `User-Agent` and `Accept`
- Primary formats: `json`; selected methods also support `csv`, `text`, `image`, or `file`
- Confirmed routes: `48`

## Confirmed endpoints

| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/cards/search` | `q`, `unique`, `order`, `dir`, `include_extras`, `include_multilingual`, `include_variations`, `page`, `format`, `pretty` | Full-text card search; paginated 175 cards per page; supports `json` and `csv`. |
| GET | `/cards/named` | `exact` or `fuzzy`, optional `set`, `format`, `face`, `version`, `pretty` | Name lookup; supports `json`, `text`, and `image`. |
| GET | `/cards/autocomplete` | query-driven card-name completion | Card-name suggestions route listed in official docs navigation. |
| GET | `/cards/random` | optional `q`, `format`, `face`, `version`, `pretty` | Returns one random card; supports `json`, `text`, and `image`. |
| POST | `/cards/collection` | JSON body `identifiers[]`, optional `pretty` | Bulk lookup for up to 75 identifiers; requires `Content-Type: application/json`. |
| GET | `/cards/:code/:number(/:lang)` | set `code`, collector `number`, optional `lang` | Fetch a card by set code and collector number. |
| GET | `/cards/multiverse/:id` | `id` path | Fetch by Gatherer multiverse id. |
| GET | `/cards/mtgo/:id` | `id` path | Fetch by MTGO id. |
| GET | `/cards/arena/:id` | `id` path | Fetch by Arena id. |
| GET | `/cards/tcgplayer/:id` | `id` path | Fetch by TCGplayer product id. |
| GET | `/cards/cardmarket/:id` | `id` path | Fetch by Cardmarket id. |
| GET | `/cards/:id` | Scryfall card UUID | Direct card lookup by Scryfall id. |
| GET | `/cards/multiverse/:id/rulings` | `id` path | Rulings by multiverse id. |
| GET | `/cards/mtgo/:id/rulings` | `id` path | Rulings by MTGO id. |
| GET | `/cards/arena/:id/rulings` | `id` path | Rulings by Arena id. |
| GET | `/cards/:code/:number/rulings` | set `code`, collector `number` | Rulings by set code and collector number. |
| GET | `/cards/:id/rulings` | Scryfall card UUID | Rulings by Scryfall id. |
| GET | `/sets` | none | List set objects. |
| GET | `/sets/:code` | set `code` | Set lookup by code. |
| GET | `/sets/tcgplayer/:id` | TCGplayer group id | Set lookup by TCGplayer id. |
| GET | `/sets/:id` | Scryfall set UUID | Direct set lookup by Scryfall id. |
| GET | `/symbology` | none | Retrieve card-symbol definitions. |
| GET | `/symbology/parse-mana` | `cost`, optional `format`, `pretty` | Parses mana-cost shorthand; only `json` is supported. |
| GET | `/catalog/card-names` | none | Catalog endpoint. |
| GET | `/catalog/artist-names` | none | Catalog endpoint. |
| GET | `/catalog/word-bank` | none | Catalog endpoint. |
| GET | `/catalog/supertypes` | none | Catalog endpoint. |
| GET | `/catalog/card-types` | none | Catalog endpoint. |
| GET | `/catalog/artifact-types` | none | Catalog endpoint. |
| GET | `/catalog/battle-types` | none | Catalog endpoint. |
| GET | `/catalog/creature-types` | none | Catalog endpoint. |
| GET | `/catalog/enchantment-types` | none | Catalog endpoint. |
| GET | `/catalog/land-types` | none | Catalog endpoint. |
| GET | `/catalog/planeswalker-types` | none | Catalog endpoint. |
| GET | `/catalog/spell-types` | none | Catalog endpoint. |
| GET | `/catalog/powers` | none | Catalog endpoint. |
| GET | `/catalog/toughnesses` | none | Catalog endpoint. |
| GET | `/catalog/loyalties` | none | Catalog endpoint. |
| GET | `/catalog/keyword-abilities` | none | Catalog endpoint. |
| GET | `/catalog/keyword-actions` | none | Catalog endpoint. |
| GET | `/catalog/ability-words` | none | Catalog endpoint. |
| GET | `/catalog/flavor-words` | none | Catalog endpoint. |
| GET | `/catalog/watermarks` | none | Catalog endpoint. |
| GET | `/bulk-data` | none | Lists available bulk data files. |
| GET | `/bulk-data/:id` | bulk-data UUID | Fetch one bulk-data descriptor by id. |
| GET | `/bulk-data/:type` | bulk-data type | Fetch one bulk-data descriptor by type. |
| GET | `/migrations` | `page` supported per example | Lists recent card migrations. |
| GET | `/migrations/:id` | migration UUID | Fetch one migration record. |

## Parameters and behavior confirmed from docs
- `GET /cards/search`
  - `q` is required and limited to 1000 Unicode characters.
  - `page` defaults to `1`.
  - Docs explicitly state the method is paginated at 175 cards per page.
- `GET /cards/named`
  - Use either `exact` or `fuzzy`.
  - Optional `set` constrains the printed card result to one set.
  - `face=back` is only valid for two-faced cards when using `image` format; otherwise Scryfall returns `422`.
- `GET /cards/random`
  - Optional `q` filters the random pool before selection.
- `POST /cards/collection`
  - Accepts JSON body field `identifiers`.
  - Up to 75 card references per request.
  - Identifier schemas documented: `id`, `mtgo_id`, `multiverse_id`, `oracle_id`, `illustration_id`, `name`, `name+set`, and `collector_number+set`.
- `GET /symbology/parse-mana`
  - Required `cost` query.
  - Returns normalized mana notation, mana value, color information, and boolean color flags.

## Pagination, errors, and formats
- List responses use a standard List object with:
  - `data`
  - `has_more`
  - `next_page`
  - optional `total_cards`
  - optional `warnings`
- Error responses use a standard Error object with:
  - `status`
  - `code`
  - `details`
  - optional `type`
  - optional `warnings`
- Request-format documentation confirms:
  - `json` is the default format.
  - Some methods support `csv`, `text`, `image`, or `file`.
  - `image` and `file` formats return `HTTP 302` redirects.
  - `image` format accepts `version` values `small`, `normal`, `large`, `png`, `art_crop`, and `border_crop`.
  - CSV responses include headers such as `X-Scryfall-Has-More` and `X-Scryfall-Next-Page`.

## Rate limits and usage notes
- Hard rate limits from the official docs:
  - `/cards/search` — `2/second (500ms)`
  - `/cards/named` — `2/second (500ms)`
  - `/cards/random` — `2/second (500ms)`
  - `/cards/collection` — `2/second (500ms)`
  - all other API methods — `10/second (100ms)`
- Excess requests return `HTTP 429 Too Many Requests`.
- Receiving `429` causes a `30` second access limitation; continued overload can trigger a temporary or permanent application ban.
- Scryfall explicitly recommends caching downloaded data for at least 24 hours and using bulk data for large-scale lookups.
- Direct file origins under `*.scryfall.io` do not have rate limits.

## CORS / CSP notes
- `api.scryfall.com` and Scryfall image origins send CORS headers for `GET`, `HEAD`, `POST`, and `OPTIONS`.
- To receive CORS headers, requests must include a correct `Origin` header matching the current page origin; `Referer` or URL parameters do not substitute for this.
- For CSP, the docs recommend allowlisting `*.scryfall.com`; the detailed example also lists `api.scryfall.com`, `embed.scryfall.com`, and `*.scryfall.io`.

## Integration notes for fireROUTE
- Always send a descriptive `User-Agent` and explicit `Accept` header.
- Treat `/cards/collection` as a POST-only bulk lookup helper, not a generic search substitute.
- Use bulk-data endpoints for large sync jobs instead of hammering card-search endpoints.
- Preserve Scryfall-specific format options (`text`, `image`, `csv`, `file`) behind raw passthrough support where useful.
- For browser-based integrations, respect Scryfall’s CORS and CSP requirements rather than assuming wildcard browser access.

## Sources inspected
- `https://scryfall.com/docs/api`
- `https://scryfall.com/docs/api/request-formats`
- `https://scryfall.com/docs/api/rate-limits`
- `https://scryfall.com/docs/api/http-concerns`
- `https://scryfall.com/docs/api/errors`
- `https://scryfall.com/docs/api/cards/search`
- `https://scryfall.com/docs/api/cards/named`
- `https://scryfall.com/docs/api/cards/random`
- `https://scryfall.com/docs/api/cards/collection`
- `https://scryfall.com/docs/api/card-symbols`
- `https://scryfall.com/docs/api/card-symbols/parse-mana`
- `https://scryfall.com/docs/api/bulk-data`
- `https://scryfall.com/docs/api/migrations`
