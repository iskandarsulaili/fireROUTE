# Waifu.pics

## Manual review status
- Category: Anime
- Official docs URL from index: `https://waifu.pics/docs`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## What I checked
- Indexed docs URL: `https://waifu.pics/docs`
- Official root URL: `https://waifu.pics/`

## Blocker summary
- The provider-controlled domain no longer serves API documentation.
- Both reviewed URLs now load the same expired-domain parking page rather than provider docs or JSON.
- Because the official host has expired, I cannot confirm a live base URL, route inventory, parameters, auth requirements, pagination rules, or response format from first-party material.

## Evidence from manual browser inspection
- Visiting `https://waifu.pics/docs` loaded title `Redirecting...` and body text beginning `The domain has expired. Is this your domain? Renew now`, followed by ParkLogic parking links.
- Visiting `https://waifu.pics/` produced the same expired-domain page.

## fireROUTE note
- Keep Waifu.pics blocked until the provider restores the domain or republishes the API on a new first-party host.
- Re-check both `/docs` and the root domain before restoring any route assumptions.

## Sources inspected
- `https://waifu.pics/docs`
- `https://waifu.pics/`
