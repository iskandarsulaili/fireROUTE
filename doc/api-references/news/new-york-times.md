# New York Times

## Overview
- Provider: New York Times Developer APIs
- Category: News
- Official docs: `https://developer.nytimes.com/`
- Base host: `https://api.nytimes.com`
- Auth: API key via query parameter `api-key` for the API products reviewed; NYT RSS feeds do not require an API key
- HTTPS: yes
- Response formats: JSON for APIs, XML for RSS feeds
- Pagination: product-specific; Article Search uses `page`, Archive is month-bucketed, Books no longer requires pagination per current docs
- Rate limits: no single numeric portal-wide limit was shown on the product pages reviewed

## Confirmed endpoints

| Product | Method | Path | Notes |
|---|---|---|---|
| Archive API | GET | `/svc/archive/v1/{year}/{month}.json` | Monthly article archive since 1851. |
| Article Search API | GET | `/svc/search/v2/articlesearch.json` | Keyword and filter-based article search. |
| Books API | GET | `/svc/books/v3/lists/overview.json` | All best-seller lists for a print date. |
| Books API | GET | `/svc/books/v3/lists/{date}/{list}.json` | One best-seller list by date/current alias and list name. |
| Most Popular API | GET | `/svc/mostpopular/v2/emailed/{period}.json` | Most emailed stories. |
| Most Popular API | GET | `/svc/mostpopular/v2/shared/{period}.json` | Most shared stories across share types. |
| Most Popular API | GET | `/svc/mostpopular/v2/shared/{period}/{share_type}.json` | Most shared stories for a specific share type. |
| Most Popular API | GET | `/svc/mostpopular/v2/viewed/{period}.json` | Most viewed stories. |
| Times Newswire API | GET | `/svc/news/v3/content.json` | Newswire content listing. |
| Times Newswire API | GET | `/svc/news/v3/content/{source}/{section}.json` | Source/section filtered newswire feed. |
| Times Newswire API | GET | `/svc/news/v3/content/section-list.json` | Section metadata list. |
| Top Stories API | GET | `/svc/topstories/v2/{section}.json` | Current front-page stories for a section or `home`. |
| RSS Feeds | GET | `/services/xml/rss/nyt/{section}.xml` | Public RSS feed surface; no API key required. |

## Product notes
- Article Search uses Lucene-style `fq` filters and a `page` parameter, with a max of 10 results per response and up to 100 pages.
- The Archive API can return very large monthly payloads and is not intended for browser-side fetching.
- Books API docs note a May 2025 change: the overview and list services now return full lists without pagination; review/history/list-name endpoints were removed.
- Top Stories and RSS are section-driven rather than keyword-driven.

## Integration notes for fireROUTE
- Treat NYT as a multi-product provider, not a single uniform endpoint.
- Keep RSS separate from JSON APIs because it is unauthenticated XML.
- Preserve product-specific parameters like `fq`, `page`, `published_date`, `period`, `share_type`, `source`, and `section` rather than over-normalizing them.

## Route-count note
- The official NYT product pages reviewed in this pass expose `13` confirmed endpoint shapes.

## Sources inspected
- `https://developer.nytimes.com/`
- `https://developer.nytimes.com/apis`
- `https://developer.nytimes.com/docs/archive-product/1/overview`
- `https://developer.nytimes.com/docs/articlesearch-product/1/overview`
- `https://developer.nytimes.com/docs/books-product/1/overview`
- `https://developer.nytimes.com/docs/most-popular-product/1/overview`
- `https://developer.nytimes.com/docs/rss-api/1/overview`
- `https://developer.nytimes.com/docs/timeswire-product/1/overview`
- `https://developer.nytimes.com/docs/top-stories-product/1/overview`
