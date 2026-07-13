# Open Data

Free and public data APIs for PAW content reference injection. These providers offer public domain facts, historical data, scientific information, and cultural knowledge — all 100% legally safe for in-game references.

## Provider Inventory

| Provider | Slug | Auth | Free Tier | Routes | Use Case |
|----------|------|------|-----------|--------|----------|
| Wikipedia | `wikipedia` | none | Unlimited | 2 | Encyclopedia articles, search, random pages |
| Wikidata | `wikidata` | none | Unlimited | 1 | Structured entity data, SPARQL queries |
| Wikimedia Commons | `wikimedia-commons` | none | Unlimited | 1 | Free media/images search |
| Archive.org | `archive-org` | none | Unlimited | 8 | Public domain books, media, Wayback Machine |
| Nobel Prize | `nobel-prize` | none | Unlimited | 4 | Nobel laureates, prizes, history |
| Universities List | `universities-list` | none | Unlimited | 2 | University names, countries, domains |
| French Address Search | `french-address-search` | none | 50 calls/sec | 15 | French address geocoding (public data) |
| Microlink.io | `microlink-io` | none | 50 req | 1 | URL metadata extraction, link previews |
| LinkPreview | `linkpreview` | api_key | 60 req/hr | 2 | URL previews (title, description, image) |
| Black History Facts | `black-history-facts` | api_key | Free tier | 6 | Black history facts database |
| BotsArchive | `botsarchive` | none | Free | 2 | Bot/automation archive data |
| Callook.info | `callook-info` | none | Free | 4 | US amateur radio callsign lookup |
| College ScoreCard | `collegescorecard-ed-gov` | api_key | 1,000 req/hr | 1 | US college data and statistics |
| Enigma Public | `enigma-public` | api_key | Free tier | 1 | Public government data |
| GENESIS | `genesis` | basic | Free (GAST) | 51 | German Federal Statistics Office data |
| Joshua Project | `joshua-project` | api_key | Free tier | 13 | World people groups data |
| Kaggle | `kaggle` | api_key | Free tier | 5 | Datasets, competitions, notebooks |
| Lowy Asia Power Index | `lowy-asia-power-index` | none | Free | 4 | Asia power index data |
| Nasdaq Data Link | `nasdaq-data-link` | api_key | Free tier | 29 | Financial and economic data |
| Open Data Minneapolis | `open-data-minneapolis` | none | Free | 16 | Minneapolis open data portal |
| openAFRICA | `openafrica` | none | Free | 8 | African open data portal |
| OpenCorporates | `opencorporates` | api_key | Free tier | 17 | Company registry data |
| OpenSanctions | `opensanctions` | none | Free | 5 | Sanctions and watchlist data |
| Recreation Info DB | `recreation-information-database` | api_key | Free tier | 62 | US recreation areas, facilities, permits |
| Socrata | `socrata` | api_key | Free (app token) | 5 | Government open data platform (SODA API) |
| UPC Database | `upc-database` | api_key | Free tier | 10 | Product barcode/UPC lookup |
| Urban Observatory | `urban-observatory` | none | Free | 10 | Urban environment sensor data |
| Voidly | `voidly` | none | Unlimited (public) | 50 | Internet censorship data, public routes |
| Umeå Open Data | `ume-open-data` | none | Free | 16 | Umeå municipality open data |
| University of Oslo | `university-of-oslo` | none | Free | 16 | UiO open data portal |
| Yelp | `yelp` | api_key | Free tier | 17 | Business listings, reviews, search |
| CARTO | `carto` | oauth | Free tier | 50 | Geospatial data platform |
| AcreLens | `acrelens` | api_key | Free tier | 8 | US property land analysis |
| Scoop.it | `scoop-it` | oauth | Free tier | 24 | Content curation platform |
| ModelPartFinder Error Codes | `modelpartfinder-error-codes` | none | Free | 2 | Error code lookup |
| Onyx Bazaar | `onyx-bazaar` | none | Free | 1 | Marketplace data |
| PeakMetrics | `peakmetrics` | blocked | — | 0 | Blocked — no public API |
| Teleport | `teleport` | blocked | — | 0 | Blocked — no public API |
| 18F | `18f` | dead | — | 0 | Dead — site no longer published |
| API Setu | `api-setu` | marketplace | — | 0 | Marketplace — no single API surface |

## Auth Types

| Auth Type | Meaning | Examples |
|-----------|---------|---------|
| `none` | No authentication required | Wikipedia, Nobel Prize, Archive.org |
| `api_key` | API key required (query param or header) | Black History Facts, College ScoreCard |
| `basic` | Username/password (often free registration) | GENESIS (GAST/GAST guest) |
| `oauth` | OAuth 2.0 token required | CARTO, Scoop.it |
| `blocked` | No public API available | PeakMetrics, Teleport |
| `dead` | Service no longer available | 18F |

## Usage

All providers are accessed through the unified `/v1/execute` endpoint:

```json
POST /v1/execute
{
  "category": "open-data",
  "path": "/w/rest.php/v1/page/Earth",
  "method": "GET",
  "params": {}
}
```

For providers requiring API keys, configure them in the provider's `authConfig` in the database.

## Safety

All data from these APIs is public domain, freely licensed, or used under free tier terms. Content is used for:
- Public domain facts (history, science, geography)
- Mythology and folklore (Greek, Norse, Egyptian, etc.)
- Classical literature and philosophy
- Natural world information
- Government and civic data
- Academic and research data

No copyrighted fictional characters, trademarked brands, or proprietary entertainment content is used.
