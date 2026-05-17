# Graphs for Coronavirus

## Manual review status
- Category: News
- Official docs URL from index: `https://corona.dnsforfamily.com/api.txt`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## What I checked
- Indexed official docs URL: `https://corona.dnsforfamily.com/api.txt`
- Official same-host alternative: `https://corona.dnsforfamily.com/`

## Blocker summary
- Both reviewed official URLs currently fail at DNS resolution before any provider content can load.
- Because the hostname itself no longer resolves, I cannot confirm a live base URL, route list, methods, parameters, auth rules, pagination behavior, rate limits, or error contract from first-party material.

## Evidence from manual browser inspection
- Visiting `https://corona.dnsforfamily.com/api.txt` failed with `ERR_NAME_NOT_RESOLVED` and Chrome's `This site can’t be reached` page.
- Visiting `https://corona.dnsforfamily.com/` produced the same DNS-resolution failure.

## fireROUTE note
- Keep Graphs for Coronavirus blocked until the official hostname resolves again or the maintainer publishes a new first-party host/reference.
- Re-check both `api.txt` and the same-host root before restoring any route assumptions.

## Sources inspected
- `https://corona.dnsforfamily.com/api.txt`
- `https://corona.dnsforfamily.com/`
