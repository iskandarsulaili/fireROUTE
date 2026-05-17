# Dog Facts

## Overview
- Provider: Dog API by kinduff
- Category: Animals
- Official docs: `https://kinduff.github.io/dog-api/`
- Base URL: `https://dog-api.kinduff.com`
- Canonical docs note: the homepage advertises `http://dog-api.kinduff.com`, but live requests redirected to HTTPS during manual review
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: none documented
- Rate limits: no numeric rate limit documented on the official homepage

## Confirmed endpoint

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/facts` | optional `number` query parameter | Returns dog facts as a JSON payload. The docs show `?number=5` as the canonical example for requesting multiple facts. |

## Query parameter notes
- `number` — optional integer-like count of facts to return.
- The official site only documents this single query parameter and does not publish min/max bounds.

## Response format notes
- The homepage says `/api/facts` returns an object with dog facts.
- During manual review, live responses used JSON with these observed fields:
  - `facts` — array
  - `success` — boolean
- The provider does not publish a formal JSON schema beyond the example route table.

## Error and availability notes
- No formal error-body schema or status-code matrix is documented.
- During live manual review, requests to `/api/facts` returned `{"facts":[],"success":false}` rather than populated facts, so consumers should tolerate empty-array / `success: false` responses in addition to ordinary HTTP failures.
- The project site also contains Slack-installation information, but that is separate from the public HTTP API surface.

## Integration notes for fireROUTE
- Treat this as a single-route JSON provider with one optional count parameter.
- Preserve the provider's minimal response contract instead of assuming richer metadata fields.
- Because live responses appeared degraded during review, adapters should handle empty-success-false payloads gracefully and avoid assuming that a `200` response always contains facts.

## Sources inspected
- `https://kinduff.github.io/dog-api/`
- `https://dog-api.kinduff.com/api/facts?number=1`
- `http://dog-api.kinduff.com/api/facts?number=3`
