# IP2WHOIS Information Lookup

## Provider metadata
- Category: `Development`
- Provider slug: `ip2whois-information-lookup`
- Docs used manually:
  - `https://www.ip2whois.com/`
  - the official `Developers – Domain WHOIS REST API` page reached from the site's Developers navigation
- Confirmed REST API base URL: `https://api.ip2whois.com/v2`
- Primary media types: JSON and XML
- Authentication model surfaced in docs: required `key` query parameter
- Manually confirmed routes in this pass: `1`

## Authentication
From the official Domain WHOIS REST API page:
- authentication is via the required query parameter `key`
- the page labels `key` as the "WHOIS lookup API license key"
- no header-based auth alternative was surfaced on the reviewed page

## Common request/response conventions
- Base URL: `https://api.ip2whois.com/v2`
- reviewed API surface uses `GET`
- required lookup input is a domain name via query parameter
- response format defaults to JSON and can be switched to XML with `format=xml`
- the homepage and developer page describe the service as real-time WHOIS lookup with support for `1221` TLDs and `634` ccTLDs

## Manually confirmed endpoint set

### 1) Domain WHOIS lookup
- Method: `GET`
- Path: `/v2`
- Full URL: `https://api.ip2whois.com/v2`
- Purpose: return WHOIS registration and contact information for a domain name
- Query parameters confirmed on the official page:
  - `key` - required API license key
  - `domain` - required domain name to inspect
  - `format` - optional output format; valid values documented as `json` and `xml`, with `json` as the default
- Response fields explicitly listed on the official page include:
  - top-level domain metadata: `domain`, `domain_id`, `status`, `create_date`, `update_date`, `expire_date`, `domain_age`, `whois_server`
  - registrar fields: `registrar.iana_id`, `registrar.name`, `registrar.url`
  - registrant fields such as `registrant.name`, `registrant.organization`, `registrant.street_address`, `registrant.city`, `registrant.region`, `registrant.zip_code`, `registrant.country`, `registrant.phone`, `registrant.fax`, `registrant.email`
  - admin contact fields such as `admin.name`, `admin.organization`, `admin.street_address`, `admin.city`, `admin.region`, `admin.zip_code`, `admin.country`, `admin.phone`, `admin.fax`, `admin.email`
  - technical contact fields such as `tech.name`, `tech.organization`, `tech.street_address`, `tech.city`, `tech.region`, `tech.zip_code`, `tech.country`, `tech.phone`, `tech.fax`, `tech.email`
  - billing contact fields such as `billing.name`, `billing.organization`, `billing.street_address`, `billing.city`, `billing.region`, `billing.zip_code`, `billing.country`, `billing.phone`, `billing.fax`, `billing.email`
  - DNS and raw-record fields including `nameservers` and the raw WHOIS record block documented lower on the page

## Pagination
- none documented
- this is a single-record lookup endpoint rather than a list/search API

## Rate limits
- the reviewed developer page does not publish per-minute headers or a throttle table
- it does explicitly state that the free API allows up to `500` WHOIS domain-name queries per month

## Error and response notes
- the reviewed page is primarily schema-oriented and does not publish a detailed error-code table
- the only response-format control directly documented is `format=json|xml`
- because the page did not expose a structured error schema in the reviewed session, this file documents only the response fields and quota note that were directly visible

## Important usage notes
- the provider page reviewed here is specifically the Domain WHOIS REST API, not the Hosted Domains API shown elsewhere in site navigation
- the docs describe the endpoint as real-time domain intelligence / WHOIS lookup rather than a historical archive
- output-format switching is query-driven (`format`), with JSON as the default
- the public site currently routes free-key signup to the broader `ip2location.io` account flow

## Verification notes
This file was manually rebuilt from IP2WHOIS's official homepage plus the official developer page for the Domain WHOIS REST API using browser inspection.