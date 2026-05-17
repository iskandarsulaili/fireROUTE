# Voidly

## Provider metadata
- Category: `Open Data`
- Provider slug: `voidly`
- Description: `Internet censorship measurements, incidents, and ISP-level blocking data across 126 countries`
- Official docs/pages used:
  - `https://voidly.ai/api-docs`
  - `https://voidly.ai/openapi.json` (linked from the official docs page as `OpenAPI Spec`)
- Confirmed API base URLs:
  - Main API: `https://api.voidly.ai`
  - Semantic-search API: `https://intelligence.voidly.ai:8443`
- Auth model:
  - Public data routes are explicitly marked `No Auth` on the docs page
  - `/hydra/*` routes require `X-API-Key`
  - Alert-management examples also use `X-API-Key`
- Methods officially documented on the reviewed pages: `GET`, `POST`, `PATCH`, `DELETE`
- Response formats officially documented on the reviewed pages: JSON, CSV, JSONL, RSS, Atom, Markdown, BibTeX, RIS
- Rate limits officially documented on the reviewed pages:
  - Demo key: `100 requests/minute`, burst `20`
  - Research key: `1,000 requests/minute`, burst `100`
  - Public data: `No limit`
  - Accessibility API section separately notes `200 req/min`
- Manually confirmed route count: `50`

## API shape and behavior
- Voidly Atlas is a multi-surface censorship-intelligence API exposed primarily from `https://api.voidly.ai`.
- The reviewed docs group routes into Hydra ML detection, open datasets, risk-intelligence APIs, incidents/evidence exports, community-probe operations, and alert subscriptions.
- The semantic incident-similarity search is explicitly documented on a second host, `https://intelligence.voidly.ai:8443`.
- The docs page also links separate Pay and MCP materials; those are distinct product surfaces and are excluded from the route count here.

## Canonical endpoints

### Hydra detection and forecasting
1. `POST /hydra/v1/detect`
2. `POST /hydra/v1/predict`
3. `GET /v1/forecast/{country}/7day`
4. `GET /hydra/v1/threat-level/{country}`
5. `GET /hydra/v1/scores`
6. `GET /hydra/v1/model/info`

### Public data and methodology
7. `GET /data/censorship-index.json`
8. `GET /data/censorship-index.csv`
9. `GET /data/country/{code}`
10. `GET /v1/vpn-accessibility`
11. `GET /data/methodology`

### Platform risk
12. `GET /v1/platforms/scores`
13. `GET /v1/platform/{platform}/risk`
14. `GET /v1/platform/{platform}/risk/{country}`
15. `GET /v1/platforms/country/{country}`

### ISP risk
16. `GET /v1/isp/index`
17. `GET /v1/isp/{asn}/profile`
18. `GET /v1/isp/worst`
19. `GET /v1/isp/compare`

### Service accessibility
20. `GET /v1/accessibility/check`
21. `POST /v1/accessibility/batch`
22. `GET /v1/accessibility/service/{name}`
23. `GET /v1/accessibility/country/{country}/summary`

### Election risk
24. `GET /v1/elections/upcoming`
25. `GET /v1/elections/{country}/briefing`
26. `GET /v1/elections/calendar`

### Incidents and evidence
27. `GET /data/incidents`
28. `GET /data/incidents/stats`
29. `GET /data/incidents/export`
30. `GET /data/incidents/delta`
31. `GET /data/incidents/feed.rss`
32. `GET /data/incidents/feed.atom`
33. `GET /data/incidents/{id}`
34. `GET /data/incidents/{id}/evidence`
35. `GET /data/incidents/{id}/report?format=markdown`
36. `GET /data/incidents/{id}/report?format=bibtex`
37. `GET /data/incidents/{id}/report?format=ris`
38. `GET /v1/incidents/similar`
39. `POST /v1/incidents/similar`

### Community probes
40. `POST /v1/community/register`
41. `POST /v1/community/validate-token`
42. `GET /v1/community/nodes/{nodeId}`
43. `GET /v1/community/leaderboard`
44. `GET /v1/community/nodes`

### Alerts and webhooks
45. `POST /api/alerts/subscribe`
46. `GET /api/alerts/stats`
47. `GET /api/alerts/subscriptions`
48. `DELETE /api/alerts/subscriptions/{id}`
49. `PATCH /api/alerts/subscriptions/{id}`
50. `POST /api/alerts/webhook-test`

