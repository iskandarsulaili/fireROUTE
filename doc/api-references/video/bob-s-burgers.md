# Bob's Burgers

## Provider metadata
- Category: `Video`
- Provider slug: `bob-s-burgers`
- Official pages manually reviewed in this pass:
  - `https://bobs-burgers-api-ui.herokuapp.com/`
  - `https://bobs-burgers-api-ui.herokuapp.com/docs`
- Research outcome: `explicit_blocker`
- Route count confirmed: `0`

## Official site findings
- `https://bobs-burgers-api-ui.herokuapp.com/` currently loads a page titled `Offline for Maintenance` instead of API documentation.
- `https://bobs-burgers-api-ui.herokuapp.com/docs` currently loads the same `Offline for Maintenance` page.
- Both reviewed official pages contain only Heroku's maintenance wrapper with an iframe pointing to `https://www.herokucdn.com/error-pages/maintenance-mode.html`.
- No first-party API index, OpenAPI schema, example request set, or migration notice is visible on the official host.

## Route extraction result
- No trustworthy base URL, endpoint paths, HTTP methods, parameters, authentication requirements, rate limits, pagination contract, error schema, or response-format notes could be confirmed from the current official-host state.
- I did not backfill routes from unofficial mirrors or cached summaries because this fireROUTE shard requires official-source confirmation.

## Current rerun evidence
- The root page and `/docs` page still render the same Heroku maintenance shell and no provider-controlled route information.
- Because the official host never exposes actual docs content in this run, the confirmed route count remains `0`.

## fireROUTE integration note
- Keep Bob's Burgers blocked until the official app leaves maintenance mode or the maintainer publishes replacement first-party documentation.
