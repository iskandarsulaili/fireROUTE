# DigitalOcean Status

## Provider metadata
- Category: `Development`
- Provider slug: `digitalocean-status`
- Docs used manually:
  - `https://status.digitalocean.com/api`
  - `https://status.digitalocean.com/api/v2/summary.json`
- Confirmed API base URL: `https://status.digitalocean.com`
- Primary media type: `application/json`
- Authentication: none documented; public read-only status feed
- Manually confirmed routes in this pass: `8`

## Common request and response conventions
From the official API page plus a live read of the official `summary.json` endpoint:
- all reviewed routes are unauthenticated `GET` endpoints under `/api/v2/`
- the API is a Statuspage-style JSON feed for status, components, incidents, and scheduled maintenances
- the live `summary.json` response included top-level keys:
  - `page`
  - `components`
  - `incidents`
  - `scheduled_maintenances`
  - `status`
- the `page` object included fields such as `id`, `name`, `url`, `time_zone`, and `updated_at`
- the `status` object included `indicator` and `description`

## Manually confirmed endpoint set

### 1) Summary
- Method: `GET`
- Path: `/api/v2/summary.json`
- Full URL: `https://status.digitalocean.com/api/v2/summary.json`
- Purpose: return blended page status, components, unresolved incidents, and upcoming/in-progress scheduled maintenances
- Response notes observed/documented:
  - includes `page`, `components`, `incidents`, `scheduled_maintenances`, and `status`

### 2) Overall page status
- Method: `GET`
- Path: `/api/v2/status.json`
- Full URL: `https://status.digitalocean.com/api/v2/status.json`
- Purpose: return the overall status rollup for the page
- Officially documented status indicator values:
  - `none`
  - `minor`
  - `major`
  - `critical`

### 3) Components
- Method: `GET`
- Path: `/api/v2/components.json`
- Full URL: `https://status.digitalocean.com/api/v2/components.json`
- Purpose: return all page components and their current states
- Officially documented component status values:
  - `operational`
  - `degraded_performance`
  - `partial_outage`
  - `major_outage`

### 4) Unresolved incidents
- Method: `GET`
- Path: `/api/v2/incidents/unresolved.json`
- Full URL: `https://status.digitalocean.com/api/v2/incidents/unresolved.json`
- Purpose: return currently unresolved incidents only
- Officially documented included incident states:
  - `investigating`
  - `identified`
  - `monitoring`

### 5) All incidents
- Method: `GET`
- Path: `/api/v2/incidents.json`
- Full URL: `https://status.digitalocean.com/api/v2/incidents.json`
- Purpose: return the most recent incidents
- Officially documented scope:
  - returns the `50` most recent incidents
  - includes unresolved incidents plus `resolved` and `postmortem` incidents

### 6) Upcoming scheduled maintenances
- Method: `GET`
- Path: `/api/v2/scheduled-maintenances/upcoming.json`
- Full URL: `https://status.digitalocean.com/api/v2/scheduled-maintenances/upcoming.json`
- Purpose: return future maintenance windows
- Officially documented included maintenance state:
  - `scheduled`

### 7) Active scheduled maintenances
- Method: `GET`
- Path: `/api/v2/scheduled-maintenances/active.json`
- Full URL: `https://status.digitalocean.com/api/v2/scheduled-maintenances/active.json`
- Purpose: return maintenances currently underway or being verified
- Officially documented included maintenance states:
  - `in_progress`
  - `verifying`

### 8) All scheduled maintenances
- Method: `GET`
- Path: `/api/v2/scheduled-maintenances.json`
- Full URL: `https://status.digitalocean.com/api/v2/scheduled-maintenances.json`
- Purpose: return recent maintenance events
- Officially documented scope:
  - returns the `50` most recent scheduled maintenances
  - includes upcoming/active items and `completed` maintenances

## Incident and maintenance semantics
From the official API page:
- incident lifecycle states:
  - `investigating`
  - `identified`
  - `monitoring`
  - `resolved`
  - `postmortem`
- incident impact levels:
  - `none`
  - `minor`
  - `major`
  - `critical`
- scheduled-maintenance lifecycle states:
  - `scheduled`
  - `in_progress`
  - `verifying`
  - `completed`
- scheduled-maintenance impact levels use the same none/minor/major/critical scale

## Pagination
- none documented for these endpoints
- instead, the `all` incidents and `all` scheduled maintenances endpoints are explicitly documented as capped to the `50` most recent entries

## Rate limits
- no rate-limit policy was published on the reviewed official API page

## Error and response notes
- no formal error-code table was published on the reviewed official API page
- reviewed endpoints are JSON feeds intended for public status consumption
- the live summary response shows nested arrays/objects for component inventories and maintenance incident updates, including per-item timestamps such as `created_at`, `updated_at`, `started_at`, `scheduled_for`, and `scheduled_until`

## Important usage notes
- this is a read-only public service-status API, not the main DigitalOcean product API
- the docs also publish a JavaScript helper library URL: `https://cdn.statuspage.io/se-v2.js`
- the API is ideal for status dashboards, alerting bridges, or health snapshots where public status data is sufficient
- because the incident and maintenance collections are capped rather than cursor-paginated, consumers needing long-term history should archive results externally

## Verification notes
This file was manually rebuilt from DigitalOcean’s official status API page and a live official JSON endpoint using browser inspection only.