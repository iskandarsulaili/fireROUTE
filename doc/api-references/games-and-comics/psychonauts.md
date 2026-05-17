# Psychonauts

## Overview
- Provider: Psychonauts API
- Category: Games & Comics
- Official docs landing page inspected: `https://psychonauts-api.netlify.app/`
- Official alternative page inspected: `https://raw.githubusercontent.com/wiki/thamudi/psychonauts-api/Endpoints.md`
- Official repository README inspected: `https://raw.githubusercontent.com/thamudi/psychonauts-api/master/README.md`
- Base URL confirmed from the official wiki examples and live checks: `https://psychonauts-api.vercel.app`
- Auth: none documented, and no auth was required for live checks in this review
- HTTPS: yes
- Public methods confirmed in docs/live checks: `GET` only
- Response format: JSON on successful API responses
- Confirmed routes: `2` public `GET` routes/path patterns documented and live-verified in this review
- Pagination: none documented; collection trimming uses `limit` only
- Rate limits: none documented in the official site, wiki, or README reviewed in this pass

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/characters` | optional query parameters `limit`, `gender`, `name` | Returns Psychonauts characters. Official wiki says `name` is a regex query and should not be used with `limit`. Official wiki says `gender` can be combined with `limit`. |
| GET | `/api/powers` | optional query parameters `limit`, `name` | Returns Psychonauts PSI powers. Official wiki says `name` is a regex query and should not be used with `limit`. |

## Parameter notes
- `limit` limits the number of returned items on both routes.
- `gender` is only documented on `/api/characters`. The official wiki says only `female` and `male` are available and that `gender` can be combined with `limit`.
- `name` is documented on both routes as a regex-style search returning a single result based on the search query. The official wiki explicitly says it should not be combined with `limit`.
- The official docs UI page at `https://psychonauts-api.netlify.app/characters` still shows older Heroku examples, but the official raw wiki page publishes the current canonical Vercel URLs under `/api/characters` and `/api/powers`.

## Response format notes
- A live anonymous `GET https://psychonauts-api.vercel.app/api/characters?limit=1` check returned HTTP `200` and a JSON array of character objects.
- A live anonymous `GET https://psychonauts-api.vercel.app/api/characters?name=raz` check returned HTTP `200` and a single JSON object for `razputin aquato`.
- A live anonymous `GET https://psychonauts-api.vercel.app/api/powers?limit=1` check returned HTTP `200` and a JSON array of power objects.
- A live anonymous `GET https://psychonauts-api.vercel.app/api/powers?name=pyro` check returned HTTP `200` and a single JSON object for `pyrokinesis`.
- Character objects observed in this review included fields such as `_id`, `gender`, `img`, `name`, `psiPowers`, `__v`, and `psi_powers`.
- Power objects observed in this review included fields such as `_id`, `description`, `img`, `name`, and `__v`.

## Error handling
- Empty name searches observed in this review returned HTTP `204` with no response body:
  - `GET /api/characters?name=no-such-character`
  - `GET /api/powers?name=no-such-power`
- Unsupported methods are not documented. A live `POST` attempt to both routes returned HTTP `404` with a JSON error envelope like:
  - `statusCode`: `404`
  - `statusMessage`: `Page not found: /api/characters` or `Page not found: /api/powers`
  - `data.path`: the attempted route path
- No official rate-limit or auth-error section was published in the sources reviewed here.

## Important usage notes
- The official landing page is partly stale: it still references `psychonauts-api.herokuapp.com`, and one section labels the powers route as `psi-powers` while another example links to `/powers?name=psi-punch`.
- The official raw wiki page is the clearest source for the current canonical API surface and points to the live Vercel deployment under `/api/characters` and `/api/powers`.
- The README explicitly frames the project as a fan-made Psychonauts tribute API and points users to the wiki for usage instructions.
- Because the API is small and does not publish page metadata, fireROUTE should model this provider as two read-only GET routes with query-based filtering rather than as paginated resources.

## Live checks performed
- `GET https://psychonauts-api.vercel.app/api/characters?limit=1`
- `GET https://psychonauts-api.vercel.app/api/characters?name=raz`
- `GET https://psychonauts-api.vercel.app/api/characters?gender=female&limit=2`
- `GET https://psychonauts-api.vercel.app/api/characters?name=no-such-character`
- `POST https://psychonauts-api.vercel.app/api/characters`
- `GET https://psychonauts-api.vercel.app/api/powers?limit=1`
- `GET https://psychonauts-api.vercel.app/api/powers?name=pyro`
- `GET https://psychonauts-api.vercel.app/api/powers?name=no-such-power`
- `POST https://psychonauts-api.vercel.app/api/powers`

## Sources inspected
- `https://psychonauts-api.netlify.app/`
- `https://psychonauts-api.netlify.app/characters`
- `https://raw.githubusercontent.com/wiki/thamudi/psychonauts-api/Endpoints.md`
- `https://raw.githubusercontent.com/thamudi/psychonauts-api/master/README.md`
- `https://psychonauts-api.vercel.app/api/characters?limit=1`
- `https://psychonauts-api.vercel.app/api/characters?name=raz`
- `https://psychonauts-api.vercel.app/api/powers?limit=1`
- `https://psychonauts-api.vercel.app/api/powers?name=pyro`
