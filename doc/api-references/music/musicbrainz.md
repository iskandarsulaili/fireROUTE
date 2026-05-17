# MusicBrainz

## Overview
- Provider: MusicBrainz API
- Category: Music
- Official docs: `https://musicbrainz.org/doc/MusicBrainz_API`
- OAuth/docs companion page: `https://musicbrainz.org/doc/Development/OAuth2`
- Base URL: `https://musicbrainz.org/ws/2/`
- Auth: no API key for public metadata lookups; clients must send a meaningful `User-Agent`; OAuth or HTTPS digest auth is required for user-data and submission flows
- HTTPS: yes
- Response formats: XML by default; JSON is available with `fmt=json` or `Accept: application/json`
- Pagination: supported on search, browse, and `genre/all` via `limit` and `offset`
- Rate limits: the official docs say client applications must not make more than one call per second

## Confirmed route patterns
MusicBrainz documents a small set of reusable route shapes rather than a separate page for every individual entity path. The core entity set named on the official API page is: `area`, `artist`, `event`, `genre`, `instrument`, `label`, `place`, `recording`, `release`, `release-group`, `series`, `work`, and `url`.

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/ws/2/{entity}/{mbid}` | path `entity`, `mbid`; optional `inc`, `fmt` | Core lookup pattern for the 13 named MusicBrainz entity resources. |
| GET | `/ws/2/{entity}` | path `entity`; query `query`, `limit`, `offset`, `fmt` | Search pattern for core entities. The docs explicitly note that search is not implemented for `genre`. |
| GET | `/ws/2/{result-entity}` | path `result-entity`; browse query such as `{linked-entity}={mbid}`, plus `limit`, `offset`, `inc`, `fmt` | Generic browse pattern for entities linked to another entity. The docs explicitly note that browse is not implemented for `genre`. |
| GET | `/ws/2/genre/all` | query `limit`, `offset`, `fmt` | Alphabetical paginated genre listing; also supports plain-text output with `fmt=txt` or `Accept: text/plain`. |
| GET | `/ws/2/discid/{discid}` | path `discid`; optional `inc`, `fmt` | Non-MBID lookup documented on the API page. |
| GET | `/ws/2/isrc/{isrc}` | path `isrc`; optional `inc`, `fmt` | Non-MBID lookup documented on the API page. |
| GET | `/ws/2/iswc/{iswc}` | path `iswc`; optional `inc`, `fmt` | Non-MBID lookup documented on the API page. |
| GET | `/ws/2/url` | query `resource`, optional `inc`, `fmt` | URL lookup by text / target resource. |
| GET | `/ws/2/collection` | query `editor`, optional `inc`, `fmt` | Collection listing for an editor; the docs show examples with `editor=...` and optional `inc=user-collections`. |
| GET | `/ws/2/collection/{mbid}` | path `mbid`; optional `inc`, `fmt` | Collection lookup. |
| GET | `/ws/2/collection/{mbid}/{entity-type}` | path `mbid`, `entity-type`; optional `limit`, `offset`, `fmt` | Collection-member listing such as `/areas` or `/releases`. |
| PUT | `/ws/2/collection/{mbid}/releases/{release-mbid-list}` | path `mbid`, `release-mbid-list`; query `client` | Authenticated collection update example shown in the official docs for adding release IDs. |
| DELETE | `/ws/2/collection/{mbid}/releases/{release-mbid-list}` | path `mbid`, `release-mbid-list`; query `client` | Authenticated collection update example shown in the official docs for removing release IDs. |
| POST | `/oauth2/token` | OAuth grant parameters | OAuth token exchange endpoint on the official OAuth2 page. |
| POST | `/oauth2/revoke` | token revocation parameters | OAuth token revocation endpoint on the official OAuth2 page. |
| GET | `/oauth2/userinfo` | bearer token | OAuth userinfo endpoint on the official OAuth2 page. |
| POST | `/oauth2/userinfo` | bearer token | The OAuth2 page documents both GET and POST for the same userinfo resource. |

Confirmed route count: **17**.

## Parameter and auth notes
- `fmt=json` forces JSON output; otherwise XML is the default.
- `inc` expands linked entities and relationship data.
- `limit` and `offset` are the documented pagination controls for browse/search-style responses.
- Public metadata access does not use an API key, but the official docs require a meaningful `User-Agent` header.
- The official API page says data submission and requests involving user information require authentication.
- The same page says authentication can use OAuth or digest authentication over HTTPS.
- The FAQ text says non-commercial use of the web service is free and commercial use requires MusicBrainz commercial plans/contact.

## Response, error, and format notes
- XML is the original/default output format.
- JSON is officially supported for requests, and the docs say XML and JSON are effectively equivalent for requesting data.
- The docs state that XML is the only format that supports submission flows.
- The API page shows reusable query-shape patterns rather than one endpoint page per entity.
- The docs call out ratings, tags, barcodes, and ISRCs as the kinds of data that can be submitted through the API.

## Important usage notes
- Respect the one-request-per-second guidance or MusicBrainz may block the client IP.
- Always send a descriptive `User-Agent` for fireROUTE integrations.
- Model MusicBrainz as a reusable route-pattern API rather than a large collection of unrelated endpoints.
- Keep in mind that `genre` is a documented exception: it has lookup support and `genre/all`, but the docs say browse and search are not implemented for genre.

## Sources inspected
- `https://musicbrainz.org/doc/MusicBrainz_API`
- `https://musicbrainz.org/doc/Development/OAuth2`
