# Blynk-Cloud

## Provider metadata
- Category: `Development`
- Provider slug: `blynk-cloud`
- Docs used manually:
  - `https://docs.blynk.io/en/sitemap.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/get-datastream-value.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/get-multiple-datastream-values.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/get-device-report.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/update-datastream-value.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/update-multiple-datastreams-api.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/upload-set-of-data-with-timestamps-api.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/update-property.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/trigger-events-api.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/get-device-metafield-value.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/get-device-metafield-value-1.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/is-device-connected.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/is-device-connected-1.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/upload-a-file.md`
  - `https://docs.blynk.io/en/blynk.cloud/device-https-api/troubleshooting.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/authentication.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/organizations.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/devices.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/datastreams.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/provisioning.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/static-tokens.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/users.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/templates.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/template-datastreams.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/template-events.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/template-metafields.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/tags.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/automations.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/webhooks.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/shipments.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/uploads.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/oauth.md`
  - `https://docs.blynk.io/en/blynk.cloud/platform-https-api/models.md`
  - `https://docs.blynk.io/en/blynk.cloud/security.md`
- Confirmed API base URL patterns:
  - Device HTTPS API: `https://{server_address}/external/api/...`
  - Platform HTTPS API: `https://{server_address}/api/...`
  - OAuth token endpoints: `https://{server_address}/oauth2/token?...`
- Confirmed regional `server_address` values called out in the official troubleshooting page:
  - `fra1.blynk.cloud`
  - `lon1.blynk.cloud`
  - `ny3.blynk.cloud`
  - `sgp1.blynk.cloud`
  - `blr1.blynk.cloud`
- Primary response formats confirmed in docs:
  - JSON objects and arrays for most device/history/platform responses
  - raw scalar boolean/text for some device endpoints such as online-state checks
  - empty `200 OK` bodies for some update-style GET endpoints
  - multipart upload for file upload requests
  - zip-link download responses for historical exports
- Authentication models surfaced in docs:
  - Device HTTPS API uses query parameter `token` with the device AuthToken
  - Platform API uses OAuth2:
    - Basic auth with `client_id:client_secret` on token endpoints
    - Bearer access token in `Authorization` for platform requests
    - refresh flow via `grant_type=refresh_token`
- Manually confirmed routes in this pass: `104`
  - Device HTTPS API routes: `17`
  - Platform HTTPS API routes: `87`

## Authentication

### Device HTTPS API
- The public device-side HTTPS endpoints authenticate with the device AuthToken in the query string: `token={token}`.
- The docs repeatedly point users to Device info for the AuthToken.
- The troubleshooting page says wrong-region requests can return `308 Permanent Redirect` with the correct regional URL in the `Location` header.

### Platform HTTPS API
- OAuth2 client credentials and user credentials are exchanged at `/oauth2/token`.
- The docs describe HTTP Basic auth using base64-encoded `client_id:client_secret` for token issuance.
- Access tokens are returned as Bearer tokens and used in the `Authorization` header.
- The reviewed authentication page says access tokens currently default to `86400` seconds (`24` hours), refresh tokens currently share the same lifetime, and each refresh token can be used only once.

## Common request/response conventions
- Device HTTPS routes are case-sensitive; the troubleshooting page explicitly says request path and query-parameter letter case must not be changed.
- Device-side GET endpoints heavily encode action parameters in the query string rather than using JSON bodies.
- Platform list endpoints use standard JSON envelopes and documented pagination parameters such as `page` and `size`.
- The reviewed devices v1 page documents:
  - `page` is `0`-indexed
  - default `size` is `50`
  - max `size` is `1000`
- The devices v2 route adds `include`-style expansion support so clients can inline fields like `hardwareInfo`, `dataStreamValues`, and `metaFieldValues`.
- Platform family pages embed per-route OpenAPI JSON blocks with the operation-specific query/body schemas.

## Manually confirmed device HTTPS endpoint set

### 1) Get datastream value by pin
- Method: `GET`
- Path: `/external/api/get`
- Query parameters:
  - `token` - required device AuthToken
  - `{pin}` - required virtual/digital/analog pin selector
- Official pattern: `https://{server_address}/external/api/get?token={token}&{pin}`
- Error examples in docs:
  - `{"error":{"message":"Invalid token."}}`
  - `{"error":{"message":"Wrong pin format."}}`

### 2) Get datastream value by datastream ID
- Method: `GET`
- Path: `/external/api/get`
- Query parameters:
  - `token`
  - `dataStreamId`
- Official pattern: `https://{server_address}/external/api/get?token={token}&dataStreamId={id}`
- Additional documented failure: requested datastream does not exist in the product.

