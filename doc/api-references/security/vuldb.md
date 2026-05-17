# VulDB

## Provider metadata
- Category: `Security`
- Provider slug: `vuldb`
- Docs used manually:
  - `https://vuldb.com/?doc.api`
  - `https://vuldb.com/kb/api`
  - `https://vuldb.com/` (official site access check)
- Confirmed API base URL family: `https://vuldb.com/?api`
- Confirmed localized API variant noted by the docs: `https://vuldb.com/{lang}/?api` such as `https://vuldb.com/de/?api`
- Authentication model: personal API key supplied either as POST field `apikey` or HTTP header `X-VulDB-ApiKey`
- Primary response formats: JSON by default, plus XML and CSV
- Manually confirmed routes in this pass: `21`

## Manual review notes
- The listed docs URL initially presented a Cloudflare/Turnstile challenge page (`Just a moment...`).
- After completing the challenge in-browser, the official documentation loaded at `https://vuldb.com/kb/api` and exposed the full API reference content.
- The official site root `https://vuldb.com/` still presented the same challenge page during this pass, but the API documentation page itself was manually reviewed successfully.

## Authentication
From the official API page:
- All API calls use HTTP `POST`.
- The primary endpoint is `https://vuldb.com/?api`.
- Every request must include a personal API key.
- The API key can be sent as a POST field:
  - `apikey=[your_personal_api_key]`
- Or as a custom request header:
  - `X-VulDB-ApiKey: [your_personal_api_key]`
- The docs show the minimum raw request as:
  - `POST /?api HTTP/1.1`
  - `Host: vuldb.com`
- The docs also note localized variants such as `https://vuldb.com/de/?api`; translated content changes the returned field values, but field names remain in English.

## Request and response conventions
- Method: `POST`
- Base path: `/?api`
- Request style: form-style POST parameters as documented in examples and Postman instructions
- Default response format: JSON
- Alternate response formats: XML and CSV via the `format` request parameter
- Recommended version pinning for production parsers: `version=3`
- Older API versions remain available; the docs say version `3.x` is current and version `4.0` is in development

## Common parameters confirmed from the docs
These parameters are shared across multiple request types or are documented as common request controls:
- `apikey` - personal API key in the POST body
- `version` - API major version pin, with `version=3` recommended for business-critical use
- `format` - `json` (default), `xml`, or `csv`
- `details` - `0` or `1`; enables full-detail responses when set to `1`
- `fields` - up to 3 additional detail fields in a basic `id` query
- `cti` - set to `1` to include additional CTI information on supported vulnerability lookups
- `sort` - override sorting on supported query types
- `offset` - pagination offset / start position
- `limit` - reduce result count on supported query types
- `myfilter` - set to `1` to apply the caller's saved VulDB filter

## Confirmed request types / routes
All routes below use the same HTTP method and endpoint path:
- Method: `POST`
- Path: `/?api`

### 1) Vulnerability lookup by ID
- Selector parameter: `id`
- Example: `apikey=[your_personal_api_key]&id=67685`
- Notes:
  - accepts a single VulDB entry ID
  - can also accept multiple comma-separated IDs such as `id=5,23,42`
  - supports `details=1`, `cti=1`, and `fields=...`

### 2) Recent vulnerability list
- Selector parameter: `recent`
- Example: `apikey=[your_personal_api_key]&recent=10`
- Purpose: return the most recent entries

### 3) Recent updates list
- Selector parameter: `updates`
- Example: `apikey=[your_personal_api_key]&updates=10`
- Purpose: return the most recent updates to existing entries

### 4) List entries for a specific advisory date
- Selector parameter: `advisory_date`
- Example: `apikey=[your_personal_api_key]&advisory_date=20180211`
- Notes:
  - date format is `YYYYMMDD`

### 5) List entries created on a specific day
- Selector parameter: `entry_timestamp_create`
- Example: `apikey=[your_personal_api_key]&entry_timestamp_create=20180211`
- Notes:
  - date format is `YYYYMMDD`

### 6) List entries changed on a specific day
- Selector parameter: `entry_timestamp_change`
- Example: `apikey=[your_personal_api_key]&entry_timestamp_change=20180211`
- Notes:
  - date format is `YYYYMMDD`

