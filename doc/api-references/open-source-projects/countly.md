# Countly

## Provider metadata
- Category: `Open Source Projects`
- Provider slug: `countly`
- Official docs/pages reviewed manually:
  - `https://api.count.ly/reference/rest-api-reference`
  - `https://api.count.ly/reference/api-key`
  - `https://api.count.ly/reference/i`
  - `https://api.count.ly/reference/oappsdetails`
  - `https://api.count.ly/reference/ousersall`
- Confirmed API base URL pattern: deployment-relative Countly host with unversioned routes such as `/i`, `/api-key`, `/o/...`, and `/o?method=...`
- Official example host repeatedly shown in the docs: `https://try.count.ly`
- Manually confirmed route count: `179`
- Route-method breakdown confirmed from the official sidebar:
  - `174` `GET` routes
  - `5` `POST` routes

## What the official docs confirm
- Countly publishes a large deployment-relative REST surface under a Countly instance host rather than a single globally fixed API hostname.
- The official reference uses `https://try.count.ly` as the example base host.
- The route families exposed in the official sidebar are:
  - ingestion and write routes under `/i`
  - admin/reporting/read routes under `/o/...`
  - method-style reporting routes under `/o?method=...`
  - bootstrap credential retrieval at `/api-key`
- The official sidebar currently exposes `179` concrete route+method entries across core, analytics, push, cohorts, migration, dashboards, remote-config, A/B testing, tasks, groups, and other plugin areas.

## Authentication
Confirmed from the reviewed official pages:

### 1) `GET /api-key`
- Uses HTTP Basic authentication.
- The docs say this endpoint retrieves a user's `API_KEY` from login credentials.
- The reviewed official text explicitly frames this as a way to obtain a user API key so later API requests can run on that user's behalf.

### 2) `GET /i`
- Requires `app_key`.
- Requires `device_id`.
- The docs show those as query parameters on the core ingestion route.

### 3) Reviewed `/o/...` admin/read routes
- The reviewed routes `GET /o/users/all` and `GET /o/apps/details` require `api_key` in the query string.
- `GET /o/users/all` explicitly says the request requires the `API_KEY` of a user who is a global administrator.
- `GET /o/apps/details` documents `api_key` as the user's API key plus an `app_id` selector.

## Base URL and route shape
- Example base host shown in official samples: `https://try.count.ly`
- Confirmed example full URLs from reviewed pages:
  - `GET https://try.count.ly/api-key`
  - `GET https://try.count.ly/i?app_key=app_key&device_id=device_id`
  - `GET https://try.count.ly/o/users/all?api_key=your_api_key`
  - `GET https://try.count.ly/o/apps/details?api_key=your_api_key&app_id=your_app_id`
- fireROUTE normalization note: treat Countly as **deployment-relative**. Consumers should substitute their own Countly instance host.

## Confirmed parameter notes from reviewed endpoint pages

### `GET /api-key`
- Auth: HTTP Basic auth
- Purpose: retrieve the user's API key from username/password credentials
- Response media type shown in the official example: `text/plain`

### `GET /i`
Confirmed query parameters on the official `/i` page:
- Required:
  - `app_key` — app key of the application for which data is reported
  - `device_id` — generated or device-specific unique identifier
- Optional session/time/location parameters:
  - `begin_session`
  - `session_duration`
  - `end_session`
  - `ip_address`
  - `timestamp`
  - `hour`
  - `dow`
  - `country_code`
  - `city`
  - `location`
  - `old_device_id`
- Optional JSON-encoded payload-style string parameters:
  - `metrics` — JSON object as string
  - `events` — JSON array as string
  - `user_details` — JSON object as string
- Important usage notes stated on the page:
  - `metrics` can be provided only with `begin_session`
  - `ip_address` can be provided only with `begin_session`
  - `session_duration` is used as a heartbeat/update value and the docs recommend sending it about every `60` seconds

### `GET /o/users/all`
Confirmed query parameters on the official page:
- `api_key` — required admin API key
- `callback` — optional JSONP callback function name
- Important usage note: requires a global administrator's API key
- Response example media type: `application/json`

### `GET /o/apps/details`
Confirmed query parameters on the official page:
- `api_key` — user's API key
- `app_id` — app identifier to fetch details for
- `callback` — optional JSONP callback function name
- Response example media type: `application/json`

## Response format notes
- `GET /api-key` is documented with `text/plain` output.
- The reviewed `/o/...` pages use `application/json` examples.
- The reviewed admin/read pages also expose optional `callback` query parameters for JSONP output.
- The reviewed `/i` page accepts several JSON values encoded into query-string parameters rather than a single JSON request body.

