# Cat Facts

## Overview
- Provider: Cat Facts
- Category: Animals
- Official docs: `https://alexwohlbruck.github.io/cat-facts/docs/`
- Base URL: `https://cat-fact.herokuapp.com`
- Auth: none for public fact endpoints; website-session authentication required for `/facts/me` and `/users/me`
- HTTPS: yes
- Response format: JSON
- Pagination: none documented
- Rate limits: no numeric rate limit documented

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/facts/random` | optional `animal_type`, optional `amount` | Returns one fact object by default, or an array of fact objects when `amount` is greater than 1. |
| GET | `/facts/:factID` | path `factID`; optional `animal_type` | Returns one fact by ID. |
| GET | `/facts/me` | optional `animal_type`; authenticated website session required | Returns queued facts belonging to the currently authenticated user. |
| GET | `/users/me` | authenticated website session required | Returns the currently logged-in user profile. |

## Parameter notes
- `animal_type` — optional comma-separated string. The docs show a default of `cat`.
- `amount` — optional numeric count for `/facts/random`; default `1`, documented maximum `500`.
- `factID` — path parameter for a stored fact record.
- The docs do not describe API-key auth or bearer tokens; for protected routes they explicitly say auth currently requires logging in manually on the website.

## Response format notes
- Fact responses use JSON objects with fields shown in the official examples, including `_id`, `__v`, `text`, `updatedAt`, `deleted`, `source`, and sometimes `sentCount`.
- `/facts/random` returns:
  - a single fact object when `amount=1`
  - an array of fact objects when `amount>1`
- `/facts/me` returns an array of queued fact objects and may include nested `user` data.
- `/users/me` returns a user profile object with nested `name` and `google` objects plus fields such as `photo`, `isAdmin`, `deleted`, `_id`, `updatedAt`, `createdAt`, `email`, `ip`, and optional `phone`.

## Error and availability notes
- The docs do not publish a formal error-body schema or status-code matrix.
- The documentation warns that the first request may take a few seconds because the app runs on a free Heroku dyno.
- Protected routes are documented, but the official docs also state that authentication is currently only achievable by logging in manually on the website, so they are not suitable for simple token-based server-to-server fireROUTE adapters.

## Integration notes for fireROUTE
- Treat `/facts/random` and `/facts/:factID` as the practical public API surface.
- Preserve the single-object vs array behavior on `/facts/random`; do not assume an array response for all requests.
- Avoid relying on `/facts/me` and `/users/me` unless a session-authenticated browser flow is intentionally supported.
- Because the provider is still documented on a historical Heroku host, adapters should tolerate availability issues or cold starts.

## Sources inspected
- `https://alexwohlbruck.github.io/cat-facts/`
- `https://alexwohlbruck.github.io/cat-facts/docs/`
- `https://alexwohlbruck.github.io/cat-facts/docs/endpoints/facts.html`
- `https://alexwohlbruck.github.io/cat-facts/docs/endpoints/users.html`
