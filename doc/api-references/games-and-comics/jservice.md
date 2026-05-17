# Jservice

## Overview
- Provider: `Jservice`
- Category: `Games & Comics`
- Official indexed docs URL: `http://jservice.io`
- Official repository inspected as the surviving first-party contract source: `https://github.com/sottenad/jService`
- Historical public API host: `http://jservice.io`
- Self-hosted example from the official README: `http://localhost:3000`
- Preferred API base path from the official route file: `/api`
- Auth: none documented
- HTTPS: the current parked domain redirects to HTTPS, but the surviving first-party examples use plain HTTP for the historical public host and local self-hosting
- Response format: JSON for the explicit `/api/...` routes
- Pagination: offset-style pagination on list endpoints; per-request result caps of `100`
- Rate limits: none documented in the surviving first-party sources
- Confirmed routes: `6`
- Manual status: `manually_documented`

## Base URL status at inspection time
- A fresh browser check to `https://jservice.io/` loaded title `jservice.io` and visible text `Buy this domain. | More domains at Seo.Domains`.
- A fresh browser check to `http://jservice.io/api/` redirected to `https://jservice.io/api/` and showed the same parked-domain content.
- The official repository README now explicitly says `Jservice.io is no longer running` and tells readers to self-host locally and review `config/routes.rb` for the route contract.
- Because the live domain is no longer trustworthy, the route catalog below is confirmed from the surviving first-party repository sources.

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/random` | optional `count` | Returns random clues. `count` defaults to `1` and is capped at `100`. Response includes each clue's `category`. |
| GET | `/api/final` | optional `count` | Returns random Final Jeopardy clues (`value` is `nil`). `count` defaults to `1` and is capped at `100`. Response includes each clue's `category`. |
| GET | `/api/clues` | optional `value`, `min_date`, `max_date`, `game_id`, `category`, `offset` | Filtered clue listing. The controller always applies `limit(100)` and defaults `offset` to `0`. Response includes each clue's `category`. |
| GET | `/api/categories` | optional `count`, `offset` | Returns categories. `count` defaults to `1` and is capped at `100`; `offset` defaults to `0`. |
| GET | `/api/category` | required `id` | Returns one category by id, including nested `clues`. |
| POST | `/api/invalid` | required `id` | Increments the selected clue's `invalid_count` and returns the updated clue JSON. |

Route count note:
- The official route file also exposes non-API site routes such as `/search`, `/popular`, and the root page, plus Rails resource routes for `/categories`, `/clues`, and `/game_ids`.
- fireROUTE's confirmed route count is limited to the six explicit `/api/...` endpoints above because they are the provider's clear JSON API surface in the surviving first-party contract.

## Parameter notes

### `/api/random` and `/api/final`
- `count`: optional number of records to return.
- Default: `1`.
- Maximum: `100`.

### `/api/clues`
- `value`: exact clue dollar value filter.
- `min_date`: lower airdate bound parsed by Ruby `Chronic`.
- `max_date`: upper airdate bound parsed by Ruby `Chronic`.
- `game_id`: exact game id filter.
- `category`: exact category id filter, mapped in code to `category_id`.
- `offset`: optional row offset; defaults to `0`.
- Result size is always capped at `100` clues per request.

### `/api/categories`
- `count`: optional number of category rows to return; defaults to `1`, capped at `100`.
- `offset`: optional row offset; defaults to `0`.

### `/api/category`
- `id`: category id looked up through `Category.find(params[:id])`.

### `/api/invalid`
- `id`: clue id looked up through `Clue.find(params[:id])`.
- The controller reads this from generic Rails params, so first-party code supports standard POST parameter submission rather than a documented JSON body.

## Response and schema notes
- `Clue` belongs to `Category`, and the API clue endpoints serialize clues with `:include => :category`.
- The inspected schema shows clue records include:
  - `id`
  - `answer`
  - `question`
  - `value`
  - `airdate`
  - `category_id`
  - `game_id`
  - `invalid_count`
- The `Clue` model's custom `to_json` excludes `created_at` and `updated_at` by default.
- The inspected schema shows category records include:
  - `id`
  - `title`
  - `clues_count`
- The `Category` model's custom `as_json` excludes `created_at` and `updated_at` by default.
- `/api/category` renders one category plus nested `clues`, with each nested clue excluding `created_at` and `updated_at`.
- `/api/categories` renders categories without the clue include.
- `/api/invalid` returns the updated clue object after incrementing `invalid_count`.

## Auth, errors, and live behavior notes
- The surviving first-party code does not implement API keys, bearer tokens, or session auth for the `/api/...` routes.
- No numeric rate limit is documented in the README, route file, or inspected controllers.
- The controllers do not define custom JSON error envelopes.
- `Category.find` and `Clue.find` are used for `/api/category` and `/api/invalid`; missing ids therefore depend on default Rails exception handling rather than a published provider-specific JSON error schema.
- `min_date` and `max_date` are parsed by `Chronic`; the surviving sources do not document a strict date format requirement beyond that parser behavior.
- Because the public domain is now parked, live success and error payloads could not be revalidated against the historical contract in this pass.

## Important usage notes
- The official README says the service is no longer running, so treat this provider as repository-documented and public-host-unavailable.
- The same README still gives a first-party local run example at `http://localhost:3000/api/random`.
- The clue-list endpoint uses exact-value/category/game filters rather than fuzzy search.
- Search/browse pages exist elsewhere in the Rails app, but the surviving first-party API contract is concentrated in the six explicit `/api/...` routes above.

## Integration notes for fireROUTE
- Use the six explicit `/api/...` routes as the canonical confirmed API surface.
- Treat `http://jservice.io/api` as the historical public base and `http://localhost:3000/api` as the surviving first-party self-host example.
- Preserve the hard `100`-record cap behavior on random/final/clues/categories requests.
- Do not invent auth, rate limits, or a custom JSON error schema; none are published in the surviving first-party sources.

## Sources inspected
- `https://jservice.io/`
- `http://jservice.io/api/`
- `https://github.com/sottenad/jService`
- `https://raw.githubusercontent.com/sottenad/jService/master/README.md`
- `https://raw.githubusercontent.com/sottenad/jService/master/config/routes.rb`
- `https://raw.githubusercontent.com/sottenad/jService/master/app/controllers/api_controller.rb`
- `https://raw.githubusercontent.com/sottenad/jService/master/app/models/clue.rb`
- `https://raw.githubusercontent.com/sottenad/jService/master/app/models/category.rb`
- `https://raw.githubusercontent.com/sottenad/jService/master/db/schema.rb`
