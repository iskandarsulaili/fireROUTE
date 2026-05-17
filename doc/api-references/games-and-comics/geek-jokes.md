# Geek-Jokes

## Overview
- Provider: Geek Jokes API
- Category: Games & Comics
- Official docs/source page: `https://github.com/sameerkumar18/geek-joke-api`
- Base URL: `https://geek-jokes.sameerkumar.website`
- Auth: none
- HTTPS: yes
- Response formats confirmed during review:
  - plain text by default
  - JSON when `format=json` is supplied
- Pagination: none
- Rate limits: no numeric rate limit documented in the README or live endpoint

## Confirmed endpoint

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api` | optional `format=json` | Returns a random geek/programming joke. The official README documents `GET https://geek-jokes.sameerkumar.website/api?format=json`. |

## Query parameter notes
- `format` — the only documented query parameter.
- Official README example uses `format=json`.
- During live review, omitting `format` returned a plain-text joke, while `format=json` returned a JSON object.

## Response format notes
- Observed default response: a raw text joke string.
- Observed JSON response shape when using `format=json`:
  - `joke`
- The official README describes this as a random geeky/programming joke service and does not publish additional metadata fields.

## Error handling
- No formal error schema or status-code matrix is documented.
- The official README only demonstrates successful `GET` requests.
- Consumers should handle ordinary HTTP/network failures and unexpected output defensively.

## Usage notes
- The README describes the API as fetch-only: clients simply issue a GET request to retrieve a random joke.
- The project page explicitly suggests refreshing or repeating the request to receive more jokes.
- No API key, login, pagination, or filtering options are documented.

## Integration notes for fireROUTE
- Model this provider as a single random-joke endpoint.
- Support both the plain-text default and JSON mode, with JSON mode preferred for structured integrations.
- Because the response is intentionally random and stateless, caching behavior should be chosen carefully.

## Sources inspected
- `https://github.com/sameerkumar18/geek-joke-api`
- `https://geek-jokes.sameerkumar.website/api`
- `https://geek-jokes.sameerkumar.website/api?format=json`
