# Danbooru Anime

## Manual review status
- Category: Anime
- Official docs URL from index: `https://danbooru.donmai.us/wiki_pages/help:api`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## What I checked
- Official help page: `https://danbooru.donmai.us/wiki_pages/help:api`
- Official text fallback: `https://danbooru.donmai.us/wiki_pages/help:api.txt`

## Blocker summary
- Both reviewed official URLs currently stop at Cloudflare bot verification instead of exposing the API reference.
- Because the browser never reaches the documentation content, I cannot confirm current endpoints, auth rules, parameters, rate limits, or response details from first-party material in this environment.

## Evidence from manual browser inspection
- Visiting `https://danbooru.donmai.us/wiki_pages/help:api` loaded title `Just a moment...` with body text `Performing security verification`.
- Visiting `https://danbooru.donmai.us/wiki_pages/help:api.txt` produced the same Cloudflare verification page instead of the plain-text API doc.

## fireROUTE note
- Keep Danbooru Anime blocked until the official docs become readable from this environment or the provider republishes the API reference on a more accessible first-party host.
- Re-check both the wiki page and the `.txt` fallback before restoring any route assumptions.

## Sources inspected
- `https://danbooru.donmai.us/wiki_pages/help:api`
- `https://danbooru.donmai.us/wiki_pages/help:api.txt`
