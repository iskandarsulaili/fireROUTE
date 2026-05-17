# Pusher Beams

## Provider metadata
- Category: `Development`
- Provider slug: `pusher-beams`
- Docs used manually:
  - `https://pusher.com/docs/beams/reference/publish-api/`
  - `https://pusher.com/docs/beams/reference/customer-api/`
  - `https://pusher.com/docs/beams/reference/device-api/`
  - `https://pusher.com/docs/beams/reference/reporting-api/`
- Confirmed REST API base URL template: `https://<YOUR_INSTANCE_ID>.pushnotifications.pusher.com`
- Primary media type: JSON request and response bodies
- Authentication models surfaced in docs:
  - server-side admin operations use `Authorization: Bearer <YOUR_SECRET_KEY>`
  - device user-association operations use `Authorization: Bearer <BEAMS_USER_JWT_TOKEN>`
  - several SDK-facing device/reporting routes document only `Content-Type: application/json`
- Manually confirmed operations in this pass: `20`

## Authentication
- Publish API requests require `Authorization: Bearer <YOUR_SECRET_KEY>`.
- Customer API delete-user requests require `Authorization: Bearer <YOUR_SECRET_KEY>`.
- Device user-association routes require `Authorization: Bearer <BEAMS_USER_JWT_TOKEN>`.
- The Device API and Reporting API are documented as SDK-facing APIs; many of those pages only require `Content-Type: application/json` in the published examples, while invalid instance credentials still appear in documented `401` responses.

## Common request/response conventions
- Base URL template: `https://<YOUR_INSTANCE_ID>.pushnotifications.pusher.com`
- Instance-specific paths repeat the instance placeholder inside the path, for example: `/publish_api/v1/instances/<YOUR_INSTANCE_ID>/...`
- Reviewed routes use `GET`, `POST`, `PUT`, and `DELETE`.
- Publish and device/reporting requests use JSON bodies.
- Error tables across the reviewed docs repeatedly reference `400`, `401`, `402`, `403`, `404`, `422`, `429`, and `500` depending on the route family.
- Publish API response bodies return JSON with `publishId`.
- Device retrieval/listing routes return JSON device objects and collections.

## Manually confirmed endpoint set

### Publish API
1. `POST /publish_api/v1/instances/<YOUR_INSTANCE_ID>/publishes/interests`
   - publish to one or more interests
   - required body field: `interests` array with `1..100` values
   - at least one of `apns`, `fcm`, or `web` payloads must be present
   - optional `webhookUrl`
   - documented publish rate limit: `429` at max `100 RPS`
   - documented body-size limit: `10 KiB`
2. `POST /publish_api/v1/instances/<YOUR_INSTANCE_ID>/publishes/users`
   - publish to one or more users
   - required body field: `users` array with `1..1000` IDs
   - at least one of `apns`, `fcm`, or `web` payloads must be present
   - documented publish rate limit: `429` at max `100 RPS`
   - documented body-size limit: `200 KiB`

### Customer API
3. `DELETE /customer_api/v1/instances/<YOUR_INSTANCE_ID>/users/<YOUR_USER_ID>`
   - delete a Beams user
   - user ID in the path must be URL-encoded
   - uses secret-key Bearer auth
   - documented rate limit: `429` at max `100 RPS`

### Device API
4. `POST /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/apns`
   - register a new APNs device
   - body fields: `token`, `bundleIdentifier`, optional `metadata`
5. `POST /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/fcm`
   - register a new FCM device
   - body fields: `token`, `bundleIdentifier`, optional `metadata`
6. `GET /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/apns/<DEVICE_ID>`
   - fetch an APNs device record
7. `GET /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/fcm/<DEVICE_ID>`
   - fetch an FCM device record
8. `DELETE /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/apns/<DEVICE_ID>`
   - delete an APNs device
9. `DELETE /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/fcm/<DEVICE_ID>`
   - delete an FCM device
10. `PUT /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/apns/<DEVICE_ID>/metadata`
    - update APNs device metadata
    - metadata fields documented: `sdkVersion`, `iosVersion`, `macosVersion`
11. `PUT /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/fcm/<DEVICE_ID>/metadata`
    - update FCM device metadata
    - metadata fields documented: `sdkVersion`, `androidVersion`
12. `PUT /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/fcm/<DEVICE_ID>/token`
    - update the FCM device token
    - body field: `token`
