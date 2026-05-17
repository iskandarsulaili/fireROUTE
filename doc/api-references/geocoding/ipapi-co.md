# ipapi.co

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ipapi-co`
- Official docs used manually: `https://ipapi.co/api/#introduction`
- Public base URL documented by provider: `https://ipapi.co`
- Transport: HTTPS
- Response formats documented: `json`, `jsonp`, `xml`, `csv`, `yaml`, plus plain-text field responses
- Auth model on the inspected public docs page: no credential parameter is shown in the request examples; however, the error section documents HTTP `403 Authentication Failed`

## Scope and usage notes
The inspected documentation page describes IP geolocation for:
- a specific IP address
- a specific field for a specific IP
- the caller/client IP
- a specific field for the caller/client IP

The same page also documents:
- IPv4 and IPv6 support
- optional hostname data as a beta add-on
- both server-side and client-side integration patterns

## Rate limit / quota notes
- The inspected docs page does not publish a numeric requests-per-minute or requests-per-day figure.
- The error section explicitly documents HTTP `429 Quota exceeded` with a JSON body like `{ "error": true, "reason": "RateLimited", "message": "..." }`.

## Confirmed API surface
The official page documents these route patterns:
- `GET /{ip}/{format}/`
- `GET /{ip}/{field}/`
- `GET /{format}/`
- `GET /{field}/`

## 1) Complete location for a specific IP
- Method: `GET`
- Path pattern: `/{ip}/{format}/`
- Full URL pattern: `https://ipapi.co/{ip}/{format}/`
- Purpose: retrieve the full geolocation payload for a supplied IP address

Path parameters:
- `ip` - required IP address to geolocate
- `format` - required response format; one of `json`, `jsonp`, `xml`, `csv`, `yaml`

Official example:
- `https://ipapi.co/8.8.8.8/json/`

Documented response fields include:
- `ip`
- `version`
- `city`
- `region`, `region_code`
- `country`, `country_code`, `country_code_iso3`, `country_name`
- `country_capital`, `country_tld`, `country_area`, `country_population`
- `continent_code`
- `in_eu`
- `postal`
- `latitude`, `longitude`, `latlong`
- `timezone`, `utc_offset`
- `country_calling_code`
- `currency`, `currency_name`
- `languages`
- `asn`, `org`
- `hostname` (documented as optional beta add-on)

## 2) Single location field for a specific IP
- Method: `GET`
- Path pattern: `/{ip}/{field}/`
- Full URL pattern: `https://ipapi.co/{ip}/{field}/`
- Purpose: return one geolocation field for a supplied IP as plain text

Path parameters:
- `ip` - required IP address
- `field` - required field selector

Documented field values include:
- `city`
- `region`
- `region_code`
- `country`
- `country_name`
- `continent_code`
- `in_eu`
- `postal`
- `latitude`
- `longitude`
- `latlong`
- `timezone`
- `utc_offset`
- `languages`
- `country_calling_code`
- `currency`
- `asn`
- `org`

Official examples:
- `https://ipapi.co/8.8.8.8/city/`
- `https://ipapi.co/8.8.8.8/country/`
- `https://ipapi.co/8.8.8.8/timezone/`
- `https://ipapi.co/8.8.8.8/languages/`
- `https://ipapi.co/8.8.8.8/currency/`

Response note:
- the page states this route returns the selected value as plain text

## 3) Complete location for the caller/client IP
- Method: `GET`
- Path pattern: `/{format}/`
- Full URL pattern: `https://ipapi.co/{format}/`
- Purpose: geolocate the public IP address of the request origin without explicitly sending the IP

Path parameter:
- `format` - required response format; one of `json`, `jsonp`, `xml`, `csv`, `yaml`

Official example:
- `https://ipapi.co/json/`

Usage note from docs:
- the service infers the caller IP from the request, making this route suitable for client-side/browser use cases

Response notes:
- response format options match the full-IP route
- the same location fields are documented as available on the response

## 4) Single location field for the caller/client IP
- Method: `GET`
- Path pattern: `/{field}/`
- Full URL pattern: `https://ipapi.co/{field}/`
- Purpose: return a single field for the public IP of the current caller as plain text

Path parameter:
- `field` - required field selector

Documented field values include:
- `ip`
- `city`
- `region`
- `region_code`
- `country`
- `country_name`
- `continent_code`
- `in_eu`
- `postal`
- `latitude`
- `longitude`
- `latlong`
- `timezone`
- `utc_offset`
- `languages`
- `country_calling_code`
- `currency`
- `asn`
- `org`

Official examples:
- `https://ipapi.co/ip/`
- `https://ipapi.co/city/`
- `https://ipapi.co/country/`
- `https://ipapi.co/timezone/`
- `https://ipapi.co/languages/`
- `https://ipapi.co/currency/`

Response note:
- the docs state the returned value is plain text

## Errors and missing-data behavior
The official error section documents these HTTP 4xx codes:
- `400 Bad Request`
- `404 URL Not Found`
- `403 Authentication Failed`
- `405 Method Not Allowed`
- `429 Quota exceeded`

Documented structured error bodies:
- 429 example: `{ "error": true, "reason": "RateLimited", "message": "..." }`
- additional HTTP `200` error-like payloads can also occur, such as:
  - `{ "error": true, "reason": "Invalid IP Address", "ip": "..." }`
  - `{ "error": true, "reason": "Reserved IP Address", "ip": "127.0.0.1", "reserved": true }`

Missing-field behavior documented by output format:
- `json` -> `null`
- `csv` -> empty value
- `xml` -> empty value
- `yaml` -> `null`
- field endpoint example -> `None`

## Canonical fireROUTE notes
- This provider exposes four distinct path patterns: full-vs-field and explicit-IP-vs-caller-IP.
- The docs page presents public examples without credentials, but also documents 403 auth failures and quota enforcement; treat commercial/auth behavior as plan-sensitive.
- Field endpoints return plain text rather than structured JSON.
- Error handling is unusual because some invalid-IP conditions are documented as HTTP `200` payloads with `error: true`.

## Verification notes
This file was manually rebuilt from the live official ipapi.co documentation page using browser tools.