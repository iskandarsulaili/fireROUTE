# Humor

## Overview
- Provider: Humor API
- Category: Games & Comics
- Official site inspected: `https://humorapi.com/`
- Official docs inspected: `https://humorapi.com/docs/`
- Base URL: `https://api.humorapi.com`
- Auth: required API key, passed either as query parameter `api-key` or request header `x-api-key`
- HTTPS: yes
- Response format: JSON (`Content-Type: application/json` is documented on every endpoint shown)
- Confirmed routes: `16`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/jokes/search` | `keywords`, `include-tags`, `exclude-tags`, `min-rating`, `max-length`, `offset`, `number`, `api-key` | Search jokes with filters and pagination. |
| GET | `/jokes/create` | `topics`, `max-length`, `api-key` | Creates a joke with a large language model; notably exposed as GET. |
| GET | `/jokes/random` | `include-tags`, `exclude-tags`, `min-rating`, `max-length`, `api-key` | Returns one random joke matching filters. |
| POST | `/jokes/analyze` | raw joke text body; API key required by global auth guide | Analyzes and tags a joke. Endpoint block omits an `api-key` row, but the auth guide says every request needs an API key. |
| POST | `/jokes` | raw joke text body; API key required by global auth guide | Submit a joke for review. Endpoint block omits an `api-key` row, but the auth guide says every request needs an API key. |
| POST | `/jokes/{id}/upvote` | path `id`, `api-key` | Upvotes a joke. |
| POST | `/jokes/{id}/downvote` | path `id`, `api-key` | Downvotes a joke. |
| GET | `/memes/search` | `keywords`, `keywords-in-image`, `media-type`, `min-rating`, `max-age-days`, `offset`, `number`, `api-key` | Search memes with filters and pagination. |
| GET | `/memes/random` | `keywords`, `keywords-in-image`, `media-type`, `min-rating`, `max-age-days`, `api-key` | Returns one random meme matching filters. |
| POST | `/memes/{id}/upvote` | path `id`, `api-key` | Upvotes a meme. |
| POST | `/memes/{id}/downvote` | path `id`, `api-key` | Downvotes a meme. |
| GET | `/gif/search` | `query`, `number`, `api-key` | Searches GIFs; path is singular `gif`, not `gifs`. |
| GET | `/praise` | `name`, `reason`, `api-key` | Generates praise text. |
| GET | `/insult` | `name`, `reason`, `api-key` | Generates insult text. |
| GET | `/words/rate` | `word`, `api-key` | Rates a word's funniness from `0` to `1`. |
| GET | `/words/nonsense/random` | `api-key` | Generates a nonsense word plus rating. |

## Authentication
- The docs say every request requires an API key.
- Supported auth placements:
  - query string: `?api-key=YOUR-API-KEY`
  - header: `x-api-key: YOUR-API-KEY`
- The auth guide explicitly reminds users that only the first query parameter uses `?`, with later parameters using `&`.
- The docs say a free key is available after signup.

## Rate limits and quotas
- The docs say each plan has a daily point quota.
- The quota guide says requests usually cost `1` point and `0.01` points per result, while also noting there are exceptions and users should rely on each endpoint's quota note.
- Every endpoint block inspected on the current docs page ends with `Calling this endpoint requires 1 point`.
- Documented quota headers:
  - `X-API-Quota-Request` — points used by the request
  - `X-API-Quota-Used` — points used so far today
  - `X-API-Quota-Left` — points left today
- The docs say `X-API-Quota-Used` resets to zero at midnight UTC.
- Documented rate-limit behavior by plan:
  - Free: `60 requests in 1 minute`
  - Jack: `2 requests per second`
  - Jester: `5 requests per second`
  - Joker: `10 requests per second`

## Pagination
- `/jokes/search` documents `offset` (`0` to `1000`) and `number` (`0` to `10`).
- `/memes/search` documents `offset` (`0` to `1000`) and `number` (`0` to `10`).
- `/gif/search` documents `number` (`0` to `10`) but no `offset`.
- Random and vote endpoints do not document pagination.

## Parameter and request-body notes
- Joke-tag filters use hyphenated names exactly as published: `include-tags`, `exclude-tags`.
- Meme search uses additional hyphenated keys: `keywords-in-image`, `media-type`, `max-age-days`.
- `media-type` can be `image`, `video`, or a more specific format such as `jpg`, `png`, or `gif`.
- `min-rating` is documented on jokes and memes as a `0-10` filter.
- `max-length` limits joke length in letters.
- `topics` on `/jokes/create` is a comma-separated topic list.
- `/jokes/analyze` and `/jokes` both show example request bodies as raw joke text, not JSON objects.
- Vote routes require a numeric path `id` for the joke or meme being voted on.
- `/words/rate` documents `word` and returns a `rating` between `0` and `1`.

## Joke categories
The docs page lists these joke categories/tags:
- `Clean`
- `Animal`
- `Food`
- `Sexual`
- `Knock Knock`
- `Sport`
- `Blondes`
- `Law`
- `Nerdy`
- `Relationship`
- `Deep Thougths` (spelled this way on the docs page)
- `Dark`
- `One Liner`
- `Political`
- `Chuck Norris`
- `Yo Momma`
- `NSFW`
- `Religious`
- `School`
- `Jewish`
- `Racist`
- `Insults`
- `Sexist`
- `Holiday`
- `Analogy`
- `Christmas`
- `Kids`

## Response and format notes
- Every endpoint block documents `Content-Type: application/json`.
- Search-joke responses return `jokes[]` plus `available`.
- Random-joke responses return one joke object with `id` and `joke`.
- Analyze responses return the submitted `joke` plus `tags[]`.
- Joke-submission responses return a `joke` object plus a `message`.
- Meme search responses return `memes[]` entries with `id`, `url`, and `type`, plus `available`.
- Random meme responses return one meme object with `id`, `url`, and `type`.
- GIF search responses return `images[]` entries with `url`, `width`, and `height`.
- Praise/insult responses return a `text` field.
- `/words/rate` returns `rating`.
- `/words/nonsense/random` returns `word` and `rating`.

## Error handling
- The docs explicitly document `402` when the free-plan daily quota is exhausted.
- The docs explicitly document `429` when the per-second or per-minute rate limit is exceeded.
- The inspected docs do not publish a full structured error-body schema for those errors.

## Important usage notes
- The official homepage markets more than `50,000` jokes and more than `300,000` memes.
- The docs expose side-effecting vote and submission routes in addition to read-only retrieval routes.
- `/jokes/create` is a generated-content endpoint and is published as a GET route, so consumers should not assume all content creation uses POST.
- The docs' global auth guide applies to all endpoints, even where an individual endpoint table omits the `api-key` row.

## Integration notes for fireROUTE
- Preserve hyphenated parameter names exactly: `api-key`, `include-tags`, `exclude-tags`, `keywords-in-image`, `media-type`, `max-age-days`.
- Model `/jokes/analyze` and `POST /jokes` as raw-text body endpoints, not JSON-body endpoints.
- Treat vote and submission routes as side-effecting operations that should not be called by read-only adapters.
- Keep separate schemas for joke-search, meme-search, GIF-search, and generator endpoints because their response bodies differ materially.
- Normalize the path as `/gif/search` exactly; do not pluralize it.

## Sources inspected
- `https://humorapi.com/`
- `https://humorapi.com/docs/`
