# Yu-Gi-Oh!

## Overview
- Provider: Yu-Gi-Oh! API by YGOPRODeck
- Category: Games & Comics
- Official docs: `https://ygoprodeck.com/api-guide/`
- Base URL: `https://db.ygoprodeck.com/api/v7`
- Auth: none documented
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `6`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v7/cardinfo.php` | query filters including `name`, `fname`, `id`, `konami_id`, `type`, `atk`, `def`, `level`, `race`, `attribute`, `link`, `linkmarker`, `scale`, `cardset`, `archetype`, `banlist`, `sort`, `format`, `misc`, `staple`, `has_effect`, `startdate`, `enddate`, `dateregion`, `num`, `offset`, `language`, `tcgplayer_data` | Primary lookup/search endpoint. Docs say this is the only endpoint now needed for most card access. Live check with `name=Dark Magician` returned `200`. |
| GET | `/api/v7/randomcard.php` | no GET parameters allowed | Returns one random card. Docs say cache control is disabled so it should always be fresh. Live check returned `200`. |
| GET | `/api/v7/cardsets.php` | no GET parameters allowed | Returns all stored card-set names with set metadata. Live check returned `200`. |
| GET | `/api/v7/cardsetsinfo.php` | required query `setcode` | Returns cards belonging to a specific set code. Live check with `setcode=SDY-046` returned `200`. |
| GET | `/api/v7/archetypes.php` | no GET parameters allowed | Returns all stored archetype names sorted A-Z. Live check returned `200`. |
| GET | `/api/v7/checkDBVer.php` | no GET parameters allowed | Returns current database version and last update timestamp. Live check returned `200`. |

## Authentication
- The official guide does not document API keys, OAuth, or any other authentication mechanism.
- All reviewed endpoints are publicly documented as GET endpoints.

## Endpoint details and important parameters
- `GET /api/v7/cardinfo.php`
  - Exact-match lookup: `name`
  - Fuzzy name search: `fname`
  - Passcode lookup: `id` (can be comma-separated for multiple IDs)
  - Alternate identifier: `konami_id`
  - Filters: `type`, `atk`, `def`, `level`, `race`, `attribute`, `link`, `linkmarker`, `scale`, `cardset`, `archetype`, `banlist`, `format`, `staple`, `has_effect`
  - Date filters: `startdate`, `enddate`, `dateregion` (`tcg` default or `ocg`)
  - Pagination/sizing: `num`, `offset`
  - Extras: `misc=yes` to include additional response fields, `tcgplayer_data` to swap set data source, `sort`, `language`
  - Numeric comparison syntax for `atk`, `def`, and `level`: `lt`, `lte`, `gt`, `gte`
- `GET /api/v7/cardsetsinfo.php`
  - Requires `setcode`
  - Example from docs and live check: `SDY-046`
- Language support on `cardinfo.php` only:
  - `fr`, `de`, `it`, `pt`
  - English is default

## Pagination, caching, and rate limits
- Official rate limit: `20 requests per 1 second`.
- Official abuse consequence: exceeding the limit blocks the client IP for `1 hour`.
- `cardinfo.php` specific-result cache: `2 days (172800 seconds)`, manually cleared when new cards are entered.
- `randomcard.php`: docs say cache control is disabled so responses should be fresh.
- `checkDBVer.php`: docs say it is not cached.
- Paginated `cardinfo.php` responses can include a `meta` object with:
  - `current_rows`
  - `total_rows`
  - `rows_remaining`
  - `total_pages`
  - `pages_remaining`
  - `next_page`
  - `next_page_offset`

## Errors and validation notes
- Official docs say invalid values now return proper HTTP `400` errors instead of silently returning all cards.
- Live invalid-parameter check:
  - `GET /api/v7/cardinfo.php?type=Effect%20Monster&attribute=wood&num=2`
  - returned `400`
  - response body: `{"error":"Attribute value of wood is invalid. Please use a correct attribute value. Attribute accepts 'dark', 'earth', 'fire', 'light', 'water', 'wind' or 'divine' and is not case sensitive."}`
- Docs say these endpoints error if unexpected query parameters are present:
  - `/randomcard.php`
  - `/cardsets.php`
  - `/archetypes.php`
  - `/checkDBVer.php`
- Docs say `/cardsetsinfo.php` errors when `setcode` is missing or invalid.

## Response-format notes
- `cardinfo.php` returns `data[]`; optional sections include:
  - base card fields such as `id`, `name`, `type`, `frameType`, `desc`
  - monster fields such as `atk`, `def`, `level`, `race`, `attribute`
  - `card_sets[]`
  - `card_images[]`
  - `card_prices[]`
  - `banlist_info`
  - extra `misc=yes` fields like `beta_name`, `views`, `upvotes`, `formats`, `treated_as`, `tcg_date`, `ocg_date`, `konami_id`, `md_rarity`, `has_effect`, and `genesys_points` when relevant
- `cardsets.php` returns set summaries including `set_name`, `set_code`, `num_of_cards`, `tcg_date`, and `set_image`.
- `cardsetsinfo.php` returns card-in-set records including `id`, `name`, `set_name`, `set_code`, `set_rarity`, and `set_price`.
- `archetypes.php` returns archetype-name records.
- `checkDBVer.php` returned a JSON array with `database_version` and `last_update` during live verification.

## Important usage notes
- The docs explicitly warn clients to download and store pulled data locally to reduce API pressure.
- The docs separately warn not to hotlink card images directly from YGOPRODeck at high volume; clients should download and re-host images or risk IP blacklisting.
- Card images are served from `https://images.ygoprodeck.com/images/cards/`, `.../cards_small/`, and `.../cards_cropped/` using card IDs.
- Newly leaked Japanese cards may only be available in English until official translations exist.
- The guide labels this as API version `v7`; older versions are deprecated.

## Integration notes for fireROUTE
- Treat `cardinfo.php` as the canonical adapter surface for card lookup, search, filtering, and pagination.
- Preserve provider-specific filter semantics such as `banlist`, `format`, `linkmarker`, and equation-prefixed numeric filters rather than over-normalizing them.
- Cache card metadata aggressively on the fireROUTE side to respect the provider's anti-abuse posture.
- Mirror provider error text when filter validation fails because the upstream messages are specific and actionable.

## Sources inspected
- `https://ygoprodeck.com/api-guide/`
- live checks:
  - `https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Dark%20Magician`
  - `https://db.ygoprodeck.com/api/v7/randomcard.php`
  - `https://db.ygoprodeck.com/api/v7/cardsets.php`
  - `https://db.ygoprodeck.com/api/v7/cardsetsinfo.php?setcode=SDY-046`
  - `https://db.ygoprodeck.com/api/v7/archetypes.php`
  - `https://db.ygoprodeck.com/api/v7/checkDBVer.php`
  - `https://db.ygoprodeck.com/api/v7/cardinfo.php?type=Effect%20Monster&attribute=wood&num=2`
