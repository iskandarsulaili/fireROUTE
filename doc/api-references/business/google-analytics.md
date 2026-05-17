# Google Analytics

Official docs manually reviewed:
- https://developers.google.com/analytics/devguides/config/admin/v1/rest
- https://developers.google.com/analytics/devguides/reporting/data/v1/rest
- https://developers.google.com/analytics/devguides/collection/protocol/ga4/reference
- https://developers.google.com/analytics/devguides/collection/protocol/ga4/validating-events
- https://developers.google.com/analytics/devguides/reporting/data/v1/quotas

## Overview
Google Analytics currently exposes multiple distinct API surfaces rather than one single host:

- **Admin API** for account/property configuration on `https://analyticsadmin.googleapis.com`
- **Data API** for reporting on `https://analyticsdata.googleapis.com`
- **Measurement Protocol** ingestion on `https://www.google-analytics.com/mp/collect`
- **EU Measurement Protocol endpoint** on `https://region1.google-analytics.com/mp/collect`
- **Measurement Protocol validation endpoint** on `https://www.google-analytics.com/debug/mp/collect`

Confirmed from the reviewed official docs:
- Admin API discovery docs: `https://analyticsadmin.googleapis.com/$discovery/rest?version=v1beta` and `...version=v1alpha`
- Data API discovery docs: `https://analyticsdata.googleapis.com/$discovery/rest?version=v1beta` and `...version=v1alpha`
- Admin/Data auth: OAuth 2.0 bearer tokens
- Measurement Protocol auth: query-string `api_secret` plus the reviewed page’s required `firebase_app_id`
- Response format: JSON for Admin/Data APIs; Measurement Protocol returns HTTP status only on ingest and JSON validation messages from the `/debug/mp/collect` validator
- Manual route count confirmed from the reviewed official pages: **248** method/path pairs total
  - Admin API REST page: **220** method rows
  - Data API REST page: **26** method rows
  - Measurement Protocol transport pages: **2** concrete POST routes (`/mp/collect`, `/debug/mp/collect`)

## Confirmed API families
### Admin API families seen in the reviewed REST reference
- `v1beta.accountSummaries`
- `v1beta.accounts`
- `v1beta.properties`
- `v1beta.properties.conversionEvents`
- `v1beta.properties.customDimensions`
- `v1beta.properties.customMetrics`
- `v1beta.properties.dataStreams`
- `v1beta.properties.dataStreams.measurementProtocolSecrets`
- `v1beta.properties.firebaseLinks`
- `v1beta.properties.googleAdsLinks`
- `v1beta.properties.keyEvents`
- matching `v1alpha.*` families, including `accounts.accessBindings` and extended property-setting resources

### Data API families seen in the reviewed REST reference
- `v1beta.properties`
- `v1beta.properties.audienceExports`
- `v1alpha.properties`
- `v1alpha.properties.audienceLists`
- `v1alpha.properties.recurringAudienceLists`

## Concrete endpoints confirmed from the reviewed docs
| Method | Path | Surface | Notes |
|---|---|---|---|
| GET | `/v1beta/accountSummaries` | Admin API | list accessible account summaries |
| GET | `/v1beta/accounts` | Admin API | list accessible accounts |
| GET | `/v1beta/{name=accounts/*}` | Admin API | get one account |
| PATCH | `/v1beta/{account.name=accounts/*}` | Admin API | update account |
| POST | `/v1beta/accounts:provisionAccountTicket` | Admin API | request account-creation ticket |
| POST | `/v1beta/{account=accounts/*}:searchChangeHistoryEvents` | Admin API | search account change history |
| POST | `/v1beta/properties` | Admin API | create property |
| GET | `/v1beta/{name=properties/*}` | Admin API | get property |
| PATCH | `/v1beta/{property.name=properties/*}` | Admin API | update property |
| GET | `/v1beta/{name=properties/*/dataRetentionSettings}` | Admin API | get data-retention settings |
| PATCH | `/v1beta/{dataRetentionSettings.name=properties/*/dataRetentionSettings}` | Admin API | update data-retention settings |
| POST | `/v1beta/{parent=properties/*}/customDimensions` | Admin API | create custom dimension |
| POST | `/v1beta/{name=properties/*/customDimensions/*}:archive` | Admin API | archive custom dimension |
| POST | `/v1beta/{parent=properties/*}/customMetrics` | Admin API | create custom metric |
| POST | `/v1beta/{parent=properties/*}/dataStreams` | Admin API | create data stream |
| POST | `/v1beta/{parent=properties/*/dataStreams/*}/measurementProtocolSecrets` | Admin API | create Measurement Protocol secret |
| GET | `/v1beta/{parent=properties/*}/firebaseLinks` | Admin API | list Firebase links |
| POST | `/v1beta/{parent=properties/*}/googleAdsLinks` | Admin API | create Google Ads link |
| POST | `/v1beta/{parent=properties/*}/keyEvents` | Admin API | create key event |
| POST | `/v1beta/{property=properties/*}:runReport` | Data API | run a standard report |
| POST | `/v1beta/{property=properties/*}:batchRunReports` | Data API | run multiple reports |
| POST | `/v1beta/{property=properties/*}:runRealtimeReport` | Data API | run realtime report |
| POST | `/v1beta/{property=properties/*}:runPivotReport` | Data API | run pivot report |
| POST | `/v1beta/{property=properties/*}:checkCompatibility` | Data API | validate dimensions/metrics compatibility |
| GET | `/v1beta/{name=properties/*/metadata}` | Data API | get dimensions/metrics metadata |
| POST | `/mp/collect` | Measurement Protocol | event ingestion endpoint |
| POST | `/debug/mp/collect` | Measurement Protocol | validation-only endpoint |

