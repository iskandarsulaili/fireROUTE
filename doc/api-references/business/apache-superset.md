# Apache Superset

Official docs manually reviewed:
- https://superset.apache.org/developer-docs/api/
- https://superset.apache.org/developer-docs/api/charts/

## Overview
Apache Superset exposes a deployment-relative REST API rooted under `/api/v1` on each Superset instance.

Confirmed from the reviewed official docs:
- Base URL pattern: `https://<your-superset-host>/api/v1`
- Primary auth model: JWT bearer tokens
- Login bootstrap endpoint: `POST /api/v1/security/login`
- Additional security endpoints documented for CSRF token exchange, guest-token issuance, and token refresh
- Primary response format: JSON
- The reviewed API reference is explicitly OpenAPI-based and includes code samples in cURL, Python, and JavaScript
- The current official API landing page exposes `37` documented resource groups totaling `272` grouped endpoints, plus `4` separately documented security endpoints, for **276** directly visible documented HTTP operations

## Authentication and security model
From the reviewed API landing page:
- Most API endpoints require authentication via JWT tokens
- Official quick-start login example sends JSON with:
  - `username`
  - `password`
  - `provider`
- Successful login returns an access token that is then sent as:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN`
- The reviewed security table also documents:
  - `GET /api/v1/security/csrf_token/`
  - `POST /api/v1/security/guest_token/`
  - `POST /api/v1/security/login`
  - `POST /api/v1/security/refresh`
- The quick-start example also explicitly sets `Content-Type: application/json`

## Directly confirmed security endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | `/api/v1/security/csrf_token/` | Get the CSRF token |
| POST | `/api/v1/security/guest_token/` | Get a guest token |
| POST | `/api/v1/security/login` | Create security login / obtain JWT |
| POST | `/api/v1/security/refresh` | Refresh an access token |

## Current official grouped route inventory
The reviewed API landing page exposes these resource families and endpoint counts:

| Resource group | Count | Official description |
|---|---:|---|
| Dashboards | 28 | Create, read, update, and delete dashboards |
| Charts | 20 | Create, read, update, and delete charts (slices) |
| Datasets | 19 | Manage datasets (tables) used for building charts |
| Database | 30 | Manage database connections and metadata |
| Explore | 1 | Chart exploration and data querying |
| SQL Lab | 7 | Execute SQL queries and manage SQL Lab sessions |
| Queries | 17 | View and manage SQL Lab query history |
| Datasources | 2 | Query datasource metadata and column values |
| Advanced Data Type | 2 | Advanced data type operations and conversions |
| Tags | 15 | Organize assets with tags |
| Annotation Layers | 14 | Manage annotation layers and annotations for charts |
| CSS Templates | 8 | Manage CSS templates for custom dashboard styling |
| Dashboard Permanent Link | 2 | Permanent links to dashboard states |
| Explore Permanent Link | 2 | Permanent links to chart explore states |
| SQL Lab Permanent Link | 2 | Permanent links to SQL Lab states |
| Embedded Dashboard | 1 | Configure embedded dashboard settings |
| Dashboard Filter State | 4 | Manage temporary filter state for dashboards |
| Explore Form Data | 4 | Manage temporary form data for chart exploration |
| Report Schedules | 11 | Configure scheduled reports and alerts |
| Security Roles | 11 | Manage security roles and their permissions |
| Security Users | 6 | Manage user accounts |
| Security Permissions | 3 | View available permissions |
| Security Resources (View Menus) | 6 | Manage security resources (view menus) |
| Security Permissions on Resources (View Menus) | 6 | Permission-resource mappings |
| Row Level Security | 8 | Manage row-level security rules for data access |
| Import/export | 2 | Import and export Superset assets |
| CacheRestApi | 1 | Cache management and invalidation |
| LogRestApi | 4 | Access audit logs and activity history |
| Current User | 3 | Get information about the authenticated user |
| User | 1 | User profile and preferences |
| Menu | 1 | Get the Superset menu structure |
| Available Domains | 1 | Get available domains for the Superset instance |
| AsyncEventsRestApi | 1 | Real-time event streaming via Server-Sent Events |
| OpenApi | 1 | Access the OpenAPI specification |
| Security Groups | 6 | Security-group endpoints |
| Themes | 14 | Manage UI themes |
| UserRegistrationsRestAPI | 8 | User-registration endpoints |

Manual route count confirmed from the reviewed official docs: **276** (`272` grouped endpoints + `4` security endpoints).

## Concrete chart endpoints manually confirmed
The current first-party `Charts` page explicitly documents these exact paths:

| Method | Path | Purpose |
|---|---|---|
| DELETE | `/api/v1/chart/` | Bulk delete charts |
| GET | `/api/v1/chart/` | Get a list of charts |
| POST | `/api/v1/chart/` | Create a new chart |
| GET | `/api/v1/chart/_info` | Resource metadata |
| GET | `/api/v1/chart/{id_or_uuid}` | Get chart detail information |
| DELETE | `/api/v1/chart/{pk}` | Delete a chart |
| PUT | `/api/v1/chart/{pk}` | Update a chart |
| GET | `/api/v1/chart/{pk}/cache_screenshot/` | Compute and cache a screenshot |
| GET | `/api/v1/chart/{pk}/data/` | Return payload data for a saved chart |
| DELETE | `/api/v1/chart/{pk}/favorites/` | Remove from the current user's favorites |
| POST | `/api/v1/chart/{pk}/favorites/` | Mark as favorite |
| GET | `/api/v1/chart/{pk}/screenshot/{digest}/` | Get cached screenshot |
| GET | `/api/v1/chart/{pk}/thumbnail/{digest}/` | Get chart thumbnail |
| POST | `/api/v1/chart/data` | Return payload data for an ad hoc chart query |
| GET | `/api/v1/chart/data/{cache_key}` | Fetch cached chart-query payload by cache key |
| GET | `/api/v1/chart/export/` | Download multiple charts as YAML |
| GET | `/api/v1/chart/favorite_status/` | Check favorited charts for the current user |
| POST | `/api/v1/chart/import/` | Import chart bundles with related datasets/databases |
| GET | `/api/v1/chart/related/{column_name}` | Get related-field data |
| PUT | `/api/v1/chart/warm_up_cache` | Warm chart cache |

## Path and parameter conventions confirmed from the reviewed docs
From the reviewed API root and Charts reference:
- Routes are versioned under `/api/v1`
- The API is host-relative; callers must supply the customer's own Superset hostname
- Collection and item routes are split cleanly, for example `/chart/` vs `/chart/{pk}`
- The reviewed docs visibly use path parameters such as:
  - `{pk}`
  - `{id_or_uuid}`
  - `{digest}`
  - `{cache_key}`
  - `{column_name}`
- The official import/export examples and route labels confirm YAML bundle import/export behavior on relevant asset routes
- The landing page explicitly says the sidebar includes schema definitions for underlying request/response models

## Pagination and response notes
Confirmed from the reviewed docs:
- The API is REST-oriented and JSON-based
- Collection resources are documented separately from item resources, implying route-level filtering/pagination behavior by family rather than one universal scheme
- The reviewed charts page exposes both live data-generation routes and cache-backed lookup routes, so response behavior can vary between direct execution and cache retrieval
- Screenshot and thumbnail routes use digest-based cache identifiers in the path

## Important usage notes
- Superset should be modeled in fireROUTE as a deployment-relative integration, not as a single global SaaS hostname
- The current public docs are organized by resource family and expose a much larger route surface than the old repo note captured
- JWT login is the documented bootstrap path, but CSRF and guest-token flows are also first-party documented and may matter for embedded/dashboard scenarios
- The visible route surface mixes CRUD asset APIs with query execution, screenshot generation, import/export, security, reporting, theme management, and SSE-style async event streaming
- The reviewed landing page is labeled as `developer-docs` and currently warns that the page is for the `Next` docs stream, so downstream runtime validation should still respect the installed Superset version on the target deployment

## Verification notes
This file was manually rebuilt from the current official Superset API landing page and current official Charts reference page using browser inspection.