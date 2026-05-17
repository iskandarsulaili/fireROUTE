# HaveIBeenPwned

## Provider metadata
- Category: `Security`
- Provider slug: `haveibeenpwned`
- Docs used manually:
  - `https://haveibeenpwned.com/API/v3`
- Confirmed base URL for breach/domain/paste/subscription APIs: `https://haveibeenpwned.com/api/v3`
- Additional official base URL for Pwned Passwords range search: `https://api.pwnedpasswords.com`
- Primary response formats confirmed from the docs: JSON for HIBP APIs, plain-text hash suffix lines for the Pwned Passwords range API
- Manually confirmed routes in this pass: `9`

## Authentication
Confirmed auth model from the official docs:
- breach, paste, domain, stealer-log, and subscription APIs that search by email address or domain require a paid HIBP subscription key
- the subscription key is sent in the `hibp-api-key` header
- the free Pwned Passwords API does **not** require authorisation
- every request to the HIBP API must include a `user-agent` header describing the consuming app

Important auth-specific notes:
- missing or invalid `hibp-api-key` returns `401`
- a missing `user-agent` returns `403`
- HIBP API keys must be `32`-character hexadecimal strings
- test API keys are supported for documented test email addresses under the `hibp-integration-tests.com` domain

## Versioning and base URL rules
- version 3 is specified in the URL path, not in a custom header
- the docs show the main pattern as `https://haveibeenpwned.com/api/v3/{service}/{parameter}`
- all examples document the unique path segment after `/api/v3`
- the Pwned Passwords range API is separately hosted on `https://api.pwnedpasswords.com`

## Common request/response conventions
- JSON responses use PascalCase property names in the examples and models
- email addresses are not case-sensitive, are trimmed, and must be URL encoded
- the public breach search API suppresses sensitive and retired breaches from email-search results
- the Pwned Passwords range API returns `HTTP 200` for every valid 5-character prefix; clients must inspect the returned suffix list

## Manually confirmed endpoint set

### 1) Get breaches for an email address
- Method: `GET`
- Path: `/breachedAccount/{email address}`
- Full URL: `https://haveibeenpwned.com/api/v3/breachedAccount/{email address}`
- Headers required by docs:
  - `hibp-api-key: {key}`
  - `user-agent: {your app name}`
- Path parameter:
  - URL-encoded email address
- Confirmed query parameters:
  - `truncateResponse=false` to return the full breach model instead of only breach names
  - `domain={domain}` to filter results to breaches for a specific domain
  - `IncludeUnverified=false` to exclude unverified breaches
- Default response behavior:
  - `200` returns only breach `Name` values by default
  - `404` when the address is not found in any breach
- Important notes:
  - test key `00000000000000000000000000000000` can be used with the official test addresses documented on the page
  - the docs provide examples for `account-exists@hibp-integration-tests.com`, `spam-list-only@hibp-integration-tests.com`, and `stealer-log@hibp-integration-tests.com`

### 2) Get breached email aliases for a verified domain
- Method: `GET`
- Path: `/breachedDomain/{domain}`
- Full URL: `https://haveibeenpwned.com/api/v3/breachedDomain/{domain}`
- Headers required:
  - `hibp-api-key`
  - `user-agent`
- Path parameter:
  - verified domain name
- Response behavior confirmed in docs:
  - `200` returns an object keyed by mailbox alias, each containing an array of breach names
  - `403` if the domain has not been verified
  - `404` if no breached addresses exist for the domain
- Important notes:
  - this API can return sensitive breaches because the caller has already demonstrated domain control
  - docs advise querying it only when new breaches are added
  - there is no formal published limit for this route, but excessive unnecessary querying may trigger `429`

### 3) List all breaches in the system
- Method: `GET`
- Path: `/breaches`
- Full URL: `https://haveibeenpwned.com/api/v3/breaches`
- Authentication: not required on the official docs page
- Confirmed query parameters:
  - `Domain={domain}`
  - `IsSpamList=true|false`
- Purpose: return the full set of breach records in the system

### 4) Get one breach by stable name
- Method: `GET`
- Path: `/breach/{name}`
- Full URL: `https://haveibeenpwned.com/api/v3/breach/{name}`
- Authentication: not required on the official docs page
- Path parameter:
  - breach `Name` value, which the docs note is stable and may differ from `Title`

