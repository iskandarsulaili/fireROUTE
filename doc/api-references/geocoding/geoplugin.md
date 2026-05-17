# geoPlugin

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geoplugin`
- Official docs used manually:
  - `https://www.geoplugin.com/`
- Public base URL documented by provider: `https://api.geoplugin.com`
- Transport: HTTPS on the inspected endpoint examples
- Auth model observed on the inspected official site: homepage marketing text says `no API key`, but the live code examples and onboarding text show `auth=<key>`; treat API-key usage as the currently documented request form
- Response formats surfaced on the official site: JSON payload example on the homepage plus language/code examples for JavaScript, PHP, XML, JSON, ASP, and CSV integrations

## Confirmed API surface
The currently inspected official site exposes one public HTTP API pattern:
- `GET /?ip={ip}&auth={api_key}`

## 1) IP geolocation lookup
- Method: `GET`
- Path: `/`
- Full URL pattern: `https://api.geoplugin.com?ip={ip}` with an additional `auth` query parameter shown in the official examples
- Purpose: return geolocation and currency/timezone metadata for an IP address

Documented request parameters from the official example code:
- `ip` - target IP address to geolocate; official examples use `8.8.8.8`
- `auth` - API key shown in official example code as a query value appended as `auth=<key>`

Representative response fields visible in the official homepage example include:
- `geoplugin_request`
- `geoplugin_status`
- `geoplugin_region`
- `geoplugin_areaCode`
- `geoplugin_dmaCode`
- `geoplugin_countryName`
- `geoplugin_countryCode`
- `geoplugin_continentName`
- `geoplugin_continentCode`
- `geoplugin_city`
- `geoplugin_regionName`
- `geoplugin_postal_code`
- `geoplugin_longitude`
- `geoplugin_latitude`
- `geoplugin_timezone`
- `geoplugin_currencyCode`
- `geoplugin_currencySymbol_UTF8`
- `geoplugin_currencyConverter`
- `geoplugin_currencySymbol`
- `languages`

## Auth and usage notes
The inspected official site contains mixed messaging:
- the onboarding section says `Sign Up and Get Your API Key`
- the visible example code sets an API-key variable and calls `?ip=...&auth=...`
- another marketing sentence says `No software installation required, no API key`

Because the code examples are the most concrete technical documentation on the inspected official page, this rewrite records `auth` as the currently documented request parameter while also preserving the contradiction for future review.

## Rate limits and quotas
- No per-request numeric rate-limit, daily quota, or retry policy was explicitly documented in the inspected homepage/API snippet.
- The official site does advertise `1B+ API Requests/Month` and `99.9% Uptime`, but those are marketing statistics, not enforceable client limits.

## Pagination
- No pagination model is documented or implied for this single-IP lookup endpoint.

## Errors and formats
- The visible sample payload includes `geoplugin_status`, which suggests status is reported in-body.
- The inspected page did not expose a formal HTTP error-code table, quota-exceeded schema, or retry guidance.
- The site presents examples for JavaScript, PHP, XML, JSON, ASP, and CSV consumption, but the inspected live snippets all revolve around the same base endpoint.

## Operational / usage notes
- geoPlugin is being documented here as an IP-geolocation provider, not a conventional street-address geocoder.
- The response mixes geographic fields with timezone, currency, and language metadata, so downstream adapters should not assume a minimal lat/lon-only shape.
- Because the official page currently emphasizes one generic endpoint and language-specific examples rather than a full reference manual, treat undocumented behavior conservatively.

## Canonical fireROUTE notes
- Preserve this provider as a single GET lookup operation against `https://api.geoplugin.com`.
- Do not infer additional routes from historical geoPlugin hosts or old blog posts unless they reappear on provider-controlled docs.
- Keep auth handling flexible because the inspected official page is internally inconsistent about API-key requirements.

## Verification notes
This file was manually rebuilt from the live official geoPlugin site using browser tools.