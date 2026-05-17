# Instatus

Official docs manually reviewed:
- https://instatus.com/help/api
- https://instatus.com/help/api/monitors
- https://instatus.com/help/api/incidents
- https://instatus.com/help/api/incident-updates
- https://instatus.com/help/api/status-pages
- https://instatus.com/help/api/workspaces
- https://instatus.com/help/api/components
- https://instatus.com/help/api/teammates
- https://instatus.com/help/api/maintenances
- https://instatus.com/help/api/maintenance-updates
- https://instatus.com/help/api/templates
- https://instatus.com/help/api/subscribers
- https://instatus.com/help/api/metrics
- https://instatus.com/help/api/user-profile
- https://instatus.com/help/api/public-data
- https://instatus.com/help/api/private-pages
- https://instatus.com/help/api/audience-groups
- https://instatus.com/help/api/routing-rules
- https://instatus.com/help/api/escalation-policies
- https://instatus.com/help/api/on-call-schedules

## Overview
Instatus exposes a JSON HTTP API for status pages, monitoring, incident-management, subscriptions, private-page access, escalation/on-call workflows, and related workspace resources.

Confirmed from the reviewed official docs:
- Primary API base: `https://api.instatus.com`
- Public unauthenticated data pattern: `https://<public-status-page>/summary.json`
- Auth for private API routes: `Authorization: Bearer <API_KEY>`
- Request content type: `application/json`
- Responses, including errors, are JSON
- The docs currently expose `19` API section pages
- Those `19` section pages currently publish **88** unique directly visible method/path combinations (`89` documented operations minus one repeated `GET /v2/pages` listing route reused on the private-pages docs page)

## Authentication
From the reviewed `Get started with Instatus API` page:
- Requests to the private API must provide an API token via:
  - `Authorization: Bearer <API_KEY>`
- The docs instruct users to get the API key from `Developer settings`
- Many routes are page-scoped and require a page identifier in the path
- The docs separately instruct users to retrieve the Page ID from the dashboard / page code-mode flow
- Public summary data is also available without bearer auth via a status-page-hosted `summary.json` endpoint

## Common request/response conventions
Confirmed from the reviewed docs:
- Primary base URL: `https://api.instatus.com`
- Many route families are page-scoped with `:page_id`
- The docs mix versioned prefixes (`/v1/...`, `/v2/...`) and a few unversioned endpoint paths on newer on-call/routing-policy pages
- List routes commonly expose page-number pagination using `page` and `per_page`, or in older monitor docs `limit` plus `page`
- Error responses use the common envelope:
  - `error.code`
  - `error.message`
- Official example error body:
  - `{"error":{"code":"forbidden","message":"Not authorized"}}`

## Official status/value enums surfaced by the docs
The reviewed docs explicitly publish these value sets:

### Page statuses
- `UP`
- `HASISSUES`
- `ALLUNDERMAINTENANCE`
- `ALLDEGRADEDPERFORMANCE`
- `ALLPARTIALOUTAGE`
- `ALLMINOROUTAGE`
- `ALLMAJOROUTAGE`
- `SOMEUNDERMAINTENANCE`
- `SOMEDEGRADEDPERFORMANCE`
- `SOMEPARTIALOUTAGE`
- `SOMEMINOROUTAGE`
- `SOMEMAJOROUTAGE`
- `ONEUNDERMAINTENANCE`
- `ONEDEGRADEDPERFORMANCE`
- `ONEPARTIALOUTAGE`
- `ONEMINOROUTAGE`
- `ONEMAJOROUTAGE`

### Component statuses
- `OPERATIONAL`
- `UNDERMAINTENANCE`
- `DEGRADEDPERFORMANCE`
- `PARTIALOUTAGE`
- `MAJOROUTAGE`

### Incident statuses
- `INVESTIGATING`
- `IDENTIFIED`
- `MONITORING`
- `RESOLVED`

