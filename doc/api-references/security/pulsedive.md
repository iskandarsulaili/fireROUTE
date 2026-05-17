# Pulsedive

## Provider metadata
- Category: `Security`
- Provider slug: `pulsedive`
- Docs used manually:
  - `https://docs.pulsedive.com/`
  - `https://docs.pulsedive.com/api/authentication`
  - `https://docs.pulsedive.com/api/responses`
  - `https://docs.pulsedive.com/api/limits`
  - `https://docs.pulsedive.com/api/pagination`
  - representative endpoint pages under `https://docs.pulsedive.com/api/...`
- Confirmed base URL: `https://pulsedive.com/api`
- Authentication model: optional API key passed as query parameter `key`; requests without a key are allowed but have stricter limits
- Primary response format: JSON
- Manually confirmed routes in this pass: `12`

## Authentication
- Pulsedive documents API-key authentication with the `key` query parameter.
- Official auth guidance says requests without a key still work, but with stricter rate limits.
- The docs recommend including the API key on every request for better performance and higher limits.

## Rate limits
- Pulsedive publishes plan-based limits rather than one universal numeric table on the reviewed page.
- Official limits page confirms:
  - free accounts: requests limited per second, day, and month
  - Pro API: increased limits
  - Commercial API: increased limits with soft limits on higher tiers
  - Enterprise: no rate limits
- Polling the scan queue with `GET /api/analyze.php?qid=...` does **not** count against the rate limit.
- The poll page recommends polling at most every `500ms`.

## Pagination
- Official pagination docs say pagination only applies to linked-indicator listings for threats and feeds.
- Confirmed per-request page ceilings:
  - Free: `1`
  - Pro: `2`
  - Team: `4`
  - Business/Custom: `10`
- Linked-indicator responses include pagination state such as `page_current`.

## Response and error handling
- The reviewed endpoint pages consistently document these response statuses: `200`, `400`, `401`, `404`, `429`, `500`.
- The shared responses guide says all API responses are JSON.
- Successful responses return HTTP `200`; many success payloads also include a `success` field, though not every endpoint uses it.
- Error handling guidance is status-code based, with `429` for throttling.

## Confirmed routes

### 1) Get indicator by value
- Method: `GET`
- Path: `/indicator.php`
- Example: `https://pulsedive.com/api/indicator.php?indicator=pulsedive.com`
- Required parameters:
  - `indicator` - indicator value such as a domain, IP, or URL
- Notes:
  - returns a full indicator record with risk, timestamps, linked threats, linked feeds, comments, attributes, and properties

### 2) Get indicator by ID
- Method: `GET`
- Path: `/indicator.php`
- Example: `https://pulsedive.com/api/indicator.php?iid=47936201`
- Required parameters:
  - `iid` - Pulsedive indicator ID

### 3) Get indicator links or properties
- Method: `GET`
- Path: `/indicator.php`
- Example confirmed by docs: `https://pulsedive.com/api/indicator.php?iid=47936201&get=links`
- Required parameters:
  - `iid` - indicator ID
  - `get` - documented page covers at least `links`; the page title confirms the same route also supports properties retrieval
- Notes:
  - the docs show grouped linked results such as `Related URLs`, `Redirects`, and `Active DNS`

### 4) Add indicator to scan queue
- Method: `POST`
- Path: `/analyze.php`
- Example: `https://pulsedive.com/api/analyze.php?value=pulsedive.com`
- Confirmed parameters:
  - `key` - optional API key
  - `value` - raw indicator value (domain, IP, URL)
  - `ioc` - base64-encoded indicator value alternative
  - `probe` - `0` passive or `1` active scan
  - `submit` - `0` do not save or `1` save into Pulsedive database
  - `pretty` - pretty-print JSON toggle
- Response notes:
  - success returns a queue identifier like `{ "qid": "2100254203" }`

### 5) Poll scan results
- Method: `GET`
- Path: `/analyze.php`
- Example: `https://pulsedive.com/api/analyze.php?qid=2350183660`
- Required parameters:
  - `qid` - queue ID from the add-to-queue call
- Optional parameters:
  - `key`
  - `pretty`
- Response notes:
  - while processing, the docs show fields such as `qid`, `status`, `stage`, and `error`
  - completed responses return the finished scan result payload

### 6) Search the dataset
- Method: `GET`
- Path: `/explore.php`
- Purpose: search Pulsedive’s dataset using the Explore query language
- Confirmed parameters:
  - `query` - boolean/wildcard search expression
  - the response docs show a `results` array and echoed `query`
- Notes:
  - the official page says search can span indicators or threats by value, type, risk, timestamps, feeds, attributes, and properties

### 7) Get threat by name
- Method: `GET`
- Path: `/threat.php`
- Purpose: retrieve a threat record by its name
- Confirmed selector parameter:
  - `threat`
- Response notes:
  - documented fields include `tid`, `threat`, `category`, `risk`, `description`, `summary`, `related`, `ttps`, `news`, and `comments`

### 8) Get threat by ID
- Method: `GET`
- Path: `/threat.php`
- Confirmed selector parameter:
  - `tid`

### 9) Get indicators linked to a threat
- Method: `GET`
- Path: `/threat.php`
- Purpose: retrieve linked indicators for a threat
- Confirmed notes from the page:
  - supports summary/risk breakdown behavior using `summary` together with `splitrisk`
  - this is one of the endpoint families where pagination applies

### 10) Get feed by name and organization
- Method: `GET`
- Path: `/feed.php`
- Purpose: retrieve a feed record by feed name plus organization
- Confirmed selector parameters:
  - `feed`
  - `organization`
- Response notes:
  - feed payloads include `fid`, `feed`, `organization`, `category`, `pricing`, `contact`, `website`, `schedule`, `description`, `indicators`, and `summary`

### 11) Get feed by ID
- Method: `GET`
- Path: `/feed.php`
- Confirmed selector parameter:
  - `fid`

### 12) Get indicators linked to a feed
- Method: `GET`
- Path: `/feed.php`
- Purpose: retrieve indicators linked to a specific feed
- Notes:
  - the docs show paginated results with fields such as `page_current` and `results`
  - this is the other endpoint family where documented pagination rules apply

## Important usage notes
- Pulsedive states that the same backend powers both the web UI and the public API.
- Active scanning is more detectable than passive enrichment; the `probe` toggle controls that behavior on scan requests.
- The `submit` toggle controls whether a scan is merely enriched or also stored in Pulsedive’s database, but existing indicators may still be refreshed.
- Linked-indicator collection endpoints, not lookup endpoints, are the places where pagination matters.

## Verification notes
This file was manually rebuilt from the official Pulsedive docs site, including the shared auth/rate-limit/response/pagination pages and representative endpoint pages for all documented endpoint groups.