### 3) Get multiple datastream values
- Method: `GET`
- Path: `/external/api/get`
- Query parameters:
  - `token`
  - multiple pin selectors such as `{pin}` and `{pinX}`
- Official pattern: `https://{server_address}/external/api/get?token={token}&{pin}&{pinX}`

### 4) Get all datastream values
- Method: `GET`
- Path: `/external/api/getAll`
- Query parameters:
  - `token`
- Official pattern: `https://{server_address}/external/api/getAll?token={token}`
- Response example in docs is a JSON object keyed by pins such as `a0`, `d0`, `v0`.

### 5) Get historical device data
- Method: `GET`
- Path: `/external/api/data/get`
- Query parameters confirmed in docs:
  - `token`
  - `period` with documented values including `HOUR`, `DAY`, `WEEK`, `MONTH`, `THREE_MONTHS`
  - `granularityType` with documented values `RAW_DATA`, `MINUTE`, `HOURLY`, `DAILY`
  - `sourceType` with documented values `AVG`, `MIN`, `MAX`, `SUM`, `COUNT`
  - `tzName`
  - `format`
  - optional `sendEvents`
  - optional `dataStreamId` or `pin`
- Official pattern: `https://{server_address}/external/api/data/get?token={token}&period={PERIOD}&granularityType={TYPE}&sourceType={SOURCE_TYPE}&tzName={tzName}&format={FORMAT}&pin={pin}`
- Success response may return a downloadable ZIP link.

### 6) Update datastream value by pin
- Method: `GET`
- Path: `/external/api/update`
- Query parameters:
  - `token`
  - `{pin}={value}`
- Official pattern: `https://{server_address}/external/api/update?token={token}&{pin}={value}`
- The docs say the value is parsed according to the datastream type and bounded by min/max settings.

### 7) Update datastream value by datastream ID
- Method: `GET`
- Path: `/external/api/update`
- Query parameters:
  - `token`
  - `dataStreamId`
  - `value`
- Official pattern: `https://{server_address}/external/api/update?token={token}&dataStreamId={id}&value={value}`
- The docs also show repeated `value` parameters for two-value datastreams such as location fields.

### 8) Batch-update multiple datastreams on one device
- Method: `GET`
- Path: `/external/api/batch/update`
- Query parameters:
  - `token`
  - multiple pin/value pairs such as `{pin1}={value1}` and `{pin2}={value2}`
- Official pattern: `https://{server_address}/external/api/batch/update?token={token}&{pin1}={value1}&{pin2}={value2}`
- The docs position this as a bandwidth-saving call for cellular devices and same-timestamp map updates.

### 9) Upload timestamped datapoints for one datastream
- Method: `POST`
- Path: `/external/api/batch/update`
- Query parameters:
  - `token`
  - `pin`
- Required header:
  - `Content-Type: application/json`
- Body format:
  - JSON array of `[timestamp, value]` pairs, e.g. `[[1648054765458,1.0],[1648054825459,2.0]]`
- Official pattern: `https://{server_address}/external/api/batch/update?token={token}&pin={pin}`
- Limits explicitly documented:
  - max `10,000` datapoints per day per device
  - timestamps can be at most one month old
  - batch failure example mentions max batch size `10000` points

### 10) Update widget/datastream property
- Method: `GET`
- Path: `/external/api/update/property`
- Query parameters:
  - `token`
  - `pin`
  - dynamic property/value pair: `{property}={value}`
- Official pattern: `https://{server_address}/external/api/update/property?token={token}&pin={pin}&{property}={value}`

### 11) Trigger/log an event
- Method: `GET`
- Path: `/external/api/logEvent`
- Query parameters:
  - `token`
  - `code`
  - optional `description`
- Official pattern: `https://{server_address}/external/api/logEvent?token={token}&code={event_code}&description={event_description}`
- Official errors include missing event code and unknown event code in the product template.

### 12) Get device metadata value by metadata field ID
- Method: `GET`
- Path: `/external/api/device/meta`
- Query parameters:
  - `token`
  - `metaFieldId`
- Official pattern: `https://{server_address}/external/api/device/meta?token={token}&metaFieldId={metaFieldId}`
- The page notes that metadata names are case-sensitive and calls out `loc.latlon` as a special internal field.

### 13) Update device metadata value by metadata field ID
- Method: `GET`
- Path: `/external/api/device/meta/update`
- Query parameters:
  - `token`
  - `metaFieldId`
  - `value`
- Official pattern: `https://{server_address}/external/api/device/meta/update?token={token}&metaFieldId={metaFieldId}&value={metaFieldValue}`