### Maintenance statuses
- `NOTSTARTEDYET`
- `INPROGRESS`
- `COMPLETED`

### Additional enum families explicitly documented on section pages
- Monitor locations: `US_EAST_1`, `EU_CENTRAL_1`, `AP_NORTHEAST_1`
- Monitor statuses: `UP`, `DOWN`, `DEGRADED`, `UNKNOWN`
- Monitor alert types: `INCIDENT`, `EMAIL`, `SMS`, `SLACK`, `DISCORD`, `MICROSOFT_TEAMS`, `PHONE_CALL`, `WEBHOOK`
- Routing-rule action types include `NOTIFY_TEAM`, `NOTIFY_WORKSPACE_MEMBER`, `NOTIFY_CURRENT_ON_CALL_USER`, `NOTIFY_NEXT_ON_CALL_USER`, `NOTIFY_ALL_ON_CALL_MEMBERS`
- Escalation-policy condition type exposed: `NOT_ACKNOWLEDGED`
- On-call restriction types: `NONE`, `TIMEOFDAY`, `TIMEINTERVALS`
- On-call rotation types: `DAILY`, `WEEKLY`, `CUSTOM`

## Manually confirmed endpoint inventory
Manual route count confirmed from the reviewed official docs: **88** unique routes.

### Monitors (`16`)
| Method | Path |
|---|---|
| GET | `/monitors/check_inserted_logs` |
| GET | `/:page_id/monitors` |
| POST | `/monitors` |
| PUT | `/monitors/:id` |
| DELETE | `/monitors/:id` |
| GET | `/monitors/:id/logs` |
| GET | `/monitors/:id/run` |
| POST | `/monitor-alerts` |
| PUT | `/monitor-alerts/:id` |
| GET | `/:page_id/monitor-alerts` |
| DELETE | `/monitor-alerts/:id` |
| POST | `/monitors-groups` |
| PUT | `/monitors-groups/:id` |
| DELETE | `/monitors-groups/:id` |
| POST | `/monitors-groups/:id/monitors` |
| GET | `/monitors-groups/:id/run` |

### Incidents (`6`)
| Method | Path |
|---|---|
| GET | `/v1/:page_id/incidents?page=:page&per_page=:per_page` |
| GET | `/v1/:page_id/incidents/:incident_id` |
| POST | `/v1/:page_id/incidents` |
| POST | `/v1/:page_id/incidents/:template` |
| PUT | `/v1/:page_id/incidents/:incident_id` |
| DELETE | `/v1/:page_id/incidents/:incident_id` |

### Incident updates (`5`)
| Method | Path |
|---|---|
| GET | `/v1/:page_id/incidents/:incident_id/incident-updates/:incident_update_id` |
| POST | `/v1/:page_id/incidents/:incident_id/incident-updates` |
| POST | `/v2/:page_id/incidents/:incident_id/incident-updates/:template` |
| PUT | `/v1/:page_id/incidents/:incident_id/incident-updates/:incident_update_id` |
| DELETE | `/v1/:page_id/incidents/:incident_id/incident-updates/:incident_update_id` |

### Status pages (`4`)
| Method | Path |
|---|---|
| GET | `/v2/pages?page=:page&per_page=:per_page` |
| POST | `/v1/pages` |
| PUT | `/v2/:page_id` |
| DELETE | `/v2/:page_id` |

### Workspaces (`3`)
| Method | Path |
|---|---|
| GET | `/v1/workspaces?page=:page&per_page=:per_page` |
| POST | `/v1/workspaces` |
| DELETE | `/v1/workspaces/:workspace_id` |

### Components (`5`)
| Method | Path |
|---|---|
| GET | `/v2/:page_id/components?page=:page&per_page=:per_page` |
| GET | `/v2/:page_id/components/:component_id` |
| POST | `/v1/:page_id/components` |
| PUT | `/v2/:page_id/components/:component_id` |
| DELETE | `/v1/:page_id/components/:component_id` |

