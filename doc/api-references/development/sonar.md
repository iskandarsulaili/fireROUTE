# Sonar

## Provider metadata
- Category: `Development`
- Provider slug: `sonar`
- Docs used manually:
  - `https://github.com/Cgboal/SonarSearch`
  - official source file `https://github.com/Cgboal/SonarSearch/blob/master/readme.md`
  - official source files `cmd/crobat-server/rest/server.go` and `cmd/crobat-server/main.go`
- Confirmed API base URL from the official public instance note: `https://sonar.omnisint.io`
- Self-hosted server defaults from source: REST on port `1998`, gRPC on port `1997`
- Primary media type: JSON
- Authentication: none
- Manually confirmed REST routes in this pass: `5`

## Authentication
- The official README explicitly states: `No authentication is required to use the API, nor special headers`.
- The reviewed REST router source does not add token, cookie, or signed-query validation.

## Common request/response conventions
- Public instance URL documented in the official README: `https://sonar.omnisint.io`
- Self-hosted default REST listener from source: `http://<host>:1998`
- All confirmed REST operations use `GET`.
- Supported query parameters come from the shared pagination helper:
  - `limit` - number of results to take; defaults to `100000` if omitted or unparsable
  - `page` - 1-based page number; defaults to `1`; `0` is normalized back to `1`
- Pagination math in source is `skip = (page - 1) * limit`.
- Successful responses are JSON arrays or JSON objects depending on the route.

## Manually confirmed endpoint set

### 1) Get subdomains for a domain
- Method: `GET`
- Path: `/subdomains/{domain}`
- Full URL pattern: `https://sonar.omnisint.io/subdomains/{domain}`
- Purpose: return all known subdomains for the requested domain
- Path parameters:
  - `domain` - target domain name
- Query parameters:
  - `limit` - optional result count limit
  - `page` - optional page number
- Response notes:
  - success response is a JSON array of subdomain strings

### 2) Get unique TLD/base-domain variants for a domain
- Method: `GET`
- Path: `/tlds/{domain}`
- Full URL pattern: `https://sonar.omnisint.io/tlds/{domain}`
- Purpose: derive unique registrable-domain/TLD combinations from the matched result set
- Path parameters:
  - `domain` - target domain name
- Query parameters:
  - `limit`
  - `page`
- Response notes:
  - success response is a JSON array of strings
  - the implementation derives results by parsing matched subdomains and deduplicating the resulting `{domain}.{tld}` values

### 3) Get all matching results across all TLDs
- Method: `GET`
- Path: `/all/{domain}`
- Full URL pattern: `https://sonar.omnisint.io/all/{domain}`
- Purpose: return all matched results across all TLDs for the requested domain
- Path parameters:
  - `domain` - target domain name
- Query parameters:
  - `limit`
  - `page`
- Response notes:
  - success response is a JSON array

### 4) Reverse-DNS lookup for one IP address
- Method: `GET`
- Path: `/reverse/{ip}`
- Full URL pattern: `https://sonar.omnisint.io/reverse/{ip}`
- Purpose: return domains associated with one IP address
- Path parameters:
  - `ip` - IPv4/IPv6 address string as accepted by the backend dataset/searcher
- Query parameters:
  - `limit`
  - `page`
- Response notes:
  - success response is a JSON array of domain strings for the requested IP

### 5) Reverse-DNS lookup for a CIDR range
- Method: `GET`
- Path: `/reverse/{ip}/{cidr}`
- Full URL pattern: `https://sonar.omnisint.io/reverse/{ip}/{cidr}`
- Purpose: return reverse-DNS results for a CIDR range
- Path parameters:
  - `ip` - base IP address
  - `cidr` - CIDR prefix length; the README describes this segment as a mask
- Query parameters:
  - `limit`
  - `page`
- Response notes:
  - success response is a JSON object keyed by queried range/IP entries rather than a single flat array

## Pagination
- All five REST routes support `limit` and `page` through the shared helper in the official REST server source.
- Default `limit` is `100000` when no valid integer is supplied.
- Default `page` is `1`.

## Rate limits
- No public numeric rate limit is documented in the reviewed README or source.
- The official materials do not document API keys, quotas, concurrency ceilings, or retry windows.

## Error handling
- REST handler failures return HTTP `500` with JSON body shape:
  - `{ "error": "...message..." }`
- The reviewed source emits this format for domain-search and reverse-search errors.
- The official materials do not document a richer typed error code system.

## Response format notes
- REST responses are JSON.
- The project also exposes a gRPC API used by the CLI client, but the reviewed official materials in this pass only enumerate the five REST endpoints above.

## Important usage notes
- The official README states that the public omnisint instance became stale and was taken offline after Rapid7 revoked public dataset access.
- The same README still documents the REST surface and provides full self-hosting instructions, while the current source code confirms the route list above.
- fireROUTE should therefore treat this provider as route-documented but operationally dependent on whether a maintainer-hosted or self-hosted instance is actually available.

## Verification notes
This file was manually rebuilt from the official SonarSearch repository README and current REST server source using browser-based source inspection.