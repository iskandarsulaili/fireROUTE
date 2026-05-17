# IMDb-API

## Provider metadata
- Category: `Video`
- Provider slug: `imdb-api`
- Official pages manually reviewed:
  - `https://imdb-api.com/`
  - `https://www.imdb-api.com/`
- Research outcome: `explicit_blocker`
- Route count confirmed: `0`

## What the official site currently does
- The official root domain fails with Chrome's DNS-resolution error `ERR_NAME_NOT_RESOLVED`.
- The obvious official `www` alternative fails with the same `ERR_NAME_NOT_RESOLVED` error.
- The rendered browser error page states that both `imdb-api.com` and `www.imdb-api.com` could not be resolved to a server IP address.
- Because the official host does not currently resolve, no first-party landing page, authentication guide, route reference, or schema file can be reviewed.

## Route extraction result
- No trustworthy base URL, endpoint paths, request methods, parameters, authentication headers, pagination rules, rate limits, error schema, or response-format notes can be confirmed from official sources in the current host state.
- I did not infer routes from mirrors, aggregators, cached copies, or third-party tutorials because this task requires official-source verification.

## Rerun pass 8 note
- Rechecked `https://imdb-api.com/` and `https://www.imdb-api.com/` in this rerun.
- Both hostnames still fail on Chrome's browser error page with `ERR_NAME_NOT_RESOLVED`.
- No first-party landing page, auth guide, route reference, or migration target is currently visible.

## fireROUTE integration note
- Keep IMDb-API blocked for manual fireROUTE completion until the provider restores DNS for its official host or publishes a replacement first-party documentation domain.