### Teammates (`3`)
| Method | Path |
|---|---|
| GET | `/v1/:page_id/team?page=:page&per_page=:per_page` |
| POST | `/v1/:page_id/team` |
| DELETE | `/v1/:page_id/team/:member_id` |

### Maintenances (`5`)
| Method | Path |
|---|---|
| GET | `/v2/:page_id/maintenances?page=:page&per_page=:per_page` |
| GET | `/v1/:page_id/maintenances/:maintenance_id` |
| POST | `/v1/:page_id/maintenances` |
| PUT | `/v1/:page_id/maintenances/:maintenance_id` |
| DELETE | `/v1/:page_id/maintenances/:maintenance_id` |

### Maintenance updates (`4`)
| Method | Path |
|---|---|
| GET | `/v1/:page_id/maintenances/:maintenance_id/maintenance-updates/:maintenance_update_id` |
| POST | `/v1/:page_id/maintenances/:maintenance_id/maintenance-updates` |
| PUT | `/v1/:page_id/maintenances/:maintenance_id/maintenance-updates/:maintenance_update_id` |
| DELETE | `/v1/:page_id/maintenances/:maintenance_id/maintenance-updates/:maintenance_update_id` |

### Templates (`5`)
| Method | Path |
|---|---|
| GET | `/v1/:page_id/templates?page=:page&per_page=:per_page` |
| GET | `/v1/:page_id/templates/:template_id` |
| POST | `/v1/:page_id/templates` |
| PUT | `/v1/:page_id/templates/:template_id` |
| DELETE | `/v1/:page_id/templates/:template_id` |

### Subscribers (`4`)
| Method | Path |
|---|---|
| GET | `/v2/:page_id/subscribers?page=:page&per_page=:per_page&search=:search_query` |
| POST | `/v1/:page_id/subscribers` |
| POST | `/v1/:page_id/subscribers/bulk` |
| DELETE | `/v1/:page_id/subscribers/:subscriber_id` |

### Metrics (`8`)
| Method | Path |
|---|---|
| GET | `/v1/:page_id/metrics?page=:page&per_page=:per_page` |
| GET | `/v1/:page_id/metrics/:metric_id` |
| POST | `/v1/:page_id/metrics` |
| PUT | `/v1/:page_id/metrics/:metric_id` |
| DELETE | `/v1/:page_id/metrics/:metric_id` |
| POST | `/v1/:page_id/metrics/:metric_id` |
| POST | `/v1/:page_id/metrics/:metric_id/data` |
| DELETE | `/v1/:page_id/metrics/:metric_id/data` |

### User profile (`1`)
| Method | Path |
|---|---|
| GET | `/v1/user` |

### Public data (`1`)
| Method | Path |
|---|---|
| GET | `https://<public-status-page>/summary.json` |

### Private pages (`2`)
| Method | Path |
|---|---|
| GET | `/v2/pages?page=:page&per_page=:per_page` |
| POST | `/v1/:page_id/regenerate-secure-link` |

### Audience Groups (`5`)
| Method | Path |
|---|---|
| GET | `/v1/:page_id/audience-groups?page=:page&per_page=:per_page` |
| GET | `/v1/:page_id/audience-groups/:audience_group_id` |
| POST | `/v1/:page_id/audience_groups` |
| PUT | `/v1/:page_id/audience_groups/:audience_group_id` |
| DELETE | `/v1/:page_id/audience-groups/:audience_group_id` |

### Routing Rules (`4`)
| Method | Path |
|---|---|
| GET | `/:page_id/routing-rules` |
| POST | `/routing-rules` |
| PUT | `/routing-rules/:id` |
| DELETE | `/routing-rules/:id` |

### Escalation Policies (`4`)
| Method | Path |
|---|---|
| GET | `/:page_id/escalation-policies` |
| POST | `/escalation-policies` |
| DELETE | `/escalation-policies/:id` |
| PUT | `/escalation-policies/:id` |

