# Telize

## Provider metadata
- Category: `Geocoding`
- Provider slug: `telize`
- Official docs used manually:
  - `https://www.telize.com/`
- Public base URL documented by provider: `https://www.telize.com`
- Additional documented endpoint hosts: `http://ip.telize.com`, `http://ip4.telize.com`, `http://ip6.telize.com`
- Transport: `HTTPS` on the main `www.telize.com` routes; the dedicated IP-only host variants are still documented as `HTTP`
- Auth model: no auth is documented for the legacy public endpoints; the official site now warns that the public API was permanently shut down on `2015-11-15` and says continued use requires self-hosting or a paid plan
- Response formats documented: plain text, `JSON`, `JSONP`
- CORS: supported according to the official homepage

## Product / availability notes
- The official homepage describes Telize as a JSON IP and GeoIP REST API for caller-IP discovery and IP geolocation lookups.
- The same page prominently warns that the public hosted API was permanently shut down on `2015-11-15`.
- The provider says the API powering the site is open source and that users who still want the service should either run their own instance or subscribe to a paid plan.

## Confirmed API surface
The official homepage still documents 7 GET request patterns:
- `GET /ip`
- `GET http://ip.telize.com/`
- `GET http://ip4.telize.com/`
- `GET http://ip6.telize.com/`
- `GET /jsonip`
- `GET /geoip`
- `GET /geoip/{ip}`

## 1) Plain-text caller IP lookup on the main host
- Method: `GET`
- Path: `/ip`
- Full URL pattern: `https://www.telize.com/ip`
- Purpose: return the visitor IP address in plain-text form

Parameters:
- none documented

Response notes:
- Returns either an IPv4 or IPv6 address as plain text.

## 2) Dual-stack plain-text caller IP lookup on the dedicated host
- Method: `GET`
- URL pattern: `http://ip.telize.com/`
- Purpose: return the visitor IP address in plain text while listening on both IPv4 and IPv6

Parameters:
- none documented

## 3) IPv4-only plain-text caller IP lookup
- Method: `GET`
- URL pattern: `http://ip4.telize.com/`
- Purpose: return the visitor IP address in plain text from the IPv4-only listener

Parameters:
- none documented

## 4) IPv6-only plain-text caller IP lookup
- Method: `GET`
- URL pattern: `http://ip6.telize.com/`
- Purpose: return the visitor IP address in plain text from the IPv6-only listener

Parameters:
- none documented

## 5) JSON caller IP lookup
- Method: `GET`
- Path: `/jsonip`
- Full URL pattern: `https://www.telize.com/jsonip`
- Purpose: return the visitor IP address inside a JSON object

Optional query parameters:
- `callback` - wraps the JSON response as JSONP; the official example is `https://www.telize.com/jsonip?callback=getip`

Response notes:
- The homepage examples show a JSON object with at least the `ip` field.

## 6) GeoIP lookup for the caller IP
- Method: `GET`
- Path: `/geoip`
- Full URL pattern: `https://www.telize.com/geoip`
- Purpose: return geolocation data for the visitor IP address

Optional query parameters:
- `callback` - wraps the response as JSONP; the official example is `https://www.telize.com/geoip?callback=getgeoip`

## 7) GeoIP lookup for a supplied IP address
- Method: `GET`
- Path: `/geoip/{ip}`
- Full URL pattern: `https://www.telize.com/geoip/{ip}`
- Purpose: return geolocation data for a specific IPv4 or IPv6 address

Path parameters:
- `ip` - the IPv4 or IPv6 address to geolocate

Optional query parameters:
- `callback` - wraps the response as JSONP; the official examples include `https://www.telize.com/geoip/46.19.37.108?callback=getgeoip`

## Response schema notes
The official homepage lists these JSON fields for GeoIP responses:
- `ip`
- `continent_code`
- `country`
- `country_code`
- `country_code3`
- `is_in_european_union`
- `region`
- `region_code`
- `city`
- `postal_code`
- `latitude`
- `longitude`
- `timezone`
- `offset`
- `asn`
- `organization`

Important output note:
- The provider says the IP-location database may not contain every field for every IP, so only available data is returned.

## Errors, rate limits, and pagination
- No pagination model is documented anywhere on the inspected official page.
- No request-rate or quota table is published on the inspected homepage.
- The official error section documents this client-error behavior:
  - HTTP `400 Bad Request`
  - provider error code `401`
  - message: `Input string is not a valid IP address`
- The page says incorrect user input returns a JSON-encoded error message.

## Canonical fireROUTE notes
- Treat the dedicated `ip.telize.com`, `ip4.telize.com`, and `ip6.telize.com` hostnames as separate documented request patterns even though they all serve the same caller-IP use case.
- `callback` is the provider's native JSONP switch and should stay modeled as an optional query parameter, not as a separate route.
- The provider's own homepage makes clear that the historic public hosted service is shut down, so production adapters should expect self-hosting or a paid replacement plan instead of anonymous public access.

## Verification notes
- This file was manually rebuilt from the live official Telize homepage using browser CDP tools only.
