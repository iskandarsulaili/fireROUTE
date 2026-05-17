# BIC-Boxtech

## Provider metadata
- Category: `Transportation`
- Provider slug: `bic-boxtech`
- Official docs used manually:
  - `https://docs.bic-boxtech.org/`
  - `https://docs.bic-boxtech.org/api/bic-global-container-database`
  - `https://docs.bic-boxtech.org/boxtech-api-v2.json`
- Base URL: `https://app.bic-boxtech.org/api/v2.0`
- Alternate official server published in the OpenAPI document: `https://uat.bic-boxtech.org/api/v2.0`
- Authentication:
  - `POST /oauth/token` uses HTTP Basic auth
  - all other confirmed routes use Bearer auth with a JWT obtained from `/oauth/token`
- Primary response format: JSON
- Transport scope documented here: BIC container-code lookup, container technical details, fleet management, alert management, ISO size-type lookup, and upload helper endpoints

## Important official usage notes
- The official docs describe BoxTech as the free-to-use container technical detail database maintained by the Bureau International des Containers (BIC).
- The published OpenAPI document is version `2.0.3`.
- The docs expose both production and UAT server URLs, but the production base URL is the main canonical server for this file.
- The token response schema documents both `accessToken` and `access_token` fields as JWT token fields, plus `accessTokenExpiresAt`.
- The container-write route accepts an array of `FleetIn` objects rather than a single object.
- The alert delete route constrains `alertType` to the enum values `SOLD`, `SCRAPPED`, `LOST`, and `STOLEN`.

## Rate limits, pagination, and errors
- The inspected official docs do not publish a numeric rate limit or quota.
- No cursor, page-number, `limit`, or `offset` pagination scheme is documented for the confirmed routes.
- Common documented error behavior:
  - `400` for invalid request / invalid input
  - `401` for insufficient permissions on bearer-protected routes
  - `404` on selected lookup routes such as missing BIC holders or missing containers
  - `500` for internal server error
- The published `ErrorResponse` schema is a JSON object with required `message` text.
- `POST /container` additionally documents `207` for partial or full failure in a multi-container operation.

## Confirmed API surface
The official OpenAPI document currently exposes 12 routes:
1. `POST /oauth/token`
2. `GET /codes/{bicCode}`
3. `POST /container`
4. `GET /container/{containerNumber}`
5. `DELETE /container/{containerNumber}`
6. `GET /tare_kg/{containerNumber}`
7. `GET /max_gross_mass_kgs/{containerNumber}`
8. `GET /iso/size_type_code/{sizeTypeCode}`
9. `POST /alert`
10. `DELETE /alert/{containerNumber}/{alertType}`
11. `GET /uploads`
12. `GET /uploads/{uploadId}`

## Common request and response notes
- All confirmed responses are documented as JSON.
- `containerNumber` fields are documented as 11-character ISO container identifiers such as `BICU1234565`.
- The `FleetIn` schema requires these fields when adding fleet containers:
  - `container_number`
  - `cubic_capacity_cbm`
  - `detail_st`
  - `max_gross_mass_kg`
  - `max_payload_kg`
  - `tare_kg`
- Optional `FleetIn` extensions include nested `dimensions`, `smart_container`, `tank_container`, and `combined_data_plate` data.
- The full container-detail response can include physical dimensions, weights in metric and imperial units, manufacturing metadata, customs / CSC approvals, operator details, and certificate-related fields.

## 1) Collect a token for authentication
- Method: `POST`
- Path: `/oauth/token`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/oauth/token`
- Purpose: obtain the JWT bearer token used for the other authenticated routes
- Authentication: HTTP Basic auth
- Documented response fields:
  - `accessToken`
  - `access_token`
  - `accessTokenExpiresAt`
- Documented errors:
  - `400 Invalid Request`
- Official error example note: invalid or missing authorization header text is returned in the `message` field

## 2) Identify who owns a given BIC code
- Method: `GET`
- Path: `/codes/{bicCode}`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/codes/{bicCode}`
- Purpose: look up the holder / owner details for a BIC code
- Authentication: Bearer token
- Documented path parameter:
  - `bicCode` - required string BIC code
- Documented responses:
  - `200 BIC Code Holder Detail`
  - `400 Invalid Request`
  - `401 Insufficient Permissions`
  - `404 BIC Holder not found`
  - `500 Internal Server Error`

## 3) Add container to your fleet
- Method: `POST`
- Path: `/container`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/container`
- Purpose: add one or more containers to the caller's fleet
- Authentication: Bearer token
- Request body format: `application/json`
- Documented request-body schema: array of `FleetIn` objects
- Key documented `FleetIn` fields:
  - `container_number`
  - `detail_st`
  - `tare_kg`
  - `max_gross_mass_kg`
  - `max_payload_kg`
  - `cubic_capacity_cbm`
  - optional `dimensions.*`
  - optional `smart_container`
  - optional `tank_container`
  - optional `combined_data_plate`
- Documented responses:
  - `200 Container operation result success`
  - `207 Container operation result that has partial or full failure`
  - `400 Invalid Input`
  - `401 Insufficient Permissions to Post Container`
  - `500 Internal Server Error`

## 4) Get technical details for a container
- Method: `GET`
- Path: `/container/{containerNumber}`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/container/{containerNumber}`
- Purpose: retrieve detailed technical attributes for a single container
- Authentication: Bearer token
- Documented path parameter:
  - `containerNumber` - required string container number
