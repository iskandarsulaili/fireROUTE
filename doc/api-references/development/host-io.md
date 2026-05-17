# Host.io

## Provider metadata
- Category: `Development`
- Provider slug: `host-io`
- Docs used manually:
  - `https://host.io/docs`
- Confirmed REST API base URL: `https://host.io`
- Primary media type: JSON
- Authentication model: token via HTTP Basic auth username, Bearer token, or `token` query parameter
- Manually confirmed routes in this pass: `5`

## Authentication
From the official Host.io docs:
- every API request requires your API token
- supported auth methods:
  - HTTP Basic auth with the token as the username
  - `Authorization: Bearer YOUR_TOKEN` header
  - `token={TOKEN}` query parameter
- if no token is provided, the docs say the API returns HTTP `400`

## Common request/response conventions
- Base URL: `https://host.io`
- all reviewed endpoints use `GET`
- successful responses are JSON objects
- collection-style lookups that return domain lists support pagination with `page` and `limit`
- docs note that the maximum page size depends on plan; the global technical maximum is `1000`, while the free plan is limited to `5` domains per page
- missing or invalid resources typically return JSON like `{"error": "No details found for ..."}` with HTTP `404`

## Manually confirmed endpoint set

### 1) Get homepage metadata for a domain
- Method: `GET`
- Path: `/api/web/{domain}`
- Full URL example: `https://host.io/api/web/facebook.com`
- Purpose: return homepage metadata scraped for a domain
- Path parameters:
  - `domain` - target domain name
- Query parameters confirmed on the official page:
  - `token` - API token when using query auth
- Response fields explicitly shown in the official example:
  - `domain`
  - `rank`
  - `url`
  - `ip`
  - `date`
  - `length`
  - `encoding`
  - `copyright`
  - `title`
  - `description`
  - `links` - array of linked domains found on the homepage
- Error notes from the official page:
  - HTTP `404` with JSON error if the domain is invalid or has no associated data

### 2) Get DNS records for a domain
- Method: `GET`
- Path: `/api/dns/{domain}`
- Full URL example: `https://host.io/api/dns/facebook.com`
- Purpose: return stored DNS records for a domain
- Path parameters:
  - `domain` - target domain name
- Query parameters confirmed on the official page:
  - `token` - API token when using query auth
- Supported DNS record groups explicitly listed in the docs:
  - `A`
  - `AAAA`
  - `MX`
  - `NS`
- Response fields explicitly shown in the official example:
  - `domain`
  - `a`
  - `aaaa`
  - `mx`
  - `ns`
- Error notes from the official page:
  - HTTP `404` with JSON error if the domain is invalid or has no associated data

### 3) Get related-domain counts for a domain
- Method: `GET`
- Path: `/api/related/{domain}`
- Full URL example: `https://host.io/api/related/google.com`
- Purpose: return counts of related domains across supported lookup dimensions
- Path parameters:
  - `domain` - target domain name
- Query parameters confirmed on the official page:
  - `token` - API token when using query auth
- Response groups explicitly shown in the official example:
  - `ip`
  - `redirects`
  - `backlinks`
  - `asn`
- Response item structure shown in the example:
  - `value`
  - `count`
- Important usage note from the docs:
  - the page points users to `/api/domains/:field/:value` for the full list of searchable relationship fields and for retrieving the actual domain lists
- Error notes from the official page:
  - HTTP `404` with JSON error if the domain is invalid or has no associated data

### 4) Get the combined full record for a domain
- Method: `GET`
- Path: `/api/full/{domain}`
- Full URL example: `https://host.io/api/full/google.com`
- Purpose: return a combined object containing web metadata, DNS data, related-domain counts, and IP geolocation / ASN data
- Path parameters:
  - `domain` - target domain name
- Query parameters confirmed on the official page:
  - `token` - API token when using query auth
- Response sections explicitly shown in the official example:
  - `domain`
  - `dns`
  - `ipinfo`
  - `web`
  - `related`
- Important usage notes from the official page:
  - this endpoint is documented as aggregating the data from `/api/web`, `/api/dns`, `/api/related`, and `IPinfo`
  - the `ipinfo` section can contain keyed objects for both IPv4 and IPv6 addresses
- Error notes from the official page:
  - HTTP `404` with JSON error if the domain is invalid or has no associated data

### 5) List domains associated with a field/value pair
- Method: `GET`
- Path: `/api/domains/{field}/{value}`
- Full URL examples:
  - `https://host.io/api/domains/googleanalytics/UA-61330992`
  - `https://host.io/api/domains/email/office@ssa-vending.com`
  - `https://host.io/api/domains/ns/google.com`
- Purpose: return domains associated with a supported lookup field and the total number of matches
- Path parameters:
  - `field` - lookup type
  - `value` - lookup value for that field
- Supported `field` values explicitly listed on the official page:
  - `ip`
  - `ns`
  - `mx`
  - `asn`
  - `backlinks`
  - `redirects`
  - `adsense`
  - `facebook`
  - `twitter`
  - `instagram`
  - `gtm`
  - `googleanalytics`
  - `email`
- Query parameters confirmed on the official page:
  - `limit` - must be one of `0`, `1`, `5`, `10`, `25`, `100`, `250`, or `1000`; default `25`
  - `page` - zero-indexed page number; default `0`
  - `token` - API token when using query auth
- Response fields explicitly shown in the official examples:
  - a field-specific key such as `googleanalytics`, `email`, `ns`, or `twitter`
  - `page` - present in paginated examples
  - `total`
  - `domains` - array of matching domains
- Important usage notes from the official page:
  - results are limited to a maximum of `1000` per page and a maximum of `10 million` total results
  - `/api/related/{domain}` can be used first to discover which related values exist for a domain before expanding them into domain lists here
- Error notes from the official page:
  - HTTP `404` with JSON error if there is no data for the given field/value pair or if the `limit`/`page` combination is out of bounds

## Pagination
From the official `Pagination and Limits` section:
- list-style domain endpoints use `page` and `limit`
- `page` is zero-indexed
- docs example: `limit=50&page=5` for the IP `8.8.8.8` starts from the 250th result
- technical maximum page size is `1000`
- effective allowed page size depends on plan; the free plan is limited to `5` domains per page

## Rate limits / usage limits
- the reviewed docs do not publish a requests-per-second limit or a header-based rate-limit policy
- usage is plan-dependent through the page-size restrictions described in `Pagination and Limits`
- the official docs explicitly send users to the pricing page to determine how many domains can be requested per API call on their plan

## Error and response notes
- missing auth: HTTP `400` when no token is provided
- reviewed route pages consistently document HTTP `404` with a JSON `error` message when the domain or lookup has no associated data
- response payloads are straightforward JSON objects rather than envelope-wrapped `{ data: ... }` structures
- domain-list lookups expose totals as `total`; related-domain summaries expose arrays of `{ value, count }` objects

## Important usage notes
- the docs model `/api/full/{domain}` as a convenience aggregate endpoint rather than a separate data source
- Host.io examples use query-string token auth heavily, but the docs explicitly support both Basic auth and Bearer auth as alternatives
- `/api/domains/{field}/{value}` is the main expansion endpoint for turning a relationship value into actual matching domain names
- the docs only promise the `A`, `AAAA`, `MX`, and `NS` record groups on `/api/dns/{domain}`

## Verification notes
This file was manually rebuilt from the official Host.io documentation page using browser inspection.