13. `PUT /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/apns/<DEVICE_ID>/user`
    - associate an APNs device with a Beams user
    - requires `Authorization: Bearer <BEAMS_USER_JWT_TOKEN>`
    - docs require JWT claims including `exp`, `sub`, and `iss`
14. `PUT /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/fcm/<DEVICE_ID>/user`
    - associate an FCM device with a Beams user
    - requires `Authorization: Bearer <BEAMS_USER_JWT_TOKEN>`
    - docs require JWT claims including `exp`, `sub`, and `iss`
15. `GET /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/<DEVICE_PLATFORM>/<DEVICE_ID>/interests`
    - list device interests
    - query parameters:
      - `limit` - max number of interests returned; default/max documented value `100`
      - `cursor` - cursor from the previous response
    - response metadata may include `nextCursor`
16. `PUT /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/<DEVICE_PLATFORM>/<DEVICE_ID>/interests`
    - replace the full device interest set
    - body field: `interests`
    - documented max: `5000` interests per device
17. `POST /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/<DEVICE_PLATFORM>/<DEVICE_ID>/interests/<INTEREST_NAME>`
    - add one interest to a device
18. `DELETE /device_api/v1/instances/<YOUR_INSTANCE_ID>/devices/<DEVICE_PLATFORM>/<DEVICE_ID>/interests/<INTEREST_NAME>`
    - remove one interest from a device

### Reporting API
19. `POST /reporting_api/v2/instances/<YOUR_INSTANCE_ID>/events`
    - report a notification delivery acknowledgment
    - required body fields: `event=delivery`, `publishId`, `deviceId`, `timestampSecs`
    - optional body fields: `userId`, `appInBackground`, `hasDisplayableContent`, `hasData`
20. `POST /reporting_api/v2/instances/<YOUR_INSTANCE_ID>/events`
    - report a notification open event
    - required body fields: `event=open`, `publishId`, `deviceId`, `timestampSecs`
    - optional body field: `userId`

## Pagination
- Only the reviewed device-interest listing route documents pagination.
- `GET /device_api/.../interests` supports:
  - `limit` - page size, default/max `100`
  - `cursor` - continuation cursor from a previous response
- The response metadata may include `nextCursor` when more results are available.
- The reviewed publish, customer, registration, metadata, and reporting routes do not document a pagination mechanism.

## Rate limits and quotas
- Publish API docs explicitly state `429 Too many requests` at max `100 RPS` for both publish routes.
- Customer API delete-user docs also explicitly state `429` at max `100 RPS`.
- Device-user association docs explicitly cap users at `100` devices per user when returning `422`.
- Device interest replacement docs explicitly cap each device at `5000` interests.
- The reviewed Device API and Reporting API pages do not publish a general numeric per-route rate limit beyond the explicit limits above.

## Error and response notes
Representative documented error/status behavior across the reviewed pages includes:
- `400 Bad Request`
- `401 Unauthorized`
- `402 Payment Required`
- `403 Forbidden`
- `404 Not Found`
- `422 Unprocessable Entity`
- `429 Rate Limited`
- `500 Internal Server Error`

Other notable documented validation rules include:
- publish-to-interests supports `1..100` interests per request
- publish-to-users supports `1..1000` user IDs per request
- interest names must match the documented Beams character rules and length limits
- user JWT routes validate `exp`, `sub`, and `iss`
- reporting requests require a valid instance ID plus `event`, `publishId`, `deviceId`, and `timestampSecs`

## Response format notes
- Publish routes return JSON objects containing `publishId`.
- Device registration routes return a JSON object containing device `id` and `initialInterestSet`.
- Device fetch routes return JSON device objects including `id`, `userId`, and platform-specific `metadata`.
- Device interests listing returns a JSON object containing `interests` and response metadata.
- Reporting routes treat `200 OK` as success for well-formed events.

## Important usage notes
- Pusher Beams splits its surface across distinct route families: publishing, customer cleanup, SDK-facing device management, and SDK-facing event reporting.
- The official docs repeatedly recommend using the official Android, iOS, and Web SDKs instead of calling the Device API and Reporting API directly.
- There are two different auth contexts in the reviewed materials:
  - secret-key server auth for publish/customer operations
  - Beams user JWT auth for device-to-user association
- The reporting documentation presents two logical operations on the same `POST /events` route, differentiated by the body field `event` (`delivery` vs `open`).

## Verification notes
This file was manually rebuilt from the official Pusher Beams reference pages using browser inspection.
