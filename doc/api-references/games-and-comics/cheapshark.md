# CheapShark

## Overview
- Provider: CheapShark API
- Category: Games & Comics
- Official docs: `https://www.cheapshark.com/api`
- Base URL: `https://www.cheapshark.com/api/1.0`
- Auth: no API key required
- HTTPS: yes
- CORS: explicitly supported per docs
- Rate limits: numeric quota not published; excessive request bursts return `429` and may trigger temporary or permanent blocking
- Required client behavior: docs require a descriptive `User-Agent` header

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/deals` | filters such as `storeID`, `pageNumber`, `upperPrice`, and other deal filters | Paged list of deals matching criteria. |
| GET | `/deals` | `id` query | Deal lookup by deal id. |
| GET | `/games` | `title` query and search/list filters | Search games by title. |
| GET | `/games` | `id` query | Lookup one game by CheapShark game id. |
| GET | `/games` | `ids` query | Lookup multiple games in one request. |
| GET | `/stores` | none | Returns store metadata. |
| GET | `/stores` | `lastChange` query | Returns store-change information according to docs examples. |
| GET | `/alerts` | `action=set`, `email`, `gameID`, `price` | Creates or edits a price alert. |
| GET | `/alerts` | `action=delete`, `email`, `gameID` | Deletes a price alert. |

## Usage and routing notes
- The docs explicitly require using CheapShark redirect links when sending users to specific deals:
  - `https://www.cheapshark.com/redirect?dealID={id}`
- The API is intended for direct user-driven interactions, not bulk catalog mirroring.
- Docs explicitly warn that excessive automated caching/building of full catalogs will run into rate-limit enforcement.

## Parameters and behavior confirmed from docs
- Deals example endpoint shown in docs:
  - `GET https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15`
- Deal lookup example:
  - `GET https://www.cheapshark.com/api/1.0/deals?id={dealID}`
- Game search example:
  - `GET https://www.cheapshark.com/api/1.0/games?title=batman`
- Single game lookup example:
  - `GET https://www.cheapshark.com/api/1.0/games?id=612`
- Multiple game lookup example:
  - `GET https://www.cheapshark.com/api/1.0/games?ids=128,129,130`
- Alerts example:
  - `GET https://www.cheapshark.com/api/1.0/alerts?action=set&email=someone@example.org&gameID=59&price=14.99`

## Error handling and limits
- The docs state that too many requests in a short period return HTTP `429`.
- Temporary bans expose remaining ban time via the `Retry-After` response header.
- All clients are subject to the same limits.

## Integration notes for fireROUTE
- Keep redirect-link generation separate from API data calls.
- Always send a clear `User-Agent` when integrating.
- Treat `/alerts` as state-changing even though the documented interface is query-driven.
- Do not use CheapShark as a background bulk-ingestion source; use it for interactive user search and deal lookups.

## Sources inspected
- `https://apidocs.cheapshark.com/`
- Official intro, Deals, Games, Stores, and Alerts sections visible in the docs UI
