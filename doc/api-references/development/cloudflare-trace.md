# Cloudflare Trace

## Provider metadata
- Category: `Development`
- Provider slug: `cloudflare-trace`
- Docs used manually:
  - `https://github.com/fawazahmed0/cloudflare-trace-api`
  - live trace check: `https://one.one.one.one/cdn-cgi/trace`
  - live geolocation/meta check: `https://speed.cloudflare.com/meta`
- Confirmed base URL families:
  - trace hosts published in the official README: `https://one.one.one.one`, `https://1.0.0.1`, `https://cloudflare-dns.com`, `https://cloudflare-eth.com`, `https://workers.dev`, `https://pages.dev`, `https://cloudflare.tv`, `https://icanhazip.com`
  - metadata/geolocation host published in the official README: `https://speed.cloudflare.com`
- Primary response types confirmed in this pass:
  - `text/plain` key/value lines for trace
  - JSON-style response body for `/meta` (the live browser render wrapped the body in `<pre>{}</pre>` in this session)
- Authentication: none
- Manually confirmed routes in this pass: `2`

## Authentication
- The reviewed official README does not document any auth requirement.
- The directly tested public endpoints responded without credentials.

## Common request/response conventions
- This provider is really two tiny public surfaces documented together in the reviewed official README:
  - the Cloudflare trace route family under `/cdn-cgi/trace`
  - the Cloudflare geolocation/meta route under `/meta`
- Trace responses are newline-delimited `key=value` pairs rather than JSON.
- The observed trace response in this session included fields such as `fl`, `h`, `ip`, `ts`, `visit_scheme`, `uag`, `colo`, `sliver`, `http`, `loc`, `tls`, `sni`, `warp`, `gateway`, `rbi`, and `kex`.
- The `/meta` endpoint is presented as a geolocation API in the reviewed official README.

## Manually confirmed endpoint set

### 1) Cloudflare trace
- Method: `GET`
- Path: `/cdn-cgi/trace`
- Example full URLs confirmed from the official README:
  - `https://one.one.one.one/cdn-cgi/trace`
  - `https://1.0.0.1/cdn-cgi/trace`
  - `https://cloudflare-dns.com/cdn-cgi/trace`
  - `https://cloudflare-eth.com/cdn-cgi/trace`
  - `https://workers.dev/cdn-cgi/trace`
  - `https://pages.dev/cdn-cgi/trace`
  - `https://cloudflare.tv/cdn-cgi/trace`
  - `https://icanhazip.com/cdn-cgi/trace`
- Purpose: return network/request edge metadata for the caller.
- Confirmed query parameters: none documented in the reviewed official README.
- Confirmed response notes:
  - response is plain text with one `key=value` pair per line
  - the reviewed official README explicitly describes these fields:
    - `fl` - Cloudflare web server instance
    - `h` - web server hostname
    - `ip` - client IP address
    - `ts` - epoch timestamp in seconds.millis
    - `visit_scheme` - `https` or `http`
    - `uag` - user agent
    - `colo` - IATA location identifier
    - `sliver` - whether the request is split
    - `http` - HTTP version
    - `loc` - country code
    - `tls` - TLS or SSL version
    - `sni` - whether SNI is encrypted or plaintext
    - `warp` - whether the client is using Cloudflare WARP
    - `gateway` - whether the client is over Cloudflare Gateway
    - `rbi` - whether the client is over Cloudflare Remote Browser Isolation
    - `kex` - TLS key-exchange method

### 2) Cloudflare geolocation/meta
- Method: `GET`
- Path: `/meta`
- Full URL: `https://speed.cloudflare.com/meta`
- Purpose: expose Cloudflare metadata/geolocation information for the caller.
- Confirmed query parameters: none documented in the reviewed official README.
- Confirmed response notes:
  - the reviewed official README labels this as the `Cloudflare Geolocation API`
  - the live browser render in this session displayed the response in a JSON-style `<pre>` block
  - the exact field schema was not as clearly exposed in the reviewed session as the trace format, so I am not inventing undocumented keys

## Pagination
- None documented for either reviewed route family.

## Rate limits
- No numeric rate limit was published in the reviewed official README.
- I did not infer one.

## Error handling
- No formal error envelope or status-code table was published in the reviewed official README.
- The reviewed surfaces behave like public utility endpoints rather than a full versioned REST API.

## Response format notes
- `/cdn-cgi/trace` returns plain text key/value lines.
- `/meta` is presented as a metadata/geolocation endpoint with JSON-style output.
- Neither reviewed route family uses pagination or a wrapped JSON envelope.

## Important usage notes
- The official README presents multiple interchangeable public hostnames for the same `/cdn-cgi/trace` path.
- Because the trace response is plain text, fireROUTE integrations should parse newline-delimited `key=value` pairs rather than expecting JSON.
- The reviewed official material is a lightweight endpoint inventory, not a full Cloudflare product reference.

## Verification notes
This file was manually rebuilt from the reviewed official repository README plus live checks of `https://one.one.one.one/cdn-cgi/trace` and `https://speed.cloudflare.com/meta`.