# Ganjoor

Official pages manually reviewed:
- https://api.ganjoor.net
- https://api.ganjoor.net/index.html
- https://api.ganjoor.net/swagger/v1/swagger.json
- https://ganjoor.net/

## Overview
- Official API title exposed by the reviewed Swagger document: `RMuseum API`
- Swagger version shown on the reviewed docs: `v1`
- Base origin used by the reviewed docs: `https://api.ganjoor.net`
- Auth scheme exposed in the reviewed OpenAPI document: `Authorization` header with bearer-token format, modeled as an API-key header in the spec
- Response format: JSON for API operations; media/file routes also return binary assets such as images, audio, or XML files
- Important scope note: the reviewed Swagger is much broader than a simple poem lookup API. It covers Ganjoor literary data plus artifacts, recitations, user/session flows, moderation, translations, and other RMuseum platform features.

Manual route count confirmed from the reviewed official Swagger document: **471** method/path operations across **390** unique paths.

## Tag families confirmed in the official Swagger
| Tag | Operations |
|---|---:|
| Ganjoor | 202 |
| Artifact | 86 |
| Recitation | 40 |
| AppUser | 30 |
| FAQ | 14 |
| DonationAccounting | 13 |
| Numbering | 9 |
| Notification | 8 |
| RGenericOptions | 8 |
| Role | 8 |
| GanjoorPoetSuggestedPhotos | 7 |
| GanjoorPoetSuggestedSpecLines | 7 |
| GeoLocation | 5 |
| Image | 5 |
| SiteBanners | 5 |

## Key public literary/content endpoints confirmed
The full Swagger surface is very large; these are the primary content-facing families manually confirmed from the reviewed official spec.

### Poet and catalog discovery
| Method | Path | Notes |
|---|---|---|
| GET | `/api/ganjoor/poets` | Published poets without biographies |
| GET | `/api/ganjoor/centuries` | Poets grouped by centuries |
| GET | `/api/ganjoor/poet/{id}` | Poet by numeric ID |
| GET | `/api/ganjoor/poet` | Poet by URL |
| GET | `/api/ganjoor/books` | List books |
| GET | `/api/ganjoor/cat/{id}` | Category by ID |
| GET | `/api/ganjoor/cat` | Category by full URL |

### Poem retrieval and related material
| Method | Path | Notes |
|---|---|---|
| GET | `/api/ganjoor/poem/{id}` | Full poem by ID with optional expansions |
| GET | `/api/ganjoor/poem` | Poem by URL with optional expansions |
| GET | `/api/ganjoor/poem/{id}/verses` | Poem verses only |
| GET | `/api/ganjoor/poem/{id}/recitations` | Recitations for a poem |
| GET | `/api/ganjoor/poem/{id}/images` | Images for a poem |
| GET | `/api/ganjoor/poem/{id}/songs` | Songs for a poem |
| GET | `/api/ganjoor/poem/{id}/comments` | Poem comments |
| GET | `/api/ganjoor/section/{poemId}/{sectionIndex}/related` | Related items for a poem section |

### Search, analysis, and randomization
| Method | Path | Notes |
|---|---|---|
| GET | `/api/ganjoor/poems/search` | Text search |
| GET | `/api/ganjoor/poems/similar` | Similar poems by metre/rhyme and other filters |
| GET | `/api/ganjoor/rhythms` | Metre/rhythm list |
| GET | `/api/ganjoor/poem/analysisrhyme/{id}` | Poem rhyme analysis |
| GET | `/api/ganjoor/poem/analysisrhythm/{id}` | Poem prosody analysis |
| GET | `/api/ganjoor/hafez/faal` | Random Hafez poem |
| GET | `/api/ganjoor/poem/random` | Random poem, optionally scoped by poet |
| GET | `/api/ganjoor/sections/tagged/language` | Language-tagged sections |

### Poet images and media helpers
| Method | Path | Notes |
|---|---|---|
| GET | `/api/ganjoor/poet/image/{url}.png` | Poet image as PNG |
| GET | `/api/ganjoor/poet/image/{url}.gif` | Poet image as GIF |

### Public recitation routes
| Method | Path | Notes |
|---|---|---|
| GET | `/api/audio/published` | Paginated published recitations |
| GET | `/api/audio/published/{id}` | Published recitation by ID |
| GET | `/api/audio/published/rss` | Recent published recitations as RSS |
| GET | `/api/audio/file/{id}.mp3` | MP3 file for a narration |
| GET | `/api/audio/file/{id}.xml` | XML file for a recitation |
| GET | `/api/audio/xml/{id}` | XML contents for a narration |
| GET | `/api/audio/verses/{id}` | Verse-sync information |

