# Imsea

## Overview
- Provider: Imsea
- Category: Photography
- Official docs URL from index: `https://imsea.herokuapp.com/`
- Documentation status: explicit blocker after manual review
- Confirmed public route count: `0`

## Blocker summary
The only first-party URL carried by the index now resolves to a dead Heroku deployment rather than a live API or documentation page.

- `https://imsea.herokuapp.com/` loaded as `No such app`

No alternate first-party documentation page was exposed from the surviving entry point.

## What was and was not confirmable
- Historical host: `imsea.herokuapp.com`
- Concrete API base URL: not confirmable from the current first-party state
- Endpoint paths and HTTP methods: not confirmable
- Auth model: not confirmable
- Rate limits, pagination, errors, and response format: not confirmable

## Important usage note
fireROUTE should treat Imsea as blocked unless the provider republishes the service on a working first-party host.

## Sources inspected
- `https://imsea.herokuapp.com/`