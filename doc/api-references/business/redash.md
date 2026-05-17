# Redash

Official docs manually reviewed:
- https://redash.io/help/user-guide/integrations-and-api/api/

## Overview
Redash exposes a self-hosted / workspace-hosted JSON API appended to the user's own Redash base URL.

Confirmed from the reviewed docs:
- Base URL pattern: your Redash host, e.g. `https://app.redash.io/<slug>` or `https://redash.example.com`
- Auth: API key
- Two API-key types are documented: User API Key and Query API Key
- Response format: JSON, with downloadable `.csv` / `.json` file variants for query results

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET, POST | `/api/queries` | List queries or create a new query |
| GET, POST, DELETE | `/api/queries/<id>` | Fetch, edit, or archive a query |
| GET, POST | `/api/queries/<id>/results` | Read cached results or execute / refresh a query result |
| GET | `/api/jobs/<job_id>` | Poll asynchronous query-execution jobs |
| GET | `/api/query_results/<query_result_id>` | Fetch one query result |
| GET, POST | `/api/dashboards` | List dashboards or create a dashboard |
| GET, DELETE | `/api/dashboards/<dashboard_slug>` | Fetch or archive a dashboard |
| POST | `/api/dashboards/<dashboard_id>` | Edit an existing dashboard |

Manual route count confirmed from the reviewed official docs: **8**.

## Parameters and request model
Confirmed request details from the docs:
- API key auth is required; docs recommend Query API keys whenever possible
- `POST /api/queries/<id>/results` accepts JSON with `parameters` and optional `max_age`
- `max_age=0` forces a fresh execution
- parameterized query executions put parameter values under a `parameters` object in the request body

Observed example parameter payload fields:
- scalar values such as `number_param`
- date strings such as `date_param`
- range objects like `{ start, end }`

## Async job / pagination notes
Confirmed from the docs:
- job polling uses `/api/jobs/<job_id>`
- job statuses are numeric:
  - `1` pending
  - `2` started
  - `3` success
  - `4` failure
  - `5` cancelled
- paginated listing behavior is documented for `/api/queries` and `/api/dashboards`

## Response and error notes
Observed from the reviewed page:
- successful job responses include `query_result_id` once execution succeeds
- query-result downloads can be requested as `.csv` or `.json`
- requesting cached results for a parameterized query via `GET /api/queries/<id>/results` can return the documented error `no cached result found for this query`

## Important usage notes
- Redash's API is described by the docs themselves as an incomplete list and subject to change by version.
- The API is host-relative rather than globally centralized; every deployment has its own base hostname.
- Query execution is asynchronous when a cache miss occurs, so adapters should expect a job-polling loop rather than a single synchronous response in all cases.