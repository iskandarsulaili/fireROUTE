# Deutscher Bundestag DIP

## Provider metadata
- Category: `Government`
- Provider slug: `deutscher-bundestag-dip`
- Official docs/pages used:
  - `https://dip.bundestag.de/documents/informationsblatt_zur_dip_api_v01.pdf`
  - `https://dip.bundestag.de/über-dip/hilfe/api`
  - `https://search.dip.bundestag.de/api/v1`
  - `https://search.dip.bundestag.de/api/v1/openapi.yaml`
  - `https://dip.bundestag.de/dip-config.js`
  - live official endpoint checks during this review:
    - `https://search.dip.bundestag.de/api/v1/vorgang?format=json&f.wahlperiode=20`
    - `https://search.dip.bundestag.de/api/v1/vorgang/1?format=json`
    - `https://search.dip.bundestag.de/api/v1/person?format=json&f.person=Steinmeier&f.wahlperiode=20`
    - `https://search.dip.bundestag.de/api/v1/vorgang/0?format=json`
- Current documented API host: `https://search.dip.bundestag.de/api/v1`
- Auth model: official help page says an API key is required; OpenAPI documents both `Authorization` header auth and `apikey` query auth
- Response formats: JSON and XML on the reviewed API routes
- Manually confirmed canonical route count: `16`

## Official usage notes
- The official help page states the DIP API is read-only and covers `Vorgänge und Vorgangspositionen`, `Aktivitäten`, `Personen` plus `Drucksachen` and `Plenarprotokolle` with metadata.
- The same page publishes a shared public API key, valid until the end of May 2027 during this review:
  - `R2BZaee.DjdCyihKZMf8AOjtScubP2EVydegzjmBIQ`
- The official help page also says users can request their own API key by emailing `parlamentsdokumentation@bundestag.de`.
- The OpenAPI `servers` block names `https://search.dip.bundestag.de/api/v1` as the production server.
- The OpenAPI security schemes document both supported auth transports:
  - `Authorization: ApiKey <key>`
  - `apikey=<key>` query parameter
- The portal config script on `dip.bundestag.de` also exposes the search service host `https://search.dip.bundestag.de` used by the public documentation and UI.

## Canonical endpoint inventory confirmed from the official OpenAPI document
1. `GET /vorgang`
   - Purpose: list procedure metadata (`Vorgänge`)
   - Common parameters on this route include:
     - `f.aktualisiert.start`, `f.aktualisiert.end`
     - `f.datum.start`, `f.datum.end`
     - `f.beratungsstand`
     - `f.deskriptor`
     - `f.dokumentart`, `f.dokumentnummer`
     - `f.drucksache`, `f.drucksachetyp`
     - `f.frage_nummer`, `f.gesta`
     - `f.id`, `f.initiative`, `f.kom`
     - `f.plenarprotokoll`, `f.ratsdok`
     - `f.ressort_fdf`, `f.sachgebiet`
     - `f.titel`, `f.urheber`
     - `f.verkuendung_fundstelle`
     - `f.vorgangstyp`, `f.vorgangstyp_notation`
     - `f.wahlperiode`
     - `cursor`, `format`
   - Live confirmation:
     - `GET /vorgang?format=json&f.wahlperiode=20` returned HTTP `200` with `numFound` and `documents`

2. `GET /vorgang/{id}`
   - Purpose: fetch one procedure by numeric ID
   - Parameters:
     - `id` - integer path parameter
     - `format=json|xml`
   - Live confirmation:
     - `GET /vorgang/1?format=json` returned HTTP `200`

3. `GET /vorgangsposition`
   - Purpose: list procedure-position metadata
   - Filters documented on this route include `f.aktivitaet`, date filters, document filters, `f.vorgang`, `f.zuordnung`, `f.wahlperiode`, `cursor`, and `format`

4. `GET /vorgangsposition/{id}`
   - Purpose: fetch one procedure position by ID
   - Parameters: `id`, `format`

5. `GET /drucksache`
   - Purpose: list printed-paper metadata
   - Filters documented on this route include date filters, `f.dokumentnummer`, `f.drucksachetyp`, `f.id`, `f.ressort_fdf`, `f.titel`, `f.urheber`, `f.vorgangstyp`, `f.vorgangstyp_notation`, `f.wahlperiode`, `cursor`, and `format`

