# NewsX

## Overview
- Provider: NewsX
- Category: News
- Official site reviewed: `https://www.newsx.com/`
- Indexed docs URL from category row: `https://rapidapi.com/machaao-inc-machaao-inc-default/api/newsx/` (third-party marketplace, not used as source of truth)
- Base URL: `https://www.newsx.com/wp-json`
- Auth: no auth required for the confirmed public GET content/discovery routes below; write methods exist on several collection routes but unauthenticated POSTs return `401 rest_cannot_create`
- HTTPS: yes
- Response format: JSON
- Pagination: standard WordPress REST pagination with query params such as `page` and `per_page`, plus response headers `X-WP-Total` and `X-WP-TotalPages`
- Rate limits: no first-party published rate limits were exposed on the official site or API index during this pass

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/` | none | Root REST index. Returns site metadata, namespaces, and route discovery for the exposed API surface. |
| GET | `/wp/v2/types` | optional standard WP context params | Lists registered post/content types and their `rest_base` values. Confirmed custom content types including `live_blog` and `scroll_gallery`. |
| GET | `/wp/v2/taxonomies` | optional standard WP context params | Lists taxonomy metadata; confirmed `category` and `post_tag` mappings across `post`, `scroll_gallery`, and `live_blog`. |
| GET | `/wp/v2/posts` | standard WP collection params including `page`, `per_page`, `search`, `after`, `before`, `author`, `slug`, `categories`, `tags`, `order`, `orderby`, `sticky`, `format` | Main published article feed. |
| GET | `/wp/v2/pages` | standard WP collection params including `page`, `per_page`, `search`, `author`, `parent`, `slug`, `order`, `orderby` | Static pages and utilities such as calculator/info pages. |
| GET | `/wp/v2/media` | standard WP collection params including `page`, `per_page`, `search`, `author`, `parent`, `slug`, `media_type`, `mime_type`, `order`, `orderby` | Media/attachment discovery. |
| GET | `/wp/v2/categories` | standard taxonomy params including `page`, `per_page`, `search`, `hide_empty`, `parent`, `post`, `slug`, `order`, `orderby` | Category listing. |
| GET | `/wp/v2/tags` | standard taxonomy params including `page`, `per_page`, `search`, `hide_empty`, `post`, `slug`, `offset`, `order`, `orderby` | Tag listing. |
| GET | `/wp/v2/search` | `page`, `per_page`, `search`, `type`, `subtype`, `exclude`, `include` | Cross-entity site search returning summarized search hits. |
| GET | `/wp/v2/users` | standard user collection params including `page`, `per_page`, `search`, `slug`, `order`, `orderby`, `has_published_posts`, `search_columns` | Public author listing is enabled on this site. |
| GET | `/wp/v2/live_blog` | collection params similar to posts, including `page`, `per_page`, `search`, `after`, `before`, `slug`, `categories`, `tags`, `order`, `orderby` | NewsX custom post type for live-update articles. |
| GET | `/wp/v2/scroll_gallery` | collection params similar to posts, including `page`, `per_page`, `search`, `after`, `before`, `author`, `slug`, `categories`, `tags`, `order`, `orderby`, `format` | NewsX custom post type for photo/story gallery content. |

## Parameters, auth, and error notes
- The official REST index at `/wp-json/` identifies the site as `NewsX` and exposes the public route inventory directly from the first-party domain.
- The public GET collection endpoints above responded without authentication in browser tests.
- The root route metadata exposes write methods (`POST`) on several collection routes such as `posts`, `pages`, `media`, `categories`, `tags`, `users`, `live_blog`, and `scroll_gallery`, but an unauthenticated `POST /wp-json/wp/v2/posts` returned `401` with JSON error `{"code":"rest_cannot_create","message":"Sorry, you are not allowed to create posts as this user.","data":{"status":401}}`.
- Standard WordPress filtering/sorting parameters are available directly from the route metadata; fireROUTE adapters should preserve them instead of collapsing everything to one generic query surface.
- Collection endpoints return pagination metadata in HTTP headers `X-WP-Total` and `X-WP-TotalPages`.
- Standard WordPress REST errors are JSON objects with fields such as `code`, `message`, and `data.status`.

## Live-response observations
- `GET /wp-json/wp/v2/posts?per_page=1` returned published article objects with fields including `id`, `date`, `slug`, `link`, `title.rendered`, `content.rendered`, `excerpt.rendered`, `categories`, `tags`, and `_links`.
- `GET /wp-json/wp/v2/categories?per_page=3` and `GET /wp-json/wp/v2/tags?per_page=3` returned taxonomy objects with counts, slugs, links, and related post-type links.
- `GET /wp-json/wp/v2/search?per_page=3&search=india` returned summarized search records with `id`, `title`, `url`, `type`, and `subtype`.
- `GET /wp-json/wp/v2/live_blog?per_page=1` and `GET /wp-json/wp/v2/scroll_gallery?per_page=1` confirmed that NewsX exposes separate custom collections for live blogs and gallery/photo story content.
- `GET /wp-json/wp/v2/users?per_page=1` returned public author records, confirming that user/author discovery is enabled.

## Usage notes
- There is no dedicated NewsX developer portal on the site, but the publisher-controlled WordPress REST API is openly exposed on the official domain and is sufficient for a grounded fireROUTE manual reference.
- For broad article retrieval, start with `/wp/v2/posts`; use `/wp/v2/search` for search-style lookup and `/wp/v2/categories` or `/wp/v2/tags` to resolve taxonomy IDs before filtering posts.
- NewsX-specific content is not limited to ordinary posts; `live_blog` and `scroll_gallery` are separate first-party collections worth routing distinctly.
- Because this is WordPress REST, `_embed` and linked-resource traversal patterns may be useful even though they were not the core focus of this pass.
- Avoid treating the indexed RapidAPI marketplace row as authoritative when the publisher’s own `wp-json` surface is directly available.

## Route-count note
- The official first-party REST surface currently exposes `12` confirmed public route families that were manually verified here.

## Sources inspected
- `https://www.newsx.com/`
- `https://www.newsx.com/wp-json/`
- `https://www.newsx.com/wp-json/wp/v2/posts?per_page=1`
- `https://www.newsx.com/wp-json/wp/v2/types`
- `https://www.newsx.com/wp-json/wp/v2/taxonomies`
- Indexed marketplace row reviewed only as the legacy source URL reference: `https://rapidapi.com/machaao-inc-machaao-inc-default/api/newsx/`