### 7) List entries since any timestamp change point
- Selector parameter: `entry_timestamp_all_start`
- Example: `apikey=[your_personal_api_key]&entry_timestamp_all_start=1518392525`
- Notes:
  - expects a Unix timestamp

### 8) List entries created since a timestamp
- Selector parameter: `entry_timestamp_create_start`
- Example: `apikey=[your_personal_api_key]&entry_timestamp_create_start=1518392525`
- Notes:
  - expects a Unix timestamp
  - the docs recommend this query family for steady incremental ingestion

### 9) List entries changed since a timestamp
- Selector parameter: `entry_timestamp_change_start`
- Example: `apikey=[your_personal_api_key]&entry_timestamp_change_start=1518392525`
- Notes:
  - expects a Unix timestamp

### 10) List advisories published since a timestamp
- Selector parameter: `advisory_date_start`
- Example: `apikey=[your_personal_api_key]&advisory_date_start=1518392525`
- Notes:
  - expects a Unix timestamp

### 11) Free-text search query
- Selector parameter: `search`
- Example: `apikey=[your_personal_api_key]&search=Microsoft Windows`
- Other documented examples:
  - `search=CVE-2014-6271`
  - `search=cpe:2.3:o:microsoft:windows_server_2019:::::::*`

### 12) Advanced structured search query
- Selector parameter: `advancedsearch`
- Example: `apikey=[your_personal_api_key]&advancedsearch=vendor:Microsoft,product:Windows,version:10`
- Supported key groups explicitly documented:
  - fuzzy: `vendor`, `product`, `version`, `component`, `function`, `argument`, `advisory`, `researcher`, `researcher_company`, `exploit_developer`, `exploit_language`
  - exact: `cve`, `bugtraq`, `osvdb`, `xforce`, `secunia`, `exploitdb`, `nessus`

### 13) Vendor lookup
- Selector parameter: `vendorlookup`
- Purpose: case-insensitive partial-match lookup of vendor names
- Example value shown by the docs: `Ea`

### 14) Product lookup
- Selector parameter: `productlookup`
- Purpose: case-insensitive partial-match lookup of product names
- Example value shown by the docs: `WinAmp`

### 15) Individual collection query
- Selector parameter: `collection`
- Purpose: retrieve a customer-defined collection of entries
- Example collections shown by the docs:
  - `customer23_microsoft_without_vista`
  - `oracle_java_since_01042018`
  - `ssl_products`
  - `iot_cvss3_base_above_6.9`
- Notes:
  - this route is described as an enterprise capability

### 16) CTI top activities query
- Selector parameter: `activitiestop`
- Example: `apikey=[your_personal_api_key]&activitiestop=10`
- Notes:
  - supports `details=1`
  - sorted by CTI activity score in the official example

### 17) CTI IPs by date query
- Selector parameter documented by the heading/changelog/response block: `iplist_date`
- Example section request shown by the docs: date `20250504`
- Important format note:
  - the prose says this query type is `iplist_date`
  - the example request string shown on the page uses `iplist=20250504`
  - the response example echoes `iplist_date`, so the official page currently contains a naming inconsistency that callers should verify against live behavior

### 18) CTI IP-address details query
- Selector parameter: `ipaddr`
- Example: `apikey=[your_personal_api_key]&ipaddr=192.168.0.1`
- Purpose: return risk, attribution, related vulnerabilities/CVEs, IOAs, TTPs, and related sources for an IP address

### 19) CTI actor query
- Selector parameter: `actor`
- Example: `apikey=[your_personal_api_key]&actor=zegost`
- Notes:
  - the docs say actor matching is case-insensitive

### 20) CTI sector query
- Selector parameter: `sector`
- Example: `apikey=[your_personal_api_key]&sector=agriculture`
- Notes:
  - the docs say sector matching is not case-insensitive

### 21) CTI events query
- Selector parameter: `events`
- Example: `apikey=[your_personal_api_key]&events=5`
- Notes:
  - the docs require the event count to be between `1` and `10`

## Pagination
From the official API page:
- Pagination is offset-based.
- Parameter: `offset`
- The docs describe `offset` as the starting item position for the next page/window.
- Responses expose:
  - `response_items` - current page size
  - `response_querylimitmax` - maximum page size allowed for the account/request type
