# OpenAQ

## Provider metadata
- Category: `Environment`
- Provider slug: `openaq`
- Official docs inspected manually:
  - `https://docs.openaq.org/`
  - `https://docs.openaq.org/using-the-api/quick-start`
  - multiple official resource pages under the same docs site
- Confirmed API base URL: `https://api.openaq.org/v3`
- Response format confirmed from docs: JSON
- Authentication model: API key in `X-API-Key` header
- Manually confirmed routes in this pass: `12`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/locations/{id}` | Retrieve one location record | required location `id`; `X-API-Key` header |
| GET | `/countries` | List countries represented in the catalog | API key header |
| GET | `/instruments` | List instrument records | API key header |
| GET | `/licenses` | List license metadata | API key header |
| GET | `/locations` | List locations | API key header; standard list pagination |
| GET | `/manufacturers` | List manufacturers | API key header |
| GET | `/measurements` | List measurement records | API key header; query filters described elsewhere in docs |
| GET | `/owners` | List owners | API key header |
| GET | `/parameters` | List measured parameters | API key header |
| GET | `/providers` | List providers | API key header |
| GET | `/sensors` | List sensors | API key header |
| GET | `/locations/{id}/latest` and `/parameters/{id}/latest` | Retrieve latest values by location or by parameter | required location or parameter `id`; API key header |

## Usage notes
- The docs state this documentation covers OpenAQ API version 3.
- Version 1 and version 2 endpoints are retired and return `410 Gone`.
- The quick-start guide uses `curl --request GET --url "https://api.openaq.org/v3/locations/8118" --header "X-API-Key: ..."` as the canonical example.

## Pagination, rate limits, and errors
- Paginated responses include a `meta` object with fields such as `page`, `limit`, and `found`.
- The docs include dedicated pages for API key management, rate limits, pagination, and error handling.
- The docs enumerate dedicated error pages including `401`, `403`, `404`, `405`, `408`, `410`, `422`, and `429`.

## Important fireROUTE notes
- OpenAQ is a broad global air-quality data platform rather than a narrowly scoped single-endpoint API.
- The docs strongly separate latest-value convenience endpoints from the fuller historical/listing resources.

## Verification notes
This file was manually rebuilt from OpenAQ's official documentation site.