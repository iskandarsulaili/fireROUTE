# Catch The Show

## Provider metadata
- Category: `Video`
- Provider slug: `catch-the-show`
- Official pages manually reviewed:
  - `https://catchtheshow.herokuapp.com/api/documentation`
  - `https://catchtheshow.herokuapp.com/`
- Research outcome: `explicit_blocker`
- Route count confirmed: `0`

## What the official site currently does
- The indexed docs URL currently loads an HTML shell titled `No such app`.
- That docs page contains only Heroku's missing-app iframe placeholder: `//www.herokucdn.com/error-pages/no-such-app.html`.
- The official root page returns the same `No such app` title and the same Heroku missing-app iframe.
- No first-party API reference, OpenAPI schema, request examples, or endpoint list is exposed on either reviewed official page.

## Route extraction result
- No trustworthy base URL, endpoint paths, HTTP methods, parameters, authentication rules, pagination behavior, rate limits, error schema, or response-format notes can be confirmed from the current official-host state.
- I did not backfill routes from unofficial mirrors, cached copies, or third-party summaries because this fireROUTE pass is restricted to official-source confirmation.

## Rerun pass 8 note
- Rechecked `https://catchtheshow.herokuapp.com/api/documentation` and `https://catchtheshow.herokuapp.com/` in this rerun.
- Both pages now render `No such app` and expose only the Heroku-hosted missing-app iframe wrapper.
- No first-party API documentation, route list, or migration note is currently visible on the historical official host.

## fireROUTE integration note
- Keep Catch The Show blocked for manual fireROUTE completion until the official Heroku app is restored or the maintainer publishes replacement first-party documentation on another official host.
