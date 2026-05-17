# The Vampire Diaries

## Provider metadata
- Category: `Video`
- Provider slug: `the-vampire-diaries`
- Official docs URL from index: `https://vampire-diaries-api.netlify.app/`
- Official pages reviewed:
  - `https://vampire-diaries-api.netlify.app/`
  - `https://vampire-diaries-api.netlify.app/documentation`
  - `https://vampire-diaries.herokuapp.com/api/episodes?sortBy=USviewers&sortOrder=DESC`
- Manual review outcome: `explicit_blocker`
- Confirmed route count: `0` live routes confirmable from current official material

## What the official site currently shows
- The homepage loaded with title `React App` and visible branding `The Vampire Diaries API` plus the subtitle `Your favorite series in an API`.
- The homepage still exposes an API-key form labeled `Get your FREE Api key here!`.
- The homepage visibly embeds one sample request URL:
  - `https://vampire-diaries.herokuapp.com/api/episodes?key=null&sortBy=USviewers&sortOrder=DESC`
- The homepage also shows UI labels `Your Key :`, `Route :`, and `Query :`, which implies an explorer-style interface, but it does not publish a working dedicated route reference.

## Why this remains blocked
- The official documentation page `https://vampire-diaries-api.netlify.app/documentation` currently returns Netlify's `Page not found` screen instead of API documentation.
- The sample API host shown on the homepage, `https://vampire-diaries.herokuapp.com/`, currently resolves to Heroku's `No such app` page when the sample `episodes` URL is requested.
- Because the dedicated docs page is broken and the published API host is no longer live, the official first-party material does not currently provide a trustworthy working endpoint inventory, auth workflow, pagination contract, error schema, or response-format reference.

## Route hints still visible on the official homepage
- The homepage still includes route hints in the route placeholder area for:
  - `/seasons`
  - `/episodes`
  - `/actors`
- The sample request URL also exposes these query parameters:
  - `key`
  - `sortBy`
  - `sortOrder`
- I am not counting those hints as confirmed live routes for fireROUTE because the only published API host now resolves to `No such app` and the official docs page is broken.

## Auth, pagination, rate limits, and errors
- Auth: the homepage implies an API-key flow, but the reviewed official pages do not document issuance requirements, query-vs-header usage, expiry, or quota behavior.
- Pagination: not documented on the reviewed official pages.
- Rate limits: not documented on the reviewed official pages.
- Errors: the only current runtime behavior I could verify from the published API host was Heroku's site-level `No such app` page, which is not a provider-authored API error schema.
- Format notes: the reviewed official pages do not publish a current JSON schema or example response body.

## Current fireROUTE note
- Treat this provider as blocked for manual completion until the project restores a working official documentation page or publishes a live official API host with confirmed routes and auth details.
- If revisited later, start again with the Netlify homepage and `/documentation`, then recheck whether the published Heroku API host has been replaced or restored.
