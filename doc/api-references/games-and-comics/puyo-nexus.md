# Puyo Nexus

## Overview
- Provider: Puyo Nexus Database API
- Category: Games & Comics
- Official source/docs used for this review: `https://github.com/deltadex7/puyodb-api-deno`
- Official implementation files inspected: `main.ts`, `src/server/routes.ts`, `src/server/controls.ts`
- Base URL documented in the repository README: `https://puyodb-api-deno.herokuapp.com`
- Auth: none documented
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `2`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v1/characters` | none | Returns the full documented character dataset scraped from Puyo Nexus Wiki pages. |
| GET | `/api/v1/characters/{query}` | path `query` = character name, kana spelling, romanization, or other name | Returns matching characters for the supplied query string. |

## Response and behavior notes
- The README documents the collection route returning HTTP `200` with a JSON object shaped like:
  - `error`
  - `lastUpdated`
  - `data` (array of character objects)
- The sample character objects shown in the official README include fields such as:
  - `id`
  - `name`
  - `nameJP.unicode`
  - `nameJP.latin`
  - `gender`
  - `alias`
  - `description`
  - `birthday`
- The server control code confirms:
  - `GET /api/v1/characters` returns `status = 200` and `{ error: 0, ...db.getCharacters() }`
  - `GET /api/v1/characters/:query` returns `status = 200` and `{ error: 0, ...queryResults }` when matches are found
  - `GET /api/v1/characters/:query` returns `status = 400` and `{ error: 1, msg: "Cannot find character with query \"...\"." }` when no match is found

## Auth, rate limits, pagination, and errors
- No authentication scheme is documented in the README or route code.
- No rate-limit policy or rate-limit headers are documented.
- No pagination parameters are implemented or documented; the collection route returns the full character list.
- Confirmed error behavior from the controller implementation:
  - `400` when the query route finds no matches
  - response body includes `error: 1` and a human-readable `msg`

## Important usage notes
- The repository README explicitly describes this API as unofficial and says permission for further use was still pending.
- The README says the service has two parts:
  - data serving through the Heroku deployment
  - separate scraping/refresh work maintained locally by the repository author
- The README narrows current character coverage to specific Puyo character groups rather than the entire franchise wiki.
- `main.ts` shows the server enables CORS for all origins via `oakCors()`.
- `src/server/routes.ts` confirms that only the two routes listed above are wired into the router.
- During this manual review, the documented Heroku host returned Heroku's `No such app` page, so the repository still documents the contract but the published deployment is not currently live.

## Integration notes for fireROUTE
- Treat this provider as a tiny read-only character dataset API with no pagination and only one searchable resource family.
- Preserve the `error`, `lastUpdated`, and `data` wrapper fields; they are part of the documented response shape.
- Expect unofficial-project stability and availability risk because the public deployment shown in the README is currently unavailable.

## Sources inspected
- `https://github.com/deltadex7/puyodb-api-deno`
- `https://github.com/deltadex7/puyodb-api-deno/blob/main/readme.md`
- `https://github.com/deltadex7/puyodb-api-deno/blob/main/main.ts`
- `https://github.com/deltadex7/puyodb-api-deno/blob/main/src/server/routes.ts`
- `https://github.com/deltadex7/puyodb-api-deno/blob/main/src/server/controls.ts`
- `https://puyodb-api-deno.herokuapp.com/api/v1/characters`