6. `GET /drucksache/{id}`
   - Purpose: fetch printed-paper metadata by ID
   - Parameters: `id`, `format`

7. `GET /drucksache-text`
   - Purpose: list printed-paper full texts plus metadata
   - Filters documented on this route mirror the printed-paper list route plus `cursor` and `format`

8. `GET /drucksache-text/{id}`
   - Purpose: fetch printed-paper full text plus metadata by ID
   - Parameters: `id`, `format`

9. `GET /plenarprotokoll`
   - Purpose: list plenary-protocol metadata
   - Filters documented on this route include date filters, `f.dokumentnummer`, `f.id`, `f.vorgangstyp`, `f.vorgangstyp_notation`, `f.wahlperiode`, `cursor`, and `format`

10. `GET /plenarprotokoll/{id}`
    - Purpose: fetch plenary-protocol metadata by ID
    - Parameters: `id`, `format`

11. `GET /plenarprotokoll-text`
    - Purpose: list plenary-protocol full texts plus metadata
    - Filters documented on this route mirror the plenary-protocol list route plus `cursor` and `format`

12. `GET /plenarprotokoll-text/{id}`
    - Purpose: fetch plenary-protocol full text plus metadata by ID
    - Parameters: `id`, `format`

13. `GET /aktivitaet`
    - Purpose: list activity metadata
    - Filters documented on this route include date filters, `f.deskriptor`, document filters, `f.person`, `f.person_id`, `f.plenarprotokoll`, `f.ratsdok`, `f.sachgebiet`, `f.urheber`, `f.vorgangsposition_id`, `f.vorgangstyp`, `f.vorgangstyp_notation`, `f.wahlperiode`, `cursor`, and `format`

14. `GET /aktivitaet/{id}`
    - Purpose: fetch one activity by ID
    - Parameters: `id`, `format`

15. `GET /person`
    - Purpose: list people master data
    - Filters documented on this route include `f.aktualisiert.start`, `f.aktualisiert.end`, `f.datum.start`, `f.datum.end`, `f.id`, `f.person`, `f.wahlperiode`, `cursor`, and `format`
    - Live confirmation:
      - `GET /person?format=json&f.person=Steinmeier&f.wahlperiode=20` returned HTTP `200`

16. `GET /person/{id}`
    - Purpose: fetch one person record by ID
    - Parameters: `id`, `format`

## Authentication, pagination, error, and format notes
- Official auth transports:
  - `Authorization` header with `ApiKey <key>`
  - `apikey` query parameter
- Although the public DIP portal can load data in-browser, client integrations should use one of the documented API-key mechanisms rather than relying on portal-side behavior.
- The `format` query parameter is documented on all reviewed routes with values:
  - `json`
  - `xml`
- List-route pagination uses a cursor model rather than page numbers:
  - send the original filters again plus `cursor=<last_response_cursor>`
  - continue until the returned cursor stops changing
- The OpenAPI schemas define list responses with:
  - `numFound` - total matches
  - `cursor` - continuation token
  - `documents` - array payload
- The reviewed OpenAPI schemas cap each list response page at `100` items.
- Error responses documented in OpenAPI:
  - `400` - bad request, example `{"code":400,"message":"Invalid cursor"}`
  - `401` - unauthorized / missing valid API key
  - `404` - entity not found, example `{"code":404,"message":"ID not found: 0"}`
- Live confirmation:
  - `GET /vorgang/0?format=json` returned HTTP `404` with JSON `{"code":404,"message":"ID not found: 0"}`
- No explicit numeric rate-limit policy was published on the reviewed help page or OpenAPI document, but the official unauthorized message warns that misuse may lead to blocked requests.

## fireROUTE integration notes
- Treat `https://search.dip.bundestag.de/api/v1` as the canonical upstream base URL.
- Preserve the official German filter names exactly; they carry domain meaning and are not genericized in the source docs.
- Model list routes as cursor-paginated with up to `100` documents per response.
- Keep the provider scoped to the 16 routes published in the official OpenAPI document.
- Prefer JSON for fireROUTE normalization unless XML is specifically needed downstream.