### 14) Update device metadata value by metadata field name
- Method: `GET`
- Path: `/external/api/device/meta/update`
- Query parameters:
  - `token`
  - `metaFieldName`
  - `value`
- Official pattern: `https://{server_address}/external/api/device/meta/update?token={token}&metaFieldName={metaFieldName}&value={metaFieldValue}`
- The docs explicitly say both parameter names and values are case-sensitive and must be properly encoded.

### 15) Check whether device is connected
- Method: `GET`
- Path: `/external/api/isHardwareConnected`
- Query parameters:
  - `token`
- Official pattern: `https://{server_address}/external/api/isHardwareConnected?token={token}`
- Success response is plain `true` or `false`.

### 16) Provision device
- Method: `GET`
- Path: `/external/api/provision`
- Required query parameters:
  - `token`
  - `templateId`
- Optional query parameters confirmed in docs:
  - `build`
  - `ver`
  - `type`
  - `fwType`
  - `blVer`
  - `boType`
- Official pattern: `https://{server_address}/external/api/provision?token={token}&templateId={templateId}`
- The docs say this is used for the WiFi provisioning flow.

### 17) Upload a file
- Method: `POST`
- Path: `/external/api/upload`
- Query parameters:
  - `token`
- Required body transport:
  - multipart form-data part named `upfile`
- Official pattern: `POST https://{server_address}/external/api/upload?token={token}`
- Availability note from docs:
  - currently available only for `PRO`, `Production`, and `Enterprise` customers
- Limits explicitly documented:
  - up to `10` files per device
  - each file up to `5MB`
  - each device can upload up to `1,000` files
  - reusing the same file name overwrites the previous file

## Manually confirmed platform HTTPS route inventory

### Authentication (`3`)
- `POST /oauth2/token?grant_type=client_credentials`
- `POST /oauth2/token?grant_type=user_credentials`
- `POST /oauth2/token?grant_type=refresh_token`

### Organizations (`7`)
- `GET /api/v1/organization/profile`
- `GET /api/v1/organization/search`
- `GET /api/v1/organization`
- `DELETE /api/v1/organization`
- `POST /api/v1/organization/create`
- `PUT /api/v1/organization/edit/name`
- `GET /api/v1/organization/sub-organizations`

### Devices (`23`)
- `GET /api/v1/organization/devices`
- `GET /api/v2/organization/devices`
- `GET /api/v1/organization/search/devices`
- `GET /api/v1/organization/device`
- `PUT /api/v1/organization/device`
- `DELETE /api/v1/organization/device`
- `GET /api/v1/organization/device/baseInfo`
- `POST /api/v1/organization/device/create`
- `GET /api/v1/organization/device/online`
- `GET /api/v1/organization/device/tags`
- `GET /api/v1/organization/device/timeline`
- `GET /api/v1/organization/device/logs`
- `POST /api/v1/organization/device/transfer/to-owner`
- `POST /api/v1/organization/device/transfer/to-organization`
- `DELETE /api/v1/organization/device/owner`
- `DELETE /api/v1/organization/device/clear`
- `POST /api/v1/organization/device/trigger-event`
- `POST /api/v1/organization/device/resolve-event`
- `GET /api/v1/organization/device/by-owner`
- `GET /api/v1/organization/device/by-user-org`
- `GET /api/v1/organization/device/last-activated`
- `GET /api/v1/organization/device/metafield`
- `POST /api/v1/organization/device/metafield`

### Datastreams (`8`)
- `GET /api/v2/organization/device/datastreams`
- `GET /api/v1/organization/device/datastreams/batch`
- `GET /api/v1/organization/device/datastream/history`
- `POST /api/v1/organization/device/datastream`
- `POST /api/v1/organization/device/datastreams`
- `POST /api/v1/organization/product/devices/batch-update`
- `POST /api/v1/organization/device/import/batch`
- `POST /api/v1/organization/device/datastream/property`

### Provisioning (`3`)
- `POST /api/v1/organization/device/provision/token`
- `POST /api/v1/organization/device/provision/reconfigure`
- `POST /api/v1/organization/device/provision/reprovision/token`

### Static tokens (`3`)
- `GET /api/v1/organization/static-tokens`
- `POST /api/v1/organization/static-tokens/claim`
- `POST /api/v1/organization/static-tokens/unclaim`

