# HackerOne

## Provider metadata
- Category: `Security`
- Provider slug: `hackerone`
- Docs used manually:
  - `https://api.hackerone.com/`
  - `https://api.hackerone.com/customer-resources/`
  - `https://api.hackerone.com/customer-reference/`
- Confirmed API base URL: `https://api.hackerone.com`
- Confirmed versioned route family: `/v1/...`
- Primary response format: JSON following JSON:API-style envelopes (`data`, `attributes`, `relationships`, `links`, `meta`)
- Authentication style: HTTP Basic auth using the API token identifier and token value
- Manually confirmed routes in this pass: `5`

## Authentication
From the official Getting Started page:
- HackerOne API access uses **HTTP Basic authentication**
- admin users generate and manage API tokens from the organization/program settings experience
- the docs explicitly say the **API token identifier and value** are used as the basic-auth username and password
- the official cURL examples use:
  - `-u "<YOUR_API_USERNAME>:<YOUR_API_TOKEN>"`
- Important official auth notes:
  - if the account has an IP whitelist and valid credentials are provided, the API can return `403 Forbidden`
  - if an invalid token is provided, the API returns `401 Unauthorized`

## Common request/response conventions
- API endpoint root published on the official docs home page: `https://api.hackerone.com/`
- reviewed route examples consistently use versioned endpoints under `https://api.hackerone.com/v1/...`
- the docs state that the API:
  - always returns JSON
  - is only accessible over HTTPS
  - is compliant with the JSON:API specification
- paginated responses on the reviewed customer-resource pages commonly include:
  - `data`
  - `links`
  - sometimes `meta`
- reviewed object reference pages consistently structure objects with:
  - `id`
  - `type`
  - `attributes`
  - optional `relationships`

## Manually confirmed endpoint set

### 1) Get an activity
- Method: `GET`
- Path: `/v1/activities/{id}`
- Purpose: fetch a single activity object by ID
- Path parameter:
  - `id` - required integer activity ID
- Auth: HTTP Basic with API username/token
- Response notes confirmed on the official page:
  - returns a JSON:API `data` object
  - the included relationships depend on the activity subtype
  - reviewed example includes `actor` and `attachments` relationships
- Important usage note from the docs:
  - callers should inspect the activity object reference for possible type-specific relationship variations

### 2) Query activities incrementally
- Method: `GET`
- Path: `/v1/incremental/activities`
- Purpose: fetch program activities incrementally by time
- Confirmed query parameters from the reviewed docs:
  - `handle` - program handle
  - time-cutoff parameters described by the docs for incremental retrieval
  - `sort`
  - `order`
  - `page[number]`
  - `page[size]`
- Sorting notes confirmed on the page:
  - supported sort attributes include `report_id`, `created_at`, and `updated_at`
  - supported order values are `asc` and `desc`
- Pagination notes confirmed on the example response:
  - `links.self`
  - `links.next`
  - `links.last`
  - `meta.max_updated_at`
- Default/limit notes shown on the page:
  - `page[number]` defaults to `1`
  - `page[size]` defaults to `25`
  - `page[size]` is currently limited to `1..100`

### 3) List programs for the authenticated member
- Method: `GET`
- Path: `/v1/me/programs`
- Purpose: return program objects that the authenticated API user is a member of
- Query parameters confirmed:
  - `page[number]` - default `1`
  - `page[size]` - default `25`, current limit `1..100`
- Important official note:
  - `groups` and `members` relationships are not included in this response
- Response format:
  - paginated JSON:API program objects

### 4) Get organization audit log
- Method: `GET`
- Path: `/v1/organizations/{id}/audit_log`
- Purpose: return a paginated list of audit-log items for one organization
- Path parameter:
  - `id` - required integer organization ID
- Query parameters confirmed:
  - `page[number]` - default `1`
  - `page[size]` - default `25`, current limit `1..100`
- Required permissions note from the official page:
  - `Organization Management`
- Important official behavior note:
  - insufficient permissions may cause the data to be returned as an empty array

### 5) Award a bounty on a report
- Method: `POST`
- Path: `/v1/reports/{id}/bounties`
- Purpose: award a bounty to the reporter of the specified report
- Path parameter:
  - `id` - required report ID
- Required permissions note from the official page:
  - `Reward Management`
- Request body fields confirmed:
  - `message` - required public message
  - `amount` - optional positive bounty amount; required unless `bonus_amount` is provided
  - `bonus_amount` - optional positive bonus amount; required unless `amount` is provided
- Important official eligibility notes:
  - the program must be able to award bounties
  - the report must be bounty-eligible
  - if either condition fails, the call returns `403`
- Permission nuance explicitly stated by the docs:
  - insufficient permission for this action results in `404 Not Found`

## Pagination
Confirmed from the reviewed official pages:
- HackerOne uses JSON:API-style pagination parameters:
  - `page[number]`
  - `page[size]`
- reviewed collection pages say:
  - default page number is `1`
  - default page size is `25`
  - current maximum page size is `100`
- example paginated responses include `links.self`, `links.next`, and `links.last`
- some endpoints also include `meta` fields such as `max_updated_at`

## Rate limits
From the official Getting Started page:
- Read operations: `600` requests per minute
- Exception for report pages: `300` requests per minute
- Write operations: `25` requests per `20` seconds
- requests above the limit can return HTTP `429`

## Error and response notes
From the reviewed official pages:
- global error table on the Getting Started page documents:
  - `400 Bad Request`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
  - `406 Not Acceptable`
  - `422 Unprocessable Entity`
  - `429 Too Many Requests`
- the docs note that the API currently supports JSON responses and discuss content negotiation through the JSON:API lens
- object reference pages are much more explicit about success-payload structure than about one universal error-body schema

## Important usage notes
- The root docs page is a true official entry point, but most route-level details for customer integrations live on `customer-resources`
- HackerOne splits object-schema details (`customer-reference`) from resource-operation details (`customer-resources`); both are needed for good integration docs
- The homepage also documents an API sandbox path for testing customer integrations
- Because the docs distinguish customer and hacker perspectives, consumers should not assume a customer route has a mirrored hacker-facing equivalent unless the official docs say so

## Verification notes
This file was manually rebuilt from the official HackerOne documentation pages reachable in this browser session, replacing the earlier low-fidelity generated summary.