### Public artifact routes
| Method | Path | Notes |
|---|---|---|
| GET | `/api/artifacts` | Published artifacts list |
| GET | `/api/artifacts/{friendlyUrl}` | One published artifact |
| GET | `/api/artifacts/{artifactUrl}/{itemUrl}` | One published artifact item |
| GET | `/api/artifacts/limited/{friendlyUrl}/{count}` | Artifact with limited images |
| GET | `/api/artifacts/itemsof/{id}/{start}/{count}` | Artifact items window |
| GET | `/api/artifacts/tagged/{tagUrl}/{valueUrl}` | Tagged artifact listing |
| GET | `/api/artifacts/{friendlyUrl}/filteritemsbytag/{tagFriendlyUrl}` | Filter artifact items by tag |
| GET | `/api/artifacts/{friendlyUrl}/filteritemsbytag/{tagFriendlyUrl}/{valueFriendlyUrl}` | Filter artifact items by tag/value |

## Confirmed parameters

### Common Ganjoor content parameters
From the reviewed Swagger, the major public-content routes use:
- `id`, `poemId`, `sectionIndex`, `poetId`, `catId`, `bookmarkId`, `artifactId`, `friendlyUrl`, `itemUrl`, `tagFriendlyUrl`, `valueFriendlyUrl` as path parameters
- common optional expansions on poem/category routes such as:
  - `catInfo`
  - `catPoems`
  - `rhymes`
  - `recitations`
  - `images`
  - `songs`
  - `comments`
  - `verseDetails`
  - `navigation`
  - `poems`
  - `mainSections`
- common pagination/search filters on search-like routes such as:
  - `PageNumber`
  - `PageSize`
  - `term`
  - `language`
  - `format`
  - `metre`
  - `rhyme`
  - `coupletCountsFrom`
  - `q`
  - `skip`
  - `itemsCount`

### Examples confirmed directly from the reviewed spec
- `/api/ganjoor/poet/{id}`: `id`, optional `catPoems`
- `/api/ganjoor/cat/{id}`: `id`, optional `poems`, optional `mainSections`
- `/api/ganjoor/poem/{id}`: `id` plus multiple optional expansion flags
- `/api/ganjoor/poem/{id}/verses`: optional `coupletIndex`
- `/api/ganjoor/poems/search`: `PageNumber`, `PageSize`, `term`, `poetId`, `catId`, `e`
- `/api/ganjoor/poems/similar`: `PageNumber`, `PageSize`, `metre`, `rhyme`, `poetId`, `catId`, `language`, `format`, `term`, `coupletCountsFrom`
- `/api/audio/published`: paginated public recitations, with filtering described in the summary text

## Auth notes
- The reviewed OpenAPI spec defines a security scheme named `oauth2`, but the actual scheme is modeled as `type: apiKey` in the `Authorization` header with description `bearer {token}`.
- Many public literary routes are readable without auth.
- Auth-required and permission-gated operations are explicitly marked in Swagger summaries, e.g. `Auth`, `Auth policies: ganjoor:modify`, `artifact:add`, `recitation:publish`, etc.
- Administrative/editing endpoints are numerous and should be treated separately from public literary read routes.

## Pagination, errors, and format notes
- The reviewed spec heavily reuses `PageNumber` and `PageSize` on searchable/listing routes.
- Media endpoints return files rather than standard JSON documents.
- The Swagger UI exposes the spec at `/swagger/v1/swagger.json` and the docs link to it directly.
- No numeric public rate limit was published in the reviewed Swagger UI or spec.

## Important usage notes
- This provider's official API surface is much larger than a simple read-only poetry API.
- The public literary routes can be used without touching the authenticated moderation/import/editing surface.
- fireROUTE should keep the huge authenticated admin surface separate from the public content routes most users actually want.
- The reviewed spec mixes public cultural-content endpoints with operational/admin routes; route-family grouping is more useful than a flat dump of all 471 operations.

## fireROUTE notes
- Treat `/api/ganjoor/poets`, `/api/ganjoor/poet`, `/api/ganjoor/cat`, `/api/ganjoor/poem`, `/api/ganjoor/poems/search`, and `/api/ganjoor/poems/similar` as the primary read/search routes.
- Preserve optional expansion flags on poem/category requests instead of flattening them away.
- Keep recitation and artifact routes as adjacent-but-separate capability families.
- Gate all mutation/moderation/import/bookmark routes behind explicit auth support because the official API surface includes many permission-guarded operations.