### Users (`12`)
- `GET /api/v1/organization/user/profile`
- `GET /api/v1/organization/users`
- `GET /api/v1/organization/search/users`
- `GET /api/v1/organization/user`
- `POST /api/v1/organization/users/create`
- `POST /api/v1/organization/users/create-in-org`
- `PUT /api/v1/organization/users/role`
- `POST /api/v1/organization/users/invite`
- `POST /api/v1/organization/users/register`
- `POST /api/v1/organization/users/transfer`
- `POST /api/v1/organization/users/send-push-notification`
- `POST /api/v1/organization/users/fcm-token/register`

### Templates (`5`)
- `GET /api/v1/organization/templates`
- `GET /api/v1/organization/template`
- `PUT /api/v1/organization/template`
- `DELETE /api/v1/organization/template`
- `POST /api/v1/organization/template/create`

### Template datastreams (`4`)
- `GET /api/v1/organization/template/datastreams`
- `POST /api/v1/organization/template/datastream/create`
- `PUT /api/v1/organization/template/datastream`
- `DELETE /api/v1/organization/template/datastream`

### Template events (`4`)
- `GET /api/v1/organization/template/events`
- `POST /api/v1/organization/template/event/create`
- `PUT /api/v1/organization/template/event`
- `DELETE /api/v1/organization/template/event`

### Template metadata fields (`1`)
- `GET /api/v1/organization/template/metafields`

### Tags (`1`)
- `GET /api/v1/organization/tags`

### Automations (`1`)
- `GET /api/v1/organization/automations`

### Webhooks (`5`)
- `GET /api/v1/organization/webhooks`
- `GET /api/v1/organization/webhook`
- `PUT /api/v1/organization/webhook`
- `DELETE /api/v1/organization/webhook`
- `POST /api/v1/organization/webhook/create`

### Shipments (`5`)
- `GET /api/v1/organization/shipments`
- `GET /api/v1/organization/shipment`
- `DELETE /api/v1/organization/shipment`
- `POST /api/v1/organization/shipment/create`
- `PUT /api/v1/organization/shipment/stop`

### Uploads (`1`)
- `POST /api/upload`

### OAuth client management (`1`)
- `POST /api/v1/organization/oauth/clients/create`

## Pagination
- The reviewed platform docs explicitly document paginated list behavior on organization/device listing routes.
- Confirmed pagination fields from the devices page:
  - `page` - `0`-indexed
  - `size` - default `50`, minimum `1`, maximum `1000`
- Search/list routes such as devices, organizations, and users are organized as paginated JSON responses rather than cursor-based feeds.
- The device-side HTTPS API does not expose a general pagination protocol in the reviewed docs.

## Rate limits, quotas, and operational limits
- Platform OpenAPI blocks repeatedly document `429 Too Many Requests` as a possible response.
- The device timestamped-batch upload page documents a hard limit of `10,000` datapoints per day per device.
- The same page says timestamps older than one month are rejected.
- The file-upload page documents:
  - up to `10` stored files per device
  - `5MB` per file
  - up to `1,000` uploads per device
- The authentication page says token lifetimes are subject to change and clients should rely on the returned `expires_in` value.

## Error and format notes
- Common device-side error bodies are JSON in the shape `{"error":{"message":"..."}}`.
- Frequently documented device-side failures include:
  - `Invalid token.`
  - `Wrong pin format.`
  - `Wrong dataStreamId format.`
  - `Value doesn't match the Datastream data type.`
  - `MetaField doesn't exist.`
- Historical export docs show both `400` and `500` class failures for invalid parameters, nonexistent data, and unsupported enum constants.
- The troubleshooting page documents `308 Permanent Redirect` when the wrong regional host is used.
- Platform OpenAPI blocks commonly include `400`, `403`, `404`, `429`, and `500` responses, with JSON error schemas for many routes.

## Important usage notes
- Device HTTPS calls must use the correct regional host; the docs say the active region is visible in the bottom-right corner of the web interface.
- Device/API path case matters; the troubleshooting page explicitly warns not to change path or query parameter letter-case.
- The security page says Blynk prefers TLS `1.3`, falls back to `1.2`, and rejects TLS `1.0` and `1.1`.
- The same page documents ports:
  - `443` for TLS (`9443` fallback if `443` unavailable)
  - `80` for plain connections (`8080` fallback if `80` unavailable)
- Upload and timestamped-batch endpoints are not generic CRUD surfaces; they carry product-plan and quota limits that fireROUTE adapters should surface clearly.
- The platform family pages are the strongest source for per-operation request-body schemas because they embed route-specific OpenAPI JSON blocks directly in the official docs.

## Verification notes
- The old Apiary URL in the index now exposes a generic placeholder-style documentation shell and is not the authoritative Blynk reference.
- The current first-party Blynk documentation site is `docs.blynk.io`, which provided the route inventory and usage details recorded above.
