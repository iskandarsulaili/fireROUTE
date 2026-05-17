# Cutt.ly

## Provider metadata
- Category: `URL Shorteners`
- Provider slug: `cutt-ly`
- Docs used manually:
  - `https://cutt.ly/api-documentation/cuttly-links-api`
- Confirmed API base URL: `https://cutt.ly/api/api.php`
- Primary media type: JSON
- Authentication model surfaced in docs: required `key` query parameter for all reviewed operations
- Manually confirmed routes in this pass: `4`

## Authentication
From the official Regular API page:
- the API is available only to registered users
- API keys are generated in the account's Edit Account page
- all reviewed examples authenticate with the query parameter `key`
- the `userDomain` capability for branded domains requires a paid subscription plan

## Common request/response conventions
- Base URL: `https://cutt.ly/api/api.php`
- the API is heavily parameter-driven: multiple operations share the same endpoint path
- most reviewed examples use `GET` query-string requests
- the password-setting edit flow is documented as a `POST` request with form-data in the body
- response payloads are JSON objects keyed by operation namespaces like `url`, `status`, and `stats`

## Manually confirmed endpoint set

### 1) Shorten a URL
- Method: `GET`
- Path: `/api/api.php`
- Full URL pattern: `https://cutt.ly/api/api.php?key={key}&short={encoded_url}`
- Purpose: create a shortened URL, optionally with a custom alias and custom/branded-domain behavior
- Query parameters confirmed on the official page:
  - `key` - required API key
  - `short` - required encoded source URL
  - `name` - optional custom alias/back-half
  - `userDomain` - optional `1` to use an approved custom domain from the account; paid plans only
  - `noTitle` - optional `1` to skip page-title retrieval; Team Enterprise feature
  - `public` - optional `1` to enable public click stats; available from Single plan
- Official status/result codes for `url.status`:
  - `1` - link already shortened by the same domain
  - `2` - entered link is not a valid link
  - `3` - preferred alias already taken
  - `4` - invalid API key
  - `5` - link failed validation / contains invalid characters
  - `6` - source domain is blocked
  - `7` - success
  - `8` - monthly link limit reached
- When status is `7`, the docs say the response includes at least:
  - `url.date`
  - `url.shortLink`
  - `url.fullLink`
  - `url.title`

### 2) Edit or delete an existing short link
- Method: `GET`
- Path: `/api/api.php`
- Full URL pattern: `https://cutt.ly/api/api.php?key={key}&edit={shortened_url}`
- Purpose: change alias, source URL, tags, unique-click behavior, mobile redirects/deep links, expiration, A/B tests, or delete a short link
- Core query parameters confirmed on the official page:
  - `key` - required API key
  - `edit` - required shortened link to modify
  - `tag` - add a tag
  - `name` - change alias
  - `delete=1` - delete the link
  - `source` - change destination/source URL
  - `unique` - unique-click mode; reviewed values `0`, `1`, or `15-1440`
  - `title` - change title
  - `mobile` - mobile redirect/deep-link target type; reviewed values include `android`, `ios`, `windowsMobile`, `redirect`
  - `destination` - encoded destination URL used with mobile settings
  - `expire` - expiration mode; reviewed values `0` and `1`
  - `expireCond` - click threshold, date `YYYY-MM-DD`, or `0` to remove expiration
  - `expireRedirect` - redirect after expiration
  - `expireUnique` - `1` or `0` for unique-click expiration handling
  - `password` - password-management flag/value, depending on the documented flow
  - `abtest`, `abtest_b`, `abtest_bvariation`, `abtest_c`, `abtest_cvariation` - A/B/C testing controls
  - `package_id` - Android package for deferred deep linking
  - `referrer` - deferred deep-link referrer payload
- Official edit statuses:
  - `status => 1` - OK
  - `status => 2` - could not save in database
  - `status => 3` - URL does not exist or is not owned by the caller
  - `status => 4` - invalid URL for source/destination updates
- Official edit-error notes include:
  - insufficient subscription level
  - unique time must be between `15` and `1440` minutes
  - provided alias is unavailable

### 3) Set or remove a link password
- Method: `POST`
- Path: `/api/api.php`
- Full URL pattern: `https://cutt.ly/api/api.php?key={key}&edit={shortened_url}&password=1`
- Purpose: set or remove a password on an existing link
- Official request details:
  - query params: `key`, `edit`, `password=1`
  - body transport: form-data
  - form-data field: `password` containing the desired password, or blank to remove it
- This was the only reviewed flow on the official page that explicitly switched from GET to POST

### 4) Retrieve analytics/statistics for a shortened URL
- Method: `GET`
- Path: `/api/api.php`
- Full URL pattern: `https://cutt.ly/api/api.php?key={key}&stats={shortened_url}`
- Purpose: return click statistics and breakdowns for a shortened URL
- Query parameters confirmed on the official page:
  - `key` - required API key
  - `stats` - shortened URL to analyze
  - `date_from` - optional `YYYY-MM-DD`; Team plan feature
  - `date_to` - optional `YYYY-MM-DD`; Team plan feature
- Official analytics response fields when status is successful include:
  - `stats.date`
  - `stats.clicks`
  - `stats.title`
  - `stats.fullLink`
  - `stats.shortLink`
  - social counters like `stats.facebook`, `stats.twitter`, `stats.linkedin`, `stats.rest`, `stats.bots`
  - nested referrer and device breakdown arrays such as `stats.refs.ref[*]`, `stats.devices.geo[*]`, `stats.devices.dev[*]`, `stats.devices.sys[*]`, `stats.devices.bro[*]`, `stats.devices.brand[*]`, `stats.devices.lang[*]`, and `stats.bots.bots[*]`
- Official analytics-error notes include:
  - incorrect date format; must be `YYYY-MM-DD`
  - insufficient subscription level for premium parameters

## Pagination
- none documented
- analytics breakdowns are returned as arrays inside one response rather than paginated collections

## Rate limits
From the official `API Rate Limits` table:
- Free: `3 calls / 60 sec.`
- Starter Monthly: `6 calls / 60 sec.`
- Single Monthly: `60 calls / 60 sec.`
- Team Monthly: `180 calls / 60 sec.`
- Team Enterprise Monthly: `360 calls / 60 sec.`

## Error and response notes
- the shortener docs use operation-specific status objects rather than one uniform REST error schema
- the page also documents these cross-cutting errors:
  - `401 Unauthorized` with JSON `auth:false` when the API key is incorrect
  - subscription-expired or shortening-limit-reached conditions
  - domain-ownership errors when using branded domains you do not own
  - too-many-requests errors that point users to the plan limits page
- official docs inconsistency to note:
  - one analytics parameter table labels the required shortened-link parameter as `url`, but the concrete endpoint examples and later route tables use `stats`; I documented the concrete request form shown in the official examples

## Important usage notes
- Cutt.ly's Regular API is essentially one endpoint path with multiple operation families chosen by parameters like `short`, `edit`, and `stats`
- some capabilities are subscription-gated, including branded domains, richer analytics, and parts of the edit surface
- the official page contains many edit examples; this file groups them under the single shared edit route family rather than pretending each example is a distinct path
- password management is the standout transport exception: it is documented as `POST` with form-data while most other operations are GET query requests

## Verification notes
This file was manually rebuilt from Cutt.ly's official Regular API documentation page using browser inspection.