# When is next MCU film

## Overview
- Provider: MCU-Countdown / whenisthenextmcufilm.com
- Category: Games & Comics
- Official API doc inspected: `https://github.com/DiljotSG/MCU-Countdown/blob/main/docs/API.md`
- Official repository README inspected: `https://github.com/DiljotSG/MCU-Countdown`
- Official live site inspected: `https://www.whenisthenextmcufilm.com`
- Base URL: `https://www.whenisthenextmcufilm.com`
- Auth: none documented and none required in live checks during this review
- HTTPS: yes
- Confirmed methods: `GET` only
- Response formats observed in this review:
  - HTML countdown pages on `/`, `/star-wars`, `/dc`, `/batman`, and `/spider-verse`
  - JSON on `/api`
- Confirmed routes: `6` public `GET` route/path patterns currently live and documented across the official docs/site
- Pagination: none documented or observed
- Rate limits: the official docs say the service is subject to TMDB's rate limits; no provider-specific numeric limit is published

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/` | optional query parameters `date`, `list_id` | Default MCU countdown HTML page. The API doc treats `/` as the default MCU named route. Live checks showed `?date=` works and `?list_id=` can swap the default list on this root HTML route. |
| GET | `/star-wars` | optional query parameter `date` | HTML Star Wars countdown page. The API doc says named routes use predefined lists and do not accept `list_id`; a live `/star-wars?list_id=140624` check still returned the Star Wars countdown. |
| GET | `/dc` | optional query parameter `date` | HTML DC Universe countdown page documented in the API doc. |
| GET | `/batman` | optional query parameter `date` | HTML Matt Reeves' Batman Universe countdown page documented in the API doc. |
| GET | `/spider-verse` | optional query parameter `date` | HTML Spider-Verse countdown page currently exposed by the official live site. This route is live even though the current `docs/API.md` page inspected here does not list it. |
| GET | `/api` | optional query parameters `date`, `list_id` | JSON endpoint returning the next production for the selected TMDB list; defaults to the MCU list when `list_id` is omitted. |

## Parameter notes
- `date` is documented in the official API page as an ISO `YYYY-MM-DD` value used to find the next production after that date.
- The API doc says `date` defaults to today when omitted.
- `list_id` is documented on `/api` as a TMDB list ID and defaults to the MCU list `140624`.
- The official API doc says named routes use predefined lists and do not accept `list_id`.
- Live checks refined that statement:
  - `/star-wars?list_id=140624` still returned the Star Wars countdown, matching the docs' claim that alternate named routes ignore `list_id`.
  - `/?list_id=8563040` did change the root HTML page to a Star Wars countdown, so the root route behaves differently from the alternate named routes.
- A live `GET /api?date=not-a-date` request still returned the default current countdown with HTTP `200`, so invalid `date` input appears to be ignored rather than rejected.

## Response format notes
- The official API doc publishes this JSON response shape for `GET /api`:
  - `id`
  - `days_until`
  - `overview`
  - `poster_url`
  - `release_date`
  - `title`
  - `type`
  - `following_production` with the same core fields nested inside it
- A live `GET https://www.whenisthenextmcufilm.com/api` check returned HTTP `200`, `content-type: application/json`, and the documented fields above.
- A live `GET https://www.whenisthenextmcufilm.com/api?date=2025-01-01&list_id=8563040` check returned Star Wars JSON and confirmed that `/api` can wrap arbitrary TMDB lists.
- The HTML countdown routes return full rendered pages rather than JSON.
- The official API doc says cache headers use `Cache-Control: public, max-age=3600`, but live checks in this review observed `Cache-Control: public, max-age=43200` on both HTML and JSON responses.

## Error handling
- The official API doc does not publish a formal error envelope or status-code matrix.
- A live `GET https://www.whenisthenextmcufilm.com/api?list_id=99999999999` check returned HTTP `200` with `{}` rather than an explicit error payload.
- A live `GET https://www.whenisthenextmcufilm.com/api?date=not-a-date` check returned HTTP `200` and fell back to the current default countdown.
- The live site currently links to `/diljots-list`, but a direct `GET https://www.whenisthenextmcufilm.com/diljots-list` check returned an HTML `404` page. That path is therefore not counted as a confirmed working provider route.

## Caching and rate-limit notes
- The official API doc says all endpoints include cache headers and that TMDB responses are cached in memory for one hour by default.
- The same API doc says the service is subject to TMDB's rate limits.
- Live responses during this review exposed longer cache headers than the doc text (`43200` seconds instead of `3600`), so fireROUTE should treat the official docs as directionally correct but not fully current on cache duration.

## Important usage notes
- The repository README calls this project a simple API wrapper for TMDB lists and documents both hosted usage and self-hosting with Docker Compose.
- The README confirms the production host as `https://www.whenisthenextmcufilm.com`.
- The current `docs/API.md` page documents `/`, `/star-wars`, `/dc`, `/batman`, and `/api`, but the live site also exposes a working `/spider-verse` route.
- The live site footer/nav currently advertises `Star Wars`, `DC`, `Batman`, `MCU`, `Spider-Verse`, and `Diljot's List`; only the first five HTML countdown routes plus `/api` were confirmed working in this review.
- Because the provider is essentially one JSON route plus a handful of HTML presets, fireROUTE should model it as a very small GET-only API surface.

## Live checks performed
- Reviewed `https://github.com/DiljotSG/MCU-Countdown/blob/main/docs/API.md`
- Reviewed `https://github.com/DiljotSG/MCU-Countdown`
- Reviewed `https://www.whenisthenextmcufilm.com`
- Live-checked route status/content type on:
  - `GET /`
  - `GET /star-wars`
  - `GET /dc`
  - `GET /batman`
  - `GET /spider-verse`
  - `GET /diljots-list`
  - `GET /api`
- Live-checked parameter behavior on:
  - `GET /api?date=2025-01-01&list_id=8563040`
  - `GET /api?list_id=99999999999`
  - `GET /api?date=not-a-date`
  - `GET /?list_id=8563040`
  - `GET /?date=2025-01-01`
  - `GET /star-wars?list_id=140624`

## Sources inspected
- `https://github.com/DiljotSG/MCU-Countdown/blob/main/docs/API.md`
- `https://github.com/DiljotSG/MCU-Countdown`
- `https://www.whenisthenextmcufilm.com`
- `https://www.whenisthenextmcufilm.com/api`
- `https://www.whenisthenextmcufilm.com/star-wars`
- `https://www.whenisthenextmcufilm.com/dc`
- `https://www.whenisthenextmcufilm.com/batman`
- `https://www.whenisthenextmcufilm.com/spider-verse`
- `https://www.whenisthenextmcufilm.com/diljots-list`
