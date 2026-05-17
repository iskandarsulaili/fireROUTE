# Spyse

## Provider metadata
- Category: `Security`
- Provider slug: `spyse`
- Manual review outcome: `manually_documented`
- Confirmed route count in this pass: `41`
- Primary official docs reviewed: `https://spyse-dev.readme.io/reference/quick-start`
- Official first-party alternative reviewed: `https://spyse.com/`
- Confirmed docs surface: `v4.0` `DATA API` portal hosted on ReadMe
- Confirmed API base URL: `https://api.spyse.com/v4/data`
- Primary response format signaled by the official docs: `application/json`

## Official-site review
### Quick start
The official quick-start page was reachable in this pass and explicitly confirmed:
- token-based authentication
- `Authorization: Bearer <your_access_token_here>` header usage
- example request URL `https://api.spyse.com/v4/data/domain/google.com`
- official CLI / SDK links and the `v4.0` `DATA API` naming

### Official alternative
- URL reviewed: `https://spyse.com/`
- Browser result in this pass: `net::ERR_NAME_NOT_RESOLVED`
- Conclusion: the ReadMe-hosted docs portal is currently the usable official documentation surface in this environment.

## Authentication
- Auth model: token-based authentication
- Required header: `Authorization: Bearer <your_access_token_here>`
- Token location note from the official quick-start page: registered users can find the token on their account page.

## Core request/response notes
- Base URL: `https://api.spyse.com/v4/data`
- Format: JSON-oriented REST API
- Search-style list endpoints generally default to `25` results per response.
- GET list endpoints document query pagination with `limit` and `offset`.
- Search endpoints document hard limits on standard pagination and point users toward `scroll search` or `search download` for larger result sets.

## Manually confirmed route inventory
The official sidebar exposed `41` concrete operation pages in the public `DATA API` docs.

### Downloads
1. `GET /account/downloads/{id}`
   - Purpose: retrieve file-download job details
   - Path param: `id` (`int64`, required, `>= 1`)
2. `GET /account/downloads`
   - Purpose: list file downloads from the last 90 days
   - Query params:
     - `limit` (`1..100`)
     - `offset` (`0..9999`)

### Account
3. `GET /account/quota`
   - Purpose: return account quota details

### Autonomous Systems
4. `GET /as/{asn}`
   - Purpose: autonomous-system details by AS number
   - Path param: `asn` (`1..4294967295`)
5. `POST /as/search`
6. `POST /as/search/count`
7. `POST /as/search/download`
8. `POST /as/scroll/search`
   - Search body surface confirmed from the official docs:
     - `search_params` array is required
     - `limit` (`1..100`) and `offset` (`0..9999`) are available on the standard search endpoint
     - sample searchable fields include `domain`, `ip`, `as_org`, and `asn`
   - Download body notes confirmed from the official docs:
     - `column_list` required
     - `file_format` required, enum `csv | ndjson`
     - `rows_count`
     - optional `description` up to `254` characters
   - Scroll notes confirmed from the official docs:
     - `search_id` is used for deep pagination
     - `search_id` expires after `1 minute` of inactivity

### Bulk Search
9. `POST` Domains bulk search
10. `POST` Domains bulk search download
11. `POST` IP bulk search
12. `POST` IP bulk search download
- The public docs sidebar exposed these as four distinct operation pages under `Bulk Search`.

### SSL/TLS Certificates
13. `GET` Certificate details
14. `POST` Certificate search
15. `POST` Certificate search count
16. `POST` Certificate search download
17. `POST` Certificate scroll search
- The public docs sidebar exposed these as five distinct operation pages under `SSL/TLS Certificates`.

### CVEs
18. `GET` CVE details
19. `POST` CVE search
20. `POST` CVE search count
21. `POST` CVE search download
22. `POST` CVE scroll search
- The public docs sidebar exposed these as five distinct operation pages under `CVEs`.

### Domains
23. `GET /domain/{domain_name}`
   - Purpose: domain details by name
   - Path param: `domain_name` (required string, example `google.com`)
24. `POST /domain/search`
25. `POST` Domain search count
26. `POST` Domain search download
27. `POST` Domain scroll search
28. `POST /domain/scan`
   - Purpose: on-demand crawl for up to `100` domains at a time
   - Body param: `domain_list` array of strings, required
   - Usage note from the official docs: scan results can then be obtained via `/domain`, `/domain/search`, or bulk-search domain operations.
- The standard domain search page explicitly documents a large `search_params` surface, including DNS, SPF, HTTP extract, and role flags such as `is_mx`, `is_ns`, and `is_ptr`.

### Emails
29. `GET` Email details
30. `POST` Email search
31. `POST` Email search count
32. `POST` Email search download
33. `POST` Email scroll search
- The public docs sidebar exposed these as five distinct operation pages under `Emails`.

### History
34. `GET` DNS history
35. `GET` DNS history count
36. `GET` WHOIS history
- The public docs sidebar exposed these as three distinct operation pages under `History`.

### IPs
37. `GET` IP details
38. `POST` IP search
39. `POST` IP search count
40. `POST` IP search download
41. `POST` IP scroll search
- The public docs sidebar exposed these as five distinct operation pages under `IPs`.

## Parameters and filtering notes
- Standard GET list endpoints use `limit` and `offset` pagination.
- Search-family endpoints use request bodies with a required `search_params` array.
- The docs expose per-family searchable-field tables rather than one single global filter schema.
- Confirmed examples from the autonomous-systems family include:
  - `domain`
  - `ip`
  - `as_org`
  - `asn`
- Confirmed examples from the domain family include numerous DNS- and HTTP-derived fields such as `name`, `dns_a`, `dns_aaaa`, `dns_txt`, `dns_cname`, `dns_ns`, `dns_mx`, `dns_spf_*`, `http_extract_title`, and related existence / contains / starts operators.

## Pagination and bulk-export behavior
- Standard list/search responses default to `25` items.
- Standard search endpoints are limited to the first `10,000` results.
- Deep pagination uses dedicated `scroll search` endpoints plus a `search_id` token.
- Export workflows are asynchronous and use `search download` endpoints to create downloadable files.
- Download-job follow-up is handled through the `/account/downloads` endpoints.

## Errors
The representative pages reviewed in this pass consistently documented:
- `200` success
- `401` unauthorized
- `500` internal server error
Additional reviewed search/detail pages also documented:
- `400` bad request

## Important usage notes
- The current usable official docs surface in this environment is the ReadMe portal, not the main `spyse.com` root.
- The docs are explicitly versioned as `v4.0` `DATA API`.
- The API is organized around asset-intelligence retrieval, search, search counts, asynchronous exports, and deep scroll pagination.
- Download exports are plan-limited and can require choosing explicit columns plus `csv` or `ndjson` output.
- Domain on-demand scans are capped at `100` domains per request.

## Verification note
This file replaces the weaker earlier manual record. The `41` route count is grounded in the live official sidebar operation inventory plus direct content review of the quick-start page and representative downloads, account, autonomous-systems, and domain operation pages.