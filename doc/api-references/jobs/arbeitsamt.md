# Arbeitsamt (Bundesagentur für Arbeit Jobsuche API)

## Provider metadata
- Category: `Jobs`
- Provider slug: `arbeitsamt`
- Official docs pages used:
  - `https://jobsuche.api.bund.dev/`
  - `https://jobsuche.api.bund.dev/openapi.yaml`
- Main API base URL: `https://rest.arbeitsagentur.de/jobboerse/jobsuche-service`
- Secondary server for employer logos: `https://rest.arbeitsagentur.de/vermittlung/ag-darstellung-service`
- Auth model: API key header `X-API-Key: jobboerse-jobsuche`
- Response formats: JSON for search/details, image (`webp` or `png`) for logos
- Manually confirmed route count: `5`

## Authentication
- The official docs explicitly state that authentication works via the clientId `jobboerse-jobsuche`.
- For documented `GET` requests, pass that value as header `X-API-Key`.

## Workflow documented by provider
1. Search jobs using `/pc/v4/jobs` or `/pc/v4/app/jobs`.
2. Save the `refnr` from the search response.
3. Base64-encode that reference number and request job details via `/pc/v4/jobdetails/{encryptedJobCode}`.
4. If the detail response includes `arbeitgeberKundennummerHash`, fetch the employer logo from `/ct/v1/arbeitgeberlogo/{kundennummerHash}`.

## Canonical endpoints

### 1) Search jobs
- Method: `GET`
- Path: `/pc/v4/jobs`
- Base URL: `https://rest.arbeitsagentur.de/jobboerse/jobsuche-service`
- Purpose: search open job offers with filters

Documented query parameters:
- `was` - free-text job title search
- `wo` - free-text location search
- `berufsfeld` - professional field search
- `page` - page number
- `size` - results per page
- `arbeitgeber` - employer name
- `veroeffentlichtseit` - age in days, `0-100`
- `zeitarbeit` - include temporary-employment-agency jobs
- `angebotsart` - enum `1`, `2`, `4`, `34`
- `befristung` - semicolon-separated values `1` or `2`
- `arbeitszeit` - semicolon-separated values `vz`, `tz`, `snw`, `ho`, `mj`
- `behinderung` - boolean
- `corona` - boolean
- `umkreis` - search radius in kilometers

### 2) Search jobs via app endpoint
- Method: `GET`
- Path: `/pc/v4/app/jobs`
- Purpose: alternative search endpoint for app flows
- Parameters: same documented query parameter set as `/pc/v4/jobs`

### 3) Job details v4
- Method: `GET`
- Path: `/pc/v4/jobdetails/{encryptedJobCode}`
- Purpose: retrieve detailed job information

Path parameter:
- `encryptedJobCode` - required Base64-encoded `refnr` value from search results

### 4) Job details v3
- Method: `GET`
- Path: `/pc/v3/jobdetails/{encryptedJobCode}`
- Purpose: retrieve job details from the legacy v3 detail endpoint

Path parameter:
- `encryptedJobCode` - required Base64-encoded `refnr`

### 5) Employer logo
- Method: `GET`
- Path: `/ct/v1/arbeitgeberlogo/{kundennummerHash}`
- Base URL: `https://rest.arbeitsagentur.de/vermittlung/ag-darstellung-service`
- Purpose: fetch employer logo when available

Path parameter:
- `kundennummerHash` - required hash from job details response; URL-encode if needed

Responses:
- `200` with `image/webp` or `image/png`
- `404` when no logo exists

## Response notes
### Search response (`JobSearchResponse`) includes
- `stellenangebote[]`
- `maxErgebnisse`
- `page`
- `size`
- `facetten[]`

Documented job result fields include:
- `hashId`
- `beruf`
- `refnr`
- `arbeitgeber`
- `aktuelleVeroeffentlichungsdatum`
- `eintrittsdatum`
- `arbeitsort`
- `kundennummerHash`
- `externeUrl`
- `modifikationsTimestamp`

### Detail response (`JobDetails`) includes fields such as
- `titel` / `stellenangebotsTitel`
- `stellenbeschreibung` / `stellenangebotsBeschreibung`
- `refnr` / `referenznummer`
- `arbeitgeber`
- `arbeitgeberKundennummerHash`
- `arbeitsorte[]`
- `arbeitszeitmodelle[]`
- `befristung`
- `verguetung`
- `anzahlOffeneStellen`
- `arbeitgeberAdresse`
- `fertigkeiten[]`

## Error and format notes
- The OpenAPI doc only explicitly models `200` responses for most JSON endpoints and `404` for the logo endpoint.
- Search and detail responses are JSON.
- Logo responses are binary images.

## fireROUTE normalization notes
- This provider uses a fixed shared API key value rather than per-user bearer tokens.
- The detail lookup requires a transformation step: `base64(refnr)`.
- Search filters and many response fields remain German-language and should be normalized with aliases rather than renamed destructively.