### 5) Get the most recently added breach
- Method: `GET`
- Path: `/latestBreach`
- Full URL: `https://haveibeenpwned.com/api/v3/latestBreach`
- Authentication: not required on the official docs page
- Purpose: return the breach with the newest `AddedDate`
- Important note:
  - docs explicitly say this is often the most efficient thing to poll before performing broader email or domain checks

### 6) List all data classes
- Method: `GET`
- Path: `/dataClasses`
- Full URL: `https://haveibeenpwned.com/api/v3/dataClasses`
- Authentication: not required on the official docs page
- Response shape:
  - alphabetically ordered string array of data classes

### 7) Get pastes for an email address
- Method: `GET`
- Path: `/pasteAccount/{email address}`
- Full URL: `https://haveibeenpwned.com/api/v3/pasteAccount/{email address}`
- Headers required:
  - `hibp-api-key`
  - `user-agent`
- Path parameter:
  - URL-encoded email address
- Purpose: return paste exposures associated with the email address

### 8) Get subscription status
- Method: `GET`
- Path: `/subscription/status`
- Full URL: `https://haveibeenpwned.com/api/v3/subscription/status`
- Headers required:
  - `hibp-api-key`
  - `user-agent`
- Confirmed response properties from the docs:
  - `SubscriptionName`
  - `Description`
  - `SubscribedUntil`
  - `Rpm`
  - `DomainSearchMaxBreachedAccounts`
  - `MaxBreachedDomains`
  - `IncludesStealerLogs`
  - `IncludesBulkDomainAdd`
  - `IncludesAutoSubdomainVerification`
  - `IncludesCustomerDomains`
  - `IncludesKAnon`
- Important note:
  - `Rpm` is the rate limit in requests per minute for the breach-search-by-email API

### 9) Search Pwned Passwords by hash range
- Method: `GET`
- Path: `/range/{first 5 SHA-1 chars}`
- Full URL: `https://api.pwnedpasswords.com/range/{first 5 SHA-1 chars}`
- Authentication: none
- Request model:
  - send the first 5 characters of a SHA-1 hash
  - docs also note NTLM hashes are supported in the same k-anonymity model section
- Response format:
  - plain-text lines in `HASH_SUFFIX:COUNT` format
- Important notes from the docs:
  - every valid prefix from `00000` to `FFFFF` returns `HTTP 200`
  - the API should never return `404` for a valid range query
  - a typical response contains about `800` suffixes
  - there is no rate limit on the Pwned Passwords API

## Response models and format notes
The breach example in the official docs confirms the main breach model fields include:
- `Name`
- `Title`
- `Domain`
- `BreachDate`
- `AddedDate`
- `ModifiedDate`
- `PwnCount`
- `Description`
- `LogoPath`
- `DataClasses`
- `IsVerified`
- `IsFabricated`
- `IsSensitive`
- `IsRetired`
- `IsSpamList`
- `IsMalware`
- `IsStealerLog`
- `IsSubscriptionFree`

## Rate limits
From the official rate limiting section:
- breach, paste, and stealer-log APIs are rate limited
- exceeding the rate limit returns `429 Too many requests`
- `retry-after` is returned with the number of seconds to wait
- the response body also explains the limit condition
- clients should avoid running exactly at the ceiling and should leave a small buffer
- the domain search API has no official published rate limit, but frequent unnecessary requests may still trigger `429`
- persistent abuse can trigger extra Cloudflare protections and even `503 Service Unavailable`
- the Pwned Passwords API has **no** rate limit

## Response codes
The official response code table documents:
- `200 Ok`
- `400 Bad request` for malformed email input
- `401 Unauthorised` for missing/invalid API key
- `403 Forbidden` for missing user agent or inaccessible resources
- `404 Not found`
- `429 Too many requests`
- `503 Service unavailable`

## Important usage notes
- always URL-encode email addresses in path segments
- email-search results are truncated by default for size efficiency; set `truncateResponse=false` when full breach details are required
- sensitive and retired breaches are not returned from the public email-search API
- the docs recommend polling `latestBreach` first, then performing targeted domain or account queries only when new breaches appear
- the Pwned Passwords API is separate from the main HIBP v3 base URL and returns plain text, not JSON
- HIBP requires a meaningful `user-agent`; generic or misleading values may be blocked

## Verification notes
This file was manually rebuilt from the official Have I Been Pwned API documentation with browser inspection, replacing the earlier generated summary.
