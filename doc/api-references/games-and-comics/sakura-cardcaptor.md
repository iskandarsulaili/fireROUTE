# Sakura CardCaptor

## Overview
- Provider: Sakura CardCaptor
- Category: Games & Comics
- Official docs/source inspected: `https://github.com/JessVel/sakura-card-captor-api`
- Official deployed base URL documented by the repository: `https://protected-taiga-89091.herokuapp.com`
- Auth: none documented
- HTTPS: yes
- Response format: JSON
- Pagination: `page` and `pageSize`
- Rate limits: none documented in the official repo
- Confirmed routes: `2`
- Manual status: `manually_documented`

## Base URL status at inspection time
- The official repository README still documents `https://protected-taiga-89091.herokuapp.com/` as the public API host.
- A live browser check to `https://protected-taiga-89091.herokuapp.com/api/card` no longer returned API JSON and instead loaded a Heroku `No such app` page.
- The route catalog below is therefore confirmed from the official repository documentation, but the historical deployment URL was not live during this pass.

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/card` | optional `page`, optional `pageSize` query | Returns the card collection. Official docs say the default page size is `60`, maximum `60`, and the endpoint returns at most `60` cards per request. |
| GET | `/api/card/:id` | `id` path | Returns one card by id. The repo overview table documents this route even though the README examples focus on the collection route. |

## Parameter notes
- `page`: page number for paginated card results. Official docs say it defaults to `1`.
- `pageSize`: maximum cards to return. Official docs say it defaults to `60` and the maximum is also `60`.
- `id`: card id used by `/api/card/:id`.

## Response and schema notes
- The README shows collection responses in the shape:
  - top-level `data` array
  - each card object includes `_id`, `cardNumber`, `spanishName`, `englishName`, `kanji`, `Rōmaji`, `appeardManga`, `appeardAnime`, `clowCard`, `sakuraCard`, and `__v`
- The repository says there are currently nine card-resource fields and lists them explicitly:
  - `_id`
  - `cardNumber`
  - `spanishName`
  - `englishName`
  - `kanji`
  - `Rōmaji`
  - `appeardManga`
  - `appeardAnime`
  - `clowCard`
  - `sakuraCard`
- Despite the README sentence saying "nine available resources," the field list shown on the page contains ten named fields if `_id` is counted.

## Errors, pagination, and live behavior
- No official error schema is documented in the repository.
- Pagination is documented only on `/api/card`, using `page` and `pageSize`.
- The currently documented host was unavailable during this review, so live success/error payloads could not be revalidated against the historical README examples.

## Important usage notes
- The official repository is the authoritative source for this provider now; the previously documented Heroku deployment appears to have been removed.
- Treat this provider as repository-documented / deployment-unavailable until a new official live host is published by the maintainer.
- Card names and metadata are multilingual in the documented payloads.

## Integration notes for fireROUTE
- Keep the canonical route count at `2`, based on the official repository route table.
- Mark the host as historically documented but currently unavailable.
- Expect JSON collection responses under a top-level `data` key when or if the official deployment is restored.

## Sources inspected
- `https://github.com/JessVel/sakura-card-captor-api`
- `https://protected-taiga-89091.herokuapp.com/api/card`
