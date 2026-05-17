# GBIF

## Provider metadata
- Category: `Science & Math`
- Provider slug: `gbif`
- Official docs/pages used:
  - `https://www.gbif.org/developer/summary` (official developer summary; redirects to the technical reference)
  - `https://techdocs.gbif.org/en/openapi/`
  - `https://techdocs.gbif.org/en/openapi/v1/registry`
  - `https://techdocs.gbif.org/en/openapi/v1/species`
  - `https://techdocs.gbif.org/en/openapi/v1/occurrence`
  - `https://techdocs.gbif.org/en/openapi/images`
  - `https://techdocs.gbif.org/en/openapi/v2/maps`
  - `https://techdocs.gbif.org/en/openapi/v1/literature`
  - `https://techdocs.gbif.org/en/openapi/v1/validator`
  - `https://techdocs.gbif.org/en/openapi/v1/vocabulary`
  - the official OpenAPI documents loaded by those pages: `https://techdocs.gbif.org/openapi/registry.json`, `https://techdocs.gbif.org/openapi/checklistbank.json`, `https://techdocs.gbif.org/openapi/occurrence.json`, `https://techdocs.gbif.org/openapi/v2-maps.json`, `https://techdocs.gbif.org/openapi/literature.json`, `https://techdocs.gbif.org/openapi/validator.json`, `https://techdocs.gbif.org/openapi/vocabulary.json`
- Canonical public API roots confirmed from the official docs/specs:
  - shared root: `https://api.gbif.org/`
  - most v1 REST sections: `https://api.gbif.org/v1/`
  - maps v2: `https://api.gbif.org/v2/`
  - occurrence image URL form: `https://api.gbif.org/v1/image/cache/...`
- Auth model:
  - most GBIF API use does not require authentication
  - the official overview explicitly says `POST`, `PUT`, `DELETE`, and some `GET` requests require authentication
  - the official auth model is HTTP Basic auth using an existing GBIF user account
- Response / format notes:
  - the official overview says most queries return `JSON`
  - the occurrence image API returns image content rather than JSON
  - the maps API returns raster or vector map tiles
- Rate-limit notes:
  - the official overview does not publish a fixed guaranteed numeric quota
  - rapid or numerous queries to search APIs may be rate limited with `HTTP 429`
  - the official docs recommend using the download API if a script would take more than `15` minutes through occurrence search APIs
  - the official docs say the download API accepts up to `100,000` search parameters
  - the occurrence image page says scripted usage of that image API should be limited to a single HTTP connection
- Manually confirmed route count: `505`
- Route-count breakdown confirmed from official pages/specs:
  - `Registry API` = `315`
  - `Species API` = `32`
  - `Occurrence API` = `75`
  - `Occurrence Image API` = `1`
  - `Maps API` = `3`
  - `Literature API` = `3`
  - `Validator API` = `18`
  - `Vocabulary API` = `58`

## Canonical endpoint families

### 1. Registry API (`315` routes)
Primary purpose: datasets, organizations, installations, nodes, networks, and GRSciColl registry resources.

Representative official routes confirmed from the registry page/spec:
- `GET /dataset`
- `POST /dataset`
- `GET /dataset/search`
- `GET /dataset/search/export`
- `GET /dataset/suggest`
- `GET /dataset/doi/{prefix}/{suffix}`
- `GET /dataset/{key}`
- `PUT /dataset/{key}`
- `DELETE /dataset/{key}`
- `POST /dataset/{key}/crawl`
- `GET /organization`
- `POST /organization`
- `GET /organization/{key}`
- `PUT /organization/{key}`
- `DELETE /organization/{key}`
- `GET /installation`
- `POST /installation`
- `GET /network`
- `POST /network`
- `GET /node`
- `POST /node`
- `GET /grscicoll/collection`
- `POST /grscicoll/collection`
- `GET /grscicoll/institution`
- `POST /grscicoll/institution`

The registry section also includes many nested routes for comments, contacts, endpoints, identifiers, tags, machine tags, metadata, deleted lists, pending lists, and Latimer Core variants.