## Pagination
- No single global pagination scheme was exposed on the reviewed official pages used in this pass.
- The sampled official pages reviewed for `/api-key`, `/i`, `/o/users/all`, and `/o/apps/details` did not publish a shared `page`/`limit` convention.
- Countly appears to rely on route-specific parameters where needed rather than a single universal pagination contract.

## Rate limits
- No numeric rate-limit policy was published on the reviewed official Countly reference pages used in this pass.

## Error handling
- The reviewed endpoint pages expose coarse response classes such as `2XX` and `4XX`.
- The reviewed pages do not expose one unified cross-API JSON error-envelope schema.

## Important usage notes
- Countly is not a single-host public SaaS endpoint; use the customer's own Countly instance host.
- The route surface is highly mixed: telemetry ingestion, admin CRUD-like operations, analytics/reporting, plugin controls, push workflows, dashboards, token management, and remote config all share one docs portal.
- Most of the documented surface is query-parameter driven, including many state-changing operations that still use `GET`.
- Only `5` routes in the current official sidebar are documented as `POST`; the other `174` documented routes are `GET`.

## Manually confirmed route inventory

### REST API Reference (`1` page)
- `Introduction`

### Core API (`45` routes)
- `GET /i`
- `GET /api-key`
- `GET /o/users/all`
- `GET /o/users/me`
- `GET /o/apps/all`
- `GET /o/apps/mine`
- `GET /o/apps/details`
- `GET /o?method=locations`
- `GET /o?method=sessions`
- `GET /o?method=users`
- `GET /o?method=devices`
- `GET /o?method=device_details`
- `GET /o?method=carriers`
- `GET /o?method=app_versions`
- `GET /o?method=cities`
- `GET /o?method=events`
- `GET /o?method=get_events`
- `GET /o?method=get_period_obj`
- `GET /o?method=top_events`
- `GET /o?method=total_users`
- `GET /o/analytics/dashboard`
- `GET /o/analytics/countries`
- `GET /o/analytics/sessions`
- `GET /o/analytics/metric`
- `GET /o/analytics/events`
- `GET /o/analytics/tops`
- `GET /o/analytics/loyalty`
- `GET /o/analytics/frequency`
- `GET /o/analytics/durations`
- `GET /o/ping`
- `GET /i/users/create`
- `GET /i/users/update`
- `GET /i/users/delete`
- `GET /i/users/deleteOwnAccount`
- `GET /i/apps/create`
- `GET /i/apps/update`
- `GET /i/apps/reset`
- `GET /i/apps/delete`
- `POST /i/bulk`
- `GET /i/app_users/create`
- `GET /i/app_users/update`
- `GET /i/app_users/delete`
- `GET /i/app_users/export`
- `GET /i/app_users/deleteExport/:filename`
- `GET /o/app_users/download/:filename`

### Drill API (`7` routes)
- `GET /o?method=segmentation`
- `GET /o?method=segmentation_users`
- `GET /o?method=segmentation_meta`
- `GET /o?method=segmentation_big_meta`
- `GET /o?method=drill_bookmarks`
- `GET /i/drill/add_bookmark`
- `GET /i/drill/delete_bookmark`

### Push API (`7` routes)
- `POST /i/pushes/create`
- `POST /i/pushes/prepare`
- `GET /i/pushes/message`
- `GET /i/pushes/delete`
- `GET /o/pushes/all`
- `GET /i/pushes/active`
- `POST /i/pushes/push`

### Geolocations (`3` routes)
- `GET /i/geolocations/create`
- `GET /i/geolocations/delete`
- `GET /o?method=get_locations`

### Attribution API (`9` routes)
- `GET /o/campaign`
- `GET /o/campaign?data`
- `GET /o/campaign?camp_id`
- `GET /o/campaign?getTable`
- `GET /i/campaign/create`
- `GET /i/campaign/update`
- `GET /i/campaign/delete`
- `GET /i/campaign/hide`
- `GET /i/campaign/show`

### Live API (`2` routes)
- `GET /o?method=live`
- `GET /o?method=live_graph`

### User Profiles API (`2` routes)
- `GET /o?method=user_details&uid`
- `GET /o?method=user_details`

### Funnels API (`4` routes)
- `GET /o?method=funnel`
- `GET /o?method=get_funnels`
- `GET /i/funnels/add`
- `GET /i/funnels/delete`

### DBViewer API (`3` routes)
- `GET /o/db`
- `GET /o/db?dbs=:db&collection=:collection`
- `GET /o/db?dbs=:db&collection=:collection&document=:document`

### Compare API (`2` routes)
- `GET /o/compare/events`
- `GET /o/compare/apps`

