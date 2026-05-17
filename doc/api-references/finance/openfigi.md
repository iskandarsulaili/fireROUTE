# OpenFIGI

Official docs manually reviewed:
- https://www.openfigi.com/api/overview
- https://www.openfigi.com/api/documentation
- https://www.openfigi.com/api/openapi-spec

## Overview
OpenFIGI provides an identifier-mapping API for translating third-party financial identifiers into FIGIs and for searching/filtering FIGI records.

From the official overview and OpenAPI pages reviewed in the browser:
- Production server: `https://api.openfigi.com/v3`
- Protocol: HTTPS JSON API
- Primary auth header: `X-OPENFIGI-APIKEY`
- API access model: unauthenticated access is allowed but receives lower limits; authenticated access gets higher rate and request-size limits

## Authentication
The documentation explicitly says API keys are sent via the HTTP header below:

```http
X-OPENFIGI-APIKEY: your_api_key
Content-Type: application/json
Accept: application/json
```

The reviewed overview page also shows that requests can be sent without an API key, but rate limits are lower.

## Confirmed v3 endpoints
The official documentation and OpenAPI viewer expose these current v3 routes.

| Method | Path | Purpose |
|---|---|---|
| POST | `/mapping` | Map one or more third-party identifiers to FIGIs |
| GET | `/mapping/values/{key}` | Enumerate allowed values for a supported mapping key |
| POST | `/search` | Search FIGIs using descriptive criteria |
| POST | `/filter` | Filter FIGIs using structured filter criteria |

Manual route count confirmed from the reviewed official docs: **4**.

## Endpoint details

### `POST /mapping`
Official description: “Allows mapping from third-party identifiers to FIGIs.”

Confirmed request characteristics from the reviewed OpenAPI page:
- Request body required
- Content type: `application/json`
- Body shape: array of mapping jobs
- Example body shown by the docs:

```json
[
  {
    "idType": "ID_BB_GLOBAL",
    "idValue": "BBG000BLNNH6"
  }
]
```

Additional mapping example on the docs uses:
- `idType`
- `idValue`
- `exchCode`

Example authenticated mapping call shown on the reviewed page:

```bash
curl 'https://api.openfigi.com/v3/mapping' \
  --request POST \
  --header 'Content-Type: application/json' \
  --header 'X-OPENFIGI-APIKEY: abcdefghijklmnopqrstuvwxyz' \
  --data '[{"idType":"TICKER","idValue":"IBM","exchCode":"US"}]'
```

Confirmed successful response format:
- JSON array
- Each element may contain `data` with FIGI records
- The example response includes fields such as `figi`, `securityType`, `marketSector`, `ticker`, `name`, `exchCode`, `shareClassFIGI`, `compositeFIGI`, `securityType2`, `securityDescription`, and `metadata`
- The docs also show warning-only elements such as `{ "warning": "string" }`

### `GET /mapping/values/{key}`
Confirmed from the official route list and OpenAPI path template.

Confirmed path parameter:
- `key` — the mapping field whose allowed values you want to enumerate

The older generated route inventory and the current official docs both show `marketSecDes` as a representative key value, but the canonical route shape documented by OpenFIGI is:

```text
GET /mapping/values/{key}
```

### `POST /search`
Confirmed from the official route list and OpenAPI viewer.

Confirmed request characteristics:
- JSON request body
- OpenAPI schema name shown by the docs: `SearchRequest`
- Intended for descriptive/security-attribute search rather than direct identifier mapping

The reviewed rate-limit table confirms search is part of the “Search / Filter API” family.

### `POST /filter`
Confirmed from the official route list and OpenAPI viewer.

Confirmed request characteristics:
- JSON request body
- OpenAPI schema name shown by the docs: `FilterRequest`
- Intended for structured filtering across FIGI data

The reviewed rate-limit table confirms filter is part of the “Search / Filter API” family.

## Rate limits
The official documentation publishes request limits for both anonymous and authenticated traffic.

### Mapping API
| Limitation | Without API key | With API key |
|---|---:|---:|
| Max amount of requests | 25 per minute | 25 per 6 seconds |
| Max jobs per request | 10 jobs | 100 jobs |

### Search / Filter API
| Limitation | Without API key | With API key |
|---|---:|---:|
| Max amount of requests | 5 per minute | 20 per minute |
| Max results | 15,000 | 15,000 |
| Max results per page | 100 | 100 |
| Max amount of pages | 150 | 150 |

The official docs also state that responses include these rate-limit headers:
- `ratelimit-limit`
- `ratelimit-remaining`
- `ratelimit-reset`

Status `429` is returned when a rate-limiting window is exceeded.

## Pagination
The reviewed rate-limit section explicitly confirms pagination constraints for search/filter responses:
- maximum results per page: `100`
- maximum pages: `150`
- maximum total results: `15,000`

The visible browser-reviewed excerpt did not expose the exact request field names for page selection, so fireROUTE should treat pagination as provider-specific body/query semantics layered on top of the search/filter endpoints.

## Errors
The official docs include both a general status-code table and operation-level responses.

Confirmed operation-level / general statuses seen in the reviewed docs:
- `200` — OK
- `400` — bad request / invalid payload
- `401` — invalid API key
- `405` — invalid HTTP method
- `406` — unsupported `Accept` type
- `415` — unsupported media type
- `429` — rate limit reached

Confirmed example error messages shown on the mapping operation page:
- `Bad request.`
- `Invalid API key.`
- `Invalid HTTP method.`
- `Unsupported 'Accept' type.`

## Response format
Confirmed from the reviewed docs:
- request bodies use JSON
- successful responses use JSON
- `Accept: application/json` is supported and explicitly shown in the operation viewer

## Important usage notes
- OpenFIGI’s reviewed documentation highlights **v3** as the current production base path.
- The docs still reference **v2**, but label it **“Sunsetting July 2026.”** fireROUTE should prefer v3.
- `POST /mapping` is the canonical normalized route for identifier translation and is the best default capability for a fireROUTE finance adapter.
- Search/filter limits are substantially lower than mapping limits; batch-heavy integrations should avoid using search when direct ID mapping is possible.
- The `GET /mapping/values/{key}` endpoint is useful for validating provider-specific enumerations before constructing mapping jobs.

## fireROUTE notes
- Canonicalize OpenFIGI as a read-heavy identifier/symbology provider.
- Preserve raw mapping/search/filter request shapes instead of trying to over-normalize the provider’s domain-specific identifier vocabulary.
- Prefer `POST /mapping` for the default route, with optional passthrough access to `/search`, `/filter`, and `/mapping/values/{key}` for advanced workflows.
