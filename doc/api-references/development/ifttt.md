# IFTTT

## Provider metadata
- Category: `Development`
- Provider slug: `ifttt`
- Docs used manually:
  - `https://ifttt.com/docs/connect_api`
- Confirmed Connect API base URL: `https://connect.ifttt.com`
- Additional official host confirmed from the same docs: `https://ifttt.com` for Connect URLs
- Primary format: JSON
- Manually confirmed routes in this pass: `7`

## Authentication
From the official Connect API docs:
- Requests are either unauthenticated or service-authenticated.
- Service-authenticated requests send `IFTTT-Service-Key: <service key>`.
- Some endpoints also allow a `user_id` query parameter to access user-specific resources within a service-authenticated request.
- Unauthenticated requests can only read publicly visible information.
- The docs' Connect URL flow also supports a `provisional_access_code` in the `code` query parameter to pre-authenticate a user during the connect flow.

## Common request/response conventions
- The API is located at `https://connect.ifttt.com`.
- API responses are JSON objects.
- Requests with bodies should use `Content-Type: application/json`.
- The docs list these status codes for the Connect API: `200`, `204`, `400`, `401`, `403`, `404`, `422`, `500`, `502`.
- Error responses are JSON objects with:
  - `type` = `"error"`
  - `code`
  - `message`
  - `details`

## Manually confirmed endpoint set

### 1) Show the current service and user
- Method: `GET`
- Path: `/v2/me`
- Full URL: `https://connect.ifttt.com/v2/me`
- Auth modes allowed by the docs:
  - unauthenticated
  - service-authenticated
  - service-authenticated with `user_id`
- Purpose: verify the current request's authentication context.
- Query parameter:
  - `user_id` - optional; used to check whether that service-side user is connected to an IFTTT account
- Example response fields shown in the docs:
  - `type`
  - `authentication_level`
  - `service_id`
  - `user_login`

### 2) Show a connection
- Method: `GET`
- Path: `/v2/connections/{connection_id}`
- Full URL: `https://connect.ifttt.com/v2/connections/{connection_id}`
- Auth: unauthenticated or service-authenticated with `user_id`
- Purpose: return metadata about a specific connection.
- Usage note from the docs:
  - if the authenticated user has enabled the connection, the response includes a `user_connection` object with current trigger/query/action field configuration.
- Example response fields shown in the docs include:
  - `type`, `id`, `name`, `description`, `url`, `enabled_count`, `user_status`, `services`

### 3) Update a connection
- Method: `PUT`
- Path: `/v2/connections/{connection_id}/user_connection`
- Full URL: `https://connect.ifttt.com/v2/connections/{connection_id}/user_connection`
- Auth: service-authenticated with `user_id`
- Purpose: replace the stored configuration for a specific user's connection.
- Important docs note:
  - the `PUT` replaces the currently stored configuration; omitted trigger/query/action configuration can therefore remove existing saved configuration.
- Request body structure shown in the docs includes `user_features`, nested `user_fields`, `user_feature_triggers`, `user_feature_queries`, and `user_feature_actions`.
- The docs also call out a deprecated older `POST /v2/connections/{connection_id}` update form.

### 4) Refresh a connection
- Method: `POST`
- Path: `/v2/connections/{connection_id}/user_connection/refresh`
- Full URL: `https://connect.ifttt.com/v2/connections/{connection_id}/user_connection/refresh`
- Auth: service-authenticated with `user_id`
- Purpose: refresh stored dropdown field labels when labels have changed outside IFTTT.
- Example success response: `204 No Content`

### 5) Perform a query
- Method: `POST`
- Path: `/v2/connections/{connection_id}/queries/{query_id}/perform`
- Full URL: `https://connect.ifttt.com/v2/connections/{connection_id}/queries/{query_id}/perform`
- Auth: service-authenticated with `user_id`
- Purpose: execute a query using the user query fields stored on IFTTT.
- Request body fields confirmed in the docs:
  - `fields` - object of query-field overrides
  - `user_feature_id` - optional specific configuration selector
  - `limit` - optional result limit
  - `cursor` - optional pagination cursor
- Response behavior shown in the docs:
  - response `type` is `list`
  - result data is returned under `data`
  - pagination continuation can be returned in `next`

### 6) Run an action
- Method: `POST`
- Path: `/v2/connections/{connection_id}/actions/{action_id}/run`
- Full URL: `https://connect.ifttt.com/v2/connections/{connection_id}/actions/{action_id}/run`
- Auth: service-authenticated with `user_id`
- Purpose: run the specified action using the stored user action fields.
- Request body:
  - can include `user_id`
  - may include field overrides
  - may include `user_feature_id`
- Success response: `204 No Content`
- The docs also provide type-format guidance for some action field categories, including URLs and ISO 8601 date/time strings.

### 7) Connection-enabled webhook
- Method: `POST`
- Path: `/ifttt/v1/webhooks/connection/enabled`
- Purpose: webhook sent from IFTTT to the service when a user enables a connection.
- Host pattern shown in the docs: service-owned API host, e.g. `api.example-service.com`
- Request headers/body fields shown in the docs:
  - `X-Request-ID`
  - top-level `sent_at`
  - `data.connection_id`
  - `data.user_id`
  - `data.user_timezone`
  - `event_data.enabled_at`
- Closely related officially documented webhook siblings:
  - `POST /ifttt/v1/webhooks/connection/updated`
  - `POST /ifttt/v1/webhooks/connection/disabled`

## Connect URL flow
The reviewed Connect API docs also document a browser redirect flow rather than a pure API endpoint:
- Connect URL pattern: `GET https://ifttt.com/connect/{connection_id}`
- Supported query parameters:
  - `email` - required
  - `redirect_uri` - optional, but required when `skip_config=true`
  - `code` - provisional access code used to pre-authenticate the user to the service
  - `skip_config` - optional boolean
- The docs state provisional access codes are single-use and expire after 48 hours.

## Pagination and error notes
- The Connect API docs explicitly show query-style pagination with `cursor` and `next` on query execution responses.
- Standard error envelope fields are `type`, `code`, `message`, and `details`.
- A missing connection example returns `404` with `code: not_found` and message `Unknown connection id`.

## Rate limits
- The reviewed public Connect API page did not publish a numeric rate-limit table.
- Only HTTP status/error semantics were explicitly documented on the reviewed official page.

## Important usage notes
- This provider's official docs cover both the Connect API and service-side webhook/event flows; fireROUTE should preserve that split.
- Many connection routes are user-scoped through `user_id` and service-key authentication rather than end-user bearer tokens.
- The docs distinguish between read-only public information and service-authenticated access to user-specific connection state.

## Verification notes
This file was manually rebuilt from the official IFTTT Connect API docs with browser inspection, replacing the earlier autogenerated summary.
