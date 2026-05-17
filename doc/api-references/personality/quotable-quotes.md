# Quotable Quotes

## Manual review status
- Category: Personality
- Official docs reviewed: `https://raw.githubusercontent.com/lukePeavey/quotable/master/README.md`
- Manual review outcome: `manually_documented`
- Confirmed route count: `9`

## API overview
- Base URL: `https://api.quotable.io`
- Authentication: none documented
- Response format: JSON
- Rate limit: `180 requests per minute` per IP address; the docs say the API returns `429` when exceeded

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/random` | `maxLength`, `minLength`, `tags`, `author`, deprecated `authorId` | Deprecated in favor of `/quotes/random`, but still documented. |
| GET | `/quotes/random` | `limit`, `maxLength`, `minLength`, `tags`, `author`, deprecated `authorId` | Returns one or more random quotes. |
| GET | `/quotes` | `maxLength`, `minLength`, `tags`, `author`, deprecated `authorId`, `sortBy`, `order`, `limit`, `page` | Paginated quote listing/filter endpoint. |
| GET | `/quotes/{id}` | `id` path parameter | Get quote by ID. |
| GET | `/authors` | `slug`, `sortBy`, `order`, `limit`, `page` | Paginated author listing/filter endpoint. |
| GET | `/search/quotes` | `query`, `fields`, `fuzzyMaxEdits`, `fuzzyMaxExpansions`, `limit`, `page` | Atlas Search-backed quote search. |
| GET | `/search/authors` | `query`, `autocomplete`, `matchThreshold`, `limit`, `page` | Atlas Search-backed author search. |
| GET | `/authors/{id}` | path parameter shown as `:id` in the docs | The page title says “Get Author By Slug”; the route example is `GET /authors/:id`, and the narrative describes slug-based lookup. |
| GET | `/tags` | `sortBy`, `order` | Lists tags. |

## Pagination and response details
- `GET /quotes`, `GET /authors`, `GET /search/quotes`, and `GET /search/authors` return pagination fields including:
  - `count`
  - `totalCount`
  - `page`
  - `totalPages`
  - `lastItemIndex`
  - `results`
- Quote objects in the docs include `_id`, `content`, `author`, `authorSlug`, `length`, and `tags`
- Author objects in the docs include `_id`, `bio`, `description`, `link`, `name`, `slug`, and `quoteCount`
- `GET /tags` returns `count` and `results`

## Query parameter notes
### Quote filtering
- `tags` accepts comma-separated values for `AND` matching and pipe-separated values for `OR` matching
- Multi-word tags can be kebab-case or space-separated according to the docs
- `author` can be an author name or slug, and multiple authors can be supplied with a pipe-separated list
- `sortBy` for `/quotes` supports `dateAdded`, `dateModified`, `author`, `content`
- `limit` for `/quotes` is documented with `min 1`, `max 150`, default `20`

### Random quote endpoints
- `/quotes/random` defaults to `limit=1` and documents a maximum `limit` of `50`
- `/random` and `/quotes/random` both support the same quote-length and tag/author filters

### Search endpoints
- `/search/quotes` documents searchable fields `content`, `author`, and `tags`
- `/search/quotes` supports quoted exact-phrase queries and optional fuzzy search
- `/search/authors` documents `autocomplete=true` by default and `matchThreshold` from `1` to `3`

## Errors and format notes
- Rate-limit failure returns `429`
- The reviewed README does not provide a full generic error schema for all endpoints
- No auth or API key flow is documented for the public API

## Important usage notes
- The `/random` endpoint is explicitly deprecated by the project in favor of `/quotes/random`
- The documentation is in the repository README rather than a standalone hosted reference site
- The project also exposes a public Postman workspace from the README

## Sources inspected
- `https://raw.githubusercontent.com/lukePeavey/quotable/master/README.md`
