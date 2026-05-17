# AniDB

## Manual review status
- Category: Anime
- Official docs URL from index: `https://wiki.anidb.net/HTTP_API_Definition`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## What I checked
- Indexed official wiki page: `https://wiki.anidb.net/HTTP_API_Definition`
- Official alternative page: `https://anidb.net/httpapi`

## Blocker summary
- Both reviewed official URLs currently stop at Cloudflare bot verification instead of exposing the HTTP API reference.
- Because the browser never reaches the actual docs content, I cannot confirm current routes, parameters, auth requirements, request format, pagination behavior, or error handling from first-party material in this environment.

## Evidence from manual browser inspection
- Visiting `https://wiki.anidb.net/HTTP_API_Definition` loaded title `Just a moment...` with body text `Performing security verification` from Cloudflare.
- Visiting `https://anidb.net/httpapi` produced the same Cloudflare verification page instead of the HTTP API definition.

## fireROUTE note
- Keep AniDB blocked until the official docs become readable from this environment or the provider republishes the HTTP API reference on a less restricted first-party host.
- Re-check both the wiki page and `/httpapi` before restoring any route assumptions.

## Sources inspected
- `https://wiki.anidb.net/HTTP_API_Definition`
- `https://anidb.net/httpapi`