### 2. Species API (`32` routes)
Primary purpose: taxonomic name usage lookup, parsing, matching, search, and related species metadata.

Representative official routes confirmed from the species page/spec:
- `GET /v1/parser/name`
- `POST /v1/parser/name`
- `GET /v1/species`
- `GET /v1/species/{usageKey}`
- `GET /v1/species/{usageKey}/vernacularNames`
- `GET /v1/species/{usageKey}/verbatim`
- `GET /v1/species/{usageKey}/typeSpecimens`
- `GET /v1/species/{usageKey}/toc`
- `GET /v1/species/{usageKey}/synonyms`
- `GET /v1/species/{usageKey}/speciesProfiles`
- `GET /v1/species/{usageKey}/related`
- `GET /v1/species/{usageKey}/references`
- `GET /v1/species/{usageKey}/parents`
- `GET /v1/species/{usageKey}/name`
- `GET /v1/species/{usageKey}/metrics`
- `GET /v1/species/{usageKey}/media`
- `GET /v1/species/{usageKey}/iucnRedListCategory`
- `GET /v1/species/{usageKey}/identifier`
- `GET /v1/species/{usageKey}/distributions`
- `GET /v1/species/{usageKey}/descriptions`

### 3. Occurrence API (`75` routes)
Primary purpose: occurrence search, occurrence record retrieval, verbatim/fragment views, and download workflow.

Representative official routes confirmed from the occurrence page/spec:
- `GET /occurrence/search`
- `POST /occurrence/search/predicate`
- `POST /occurrence/download/request`
- `GET /occurrence/download/request/{key}`
- `DELETE /occurrence/download/request/{key}`
- `POST /occurrence/download/request/validate`
- `GET /occurrence/download/request/predicate`
- `GET /occurrence/download/request/sql`
- `POST /occurrence/download/request/sql`
- `GET /occurrence/{gbifId}`
- `GET /occurrence/{datasetKey}/{occurrenceId}`
- `GET /occurrence/{gbifId}/fragment`
- `GET /occurrence/{datasetKey}/{occurrenceId}/fragment`
- `GET /occurrence/{gbifId}/verbatim`
- `GET /occurrence/{datasetKey}/{occurrenceId}/verbatim`

The official occurrence spec also includes route families for downloads, occurrence metrics, interpreted/verbatim fragments, and other search/result helpers.

### 4. Occurrence Image API (`1` documented URL form)
The official image page documents a single route pattern rather than an OpenAPI operation table:
- `GET /v1/image/cache/occurrence/[gbifId]/media/[md5sum(identifier)]`
- resize/crop variants are documented by inserting image-size segments, for example `GET /v1/image/cache/200x/occurrence/[gbifId]/media/[md5sum(identifier)]`

### 5. Maps API (`3` routes)
Representative official routes confirmed from the maps page/spec:
- `GET /map/occurrence/density/{z}/{x}/{y}{format}`
- `GET /map/occurrence/density/capabilities.json`
- `GET /map/occurrence/adhoc/{z}/{x}/{y}{format}`

### 6. Literature API (`3` routes)
Representative official routes confirmed from the literature page/spec:
- `GET /literature/{uuid}`
- `GET /literature/search`
- `GET /literature/export`

### 7. Validator API (`18` routes)
Representative official routes confirmed from the validator page/spec:
- `GET /validation`
- `POST /validation`
- `POST /validation/url`
- `POST /validation/eml`
- `GET /validation/{key}`
- `PUT /validation/{key}`
- `DELETE /validation/{key}`
- `PUT /validation/{key}/cancel`
- `GET /validation/{key}/eml`
- `GET /validation/running`
- `GET /validation/enumeration`

