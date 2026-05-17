# Catboy

## Manual review status
- Category: Anime
- Official docs URL from index: `https://catboys.com/api`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## What I checked
- Indexed official API URL: `https://catboys.com/api`
- Official root domain: `https://catboys.com/`

## Blocker summary
- The provider-controlled domain no longer serves API documentation.
- Both reviewed URLs now redirect into Afternic's parked-domain sales flow for `CatBoys.com`.
- Because the official host has become a for-sale landing page, I cannot confirm a live base URL, routes, parameters, auth requirements, pagination rules, or response format from first-party material.

## Evidence from manual browser inspection
- Visiting `https://catboys.com/api` redirected to `https://www.afternic.com/forsale/catboys.com...` with title `catboys.com` and visible sales copy `The domain name CatBoys.com is for sale!`.
- Visiting `https://catboys.com/` produced the same Afternic for-sale experience.

## fireROUTE note
- Keep Catboy blocked until the provider restores a provider-controlled site or publishes a new first-party API reference.
- Re-check both `/api` and the root domain before restoring any route assumptions.

## Sources inspected
- `https://catboys.com/api`
- `https://catboys.com/`
