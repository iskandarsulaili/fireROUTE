# Crossref Metadata Search

Official pages manually reviewed:
- https://raw.githubusercontent.com/CrossRef/rest-api-doc/master/README.md
- https://api.crossref.org/

## Overview
- Public API base URL: `https://api.crossref.org`
- Authentication: none required for public access
- Response format: JSON
- The reviewed README is explicitly marked deprecated, but it points to the current API host at `https://api.crossref.org/`

Manual route count confirmed from the reviewed official docs/examples: **10**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/works` | Search works and DOI metadata |
| GET | `/works/{doi}` | Retrieve one work by DOI |
| GET | `/works/{doi}/agency` | Retrieve registration-agency information for a DOI |
| GET | `/members` | Search/list members |
| GET | `/members/{memberId}` | Get one member |
| GET | `/members/{memberId}/works` | List works for one member |
| GET | `/journals/{issn}` | Get one journal |
| GET | `/journals/{issn}/works` | List works for one journal |
| GET | `/funders/{funderId}/works` | List works for one funder |
| GET | `/prefixes/{ownerPrefix}/works` | List works for one DOI prefix |

## Confirmed query parameters and controls
The reviewed README examples and parameter sections document:
- `query`
- fielded query params such as `query.author` and `query.bibliographic`
- `filter`
- `facet`
- `rows`
- `offset`
- `cursor`
- `sort`
- `order`
- `sample`
- `select`
- `mailto`

## Rate limits and etiquette
- The public API is free and open.
- Current limits, when imposed, are advertised in HTTP headers `X-Rate-Limit-Limit` and `X-Rate-Limit-Interval`.
- The docs strongly recommend using HTTPS plus contact info via `mailto` query parameter or `mailto:` in `User-Agent` to reach the more reliable "polite pool".

## Pagination
The reviewed docs show two pagination patterns:
- offset pagination with `rows` + `offset`
- deep pagination using `cursor=*` and subsequent cursor tokens

## Response and error notes
- Collection responses use Crossref's standard JSON envelope with message metadata and result items
- `/works/{doi}/agency` returns the DOI's agency information
- The reviewed README emphasizes caching and backoff rather than polling aggressively

## Important usage notes
- The reviewed README says records usually appear within about 20 minutes of successful deposit.
- Summary information is described as batch-processed every 24 hours.
- Users should monitor latency, back off when performance degrades, and identify themselves with contact info.

## fireROUTE notes
- `/works` is the main search endpoint and should expose Crossref's filter/query controls directly.
- Use cursor pagination for large harvests instead of large `offset` traversal.
- Preserve `mailto` passthrough and encourage identifiable `User-Agent` strings in adapters.