### Cohorts API (`7` routes)
- `GET /o?method=cohort`
- `GET /o?method=get_cohorts`
- `GET /o?method=get_cohort_list`
- `GET /o?method=cohortdata`
- `GET /i/cohorts/add`
- `GET /i/cohorts/edit`
- `GET /i/cohorts/delete`

### Data Migration (`12` routes)
- `GET /o/datamigration/getmyimports`
- `GET /o/datamigration/getmyexports`
- `GET /o/datamigration/getstatus`
- `GET /o/datamigration/validateconnection`
- `GET /i/datamigration/sendexport`
- `GET /i/datamigration/export`
- `GET /i/datamigration/stop_export`
- `GET /i/datamigration/delete_import`
- `GET /i/datamigration/delete_export`
- `GET /i/datamigration/delete_all`
- `GET /i/datamigration/import`
- `GET /i/datamigration/report_import`

### Feedback plugin (`8` routes)
- `GET /o?method=star`
- `GET /i/feedback/widgets/create`
- `GET /i/feedback/widgets/remove`
- `GET /i/feedback/widgets/edit`
- `GET /o/feedback/data`
- `GET /o/feedback/multiple-widgets-by-id`
- `GET /o/feedback/widgets`
- `GET /o/feedback/widget`

### Other plugins (`2` routes)
- `GET /o/slipping`
- `GET /o?method=retention`

### Export API (`1` route)
- `GET /o/export/db`

### Whitelabeling (`2` routes)
- `GET /o/whitelabeling/data`
- `POST /i/whitelabeling/updateform`

### Alerts API (`4` routes)
- `GET /i/alert/save`
- `GET /i/alert/delete`
- `GET /i/alert/status`
- `GET /o/alert/list`

### Flows API (`1` route)
- `GET /o/flows`

### System Utility API (`9` routes)
- `GET /o/system/overall`
- `GET /o/system/memory`
- `GET /o/system/disks`
- `GET /o/system/cpu`
- `GET /o/system/database`
- `GET /o/system/healthcheck`
- `GET /o/system/dbcheck`
- `GET /o/system/plugins`
- `GET /o/system/version`

### Dashboards API (`9` routes)
- `GET /o/dashboards/all`
- `GET /o/dashboards`
- `GET /i/dashboards/create`
- `GET /i/dashboards/update`
- `GET /i/dashboards/delete`
- `GET /o/dashboards/widget`
- `GET /i/dashboards/add-widget`
- `GET /i/dashboards/update-widget`
- `GET /i/dashboards/remove-widget`

### Token manager (`4` routes)
- `GET /o/token/check`
- `GET /o/token/list`
- `GET /i/token/create`
- `GET /i/token/delete`

### Remote Config API (`8` routes)
- `GET /o/sdk?method=fetch_remote_config`
- `GET /o?method=remote-config`
- `GET /i/remote-config/add-parameter`
- `GET /i/remote-config/update-parameter`
- `GET /i/remote-config/remove-parameter`
- `GET /i/remote-config/add-condition`
- `GET /i/remote-config/update-condition`
- `GET /i/remote-config/remove-condition`

### A/B Testing API (`10` routes)
- `GET /o?method=ab-testing`
- `GET /o/ab-testing/check-models`
- `GET /o/ab-testing/experiment`
- `GET /o/ab-testing/experiment-detail`
- `GET /i/ab-testing/add-experiment`
- `GET /i/ab-testing/update-experiment`
- `GET /i/ab-testing/remove-experiment`
- `GET /i/ab-testing/start-experiment`
- `GET /i/ab-testing/stop-experiment`
- `GET /i/ab-testing/update-experiment-position`

### Notes API (`4` routes)
- `GET /i/notes/save`
- `GET /i/notes/delete`
- `GET /o?method=notes`
- `GET /o/notes`

### Tasks (`8` routes)
- `GET /i/tasks/delete`
- `GET /i/tasks/edit`
- `GET /i/tasks/name`
- `GET /i/tasks/update`
- `GET /o/tasks/all`
- `GET /o/tasks/check`
- `GET /o/tasks/list`
- `GET /o/tasks/task`

### Groups (`6` routes)
- `GET /o/groups`
- `GET /o/groups/group-users`
- `GET /i/groups/create`
- `GET /i/groups/update`
- `GET /i/groups/delete`
- `GET /i/groups/save-user-group`

## Verification notes
- All route inventory counts above were taken from Countly's official docs sidebar during this manual review.
- Shared auth and parameter notes were confirmed from the official pages for `/api-key`, `/i`, `/o/users/all`, and `/o/apps/details`.
- This file replaces the earlier weak manual document that only covered four routes in detail and undercounted the official route surface.