- The default and maximum page size vary by account type and request type.
- The docs say commercial and enterprise users should typically have a maximum page size of `500` for most request types.
- The `limit` parameter can reduce the number of returned results on supported query types.
- Query types that already define their own count, such as `recent`, `updates`, and `events`, do not use `limit` the same way; the docs say `recent` and `updates` ignore `limit`.
- The official steady-streaming guidance recommends cursoring by `entry_timestamp_create_start` instead of relying only on pagination.

## Rate limits, credits, and throttling
From the official `Access Request Limit` and `DDoS Protection` sections:
- Every request consumes at least `1` API credit, even if it returns an error or no data.
- Credit availability depends on account rank and/or purchased API license.
- API credits are limited within a moving `24` hour window.
- Once credits are exhausted, further access is denied until enough older requests roll out of the 24-hour window.
- Basic vulnerability queries consume `1` credit per request.
- Full-detail vulnerability queries can consume `1` credit per returned result item.
- CTI API usage has different pricing:
  - `details=0` CTI queries consume `5` credits
  - `details=1` CTI queries consume `10` credits
  - CTI credit consumption does not depend on the number of CTI items returned
- VulDB explicitly recommends staying at or below roughly `30` requests per minute.
- The docs recommend delays of about `2` seconds between requests.
- Violating the anti-DDoS threshold can trigger temporary blocking and may return HTTP `429 Too Many Requests`.
- Repeated or extreme abuse can lead to stronger lockouts.

## Errors and status handling
The API page documents both API-level status codes and HTTP-level anti-abuse errors.

### Documented API status codes
- `200` - request valid, allowed, processed, results returned
- `204` - request valid, allowed, processed, but no results
- `400` - bad request with invalid request-type data
- `401` - authentication required, API key missing or unrecognized
- `402` - payment required / current plan not sufficient
- `403` - API rate exceeded / no further requests until counter reset or upgrade
- `405` - unknown request type
- `409` - API abuse suspected / requests blocked until counter reset

### Additional error notes
- Invalid processing adds a human-readable `error` field to the response.
- The docs also mention `notification` and `warning` response fields for API-exchange state and release notices.
- Anti-DDoS enforcement may bypass the normal API payload and return plain HTTP errors instead, including `429 Too Many Requests`.

## Response format notes
- JSON is the default if `format` is empty or set to `json`.
- XML is returned when `format=xml`.
- CSV is returned when `format=csv`.
- CSV uses `;` as the delimiter and wraps values in double quotes.
- JSON/XML responses contain these top-level sections:
  - `response`
  - `request`
  - `result`
- Common response metadata fields documented on the page include:
  - `version`
  - `format`
  - `status`
  - `lang`
  - `items` (or `count` for API v1)
  - `consumption`
  - `remaining`
  - `querylimit`
  - `querylimitmax`
  - `timestamp`
  - `rtt`
  - `etag`
- The `request` section echoes processed request metadata such as API-key validity, detail mode, sort, type, and value.

## Important usage notes
- The docs consistently describe the VulDB API as a single POST endpoint with many selector parameters rather than many different path-based REST endpoints.
- For production integrations, the docs strongly recommend pinning `version=3` instead of floating to the latest major version.
- The docs explicitly warn that repeated once-per-day polling at the exact same second can create timing issues for credit restoration.
- The `fields` parameter is limited to 3 additional fields on a basic `id` request.
- Lookup queries `vendorlookup` and `productlookup` do not support the `details` parameter and always consume 1 credit.
- The docs state that detailed CTI data is limited to certain account/license levels.
- Search result sorting supports these documented fields:
  - `id`
  - `entry_timestamp_create`
  - `entry_timestamp_change`
  - `advisory_date`
  - `source_cve`
  - `source_securityfocus`
  - `source_secunia`
  - `source_osvdb`
- The documentation prose contains a few wording inconsistencies, such as `detail` vs `details` and `iplist` vs `iplist_date`; the request examples consistently remain the best implementation guide.

## Verification notes
This file was manually rebuilt from VulDB's official documentation page after completing the first-party browser challenge and reviewing the live API reference content exposed at `https://vuldb.com/kb/api`.