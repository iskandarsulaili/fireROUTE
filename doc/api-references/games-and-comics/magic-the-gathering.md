# Magic The Gathering

## Overview
- Provider: Magic The Gathering
- Category: Games & Comics
- Indexed official docs URL: `http://magicthegathering.io/`
- Official successor docs inspected: `https://scrydex.com/docs/magicthegathering/cards`
- Current official API base URL: `https://api.scrydex.com/magicthegathering/v1`
- Confirmed routes: `4`
- Manual status: `manually_documented`
- Auth: Scrydex documents `X-Api-Key` and `X-Team-ID` headers; requests without auth headers proceed with heavily reduced rate limits
- HTTPS: yes
- Response format: JSON

## Migration note
- The indexed legacy homepage now shows only a migration notice: `The Magic The Gathering API is now part of Scrydex - a suite of TCG developer APIs.`
- The successor docs linked from that official page provide the currently documented Magic: The Gathering API surface.

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/cards/{id}` | path `id` = card identifier; query `select`, `casing`, `include` | Retrieves one Magic card by unique identifier. `include` explicitly documents `prices`. |
| GET | `/cards` | query `q`, `page`, `page_size`/`pageSize`, `select`, `include`, `orderBy` | Global paginated card search/list route. `q` uses Lucene-like search syntax. |
| GET | `/expansions/{expansionId}/cards` | path `expansionId` = expansion identifier shown in docs examples as `BLB`; same query parameters as `/cards` | Expansion-scoped paginated card search route documented on the cards page. |
| GET | `/cards/{id}/price_history` | path `id`; query `days`, `start_date`, `end_date`, `variant`, `condition`, `company`, `grade`, `is_perfect`, `is_error`, `is_signed`, `page`, `page_size` | Returns historical price points for one card. |

## Authentication and access
- Scrydex's authentication guide says API access requires:
  - a Scrydex account and plan
  - a team ID
  - an API key
- Authenticated requests send:
  - `X-Api-Key`
  - `X-Team-ID`
- The docs say all API requests must be made over HTTPS.
- The docs also say requests made without authentication headers still proceed, but with heavily reduced rate limits.

## Query and filter behavior
### `GET /cards/{id}`
- Documented path parameter:
  - `id` = unique identifier of the card to retrieve
- Documented query parameters:
  - `select` = comma-separated fields to return
  - `casing` = response field naming style; supported values: `camel`, `snake`
  - `include` = additional related resources; the inspected docs explicitly list `prices`

### `GET /cards` and `GET /expansions/{expansionId}/cards`
- The docs describe both routes as sharing the same search logic.
- Documented query parameters:
  - `q` = Lucene-like search query
  - `page` = page number, default `1`
  - `page_size` / `pageSize` = page size, default `100`, max `100`
  - `select` = comma-delimited field selection
  - `include` = opt-in related data such as prices
  - `orderBy` = sort expression; docs examples include `orderBy=mana_value` and `orderBy=name,-power`
- The docs explicitly say snake_case and camelCase query names are both accepted.

### Search-query notes from the official cards docs
- Keyword search examples:
  - `name:jace`
  - `name:"jace, the mind sculptor"`
- Boolean examples:
  - `name:jace types:Planeswalker`
  - `name:jace (colors:U OR colors:W)`
- Exclusion example:
  - `types:Creature -colors:B`
- Wildcard example:
  - `name:zur*`
- Exact-match example:
  - `!name:"Zurgo Helmsmasher"`
- Numeric range examples:
  - `mana_value:[1 TO 3]`
  - `power:[* TO 5]`
  - `toughness:[7 TO *]`
- Nested-field example:
  - `expansion.id:BLB`

### `GET /cards/{id}/price_history`
- Documented query parameters:
  - `days`
  - `start_date` in `YYYY-MM-DD`
  - `end_date` in `YYYY-MM-DD`
  - `variant`
  - `condition`
  - `company`
  - `grade`
  - `is_perfect`
  - `is_error`
  - `is_signed`
  - `page`
  - `page_size`

## Response format notes
- The Magic docs are JSON-focused throughout.
- The inspected search response example shows this top-level envelope:
  - `status`
  - `data`
  - `page`
  - `pageSize`
  - `totalCount`
- The price-history docs describe a paginated object containing:
  - `data[]`
  - `page`
  - `page_size`
  - `count`
  - `total_count`
- The card-object docs manually enumerate major card fields including:
  - identity and naming fields such as `id`, `name`, `flavor_name`
  - gameplay fields such as `types`, `subtypes`, `colors`, `mana_cost`, `mana_value`, `power`, `toughness`, `loyalty`, `rules`, `keywords`
  - media and variant fields such as `images[]`, `variants[]`
  - metadata objects such as `expansion`, `language`, `legalities`, and `identifiers`

## Pagination, rate limits, and usage accounting
- `/cards` and `/expansions/{expansionId}/cards` are explicitly documented as paginated.
- `page_size` / `pageSize` defaults to `100` and is capped at `100` on the cards search routes.
- The price-history route is also paginated via `page` and `page_size`.
- Scrydex's rate-limit guide documents:
  - credit-based usage tied to plan limits
  - a global per-second limit of `100 requests per second`
  - HTTP `429 Too Many Requests` when the per-second limit is exceeded
- The same guide says usage can be monitored via `GET https://api.scrydex.com/account/v1/usage`, updated every `20-30 minutes`.
- The inspected Magic docs do not publish per-route credit costs.

## Errors and failure behavior
- The rate-limit guide explicitly documents HTTP `429 Too Many Requests` when the `100 requests per second` limit is exceeded.
- The authentication guide says HTTP requests will fail or redirect to HTTPS automatically.
- The inspected Magic-specific pages do not publish a broader structured error schema or status-code matrix.

## Important usage notes
- The legacy `magicthegathering.io` site now serves as a migration notice, so the actively documented API contract lives on Scrydex.
- `include` is opt-in; prices are specifically called out as additional data rather than default response content.
- `select` and `orderBy` are the primary payload-size and ordering controls exposed on the cards search endpoints.
- The docs recommend paginating results, limiting returned fields, and avoiding unnecessarily expensive wildcard or range queries.
- Magic-specific webhook event payloads are documented on `https://scrydex.com/docs/magicthegathering/webhooks`, but the inspected page did not document a Magic-specific webhook-management route path, so webhook subscription management is not counted in the confirmed route total.

## Integration notes for fireROUTE
- Treat this provider as the current officially documented Scrydex-backed Magic API, reached from the legacy homepage's migration notice.
- Model the confirmed public Magic route surface as `4` read endpoints.
- Require callers to support header-based auth with `X-Api-Key` and `X-Team-ID`, while noting the docs say unauthenticated requests may still proceed at reduced limits.
- Preserve both camelCase and snake_case query-name compatibility on the search routes.
- Do not invent undocumented mutation routes, webhook-management routes, or per-route credit costs.

## Sources inspected
- `https://magicthegathering.io/`
- `https://scrydex.com/docs`
- `https://scrydex.com/docs/getting-started/authentication`
- `https://scrydex.com/docs/getting-started/rate-limits`
- `https://scrydex.com/docs/magicthegathering/cards`
- `https://scrydex.com/docs/magicthegathering/price-history`
- `https://scrydex.com/docs/magicthegathering/webhooks`
