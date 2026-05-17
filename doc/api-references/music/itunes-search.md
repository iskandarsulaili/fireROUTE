# iTunes Search

## Overview
- Provider: Apple iTunes Search API
- Category: Music
- Official docs: `https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/`
- Base URL: `https://itunes.apple.com`
- Auth: none
- HTTPS: yes
- Response format: JSON, encoded as UTF-8
- Pagination: none documented; search results are bounded via the `limit` parameter
- Rate limits: the official docs say the Search API is limited to approximately `20 calls per minute` and recommend caching for large websites

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/search` | required `term`; optional `country`, `media`, `entity`, `callback`, `limit`, `lang`, `version`, `explicit` | Main text search endpoint for store content. |
| GET | `/lookup` | one of `id`, `amgArtistId`, `amgAlbumId`, `amgVideoId`, `upc`, `isbn`; optional `entity`, `limit`, `sort` | ID-based lookup endpoint for artists, albums, apps, books, and other store entities. |

## Search endpoint details
- Official format: `https://itunes.apple.com/search?parameterkeyvalue`
- Confirmed search parameters from Apple’s parameter table:
  - `term` — URL-encoded search text; required
  - `country` — two-letter storefront country code; docs say the default is `US`
  - `media` — one of `movie`, `podcast`, `music`, `musicVideo`, `audiobook`, `shortFilm`, `tvShow`, `software`, `ebook`, `all`
  - `entity` — result type relative to the media type
  - `callback` — JavaScript callback name for cross-site / JSONP use
  - `limit` — number of results; documented range `1` to `200`, default `50`
  - `lang` — `en_us` or `ja_jp`, default `en_us`
  - `version` — response key version `1` or `2`, default `2`
  - `explicit` — `Yes` or `No`, default `Yes`
- The docs’ media/entity table documents these media/entity groupings:
  - `movie` → `movieArtist`, `movie`
  - `podcast` → `podcastAuthor`, `podcast`
  - `music` → `musicArtist`, `musicTrack`, `album`, `musicVideo`, `mix`, `song`
  - `musicVideo` → `musicArtist`, `musicVideo`
  - `audiobook` → `audiobookAuthor`, `audiobook`
  - `shortFilm` → `shortFilmArtist`, `shortFilm`
  - `tvShow` → `tvEpisode`, `tvSeason`
  - `software` → `software`, `iPadSoftware`, `macSoftware`
  - `ebook` → `ebook`
  - `all` → `movie`, `album`, `allArtist`, `podcast`, `musicVideo`, `mix`, `audiobook`, `tvSeason`, `allTrack`

## Lookup endpoint details
- Apple’s lookup examples confirm the base route `https://itunes.apple.com/lookup`
- The official examples show these lookup keys:
  - `id` — iTunes artist/app/content ID
  - `amgArtistId`
  - `amgAlbumId`
  - `amgVideoId`
  - `upc`
  - `isbn`
- The examples also confirm these optional lookup parameters:
  - `entity` — for example `album` or `song`
  - `limit` — for example top 5 albums / songs
  - `sort=recent` — shown on recent-song lookups

## Response format notes
- Apple states that all JSON results are encoded as UTF-8.
- The response examples and result-key table confirm fields such as:
  - `wrapperType`
  - `kind`
  - `artistId`
  - `collectionId`
  - `trackId`
  - `artistName`
  - `collectionName`
  - `trackName`
  - censored-name variants
  - `artistViewUrl`
  - `collectionViewUrl`
  - `trackViewUrl`
  - `previewUrl`
  - `artworkUrl60`
  - `artworkUrl100`
  - `collectionPrice`
  - `trackPrice`
  - explicitness fields
  - `discCount`, `discNumber`, `trackCount`, `trackNumber`
  - `trackTimeMillis`
  - `country`
  - `currency`
  - `primaryGenreName`
- Apple’s docs explain JSON/JSONP usage rather than publishing a separate formal error schema.

## Usage notes
- The overview states the API can search content across the iTunes Store, App Store, iBooks Store, and Mac App Store.
- Apple explicitly recommends dynamic script tags when using callback-based cross-site requests.
- The docs stress correct URL encoding for affiliate and search links.
- Apple recommends caching both search and lookup responses for high-traffic sites.
- Promotional media returned by the API is subject to Apple’s usage restrictions and must be used only to promote the corresponding store content.

## Error handling
- The archived docs inspected do not publish a compact HTTP status/error-body table.
- Practical integration should therefore rely on normal HTTP failure handling plus validation of returned JSON payloads.
- Because the docs emphasize JSONP callback support, consumers should also handle script-loading failures in browser contexts.

## Integration notes for fireROUTE
- Treat `/search` and `/lookup` as distinct route families: one is free-text search, the other is identifier-based resolution.
- Preserve Apple’s exact parameter names and casing (`musicVideo`, `amgArtistId`, `trackTimeMillis`, etc.).
- Because result shape varies by media/entity, fireROUTE should not over-normalize without retaining raw fields.
- Honor Apple’s approximate `20 calls per minute` guidance and add caching/backoff by default.

## Sources inspected
- `https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/`
- `https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html`
- `https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/SearchExamples.html`
- `https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/LookupExamples.html`
- `https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/UnderstandingSearchResults.html`
