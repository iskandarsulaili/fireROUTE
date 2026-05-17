# British National Bibliography

Official pages manually reviewed:
- http://bnb.data.bl.uk/
- https://www.bl.uk/services/collection-metadata-services
- https://bl.natbib-lod.org/about/about-the-british-national-bibliography
- https://bl.natbib-lod.org/about/release-log

## Overview
- Historical indexed host: `http://bnb.data.bl.uk/`
- Current official British Library replacement page: `https://www.bl.uk/services/collection-metadata-services`
- Current official portal base URL: `https://bl.natbib-lod.org`
- Current machine endpoint confirmed from the live official portal bundle and live requests: `https://api-gw.staging.natbib-lod.org/api/graphql`
- API style: GraphQL over HTTP plus portal-host token/bootstrap endpoints
- Authentication: anonymous client-token bootstrap is available; signed-in user-token bootstrap and token refresh routes also exist
- Response format: JSON for token/bootstrap and GraphQL routes; HTML for portal pages
- Rate limits: no numeric public rate limits were published on the reviewed official pages

The British Library metadata-services page now says the British National Bibliography is available on the Share Family beta portal. The old `bnb.data.bl.uk` host is no longer reachable, but the current official portal and its live GraphQL surface are publicly accessible.

Manual route count confirmed from the current official HTTP surface: **5**.

## Confirmed endpoint surface

| Method | Path | Purpose | Notes |
|---|---|---|---|
| GET | `/api/auth/get-client-token` | Get an anonymous bearer token for portal API calls | Live request returned JSON with `access_token`, `expires_in`, `token_type`, `scope`, and `expires_timestamp` |
| GET | `/api/auth/get-user-token` | Get a signed-in user token from the portal session | Anonymous live request returned HTTP `400` with `{}` |
| POST | `/api/refresh-token` | Refresh a stored token object when a `refresh_token` is present | Confirmed from the official portal bundle; used only when the stored token includes a refresh token |
| POST | `/api/graphql` | Main machine-query surface on the API gateway | Official portal bundle points to `https://api-gw.staging.natbib-lod.org/api/graphql`; live authenticated `query { __typename }` returned `200` with `{"data":{"__typename":"Query"}}` |
| GET | `/api/authentication-proxy/instances/{instanceId}/records.{format}` | Record-export proxy for publication / instance records | The official portal bundle constructs this route from publication or instance URIs and explicitly requests `marcxml` |

## Confirmed GraphQL operation families

Live schema introspection on the official GraphQL endpoint returned **37** root query fields and **no mutation type**.

### Collection / search queries
- `agents`
- `people`
- `meetings`
- `organizations`
- `families`
- `opuses`
- `publications`
- `subjects`
- `exactMatches`
- `resources`

### Direct entity lookups
- `agent`
- `person`
- `meeting`
- `organization`
- `family`
- `opus`
- `work`
- `instance`
- `item`
- `subject`
- `publication`
- `date`
- `event`
- `topic`
- `genericConcept`
- `concept`

### Facet / vocabulary lookups
- `places`
- `occupations`
- `agentTypes`
- `availabilities`
- `languages`
- `forms`
- `formats`
- `roles`
- `genres`
- `opusTypes`
- `publicationTypes`

## Confirmed parameters and request notes

### `GET /api/auth/get-client-token`
- No request parameters were required in the reviewed live call.
- The live JSON response included these keys:
  - `access_token`
  - `expires_in`
  - `refresh_expires_in`
  - `token_type`
  - `not-before-policy`
  - `scope`
  - `expires_timestamp`
- The reviewed live response showed:
  - `token_type: Bearer`
  - `expires_in: 300`
  - `refresh_expires_in: 0`
  - no `refresh_token`

### `GET /api/auth/get-user-token`
- No request parameters were exposed on the reviewed public surface.
- The official portal bundle checks this route first when trying to obtain a signed-in session token.
- An anonymous live request returned HTTP `400` with an empty JSON object `{}`.

### `POST /api/refresh-token`
- The official portal bundle posts JSON shaped as `{ "token": <stored token object> }`.
- The bundle only attempts this route when the stored token contains a `refresh_token` and the access token is expired.

### `POST /api/graphql`
- Required headers confirmed in live requests:
  - `Content-Type: application/json`
  - `Authorization: Bearer {access_token}`
- Required body field:
  - `query`
- Optional body field confirmed in live requests:
  - `variables`
