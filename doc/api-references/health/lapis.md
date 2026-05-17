# LAPIS

## Provider metadata
- Category: `Health`
- Provider slug: `lapis`
- Official docs/pages used:
  - `https://lapis.cov-spectrum.org/open/v2/docs/getting-started/introduction`
  - `https://lapis.cov-spectrum.org/open/v2/docs/references/open-api-definition`
  - `https://lapis.cov-spectrum.org/open/v2/docs/concepts/authentication`
  - `https://lapis.cov-spectrum.org/open/v2/docs/concepts/request-methods`
  - `https://lapis.cov-spectrum.org/open/v2/docs/concepts/response-format`
  - `https://lapis.cov-spectrum.org/open/v2/docs/concepts/data-versions`
  - `https://lapis.cov-spectrum.org/open/v2/docs/concepts/request-id`
  - `https://lapis.cov-spectrum.org/open/v2/api-docs`
- Current official API base URL: `https://lapis.cov-spectrum.org/open/v2`
- Reviewed instance/product notes:
  - the reviewed public instance identifies itself as `Instance for SARS-CoV-2`
  - the docs describe LAPIS as `Lightweight API for Sequences`
  - the docs page title reviewed in this run was `LAPIS (version 0.8.3)`
- Auth model:
  - the official authentication guide for this reviewed instance explicitly says it does not require authentication to access its data
  - the same guide says other LAPIS instances may require an access token and would return `401 Unauthorized` when unauthenticated
  - the reviewed OpenAPI document for this public instance did not publish any security scheme
- Request methods:
  - most query endpoints support both `GET` and `POST`
  - the official guide says `GET` is ideal for shareable/browser URLs
  - the guide says `POST` with JSON body is required for some advanced queries that are not possible with `GET`
- Response formats:
  - non-sequence data endpoints typically support `JSON`, `CSV`, `CSV-WITHOUT-HEADERS`, `TSV`, and `TSV-ESCAPED`
  - sequence endpoints support `FASTA`, `JSON`, and `NDJSON`
  - the docs say `Accept` headers can request formats, but explicit request parameters take precedence
- Public rate-limit note: no numeric rate-limit table or quota guidance was published on the reviewed official docs pages
- Manually confirmed route count: `26` concrete paths

## Authentication and access
- The official authentication guide says this public SARS-CoV-2 LAPIS instance is open and does not require authentication.
- The same guide says LAPIS can be configured with authentication on other instances.
- When authentication is required on another instance, the official docs say callers should expect `401 Unauthorized` until they include a valid access token.
- The official docs do not publish one universal token-acquisition route because it depends on the identity provider configured for each LAPIS deployment.

## Common request behavior
### GET and POST support
- The official guide says LAPIS supports both `GET` and `POST` for queries.
- `GET` encodes filters and fields in the URL and is intended for direct browser use and shareable queries.
- `POST` sends JSON in the request body and is intended for programmatic or more advanced queries.
- The official example for `/sample/aggregated` shows:
  - `GET` with comma-separated repeated values such as `fields=country,date`
  - `POST` with `Content-Type: application/json`

### Shared query parameters seen in the reviewed OpenAPI spec
Common data-query routes repeatedly expose these parameters:
- `sequenceFilters`
- `fields`
- `orderBy`
- `nucleotideMutations`
- `aminoAcidMutations`
- `nucleotideInsertions`
- `aminoAcidInsertions`
- `limit`
- `offset`
- `dataFormat`
- `X-Request-ID` header
- `downloadAsFile`
- `downloadFileBasename`
- `compression`

### Pagination and result-windowing
- The reviewed schema defines:
  - `limit` - maximum number of entries to return
  - `offset` - offset of the first entry to return
- LAPIS therefore uses offset/limit-style pagination rather than next/previous-link pagination.

### Response metadata
- The official data-version guide says every response carries the data version so multi-request analyses can stay consistent.
- The guide says data versions are available in the `lapis-data-version` response header and, for JSON responses, in the `dataVersion` field.
- The official request-ID guide says callers may send `X-Request-Id` and LAPIS will also include a request ID in responses.
- In this run, a live `GET /sample/info` response returned JSON fields including `dataVersion`, `requestId`, `requestInfo`, `lapisVersion`, and `siloVersion`.

### Response-format notes
- The official response-format guide says endpoint response formats are endpoint-specific and visible in Swagger.
- `200` indicates success; other response codes indicate errors.
- CSV/TSV responses are documented as RFC 4180-compliant; the docs warn that embedded newlines/delimiters are quoted.
- `TSV-ESCAPED` is offered as an alternative where delimiters/newlines are escaped instead of quoted.
- Sequence outputs default to FASTA and can also be returned as JSON or NDJSON.
- The docs specifically call out `NDJSON` as useful for streaming large downloads line-by-line.

## Canonical endpoints
### Sequence retrieval and derived sequence views
1. `GET, POST /sample/unalignedNucleotideSequences` - fetch unaligned nucleotide sequences
2. `GET, POST /sample/alignedNucleotideSequences` - fetch aligned nucleotide sequences
3. `GET, POST /sample/alignedAminoAcidSequences` - fetch aligned amino-acid sequences across genes
4. `GET, POST /sample/alignedAminoAcidSequences/{gene}` - fetch aligned amino-acid sequences for one gene

