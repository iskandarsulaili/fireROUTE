# IP 2 Country

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ip-2-country`
- Official docs used manually:
  - `https://ip2country.info/`
  - provider example endpoint checked from that page: `https://api.ip2country.info/ip?5.6.7.8`
- Public API base URL documented by provider: `https://api.ip2country.info`
- Transport: `HTTPS`
- Auth model: the legacy landing page does not document a request credential for the shown endpoint; the same page prominently urges users to migrate to `ipapi.com` for API-key-based access
- Response formats documented: `JSON` for the lookup endpoint; `HEAD` is also shown as supported on the same URL pattern

## Product and access notes
- The official landing page now presents IP2Country as a legacy service being merged into `ipapi.com`.
- The page explicitly says: `IP2country is joining ipapi.com` and tells users to `switch to ipapi`.
- The visible product description says the API supports both `IPv4` and `IPv6`.
- The inspected landing page exposes only a single legacy request pattern and does not publish a richer reference, schema table, or onboarding guide.

## Confirmed API surface
The inspected official page confirms `1` legacy lookup route family:
1. `GET` or `HEAD /ip?{ip_address}`

## 1) Legacy IP-to-country lookup
- Methods shown by provider: `GET`, `HEAD`
- Path pattern shown on the page: `/ip?{ip_address}`
- Full URL pattern shown by provider: `https://api.ip2country.info/ip?5.6.7.8`
- Purpose: map an IPv4 or IPv6 address to country/geolocation data

Documented request details:
- The page shows the IP address directly after the `?` without a named query key.
- No alternate parameter names, headers, or request-body shapes are documented on the inspected page.
- No separate bulk, reverse, batch, or status route is documented on the inspected page.

## Pagination, errors, rate limits, and format notes
- No pagination model is documented on the inspected official page.
- No published rate-limit table is visible on the inspected official page.
- No response field reference is published on the inspected official page beyond calling it a `JSON API`.
- When I manually opened the provider's own example host from the landing page, the endpoint returned a Cloudflare `522 Connection timed out` page in the browser rather than a successful JSON response.
- Because the example endpoint currently timed out, the legacy route appears unstable even though it is still advertised on the provider-controlled landing page.

## Canonical fireROUTE notes
- Treat this provider as a legacy, migration-state service.
- Only one public route family could be confirmed from current official content.
- Keep auth marked as effectively undocumented on the legacy surface itself; the page's API-key guidance points users to the replacement `ipapi.com` product rather than documenting a key for `api.ip2country.info`.
- Expect minimal documentation depth and possible runtime instability on the advertised endpoint.

## Verification notes
- This file was manually rebuilt from the live official IP2Country landing page and the provider's own example endpoint using browser tools only.