- Confirmed argument families from live schema introspection:
  - `agent` / `person` / `meeting` / `organization` / `family` / `opus` / `work` / `instance` / `item` / `subject` / `publication` / `date` / `event` / `topic` / `genericConcept` / `concept`: `uri`
  - `agents` / `people` / `meetings` / `organizations` / `families`: `svdeql`, `tql`, `stql`, `filters`, `refinementQuery`
  - `opuses`: `svdeql`, `stql`, `filters`, `refinementQuery`
  - `publications`: `svdeql`, `stql`, `printOnlineGroupingEnabled`, `cursor`, `filters`, `refinementQuery`
  - `resources`: `q`, `sort`, `offset`, `rows`, `filters`, `partialMatch`
  - `exactMatches`: `q`, `filter`
  - `places` / `occupations` / `agentTypes` / `availabilities` / `languages` / `forms` / `formats` / `roles` / `genres` / `opusTypes` / `publicationTypes`: `q`, `fuzzy`, `edits`, `ml`, `filters`
- Live introspection also confirmed collection metadata fields such as `totalMatches`, `startOffset`, `pageSize`, `facets`, `didYouMean`, and `meta` on `ResourceCollection`.

### `GET /api/authentication-proxy/instances/{instanceId}/records.{format}`
- Path parameters:
  - `instanceId`
  - `format`
- The official portal bundle builds this route from publication or instance URIs by extracting the trailing numeric identifier.
- The same bundle explicitly requests `marcxml` on this route.
- A bundled extension list also includes `json`, `xml`, `jsonld`, `rdf`, `nt`, `n3`, `ttl`, `nq`, `trix`, `trig`, `mrc`, `marcxml`, and `ris`, but only `marcxml` was directly exercised by the reviewed record-download helper.

## Confirmed live behavior
- `GET /api/auth/get-client-token` returned HTTP `200` JSON and an anonymous bearer token.
- `POST https://api-gw.staging.natbib-lod.org/api/graphql` with a bearer token and body `{"query":"query{__typename}"}` returned HTTP `200` JSON `{"data":{"__typename":"Query"}}`.
- GraphQL schema introspection succeeded and exposed `37` root query fields.
- GraphQL schema introspection reported `mutationType: null`.
- A live `exactMatches` GraphQL query returned BNB resource URIs such as `https://natbib-lod.org/publications/1041705355140371` and `https://natbib-lod.org/opuses/1261705354417638`.
- A live `publication(uri: ...)` GraphQL lookup resolved linked `instance` and `work` URIs.
- A live request to `/api/authentication-proxy/instances/1041705355140371/records.marcxml` returned HTTP `500` with a JSON error body, so the record-export surface is confirmed but not healthy for that sample in this run.

## Pagination, error, and format notes
- GraphQL collection types expose `totalMatches`, `startOffset`, and `pageSize`.
- Different collection queries use different pagination styles:
  - `resources` exposes `offset` and `rows`
  - `publications` exposes `cursor`
  - collection queries also support `filters` and `refinementQuery`
- Successful token/bootstrap and GraphQL requests return JSON.
- GraphQL validation failures return a JSON `errors` array.
- Anonymous `GET /api/auth/get-user-token` requests can return HTTP `400` with `{}`.
- The record-export route can currently return HTTP `500` JSON errors for at least one live sample instance.
- No public numeric rate-limit, quota, or throttling-header guidance was found on the reviewed official pages.

## Important usage notes
- The British Library metadata-services page explicitly says the BNB is now available on the Share Family beta portal and that the BNB is not a catalogue of the British Library's collections.
- The official Share Family release-log page says the BNB tenant shipped with simple search, exact-match suggestions, advanced search, entity pages, and an automatic authentication-token workflow.
- Live GraphQL results use canonical resource URIs under `https://natbib-lod.org/...` even though the interactive portal is hosted at `https://bl.natbib-lod.org/...`.
- Treat the old `bnb.data.bl.uk` host as retired/unreachable and the Share Family portal as the current official replacement.

## Integration notes for fireROUTE
- Prefer the GraphQL endpoint as the canonical machine interface.
- Acquire a client token before sending GraphQL requests.
- Preserve GraphQL request/response envelopes instead of flattening them into guessed REST resources.
- Keep publication / instance record export marked as unstable until the official portal documents format-specific success behavior or the current `500` responses are resolved.

## Sources inspected
- `http://bnb.data.bl.uk/`
- `https://www.bl.uk/services/collection-metadata-services`
- `https://bl.natbib-lod.org/about/about-the-british-national-bibliography`
- `https://bl.natbib-lod.org/about/release-log`
- `https://api-gw.staging.natbib-lod.org/api/graphql`
