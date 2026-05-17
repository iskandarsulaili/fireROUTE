# SWAPI

## Provider metadata
- Category: `Video`
- Provider slug: `swapi-2`
- Official docs pages used:
  - `https://www.swapi.tech/`
  - `https://www.swapi.tech/documentation`
- Official live API responses manually checked from the same first-party host:
  - `https://www.swapi.tech/api`
  - `https://www.swapi.tech/api/people/1/`
  - `https://www.swapi.tech/api/people/?page=1&limit=2`
  - `https://www.swapi.tech/api/people/999999`
- Main API base URL confirmed from the official docs page: `https://www.swapi.tech/api/`
- Alternate base URL explicitly listed on the official docs page: `https://swapi.tech/api/`
- Supported auth models confirmed on the reviewed official pages: none; the API is open and read-only
- Primary request/response formats confirmed from the reviewed official pages: JSON by default, optional Wookiee encoding, HTTP `GET` only
- Manually confirmed route count: `13`

## Authentication
- The official documentation explicitly says SWAPI is a completely open API.
- No authentication is required.
- The same section says access is limited to `GET` requests.

## API-wide behavior
- The official docs page describes SWAPI as a read-only HTTP API.
- The reviewed docs confirm the API root at `https://www.swapi.tech/api/`.
- The same page says a `404 NOT FOUND` response usually means the base URL or resource path is wrong.
- The official docs also confirm two output encodings:
  - JSON (default)
  - Wookiee via `?format=wookiee`

## Canonical endpoints
#### 1) API root / resource discovery
- Method: `GET`
- URL: `https://www.swapi.tech/api`
- Purpose: list the top-level resource collections

#### 2) List people
- Method: `GET`
- URL: `https://www.swapi.tech/api/people/`
- Purpose: list person/character records

#### 3) Get one person
- Method: `GET`
- URL: `https://www.swapi.tech/api/people/{id}/`
- Purpose: fetch one person/character record

#### 4) List films
- Method: `GET`
- URL: `https://www.swapi.tech/api/films/`
- Purpose: list film records

#### 5) Get one film
- Method: `GET`
- URL: `https://www.swapi.tech/api/films/{id}/`
- Purpose: fetch one film record

#### 6) List starships
- Method: `GET`
- URL: `https://www.swapi.tech/api/starships/`
- Purpose: list starship records

#### 7) Get one starship
- Method: `GET`
- URL: `https://www.swapi.tech/api/starships/{id}/`
- Purpose: fetch one starship record

#### 8) List vehicles
- Method: `GET`
- URL: `https://www.swapi.tech/api/vehicles/`
- Purpose: list vehicle records

#### 9) Get one vehicle
- Method: `GET`
- URL: `https://www.swapi.tech/api/vehicles/{id}/`
- Purpose: fetch one vehicle record

#### 10) List species
- Method: `GET`
- URL: `https://www.swapi.tech/api/species/`
- Purpose: list species records

#### 11) Get one species
- Method: `GET`
- URL: `https://www.swapi.tech/api/species/{id}/`
- Purpose: fetch one species record

#### 12) List planets
- Method: `GET`
- URL: `https://www.swapi.tech/api/planets/`
- Purpose: list planet records

#### 13) Get one planet
- Method: `GET`
- URL: `https://www.swapi.tech/api/planets/{id}/`
- Purpose: fetch one planet record

## Parameters and resource-specific search fields
- The official docs say collection resources support searching/filtering and show a people example:
  - `https://www.swapi.tech/api/people/?name=r2`
- The reviewed resource sections list the following search fields:
  - `people` -> `name`
  - `films` -> `title`
  - `starships` -> `name`, `model`
  - `vehicles` -> `name`, `model`
  - `species` -> `name`
  - `planets` -> `name`
- The official docs also describe these query-string behaviors:
  - `expanded=true` on collection routes to return expanded resource properties instead of shorthand list entries
  - `format=wookiee` to switch from normal JSON to Wookiee output

## Pagination
- The prose docs page does not provide a dedicated pagination table, but the reviewed official live API response at `/api/people/?page=1&limit=2` confirms collection routes accept `page` and `limit`.
- The reviewed live response also confirms list responses include:
  - `total_records`
  - `total_pages`
  - `previous`
  - `next`
  - `results`
- In the reviewed example, `next` returned a fully qualified URL such as `https://www.swapi.tech/api/people?page=2&limit=2`.

## Errors and rate limits
- The official docs page states SWAPI rate-limits by IP address to `10,000` API requests per day.
- The same page documents additional rate slowing: after the 5th API request within a 15-minute window, each subsequent request is slowed by `100ms` more than the previous one.
- A manually checked invalid detail request to `https://www.swapi.tech/api/people/999999` returned HTTP `404` with a JSON body starting with `{"message":"not found"...}`.

## Format notes
- JSON is the default response format.
- The official docs describe Wookiee output as the same data rendered with Wookiee translations and enabled by appending `?format=wookiee`.
- Collection responses and detail responses both use a common envelope style with top-level metadata such as `message`, `result`/`results`, `apiVersion`, `timestamp`, `support`, and `social` in the reviewed live responses.

## Important usage notes
- The official homepage says the original `swapi.co` is no longer maintained and positions `swapi.tech` as the maintained replacement.
- The docs page recommends reading the getting-started section before consuming resources directly.
- The reviewed live root response currently exposes the maintained collections for `films`, `people`, `planets`, `species`, `starships`, and `vehicles`.