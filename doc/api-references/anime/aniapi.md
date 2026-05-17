# AniAPI

## Manual review status
- Category: Anime
- Official docs URL from index: `https://aniapi.com/docs/`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## What I checked
- Indexed docs URL: `https://aniapi.com/docs/`
- Official root URL: `https://aniapi.com/`

## Blocker summary
- The indexed docs URL no longer exposes AniAPI documentation.
- In this run it redirected to the parked host `http://ww1.aniapi.com/`, whose HTML is an ad/search iframe shell rather than provider docs.
- The official root URL also does not expose usable documentation; it currently resolves to a plain `Too many requests` response in this environment.
- Because the official site no longer provides readable first-party documentation, I cannot confirm a live base URL, route inventory, parameters, auth workflow, pagination rules, rate limits, or error format.

## Evidence from manual browser inspection
- Visiting `https://aniapi.com/docs/` landed on `http://ww1.aniapi.com/` and the page HTML was a parked/advertising shell with embedded third-party tracking and iframe content, not AniAPI docs.
- Visiting `https://aniapi.com/` returned a minimal page whose body text was `Too many requests`.

## fireROUTE note
- Keep AniAPI blocked until the provider restores a readable first-party docs surface or publishes a new official API reference.
- Re-check both `/docs/` and the root domain before restoring any route assumptions.

## Sources inspected
- `https://aniapi.com/docs/`
- `https://aniapi.com/`
