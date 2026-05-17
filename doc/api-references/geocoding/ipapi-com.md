# ipapi.com

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ipapi-com`
- Official docs used manually:
  - `https://ipapi.com/`
  - `https://docs.apilayer.com/ipapi/docs/api-documentation`
  - `https://docs.apilayer.com/ipapi/docs/ipapi-ip-to-geolocation-api-v-1-0-0`
  - `https://api.swaggerhub.com/apis/apilayer-863/IPapi/1.0.0/swagger.json`
- Public base URL documented by provider: `https://api.ipapi.com/api`
- Transport: `HTTPS`
- Auth model: API key in query parameter `access_key`
- Response formats documented: `json`, `xml`; JSONP is documented via `callback`

## Product / plan notes
- The official homepage markets ipapi as a real-time IP geolocation and reverse-IP lookup API with 45+ data points.
- The homepage advertises a free tier of `5,000 requests per month`.
- The official docs describe optional hostname enrichment and plan-gated security data.

## Confirmed API surface
The official ipapi materials expose 3 request modes:
- `GET /api/{ip}`
- `GET /api/check`
- bulk lookup mode, documented inconsistently across official pages:
  - docs summary page: `POST /api/bulk`
  - linked OpenAPI/Swagger file: `GET /api/{ip1},{ip2},...`

Because both official sources agree that bulk lookup is a distinct higher-tier multi-IP operation, this file treats bulk lookup as one confirmed route family while explicitly preserving the method/path discrepancy.

## Common query parameters
Used across the documented request modes:
- `access_key` - required API key
- `fields` - optional comma-separated field selector
- `hostname` - optional `0` or `1`; include hostname lookup
- `security` - optional `0` or `1`; include security/proxy/Tor/crawler/threat data on eligible plans
- `language` - optional 2-letter localization code
- `output` - optional `json` or `xml`
- `callback` - optional JSONP callback function name

Representative response fields visible in the official schema:
- top-level: `ip`, `hostname`, `type`, `continent_code`, `continent_name`, `country_code`, `country_name`, `region_code`, `region_name`, `city`, `zip`, `latitude`, `longitude`, `msa`, `dma`, `radius`, `ip_routing_type`, `connection_type`
- nested `location`: `geoname_id`, `capital`, `languages`, `country_flag`, `country_flag_emoji`, `calling_code`, `is_eu`
- nested `time_zone`: `id`, `current_time`, `gmt_offset`, `code`, `is_daylight_saving`
- nested `currency`: `code`, `name`, `plural`, `symbol`, `symbol_native`
- nested `connection`: `asn`, `isp`, `sld`, `tld`, `carrier`, `home`, `organization_type`, `isic_code`, `naics_code`
- nested `security`: proxy/crawler/Tor/threat-related flags and descriptors

## 1) Standard single-IP or single-domain lookup
- Method: `GET`
- Path pattern: `/api/{ip}`
- Full URL pattern: `https://api.ipapi.com/api/{ip}?access_key=<key>`
- Purpose: return geolocation/intelligence data for one IPv4 address, IPv6 address, or domain

Path parameter:
- `ip` - required lookup target; the official OpenAPI description says this can be an IPv4, IPv6, or domain name

Usage notes:
- This is the canonical single-resource lookup route shown by both the docs summary page and the linked Swagger/OpenAPI reference.
- JSON is the default output; XML requires `output=xml`.

## 2) Origin-IP lookup
- Method: `GET`
- Path: `/api/check`
- Full URL pattern: `https://api.ipapi.com/api/check?access_key=<key>`
- Purpose: return the geolocation/intelligence data for the IP address making the request

Documented query parameters:
- `access_key`
- `fields`
- `hostname`
- `security`
- `language`
- `output`
- `callback`

Usage note:
- The official docs describe this route as the way to detect the requestor's own public IP details without supplying an explicit path IP.

## 3) Bulk lookup
- Official documentation discrepancy:
  - the high-level API-documentation page summarizes bulk lookup as `POST /api/bulk`
  - the linked Swagger/OpenAPI file describes bulk lookup as `GET /api/{ip1},{ip2},...`
- Purpose: return multiple IP lookup results in one request

Shared official behavior notes:
- bulk lookup is a distinct paid/higher-tier feature
- the linked OpenAPI description says bulk mode accepts a comma-separated list of IPs/domains
- the linked OpenAPI description caps bulk requests at `50` values
- the same optional controls are documented: `fields`, `hostname`, `security`, `language`, `output`, `callback`

fireROUTE implementation caution:
- verify the active bulk method/path against a live authenticated account before hard-coding an adapter, because the provider's own current summary page and current linked OpenAPI file disagree on this one operation.

## Errors, rate limits, and pagination
- No pagination model is documented.
- The linked OpenAPI file documents these response/error classes:
  - `400` - malformed request or invalid parameters
  - `401` - missing or invalid access key
  - `402` - requested function requires a higher plan
  - `403` - monthly or rate usage limit reached
  - `422` - too many IPs in a bulk request
  - `500` - internal server error
- The inspected official pages did not expose a public per-second rate-limit table.
- The homepage does publicly advertise the free monthly quota (`5,000` requests/month).

## Canonical fireROUTE notes
- Auth is query-string based (`access_key`), not header-based, in the inspected official docs.
- `/api/check` is a distinct operation and should not be collapsed into the generic single-IP route.
- The bulk route should remain provider-specific until the official method/path discrepancy is revalidated.
- `security=1` materially changes response shape by adding security/risk fields.

## Verification notes
- This file was manually rebuilt from the live official ipapi site, APILayer docs pages, and the linked official Swagger/OpenAPI file using browser tools.
