# Rijksmuseum

## Manual review status
- Category: Art & Design
- Official pages reviewed:
  - `https://data.rijksmuseum.nl/`
  - `https://data.rijksmuseum.nl/docs/`
  - `https://data.rijksmuseum.nl/docs/search`
  - `https://data.rijksmuseum.nl/docs/oai-pmh/`
  - `https://data.rijksmuseum.nl/docs/ldes/`
  - `https://data.rijksmuseum.nl/docs/sru`
  - `https://data.rijksmuseum.nl/docs/http/`
  - `https://data.rijksmuseum.nl/docs/http/content-negotiation-arguments`
  - `https://data.rijksmuseum.nl/docs/http/content-negotiation-headers`
  - `https://data.rijksmuseum.nl/docs/iiif/`
  - `https://data.rijksmuseum.nl/docs/iiif/cd`
  - `https://data.rijksmuseum.nl/docs/iiif/image`
  - `https://data.rijksmuseum.nl/docs/iiif/presentation`
- Manual review outcome: `manually_documented`
- Confirmed route count: `16`

## API overview
- Primary documentation root: `https://data.rijksmuseum.nl/docs/`
- Provider surface is split across multiple official hosts rather than one shared REST base:
  - `https://data.rijksmuseum.nl` for search, linked-data resolver, LDES, and IIIF Change Discovery
  - `https://id.rijksmuseum.nl` for real-world object identifiers that redirect into metadata identifiers
  - `http://library.rijksmuseum.nl:9998` for SRU bibliographic search
  - `https://iiif.micr.io` for Rijksmuseum's published IIIF Image and IIIF Presentation endpoints
- Authentication:
  - the reviewed Search and OAI-PMH docs explicitly say `No API key is needed`
  - the broader Data Services site describes an open-data policy and the reviewed pages did not publish any shared auth requirement for the public routes below
  - this conflicts with the old category-index metadata that labeled Rijksmuseum as `apiKey`
- Formats:
  - Search responses follow the Linked Art Search JSON model
  - OAI-PMH responses are XML
  - LDES pages are JSON-LD / RDF-based linked-data documents
  - SRU responses are UTF-8 and default to MARCXML, with `dc` and `rm` alternatives documented
  - the linked-data resolver supports profile/media-type negotiation and can return linked-data serializations such as Turtle and RDF/XML
  - IIIF Image returns image metadata (`info.json`) and binary image responses; IIIF Presentation returns manifest JSON
- Rate limits:
  - no numeric rate-limit quota was published on the reviewed pages

## Confirmed endpoints
| Method | Path / URL pattern | Notes |
|---|---|---|
| GET | `https://data.rijksmuseum.nl/search/collection` | Linked Art Search endpoint for collection-object discovery. |
| GET | `https://data.rijksmuseum.nl/oai?verb=Identify` | OAI-PMH repository metadata. |
| GET | `https://data.rijksmuseum.nl/oai?verb=ListMetadataFormats` | Lists available OAI metadata formats such as `edm` and `oai_dc`. |
| GET | `https://data.rijksmuseum.nl/oai?verb=ListSets` | Lists curated OAI sets and their `setSpec` identifiers. |
| GET | `https://data.rijksmuseum.nl/oai?verb=ListRecords` | Harvests full OAI records with optional filtering/pagination parameters. |
| GET | `https://data.rijksmuseum.nl/oai?verb=GetRecord` | Retrieves one specific OAI record. |
| GET | `https://data.rijksmuseum.nl/oai?verb=ListIdentifiers` | Retrieves OAI record headers / identifiers without full metadata bodies. |
| GET | `https://data.rijksmuseum.nl/ldes/collection.json` | Root Linked Data Event Stream for all exposed resources. |
| GET | `https://data.rijksmuseum.nl/ldes/dataset/{datasetNumber}/collection.json` | Dataset-scoped LDES root when a dataset number is known. |
| GET | `http://library.rijksmuseum.nl:9998/biblios` | SRU bibliographic search endpoint using `operation=searchRetrieve`. |
| GET | `https://id.rijksmuseum.nl/{id}` | Real-world object identifier; docs say this returns `303` to the metadata identifier. |
| GET | `https://data.rijksmuseum.nl/{id}` | Metadata-object dereference endpoint with content negotiation support. |
| GET | `https://data.rijksmuseum.nl/cd/collection.json` | IIIF Change Discovery root collection for metadata-change events. |
| GET | `https://iiif.micr.io/{imageId}/info.json` | IIIF Image API metadata endpoint. |
| GET | `https://iiif.micr.io/{imageId}/{region}/{size}/{rotation}/{quality}.{format}` | IIIF Image API binary-image route with crop/resize/rotation/quality/format controls. |
| GET | `https://iiif.micr.io/{imageId}/manifest` | IIIF Presentation manifest endpoint. |

## Confirmed parameters and behavior notes
### Search API
- No API key is needed.
- The docs say the default request without query parameters returns the first `100` collection items.
- Optional documented query parameters:
  - `aboutActor`
  - `creator`
  - `creationDate`
  - `description`
  - `imageAvailable`
  - `material`
  - `memberOfSetId`
  - `objectNumber`
  - `pageToken`
  - `technique`
  - `title`
  - `type`
