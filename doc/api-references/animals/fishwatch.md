# FishWatch

## Manual review status
- Category: Animals
- Official docs URL from index: `https://www.fishwatch.gov/developers`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## What I checked
- Indexed official docs URL: `https://www.fishwatch.gov/developers`
- Current official NOAA seafood-profiles page reached from the live site: `https://www.fisheries.noaa.gov/topic/sustainable-seafood/seafood-profiles`

## Blocker summary
- The indexed FishWatch developers URL no longer exposes API documentation.
- It now redirects to NOAA Fisheries' editorial topic page `https://www.fisheries.noaa.gov/topic/sustainable-seafood`.
- The current official NOAA seafood-profiles page is also an editorial content page, not an API reference.
- Neither reviewed page publishes a base URL, endpoint inventory, request parameters, authentication workflow, pagination rules, rate limits, or error documentation for a FishWatch API.

## Evidence from manual browser inspection
- Visiting `https://www.fishwatch.gov/developers` landed on `https://www.fisheries.noaa.gov/topic/sustainable-seafood` with title `Sustainable Seafood | NOAA Fisheries` and long public-site navigation/editorial content rather than developer docs.
- Visiting `https://www.fisheries.noaa.gov/topic/sustainable-seafood/seafood-profiles` loaded title `Sustainable Seafood: Seafood Profiles | NOAA Fisheries` and a human-facing seafood-profile page, again without any API reference or route list.

## fireROUTE note
- Keep FishWatch blocked until NOAA republishes a first-party developer/API reference or a clearly documented machine-readable endpoint surface.
- Re-check both the historical developers URL and the current NOAA seafood-profiles page before restoring any route assumptions.

## Sources inspected
- `https://www.fishwatch.gov/developers`
- `https://www.fisheries.noaa.gov/topic/sustainable-seafood/seafood-profiles`
