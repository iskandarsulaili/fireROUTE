# The Guardian

## Overview
- Provider: The Guardian Open Platform / Content API
- Category: News
- Official docs: `https://open-platform.theguardian.com/documentation/`
- Base URL: `https://content.guardianapis.com`
- Auth: API key required via the `api-key` query parameter
- HTTPS: yes
- Response formats: JSON by default; XML also documented via the `format` parameter
- JSONP support: yes, via the `callback` query parameter
- Pagination: page-based with `page` and `page-size`; default page size documented as `10`
- Deep-pagination note: the docs explicitly describe a separate content-`/next` flow when normal page-based pagination is not sufficient
- Rate limits / quotas: Guardian docs state keys are rate-limited and quota-limited, but the public endpoint docs inspected do not publish a single default numeric quota; they note elevated requests-per-day / requests-per-second may be arranged on request

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/search` | required `api-key`; optional rich query/filter params including `q`, `query-fields`, `section`, `tag`, `from-date`, `to-date`, `page`, `page-size`, `order-by`, `show-fields`, `show-tags`, `show-section`, `show-blocks`, `show-elements`, `show-references`, `show-rights`, `format`, `callback` | Main content search/listing endpoint. |
| GET | `/content/{id}/next` | required content `id` in path; same search/order context query params as the initiating search | Official deep-pagination continuation route described on the content page. |
| GET | `/tags` | required `api-key`; optional `q`, `web-title`, `type`, `section`, `reference`, `reference-type`, `page`, `page-size`, `show-references`, `format`, `callback` | Lists Guardian tags / taxonomy records. |
| GET | `/sections` | required `api-key`; optional `q`, `format`, `callback` | Lists sections. |
| GET | `/editions` | required `api-key`; optional `q`, `format`, `callback` | Lists editions such as `uk`, `us`, `au`, `international`, `europe`. |
| GET | `/{id}` | required path-like `id`; required `api-key`; optional content filters, date controls, paging, ordering, and `show-*` expansion parameters | Returns a single item by site path, with optional expansions and related-content controls. |

## Authentication
- The overview page says you must sign up for an API key.
- The key should be sent with every request as the `api-key` query parameter.
- Guardian examples often use the special demo value `api-key=test` in documentation links.

## Content search details
- Documented endpoint URL: `https://content.guardianapis.com/search`
- Confirmed content-search query controls visible in the docs:
  - `q` — free-text query; supports `AND`, `OR`, `NOT`, parentheses, and exact phrases in double quotes
  - `query-fields` — restrict which indexed fields are searched
  - filters such as `section`, `reference`, `reference-type`, `tag`, `rights`, `ids`, `production-office`, `lang`, `star-rating`
  - date filters `from-date`, `to-date`, and `use-date`
  - pagination `page` and `page-size` (documented range `1` to `50` on the content page)
  - ordering controls `order-by` (`newest`, `oldest`, `relevance`) and `order-date`
  - response-expansion controls including `show-fields`, `show-tags`, `show-section`, `show-blocks`, `show-elements`, `show-references`, `show-rights`
- The docs also explain boolean syntax for some filters:
  - AND = `,`
  - OR = `|`
  - NOT = `-`
- The content docs explicitly describe deep pagination via `/content/{id}/next`, carrying forward the original query/order context after the last seen item.

## Tag, section, edition, and single-item details
- `/tags`
  - query params documented: `q`, `web-title`, `type`, `section`, `reference`, `reference-type`, `page`, `page-size`, `show-references`
- `/sections`
  - query param documented: `q`
- `/editions`
  - query param documented: `q`
- `/{id}` single item
  - `id` is the site path for the item; the docs say replacing the site domain with `content.guardianapis.com` yields the API URL for that content
  - supports many of the same filters/date/page/order/`show-*` parameters as the content search page
  - additionally documents related-content toggles such as `show-story-package`, `show-editors-picks`, `show-most-viewed`, and `show-related`

## Response format notes
- Endpoint docs consistently show a top-level `response` object.
- Common response fields shown across docs pages include:
  - `status`
  - `userTier`
  - `total`
- Search/listing responses additionally show fields such as:
  - `startIndex`
  - `pageSize`
  - `currentPage`
  - `pages`
  - `orderBy`
  - `results`
- Content result items shown in the docs include:
  - `id`
  - `type`
  - `sectionId`
  - `sectionName`
  - `webPublicationDate`
  - `webTitle`
  - `webUrl`
  - `apiUrl`
  - `isHosted`
  - `pillarId`
  - `pillarName`
- Single-item responses return `response.content` rather than a `results` array.
- Optional expansion parameters can attach fields, tags, sections, blocks, elements, references, rights, editors’ picks, related items, and story-package data.

## Pagination and quota notes
- Default page size is documented as `10`.
- Content-page docs document `page-size` up to `50`.
- The overview page warns that applications that poll heavily may exceed their daily quota.
- The docs say Guardian can discuss higher request-per-day or request-per-second limits for qualifying use cases.

## Error / status notes
- The public endpoint pages inspected document response-body success structure and reference an HTTP status code article, but they do not publish a compact per-endpoint HTTP error matrix inline.
- Successful examples use `response.status = "ok"`.
- Because the API supports JSONP via `callback`, consumers should preserve both raw HTTP status handling and provider response-body status handling.

## Integration notes for fireROUTE
- Keep `/search` and `/{id}` separate: the former is a collection search API, the latter is a path-addressed content lookup API.
- Preserve Guardian’s hyphenated parameter names exactly (`api-key`, `page-size`, `from-date`, `show-fields`, etc.).
- Treat `/content/{id}/next` as a real route family for deep-pagination workflows rather than inferring it from generic paging alone.
- Expansion parameters materially change payload shape; adapters should expose them instead of flattening everything to the minimal search schema.

## Sources inspected
- `https://open-platform.theguardian.com/documentation/`
- `https://open-platform.theguardian.com/documentation/search`
- `https://open-platform.theguardian.com/documentation/tag`
- `https://open-platform.theguardian.com/documentation/section`
- `https://open-platform.theguardian.com/documentation/edition`
- `https://open-platform.theguardian.com/documentation/item`
