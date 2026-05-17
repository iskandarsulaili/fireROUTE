# Digimon Information

## Overview
- Provider: Digimon API
- Category: Games & Comics
- Official docs: `https://digimon-api.vercel.app/`
- Base URL: `https://digimon-api.vercel.app`
- Supported public API root: `https://digimon-api.vercel.app/api/digimon`
- Deprecated API root noted by the official page: `https://digimon-api.herokuapp.com/api/digimon`
- Auth: none documented, and no auth was required for the live checks in this review
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `3` public `GET` routes
- Pagination: none documented
- Rate limits: none documented on the official page

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/digimon` | none | Returns an array of all Digimon records. A live anonymous check during this review returned `209` items. |
| GET | `/api/digimon/name/{name}` | required path parameter `name` | Returns an array filtered by Digimon name. The official docs say the array contains one Digimon when a match is found. |
| GET | `/api/digimon/level/{level}` | required path parameter `level` | Returns an array filtered by Digimon level. A live anonymous check for `rookie` returned `31` items in this run. |

## Parameter notes
- `name` is passed in the path, for example `/api/digimon/name/agumon`.
- `level` is passed in the path, for example `/api/digimon/level/rookie`.
- The official page does not document any query-string filters, pagination parameters, sorting parameters, or auth tokens.

## Response format notes
- The official docs describe all three routes as returning arrays.
- The official field reference lists exactly three documented fields per Digimon object:
  - `name` — Digimon name, string
  - `img` — image URL, string
  - `level` — Digimon level, string
- A live anonymous check of `GET /api/digimon/name/agumon` returned:
  - `name`: `Agumon`
  - `img`: `https://digimon.shadowsmith.com/img/agumon.jpg`
  - `level`: `Rookie`

## Error handling
- The official docs page does not publish a full error-code table.
- A live anonymous check of `GET /api/digimon/name/not-a-real-digimon` returned HTTP `400` with JSON body `{"ErrorMsg":"Not A Real Digimon is not a Digimon in our database."}`.
- No shared pagination envelope or separate metadata block is documented beyond the returned arrays.

## Important usage notes
- The official site explicitly says the Vercel deployment is the supported endpoint and the older Heroku deployment is deprecated.
- This is a very small API surface: one full-list route plus two path-filter routes.
- Because the docs only describe path-based filters, fireROUTE should preserve the provider's native path format instead of trying to convert lookups into query parameters.

## Live checks performed
- `GET https://digimon-api.vercel.app/api/digimon`
- `GET https://digimon-api.vercel.app/api/digimon/name/agumon`
- `GET https://digimon-api.vercel.app/api/digimon/level/rookie`
- `GET https://digimon-api.vercel.app/api/digimon/name/not-a-real-digimon`

## Sources inspected
- `https://digimon-api.vercel.app/`
- `https://digimon-api.vercel.app/api/digimon`
- `https://digimon-api.vercel.app/api/digimon/name/agumon`
- `https://digimon-api.vercel.app/api/digimon/level/rookie`
- `https://digimon-api.vercel.app/api/digimon/name/not-a-real-digimon`
