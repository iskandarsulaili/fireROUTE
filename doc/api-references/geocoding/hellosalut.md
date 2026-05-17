# HelloSalut

## Provider metadata
- Category: `Geocoding`
- Provider slug: `hellosalut`
- Official docs used manually:
  - `https://fourtonfish.com/project/hellosalut-api/` (redirects to the maintained project page below)
  - `https://stefanbohacek.com/project/hellosalut-api/`
  - official API endpoint examples checked manually on `https://hellosalut.stefanbohacek.com/`
- Public API base URL documented by provider: `https://hellosalut.stefanbohacek.com/`
- Transport: `HTTPS`
- Auth model: no authentication documented
- Response format documented and observed: `JSON`

## Product and access notes
- The official project page describes HelloSalut as a small API that says hello to visitors in their native language.
- The docs describe two usage styles: manual mode (explicit `lang`, `ip`, or `cc`) and automatic mode (`mode=auto`).
- The project page says the service is currently in beta while the dataset continues to grow.
- The docs also state that language has higher priority than IP when both are supplied.

## Confirmed API surface
The inspected official docs confirm `1` route family:
1. `GET /`

## 1) Greeting lookup / auto-detect endpoint
- Method: `GET`
- Path: `/`
- Full URL pattern: `https://hellosalut.stefanbohacek.com/?mode=auto`
- Purpose: return a JSON greeting based on an explicit language code, explicit country code, explicit IP address, or the provider's automatic detection mode

Documented and observed query parameters:
- `mode` - when set to `auto`, asks the service to determine the greeting automatically
- `lang` - browser or language code to use for lookup, for example `ja`
- `ip` - IP address to geolocate into a country/language choice, for example `89.120.120.120`
- `cc` - explicit country code lookup, for example `nl`

Important parameter behavior:
- The official docs say `lang` has higher priority than `ip` if both are supplied.
- The docs recommend supplying either IP or language when possible instead of relying only on the still-limited language list.
- The root URL without query parameters is not the main API mode; it returns a plain instruction page that points users back to the project documentation.

Observed JSON responses from official examples:
- `GET /?lang=ja` returned `{"code":"ja","hello":"&#12371;&#12435;&#12395;&#12385;&#12399;"}`
- `GET /?ip=89.120.120.120` returned `{"code":"ro","hello":"Salut"}`
- `GET /?cc=nl` returned `{"code":"nl","hello":"Hallo"}`
- `GET /?mode=auto` returned `{"code":"en-us","hello":"Hi"}`
- `GET /?lang=zzz` returned `{"code":"none","hello":"Hello"}`

Documented response fields:
- `code` - language code or country-derived code chosen by the service
- `hello` - translated greeting string

## Errors, rate limits, and pagination
- No HTTP error catalog, API-specific error schema, or status-code table is documented on the inspected official project page.
- Instead of publishing an error envelope, the docs say unmatched language or IP input falls back to the default greeting `Hello`.
- Manual testing confirmed fallback behavior with `?lang=zzz`, which returned `{"code":"none","hello":"Hello"}` rather than an error object.
- No published rate-limit or quota table is visible on the inspected official docs page.
- No pagination model is documented; this is a single-response lookup endpoint.

## Format and usage notes
- The provider documents and returns JSON responses.
- Non-ASCII greetings may appear HTML-entity encoded inside the JSON body, as observed in the Japanese example.
- The docs page includes a browser `fetch()` example, which is a practical signal that the provider expects browser-based consumption.
- The project page publishes supported-country coverage for IP-based detection and a separate supported-browser-language list, but does not present them as route changes.

## Canonical fireROUTE notes
- Canonical base URL: `https://hellosalut.stefanbohacek.com/`
- Canonical route family: `GET /`
- Treat `mode`, `lang`, `ip`, and `cc` as alternate query-driven behaviors on the same route.
- Preserve the documented priority rule that `lang` overrides `ip` when both are present.
- Model unmatched input as a successful fallback response, not as a separate error route.

## Verification notes
- This file was manually rebuilt from the live official project page and live official HelloSalut endpoint examples using browser/CDP tools only.