- `aboutActor`, `creator`, `material`, and `memberOfSetId` can be duplicated.
- `objectNumber` and `creationDate` support wildcard characters `*` and `?`.

### OAI-PMH
- Base URL: `https://data.rijksmuseum.nl/oai`
- Every request requires `verb`.
- Reviewed verb-specific parameters include:
  - `metadataPrefix` on record-harvesting routes
  - `set` for set-specific harvesting
  - `resumptionToken` for pagination
  - `from` and `until` for selective harvesting
  - record-specific lookup inputs on `GetRecord` using identifier + metadata format semantics from the examples and surrounding text
- Timestamps use UTC granularity `YYYY-MM-DDThh:mm:ssZ`.
- Reviewed docs say `ListRecords` returns the first `50` records before continuing with `resumptionToken`.

### LDES
- Root for all exposed resources: `https://data.rijksmuseum.nl/ldes/collection.json`
- Dataset-scoped root pattern: `https://data.rijksmuseum.nl/ldes/dataset/{datasetNumber}/collection.json`
- Dataset numbers exist, but the docs explicitly say discovery of datasets is currently not available.

### SRU
- Base URL pattern: `http://library.rijksmuseum.nl:9998/biblios`
- Reviewed example parameters:
  - `version=1.1`
  - `operation=searchRetrieve`
  - `maximumRecords`
  - `query`
  - `startRecord`
  - optional `recordSchema` values `marcxml`, `dc`, `rm`
- The docs say SRU uses CQL and show searchable indexes such as `title`, `author`, `subject`, `isbn`, `issn`, `editor`, `publisher`, and `cql`.

### Linked-data resolver
- Two PID shapes are documented:
  - `https://id.rijksmuseum.nl/{integer}` for real-world objects
  - `https://data.rijksmuseum.nl/{integer}` for metadata objects
- Query-string negotiation parameters:
  - `_profile` (equivalent to `Accept-Profile`)
  - `_mediatype` (equivalent to `Accept`)
- Header negotiation parameters:
  - `Accept-Profile`
  - `Accept`
- The docs call out special `_profile=alt` behavior for listing available content in JSON.
- Reviewed examples mention profile tokens such as `schema`, `edm`, and `la`.

### IIIF surfaces
- IIIF Change Discovery root: `https://data.rijksmuseum.nl/cd/collection.json`
- IIIF Image / Presentation host: `https://iiif.micr.io`
- Reviewed image examples show image IDs such as `RFwqO` and `ohGMs`.
- Image API path semantics follow the IIIF URI components `{region}`, `{size}`, `{rotation}`, `{quality}`, and `{format}`.

## Response, pagination, and error notes
- Search pagination uses `pageToken`; the docs say follow the `next.id` URL and that each page contains `100` results.
- Search responses expose `id`, `partOf`, `next`, optional `prev`, and `orderedItems` in Linked Art Search format.
- OAI-PMH pagination uses `resumptionToken`; the docs say tokens do not expire.
- LDES and IIIF Change Discovery are ordered collection/page models that paginate by following linked pages rather than classic numeric offsets.
- SRU pagination uses `startRecord`, while page size is controlled with `maximumRecords`.
- The resolver docs describe `303` redirects from `id.rijksmuseum.nl/{id}` to `data.rijksmuseum.nl/{id}`.
- The reviewed docs did not publish a consolidated numeric rate-limit table or a detailed HTTP error-code catalog for these services.

## Important usage notes
- Rijksmuseum's current public docs are no longer the old `https://data.rijksmuseum.nl/object-metadata/api/` page from the category index; that legacy URL now returns `404`, while the active docs live under `https://data.rijksmuseum.nl/docs/`.
- Dataset discovery is explicitly unavailable for both LDES and IIIF Change Discovery; dataset-scoped routes are usable only when the dataset number is already known from another official source.
- Resolver requests from browsers are treated specially: without explicit content negotiation, the docs say the resolver may prefer the canonical Rijksmuseum object homepage, and browser-served content may be wrapped as `text/html` with extra presentation markup.
- The SRU endpoint is still documented on plain HTTP rather than HTTPS.
- Rijksmuseum relies on Micrio for the public IIIF Image and Presentation endpoints instead of serving those two APIs from `data.rijksmuseum.nl` directly.

## Sources inspected
- `https://data.rijksmuseum.nl/`
- `https://data.rijksmuseum.nl/docs/`
- `https://data.rijksmuseum.nl/docs/search`
- `https://data.rijksmuseum.nl/docs/oai-pmh/`
- `https://data.rijksmuseum.nl/docs/ldes/`
- `https://data.rijksmuseum.nl/docs/sru`
- `https://data.rijksmuseum.nl/docs/http/`
- `https://data.rijksmuseum.nl/docs/http/content-negotiation-arguments`
- `https://data.rijksmuseum.nl/docs/http/content-negotiation-headers`
- `https://data.rijksmuseum.nl/docs/iiif/`
- `https://data.rijksmuseum.nl/docs/iiif/cd`
- `https://data.rijksmuseum.nl/docs/iiif/image`
- `https://data.rijksmuseum.nl/docs/iiif/presentation`
