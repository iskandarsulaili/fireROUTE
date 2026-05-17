# IPstack

## Provider metadata
- Category: `APILayer Featured`
- Provider slug: `ipstack`
- Official docs inspected manually:
  - `https://ipstack.com/`
  - official quickstart/docs pages linked from the site
- Confirmed API base URL: `http://api.ipstack.com`
- Response format confirmed from docs: JSON and XML
- Authentication model: query-string `access_key`
- Manually confirmed routes in this pass: `3`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/{ip}` | Standard lookup for one IPv4 or IPv6 address | required `access_key`; optional `fields`, `hostname`, `security`, `language`, `callback`, `output` |
| GET | `/{ip1,ip2,...}` | Bulk lookup for multiple IP addresses | required `access_key`; optional field/filter params as above |
| GET | `/check` | Lookup the requester IP address | required `access_key`; optional field/filter params as above |

## Usage notes
- The official quickstart explicitly lists Standard Lookup, Bulk Lookup, and Requester Lookup as the three main endpoints.
- Example requests in the docs use `http://api.ipstack.com/...` with query-string auth.
- Optional enrichment families visible on the site include location, timezone, currency, connection, and security data.

## Plan and transport notes
- The official site markets HTTPS support and security enrichment as plan-sensitive features.
- The inspected public docs did not expose one simple numeric rate-limit table.

## Verification notes
This file was manually rebuilt from IPstack's official site and linked quickstart documentation.