## Authentication
### Admin API and Data API
The reviewed Google REST references follow the standard Google API bearer-token model:

```http
Authorization: Bearer {access_token}
```

### Measurement Protocol
The reviewed Measurement Protocol page explicitly documented:
- `api_secret` as a required query parameter
- `firebase_app_id` as a required query parameter on the reviewed reference variant
- HTTPS POST only

Example transport pattern confirmed by the docs:

```http
POST /mp/collect?firebase_app_id={firebase_app_id}&api_secret={api_secret}
Host: www.google-analytics.com
Content-Type: application/json
```

## Request/response behavior
### Measurement Protocol
Confirmed from the reviewed reference and validation pages:
- all data must be sent using **HTTPS POST**
- the JSON POST body must be **smaller than 130 kB**
- documented body fields include `app_instance_id`, optional `user_id`, optional `timestamp_micros`, `user_properties`, and event payloads
- events can be backdated up to **72 hours**
- the ingest endpoint returns a **2xx** status if the HTTP request was received
- the ingest endpoint **does not** return an error code for malformed payload/data-processing issues
- Google recommends validating during development with `/debug/mp/collect` and `validation_behavior=ENFORCE_RECOMMENDATIONS`

### Admin/Data APIs
Confirmed from the reviewed REST references:
- responses are JSON resources following Google API conventions
- list operations use path placeholders like `name`, `parent`, `property`, and `entity`
- Data API report-style operations are POST requests with JSON bodies rather than simple list GETs
- the Data API includes metadata and compatibility helpers in addition to report execution

## Pagination and query/body parameters
### Admin API
The reviewed Admin API reference is resource-oriented and uses standard Google list/search/update shapes:
- common path placeholders: `name`, `parent`, `account`, `property`, `entity`
- list-style operations exist for accounts, properties, custom dimensions, custom metrics, data streams, links, and key events
- create/update operations use JSON request bodies

### Data API
Confirmed method families from the reviewed Data API reference:
- report execution uses POST bodies for dimensions, metrics, date ranges, filters, pivots, or audience export requests
- `getMetadata` is a GET metadata route
- the API separates Core, Realtime, and Funnel request categories for quota accounting

## Rate limits and quota notes
Confirmed from the reviewed **Data API limits and quotas** page:
- quota categories: **Core**, **Realtime**, and **Funnel**
- standard-property limits per category:
  - `200,000` tokens per property per day
  - `40,000` tokens per property per hour
  - `14,000` tokens per project per property per hour
  - `10` concurrent requests per property
  - `10` server errors per project per property per hour
- Analytics 360 limits are 10x or 5x higher depending on the row shown on the reviewed page
- daily quotas refresh at **midnight Pacific Standard Time**
- hourly quotas refresh within an hour and not necessarily exactly on hour boundaries
- the reviewed page also states that properties are allowed **120 potentially thresholded requests per hour**

The reviewed pages did **not** present one single flat numeric quota that covers every Admin API and Measurement Protocol call together; the most explicit numeric limits on the reviewed docs were for the Data API.

## Errors and operational notes
Confirmed from the reviewed docs:
- Data API can block callers after server-error quotas are exhausted for a project/property pair
- Measurement Protocol validation should be done with `/debug/mp/collect`; production traffic should usually omit `validation_behavior`
- the validation page documents structured validation responses rather than ingesting the events into reports
- Google warns against creating multiple projects/accounts to circumvent service-specific usage limits

## fireROUTE integration notes
- Treat Google Analytics as a **multi-surface provider**, not a single base URL.
- Keep Admin, Data, and Measurement Protocol routes distinct in routing logic.
- Do not assume Measurement Protocol ingestion success means the payload was semantically accepted; use `/debug/mp/collect` during testing.
- For reporting, preserve POST-body semantics rather than trying to flatten Data API report calls into list-style GET conventions.