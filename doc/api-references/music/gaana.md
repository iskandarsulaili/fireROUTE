# Gaana

## Overview
- Provider: Gaana
- Category: Music
- Official docs URL from index: `https://github.com/cyberboysumanjay/GaanaAPI`
- Documentation status: explicit blocker after manual review
- Confirmed public route count: `0`

## Blocker summary
The indexed URL is an unofficial GitHub repository, not a first-party Gaana developer portal. In this run, the first-party Gaana site blocked browser access and the obvious first-party API hostname did not expose a readable public reference.

- `https://gaana.com/` returned an `Access Denied` page in the browser
- `https://api.gaana.com/` loaded as an empty page with no visible route list, auth details, or API documentation
- no first-party public developer portal or endpoint inventory was confirmed from the reachable official pages in this run

## What was and was not confirmable
- Official consumer site hostname: `https://gaana.com/`
- Possible first-party API hostname: `https://api.gaana.com/`
- Concrete API base URL for public integration use: not confirmable
- Endpoint paths and HTTP methods: not confirmable
- Auth details: the old index labeled the provider `No`, but current first-party pages do not expose a public request format
- Rate limits, pagination, error schema, and response format: not confirmable from reachable first-party pages

## Important usage note
fireROUTE should treat Gaana as blocked until Gaana publishes a readable first-party API reference or developer portal instead of relying on third-party reverse-engineered repositories.

## Sources inspected
- `https://gaana.com/`
- `https://api.gaana.com/`
- `https://github.com/cyberboysumanjay/GaanaAPI`
