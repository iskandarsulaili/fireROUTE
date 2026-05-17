# Juju

## Provider metadata
- Category: `Jobs`
- Provider slug: `juju`
- Official docs page used: `https://www.juju.com/publisher/spec/`
- Current documented API host: `http://api.juju.com`
- Primary documented routes: `/jobs`, `/add-channel`
- Auth model: required publisher identifiers/query parameters, not header auth
- Response format: RSS/XML for search results
- Manually confirmed route count: `2`

## Authentication and request model
The official publisher spec does not use bearer or API-key headers. Instead, requests identify the publisher in the query string.

Required request parameters for the search API:
- `partnerid` - assigned Publisher ID
- `ipaddress` - end-user IP address
- `useragent` - end-user user-agent
- at least one of:
  - `k` - query string
  - `l` - location

The docs also note:
- all URL parameters should be URL encoded
- requests may be made with `GET` or `POST`
- POST requests should use `Content-Type: application/x-www-form-urlencoded`

## Canonical endpoints
### 1) Search jobs
- Methods: `GET`, `POST`
- Path: `/jobs`
- Full URL pattern: `http://api.juju.com/jobs`
- Purpose: retrieve publisher job-search results

Documented query/body parameters:
- `partnerid` - required publisher ID
- `ipaddress` - required end-user IP
- `useragent` - required end-user user agent
- `k` - search query; one of `k` or `l` is required
- `l` - location; one of `k` or `l` is required
- `c` - category filter; may be comma-joined
- `r` - search radius in miles; default `20`, max `100`
- `order` - `relevance`, `date`, or `distance`
- `days` - search lookback; default `90`
- `jpp` - jobs per page; default/max `20`
- `page` - page number starting at `1`
- `channel` - tracking channel name
- `highlight` - set `0` to disable HTML bolding
- `startindex` - skip records for backfill use cases; default/minimum `1`
- `session` - anonymized user/session identifier

Response notes:
- Returns RSS/XML.
- The provider says only the first `1000` job postings in a result set are available.
- Requests for deeper results using `page` or `startindex` are redirected with `302`.

### 2) Activate a channel
- Method: `GET`
- Path: `/add-channel`
- Full URL pattern: `http://api.juju.com/add-channel`
- Purpose: activate a named reporting channel before using it on `/jobs`

Parameters:
- `partnerid` - required publisher ID
- `channel` - required channel name

Usage notes:
- Successful response activates the channel.
- Maximum of `50` channels.
- Channel names are case-sensitive.
- Certain characters are forbidden: `#/\\$!*~'";:|<>&?`

## Categories documented for `c`
Examples from the official list include:
- `accounting`
- `administrative-clerical`
- `engineering`
- `government`
- `health-care`
- `software-it`
- `warehouse`

## Response schema notes
The XML example includes:
- channel metadata such as `title`, `link`, `description`, `language`
- pagination-style metadata such as `totalresults`, `startindex`, `itemsperpage`
- per-job fields such as:
  - `title`
  - `zip`
  - `city`
  - `county`
  - `state`
  - `country`
  - `source`
  - `company`
  - `link`
  - `onclick`
  - `guid`
  - `postdate`
  - `description`

## Attribution and click-tracking notes
- The spec requires attribution HTML near results.
- It also requires loading Juju's partner JavaScript and preserving the returned `onclick` logic for tracked links.
- Optional query parameters `email`, `fname`, and `lname` should be appended to the job link when available.

## Error notes
The spec explicitly calls out:
- `200 OK` for success
- `400 Bad Request` for invalid requests/IDs
- `503 Service Unavailable` at times of high load
- `302 Redirect` when paging beyond the first 1000 jobs

## fireROUTE normalization notes
- This is not a pure JSON REST API; adapters must handle XML/RSS.
- User context (`ipaddress`, `useragent`) is required and should be preserved.
- Link click-tracking is part of the documented integration contract, not an optional embellishment.
