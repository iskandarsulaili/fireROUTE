# FunTranslations

## Overview
- Provider: Fun Translations Translation APIs
- Category: Games & Comics
- Shard: `fireROUTE-SHARD::games-and-comics::6`
- Official docs: `https://funtranslations.com/api/`
- Official API host checked: `https://api.funtranslations.com/`
- Base URL: `https://api.funtranslations.com/translate`
- Auth: API key via `Authorization: Bearer YOUR_API_KEY`
- HTTPS: yes
- Response format: JSON
- Pagination: none on translation routes; the docs catalog itself is paginated
- Rate limits: paid plans documented as `1000` calls/day on Starter, `5000` calls/day on Premium, and `12500` calls/day on Ultra; the FAQ also says a separate public free tier exists with limited calls/day
- Confirmed direct API routes: `77`

## Common request contract
All confirmed translator routes use the same request shape on the inspected docs pages:
- Method: `POST`
- Path pattern: `/{translatorSlug}` under `https://api.funtranslations.com/translate`
- Headers:
  - `Authorization: Bearer YOUR_API_KEY`
  - `Content-Type: application/json`
- JSON body:
  - `text` — string, the text to translate

Representative official example:
```json
{
  "text": "Hello, how are you?"
}
```

## Confirmed endpoints
Every route below is documented as `POST https://api.funtranslations.com/translate/{slug}` and accepts the same `text` JSON field.

### Standalone translator pages found in the paginated API catalog
- Catalog page 1: `/yodish`, `/parseltongue`, `/shakespeare-english`, `/r2d2`, `/skroth`, `/star-wars-huttese-language`, `/asshai`, `/morse-code`, `/kryptonian`, `/pirate-speak`, `/valspeak`, `/minions-speak`
- Catalog page 2: `/ferb-latin`, `/pig-latin`, `/dothraki`, `/valyrian`, `/hodor`, `/sindarin`, `/quenya`, `/orcish`, `/star-wars-sith-language`, `/star-wars-cheunh-language`, `/star-wars-gungan-language`, `/star-wars-mandalorian-language`
- Catalog page 3: `/chef-speak`, `/catalan`, `/old-english`, `/vulcan`, `/klingon`, `/romulan`, `/dovahzul`, `/thuum`, `/aldmeris`, `/groot`, `/jive`, `/ebonics`
- Catalog page 4: `/dolan`, `/elmer-fudd-speak`, `/kraut`, `/wow-world`, `/cockney-londoner-accent`, `/norfolk-dialect`, `/morse2english`, `/us-2-uk-english`, `/uk-2-us-english`, `/leet-speak`, `/brooklyn`, `/ermahgerd`
- Catalog page 5: `/australian`, `/boston`, `/austrian`, `/article-rewriter`, `/braille`, `/numbers`, `/emoji`, `/doge`, `/navi`
- Catalog page 6: `/southern-accent`, `/ubbi-dubbi`, `/inflationary-english`, `/george-bush-dubya`, `/postmordern`, `/ayleidoon`, `/redneck`, `/roman-numeral`, `/asian-accent`, `/russian-accent`

### Additional translator slugs confirmed only from collection pages
These slugs were not exposed as unique standalone catalog pages in the paginated listing, but the official collection pages gave direct `https://api.funtranslations.com/translate/{slug}` examples for them:
- Star Wars collection: `/ewokese`, `/jawaese`, `/star-wars-aqualish-language`, `/stormtrooper`
- Game of Thrones collection: `/lhazareen`
- Star Trek collection: `/cardassian-kardasi`, `/tamarian`
- Elvish collection: `/tel-quessir`
- Elder Scrolls collection: `/jel`, `/tamrielic`

## Collection-page notes
The following official pages are product or bundle pages, not separate API routes:
- `https://funtranslations.com/api/collections/star-wars`
- `https://funtranslations.com/api/collections/game-of-thrones`
- `https://funtranslations.com/api/collections/star-trek`
- `https://funtranslations.com/api/collections/elvish`
- `https://funtranslations.com/api/collections/elder-scrolls`

Each inspected collection page explicitly says to use the standard `https://api.funtranslations.com/translate/{slug}` endpoint and swap in one of the included translator slugs, so these collection URLs should not be modeled as fireROUTE endpoints.

## Response format
The inspected translator page documents JSON responses and shows this example shape:
```json
{
  "success": {
    "total": 1
  },
  "contents": {
    "translated": "< translated text >",
    "text": "Master Obiwan has lost a planet.",
    "translation": "yodish"
  }
}
```

Observed documented fields:
- `success.total`
- `contents.translated`
- `contents.text`
- `contents.translation`

## Authentication and rate limits
- Official FAQ text says authentication is API-key based and must be sent in `Authorization: Bearer YOUR_API_KEY`.
- Official FAQ text says paid-plan quotas are:
  - Starter: `1000` API calls/day
  - Premium: `5000` API calls/day
  - Ultra: `12500` API calls/day
- The same FAQ says there is no free trial, but a separate public free tier exists with limited calls per day.
- The inspected catalog also labels the service as a RESTful JSON API with API-key auth.

## Pagination
- Translation endpoints themselves do not document pagination.
- Only the human-facing documentation catalog is paginated (`12`, `24`, or `48` products per page).
- fireROUTE should treat the translation API as a set of independent single-request POST routes rather than a paginated resource API.

## Errors
- The inspected docs pages do not publish a formal HTTP status table or JSON error schema.
- During this pass, direct browser access to `https://api.funtranslations.com/` hit a Cloudflare block page, so live unauthenticated API error responses could not be manually inspected from the browser.
- Because of that, error handling should be treated as undocumented beyond standard HTTP failure expectations.

## Important usage notes
- The public catalog advertises `100` APIs, but manual inspection of catalog pages `1` through `9` exposed repeated product pages on later pages rather than `100` unique route docs.
- Manual extraction from the official catalog pages yielded `72` unique documentation/product URLs, of which `5` were collection bundle pages and `67` were direct translator-product pages.
- Manual inspection of the five official collection pages revealed `10` additional direct translator slugs not surfaced as standalone catalog pages, bringing the confirmed direct translation-route total to `77`.
- The route contract appears intentionally uniform across translators: same host, same `POST` method, same bearer-token auth, same `text` field, same JSON response envelope.
- The docs page for Yoda provides the clearest representative contract and matches the collection-page examples.

## Sources inspected
- `https://api.funtranslations.com/`
- `https://funtranslations.com/api/`
- `https://funtranslations.com/api?page=2`
- `https://funtranslations.com/api?page=3`
- `https://funtranslations.com/api?page=4`
- `https://funtranslations.com/api?page=5`
- `https://funtranslations.com/api?page=6`
- `https://funtranslations.com/api?page=7`
- `https://funtranslations.com/api?page=8`
- `https://funtranslations.com/api?page=9`
- `https://funtranslations.com/api/yodish`
- `https://funtranslations.com/api/collections/star-wars`
- `https://funtranslations.com/api/collections/game-of-thrones`
- `https://funtranslations.com/api/collections/star-trek`
- `https://funtranslations.com/api/collections/elvish`
- `https://funtranslations.com/api/collections/elder-scrolls`