### Mutation and insertion analysis
5. `GET, POST /sample/nucleotideMutations` - analyze nucleotide mutations
6. `GET, POST /sample/aminoAcidMutations` - analyze amino-acid mutations
7. `GET, POST /sample/nucleotideInsertions` - analyze nucleotide insertions
8. `GET, POST /sample/aminoAcidInsertions` - analyze amino-acid insertions

### Aggregation, details, tree, and ancestor queries
9. `GET, POST /sample/aggregated` - aggregate sequences across selected fields
10. `GET, POST /sample/details` - return detail rows for matching sequences
11. `GET, POST /sample/phyloSubtree` - return phylogenetic subtree data
12. `GET, POST /sample/mostRecentCommonAncestor` - compute MRCA-style output for matching sequences

### Query parsing and time-series helpers
13. `POST /query/parse` - parse LAPIS query expressions
14. `POST /component/queriesOverTime` - time-series helper for query counts/results over time
15. `POST /component/nucleotideMutationsOverTime` - time-series helper for nucleotide mutations over time
16. `POST /component/aminoAcidMutationsOverTime` - time-series helper for amino-acid mutations over time

### Instance metadata and reference information
17. `GET /sample/referenceGenome` - return reference-genome data
18. `GET /sample/lineageDefinition/{column}` - return lineage-definition data for a named column
19. `GET /sample/info` - return instance metadata and versions
20. `GET /sample/databaseConfig` - return the database/configuration view used by this instance

### Operational actuator endpoints exposed in the same official Swagger inventory
21. `GET /actuator` - actuator root endpoint
22. `GET /actuator/metrics` - metrics listing
23. `GET /actuator/metrics/{requiredMetricName}` - one metric detail endpoint
24. `GET /actuator/health` - health endpoint
25. `GET, DELETE /actuator/caches` - inspect or clear caches
26. `GET, DELETE /actuator/caches/{cache}` - inspect or clear one named cache

## Parameters and path notes
### Key path parameters
- `{gene}` on `/sample/alignedAminoAcidSequences/{gene}` is required.
- The reviewed schema enumerates these allowed gene values for the reviewed SARS-CoV-2 instance:
  - `E`
  - `M`
  - `N`
  - `ORF1a`
  - `ORF1b`
  - `ORF3a`
  - `ORF6`
  - `ORF7a`
  - `ORF7b`
  - `ORF8`
  - `ORF9b`
  - `S`
- `{column}` on `/sample/lineageDefinition/{column}` is required and identifies the lineage-definition column to inspect.
- `{requiredMetricName}` and `{cache}` are actuator path parameters for operational endpoints.

### Example parameter surfaces confirmed in the reviewed spec
- `GET /sample/aggregated` supports `sequenceFilters`, `fields`, `orderBy`, mutation/insertion filters, `limit`, `offset`, `dataFormat`, `downloadAsFile`, `downloadFileBasename`, `compression`, and optional `X-Request-ID`.
- `POST /sample/aggregated` accepts `application/json` and `application/x-www-form-urlencoded` request bodies.
- `GET /sample/details` supports the same broad filter family, but uses `DetailsFields` and `DetailsOrderByFields` for result shaping.
- `GET /sample/unalignedNucleotideSequences` adds sequence-specific controls such as `fastaHeaderTemplate` and `SequencesDataFormat`.
- `GET /sample/alignedAminoAcidSequences/{gene}` adds the required `gene` path parameter plus the same sequence-query controls.
- `POST /query/parse` accepts `application/json` and uses only the optional `X-Request-ID` header outside the request body.

## Errors and status notes
- The official response-format page says `200` means success and other status codes indicate errors.
- The official authentication guide explicitly documents `401 Unauthorized` for LAPIS instances that require auth when a caller omits credentials.
- The reviewed OpenAPI spec commonly lists `200` and `500` responses for the data-query endpoints.
- The official Swagger page says callers can inspect response codes and example payloads for each route in the generated Swagger UI.

## Important usage notes from the official docs
- The official introduction describes LAPIS as a pathogen-sequence API for data retrieval, flexible aggregation, and mutation/filter-based genomic epidemiology queries.
- The official docs say metadata and aggregated data can be returned as JSON/CSV/TSV-family formats, while sequences are provided primarily as FASTA.
- The official docs say LAPIS is built for very large pathogen datasets and uses SILO as its query engine.
- The official OpenAPI/Swagger page says the Swagger UI is generated from the LAPIS database config and is instance-specific.
- The data-version guide emphasizes that LAPIS does not preserve older dataset snapshots for version browsing; data-version metadata is meant to help clients keep multi-request analyses internally consistent.
- The request-ID guide explicitly asks users to include the request ID when reporting issues.

## fireROUTE normalization notes
- Treat this provider as the public SARS-CoV-2 LAPIS instance currently exposed at `https://lapis.cov-spectrum.org/open/v2`.
- Preserve the distinction between:
  - data-query routes under `/sample/*`
  - query-helper/component routes under `/component/*` and `/query/*`
  - operational Spring Boot actuator routes under `/actuator/*`
- Do not assume auth is universally absent on every LAPIS deployment; only this reviewed public instance is explicitly documented as open.
- Preserve format flexibility in fireROUTE route docs because LAPIS supports JSON plus multiple tabular and sequence-specific formats.