- Documented response fields can include:
  - `bic_code`, `prefix`, `equipment_identifier`, `serial_number`, `check_digit`
  - `detail_st`, `group_st`
  - `tare_kg`, `max_payload_kg`, `max_gross_mass_kg`
  - size and door dimensions in both metric and imperial units
  - manufacturer / operator / approval / inspection fields
  - optional alert and certificate-related fields
- Documented responses:
  - `200 Container Technical Details`
  - `400 Invalid Input`
  - `401 Insufficient Permissions`
  - `404 Container not found`
  - `500 Internal Server Error`

## 5) Remove container from your fleet
- Method: `DELETE`
- Path: `/container/{containerNumber}`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/container/{containerNumber}`
- Purpose: remove a container from the caller's fleet
- Authentication: Bearer token
- Documented path parameter:
  - `containerNumber` - required string container number
- Documented responses:
  - `200 Container Removed from Fleet`
  - `400 Invalid Input`
  - `401 Insufficient Permissions`
  - `500 Internal Server Error`

## 6) Get only the tare weight of a container
- Method: `GET`
- Path: `/tare_kg/{containerNumber}`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/tare_kg/{containerNumber}`
- Purpose: return only the tare-weight view for a container
- Authentication: Bearer token
- Documented path parameter:
  - `containerNumber` - required string container number
- Documented responses:
  - `200`
  - `400 Invalid Input`
  - `401 Insufficient Permissions`
  - `500 Internal Server Error`

## 7) Get only the max gross mass of a container
- Method: `GET`
- Path: `/max_gross_mass_kgs/{containerNumber}`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/max_gross_mass_kgs/{containerNumber}`
- Purpose: return only the max gross weight view for a container
- Authentication: Bearer token
- Documented path parameter:
  - `containerNumber` - required string container number
- Documented responses:
  - `200 Container Technical Detail`
  - `400 Invalid Input`
  - `401 Insufficient Permissions`
  - `500 Internal Server Error`

## 8) Identify an ISO size or group type code
- Method: `GET`
- Path: `/iso/size_type_code/{sizeTypeCode}`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/iso/size_type_code/{sizeTypeCode}`
- Purpose: look up an ISO size / type code definition
- Authentication: Bearer token
- Documented path parameter:
  - `sizeTypeCode` - required string ISO size/type code
- Documented responses:
  - `200 ISO Size Type Code Detail`
  - `400 Invalid Size Type Code`
  - `401 Insufficient Permissions`
  - `500 Internal Server Error`

## 9) Set an alert against a container
- Method: `POST`
- Path: `/alert`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/alert`
- Purpose: attach an alert to a container in your fleet
- Authentication: Bearer token
- Request body format: `application/json`
- Documented request-body fields:
  - `container_number` - required full container number
  - `type` - required alert type enum: `SOLD`, `SCRAPPED`, `LOST`, `STOLEN`
  - `message` - optional free-text details
- Documented responses:
  - `200 Successful Request`
  - `400 Invalid Request`
  - `401 Insufficient Permissions`
  - `500 Internal Server Error`

## 10) Remove an alert from a container
- Method: `DELETE`
- Path: `/alert/{containerNumber}/{alertType}`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/alert/{containerNumber}/{alertType}`
- Purpose: remove a specific alert from a fleet container
- Authentication: Bearer token
- Documented path parameters:
  - `containerNumber` - required string container number
  - `alertType` - required enum: `SOLD`, `SCRAPPED`, `LOST`, `STOLEN`
- Documented responses:
  - `200 Successful Request`
  - `400 Invalid Request`
  - `401 Insufficient Permissions`
  - `500 Internal Server Error`

## 11) Collect all uploaded files
- Method: `GET`
- Path: `/uploads`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/uploads`
- Purpose: list uploaded CSV-file records
- Authentication: Bearer token
- Documented response object fields in each upload item can include:
  - `uploadId`
  - `uploaderName`
  - `uploadAction`
  - `uploadDatetime`
  - `uploadError`
  - `uploadInserted`
  - `uploadStatus`
- Documented responses:
  - `200 Successfully retrieved the list of uploaded CSV files`
  - `401 Insufficient Permissions`
  - `500 Internal Server Error`

## 12) Collect pre-signed URL for upload
- Method: `GET`
- Path: `/uploads/{uploadId}`
- Full URL: `https://app.bic-boxtech.org/api/v2.0/uploads/{uploadId}`
- Purpose: retrieve a pre-signed upload URL for a specific upload record
- Authentication: Bearer token
- Documented parameters:
  - `uploadId` - required path string / UUID
  - `fileType` - optional query string parameter
- Documented responses:
  - `200 Pre-signed Url for Upload`
  - `401 Insufficient Permissions`
  - `500 Internal Server Error`

## Sources inspected
- `https://docs.bic-boxtech.org/`
- `https://docs.bic-boxtech.org/api/bic-global-container-database`
- `https://docs.bic-boxtech.org/boxtech-api-v2.json`