## Core parameters and path conventions
### Hydra request/query fields documented on the page
- `country` - ISO 3166-1 alpha-2 code.
- `target` - target domain for active check or prediction.
- `includeISPs` - optional boolean on detection requests.
- `horizon` - prediction horizon in days for `/hydra/v1/predict`.
- `includeHistory` - optional history flag on `/hydra/v1/threat-level/{country}`.
- `minConfidence` - query parameter on `/hydra/v1/scores`.
- `limit` - query parameter on `/hydra/v1/scores`.

### Platform / ISP / accessibility / election parameters
- `platform` - platform slug in path.
- `country` or `code` - country code in path or query depending on route family.
- `asn` - ISP ASN for profile and comparison routes.
- `asns` - comma-separated ASN list for comparison.
- `domain` - service domain on accessibility checks.
- `name` - service-name path variable for accessibility lookups.
- `days` - query parameter for upcoming election lookups.
- `threshold` - high-risk forecast threshold shown in the docs examples.
- `provider` - VPN provider filter for `/v1/vpn-accessibility`.

### Incident and semantic-search parameters
- `country`, `limit` - shown on incidents list examples.
- `format` - export/report format selector with documented values including `csv`, `jsonl`, `json`, `markdown`, `bibtex`, `ris`.
- `since` - delta-sync timestamp.
- `id` - human-readable incident ID or hash ID.
- `query` - natural-language similarity-search text.
- `k` - number of similar incidents to return; docs say default `5`, max `50`.
- Optional semantic-search filters explicitly called out: `country`, `incident_type`, `min_confidence`.

### Community and alert request fields
- Community routes document probe-node registration and token validation, but the page does not publish a full JSON schema on the visible surface reviewed here.
- Alert subscription example fields:
  - `country_code`
  - `min_severity`
  - `webhook_url`
- Alert subscription toggle example field:
  - `enabled`

## Response and pagination notes
- All error responses are documented as JSON objects with `error` and `message` fields.
- `/hydra/v1/detect` returns fields including `blocked`, `confidence`, `blockType`, `sources`, and `lastChecked`.
- `/v1/forecast/{country}/7day` returns `forecast[]`, `summary`, `confidence`, and `model_version`.
- `/data/censorship-index.json` is documented as continuously updated and paired with a CSV export variant.
- `/data/incidents` is explicitly labeled `List incidents (paginated)`, but the reviewed page does not publish the exact page-token/offset parameter names for that list route.
- Incident report routes support multiple citable/export output formats rather than one fixed representation.
- The semantic-search API is documented as supporting both GET query-string use and POST JSON-body use.

## Authentication notes
- The docs page says public data endpoints require no authentication.
- The quickstart and Hydra examples require `X-API-Key`.
- The published demo key is `hydra_demo_key` for testing and is capped at `100 requests/minute`.
- Alert subscription examples also send `X-API-Key`.
- The reviewed page does not publish an OAuth flow or bearer-token alternative.

## Error notes
- Documented HTTP codes:
  - `400 Bad Request`
  - `401 Unauthorized`
  - `404 Not Found`
  - `429 Rate Limited`
  - `500 Server Error`
  - `503 Service Unavailable`
- Official sample error body:
  - `{"error":"BAD_REQUEST","message":"country and target are required"}`
- The docs tell clients to retry `429` and `500` style failures with exponential backoff.
- The `429` guidance says to wait `60` seconds before retrying with backoff.

## Webhook notes
- Alert subscriptions create real-time incident notifications.
- Webhook payloads include an `event`, `timestamp`, and nested `incident` object.
- Signatures use `X-Voidly-Signature: sha256=...` with HMAC-SHA256.
- Retry schedule documented on the page: `2`, `4`, `8`, `16`, `32` minutes.

## Usage notes
- The docs page marks the public data surface as `CC BY 4.0`.
- Voidly positions the Atlas API as free for research and emphasizes open datasets, citation export, and journalistic/research workflows.
- The docs explicitly present human-readable incident IDs such as `IR-2026-0142` as citable identifiers.
- The semantic-search endpoint is on a different host from the rest of the API and should not be collapsed onto `api.voidly.ai`.
- The Accessibility API section specifically advertises `200 req/min` and batch checks of up to `50` domains.

## fireROUTE normalization notes
- Treat Voidly as a multi-family API with two base hosts, not a single-root REST surface.
- Preserve the distinction between authenticated Hydra/alert routes and explicitly unauthenticated public-data routes.
- Preserve format-specific incident report routes and dataset export routes rather than flattening them into a single synthetic download endpoint.
- Preserve the semantic-search host `https://intelligence.voidly.ai:8443` exactly as documented.
- Exclude linked Voidly Pay and MCP surfaces from this provider mapping unless they are documented under a separate provider entry.