### On-call Schedules (`4`)
| Method | Path |
|---|---|
| GET | `/on-call-schedules/:id/members` |
| POST | `/on-call-schedules` |
| PUT | `/on-call-schedules/:id` |
| DELETE | `/on-call-schedules/:id` |

## Parameters and body-shape notes confirmed from the reviewed docs
The reviewed section pages surfaced these recurring request patterns:

### Shared list/pagination patterns
- `page`
- `per_page`
- Older monitor list routes instead expose `limit` and example `page`
- Search examples surfaced:
  - monitor list `search`
  - subscriber list `search`
- Monitor list `status` filter supports `UP`, `DOWN`, `UNKNOWN`, `DEGRADED`

### Monitor-specific body fields
The monitor create/update examples visibly include:
- `pageId`
- `url`
- `httpMethod`
- `body`
- `headers`
- `queryParams`
- `basicAuth.username`
- `basicAuth.password`
- `type`
- `assertions[]` with fields such as `type`, `comparison`, `selector`, `target`
- Manual run examples also surfaced `location`, `retry`, and `monitorLogId`

### Incident / maintenance body fields
The reviewed incident and maintenance pages visibly include bodies using fields such as:
- `name`
- `message`
- `components`
- `started` / `start` / `end`
- `status`
- `notify`
- `notifyStart`
- `notifyEnd`
- `notifyEarly`
- `notifyMinutes`
- `autoStart`
- `autoEnd`
- `statuses[]` objects mapping component IDs to status values
- `translations.message.<locale>`

### Subscriber body fields
The subscriber pages visibly include:
- `email`
- `all`
- `components`
- `autoConfirm` with a docs note that skipping confirmation emails is a paid feature
- bulk subscriber creation via a top-level `subscribers` array

### Metrics body fields
The metrics pages visibly include:
- `name`
- `suffix`
- metric `data` arrays containing `timestamp` and `value`
- write routes for appending and deleting metric data

### Access-control / workflow bodies
The reviewed routing, escalation, audience, and on-call pages visibly include nested policy objects such as:
- routing `assertions[]` and `actions[]`
- escalation `rules[]`, `delayInMins`, `repeat`, `repeatCount`, `repeatDelay`, `revertAcknowledgement`
- on-call `onCallShifts[]`, `rotationType`, `restrictionType`, `timeOfDayRestrictionStartTime`, `timeOfDayRestrictionEndTime`, and custom rotation fields
- audience-group membership and component-assignment objects

## Error, format, and operational notes
Confirmed from the reviewed docs:
- All API endpoints return JSON, including errors
- Common error shape:
  - `error.code`
  - `error.message`
- Many docs pages show object or array JSON responses rather than envelope wrappers
- Public `summary.json` responses contain page-level status plus `activeIncidents` and `activeMaintenances`
- Status-page, component, incident, and maintenance responses frequently include nested related objects rather than only IDs

## Important usage notes
- Instatus currently mixes `/v1`, `/v2`, and a few unversioned route families in the official docs; fireROUTE should preserve the documented path exactly instead of force-normalizing every route to one version prefix
- Many routes are page-scoped, but some account/workspace routes are not; adapters should not assume every resource begins with `/:page_id`
- The public `summary.json` pattern is documented separately from the authenticated API base and should be modeled as a first-class read-only route family
- The docs expose several product subsystems beyond basic status pages, including monitor automation, audience segmentation, routing rules, escalation policies, and on-call schedules
- A few section pages reveal naming inconsistencies in the currently published docs, such as mixed `audience-groups` vs `audience_groups` path spellings and mixed version prefixes across related resources; these should be runtime-validated against the target deployment
- The reviewed private-pages docs reuse the `/v2/pages` listing path but describe secure-link behavior, so downstream consumers should distinguish standard page metadata from private-link access semantics

## Verification notes
This file was manually rebuilt from the current official Instatus API root page plus all currently linked first-party section pages using browser inspection.