### 8. Vocabulary API (`58` routes)
Representative official routes confirmed from the vocabulary page/spec:
- `GET /vocabularies`
- `POST /vocabularies`
- `GET /vocabularies/{name}`
- `PUT /vocabularies/{name}`
- `GET /vocabularies/{vocabularyName}/concepts`
- `POST /vocabularies/{vocabularyName}/concepts`
- `GET /vocabularies/{vocabularyName}/concepts/{name}`
- `PUT /vocabularies/{vocabularyName}/concepts/{name}`
- `GET /vocabularies/{vocabularyName}/concepts/suggest`
- `GET /vocabularyLanguage`
- `GET /vocabularyTags`
- `POST /vocabularyTags`
- `GET /vocabularyTags/{name}`
- `PUT /vocabularyTags/{name}`
- `DELETE /vocabularyTags/{name}`

## Confirmed parameters and request conventions

### Cross-cutting parameters from the official overview
- `limit` - page size for APIs that support paging; overly large values may be reduced to the service maximum
- `offset` - paging offset
- repeatable parameters are supported on some search APIs; the official example is repeating `country`
- range queries are supported on some search APIs; the official example is `year=1800,1899`

### Representative section parameters confirmed from the official specs
- Species/search parameters seen in the official spec: `name`, `datasetKey`, `usageKey`, `rank`, `higherTaxonKey`, `status`, `habitat`, `limit`, `offset`
- Occurrence/search parameters seen in the official spec: `country`, `year`, `basisOfRecord`, `taxonKey`, `datasetKey`, `datasetName`, `continent`, `day`, `decimalLatitude`, `decimalLongitude`
- Maps parameters seen in the official spec: `z`, `x`, `y`, `format`, `srs`, `year`, `basisOfRecord`, `bin`, `hexPerTile`, `squareSize`, `style`, `country`, `taxonKey`, `datasetKey`, `publishingOrg`, `publishingCountry`, `networkKey`, `mode`
- Literature parameters seen in the official spec: `uuid`, `doi`, `gbifDatasetKey`, `gbifDownloadKey`, `gbifTaxonKey`, `literatureType`, `openAccess`, `peerReview`, `publisher`, `publishingCountry`, `relevance`
- Registry parameters seen in the official spec include filters such as `country`, `city`, `name`, `code`, `source`, `identifierType`, and multiple collection/institution search fields
- Validator parameters seen in the official spec include `key`, `fileUrl`, `evaluationCategory`, and related validation controls

## Errors, pagination, and usage notes
- `HTTP 429` is the explicitly documented rate-limit response for rapid or numerous search queries.
- The official docs do not promise a stable numeric requests-per-minute quota; they instead say the maximum rate changes with server load.
- The official overview warns that undocumented or experimental endpoints may change or be removed without warning.
- The official overview also states that `www.gbif.org` itself is not part of the public API and that scraping or bulk downloading website resources may be blocked.
- The occurrence image page states that cached images may load slowly or fail if the cache is cold or if the publisher source is unavailable.
- The image page also states that the maximum image resolution available through the server is `1200x1200px`.

## Important integration notes
- GBIF is not a single small REST surface; it is a large multi-section platform with separate registry, taxonomy, occurrence, maps, literature, validation, and controlled-vocabulary APIs.
- The official pages expose both production and user-testing servers for many sections; fireROUTE should normalize against the production URLs above.
- The validator section is documented on an official GBIF page but its published server URL is `http://prodws1-vh.gbif.org:8118`, which is distinct from the main `api.gbif.org` host.
- The occurrence download workflow is part of the officially documented API surface and is where authenticated/batch usage becomes important.

## fireROUTE normalization notes
- Use `https://api.gbif.org/` as the umbrella base and preserve section-specific canonical roots where needed (`/v1/`, `/v2/`, and the image-cache path form).
- Model GBIF as a large official API family with `505` confirmed routes, not as a single search endpoint.
- Keep authentication optional at the provider level but mark write/download-style routes as requiring GBIF-account HTTP Basic auth.
- Preserve GBIF parameter names such as `limit`, `offset`, `country`, `year`, `taxonKey`, `datasetKey`, and `basisOfRecord` exactly as documented.
- Expect mixed response types across the provider: mostly JSON, plus image responses and map-tile responses.