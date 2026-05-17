# Google Calendar

## Provider metadata
- Category: `Calendar`
- Provider slug: `google-calendar`
- Docs used manually:
  - `https://developers.google.com/workspace/calendar/api/v3/reference`
  - `https://developers.google.com/workspace/calendar/api/v3/reference/calendars/get`
  - `https://developers.google.com/workspace/calendar/api/v3/reference/calendarList/list`
  - `https://developers.google.com/workspace/calendar/api/v3/reference/events/insert`
  - `https://developers.google.com/workspace/calendar/api/v3/reference/events/list`
  - `https://developers.google.com/workspace/calendar/api/v3/reference/events/watch`
  - `https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query`
  - `https://developers.google.com/workspace/calendar/api/v3/reference/channels/stop`
  - `https://developers.google.com/workspace/calendar/api/guides/quota`
  - `https://developers.google.com/workspace/guides/auth-overview`
- Confirmed REST API base URL: `https://www.googleapis.com/calendar/v3`
- Primary media type: JSON
- Authentication model surfaced in docs: Google Workspace auth model using OAuth 2.0 / service accounts depending on data access pattern; some routes explicitly note authorization is optional while others require it
- Manually confirmed routes in this pass: `6`

## Authentication
From the official Google Workspace auth overview and Calendar method pages:
- Google Workspace APIs use API keys for public data, OAuth 2.0 client credentials for end-user delegated access, and service accounts for server-to-server use cases
- most Google Calendar data access requires OAuth 2.0 rather than an API key
- service accounts can be used with domain-wide delegation when accessing user data across a Google Workspace organization
- method pages list acceptable scopes per operation
- reviewed Calendar method pages explicitly label some methods as requiring authorization and others as allowing authorization optionally
- the official auth overview emphasizes that returned access tokens contain granted scopes and apps must respect the returned scope set

## Common request/response conventions
- Base URL: `https://www.googleapis.com/calendar/v3`
- Resource families are grouped around calendars, calendar lists, events, freebusy queries, channels, colors, ACLs, and settings.
- Successful collection responses commonly return list envelopes with items plus page/sync tokens.
- RFC3339 timestamps are required for time-bound filters such as `timeMin`, `timeMax`, and `updatedMin`.
- Push-notification watch routes create channels that are later stopped through `/channels/stop`.

## Manually confirmed endpoint set

### 1) Get calendar metadata
- Method: `GET`
- Path: `/calendars/{calendarId}`
- Full URL pattern: `https://www.googleapis.com/calendar/v3/calendars/{calendarId}`
- Purpose: return metadata for a calendar.
- Path parameters confirmed on the official page:
  - `calendarId` - calendar identifier; the docs say to use `calendarList.list` to discover IDs, or `primary` for the current user's primary calendar
- Authorization scopes confirmed on the official page:
  - `https://www.googleapis.com/auth/calendar.readonly`
  - `https://www.googleapis.com/auth/calendar`
- Response notes confirmed on the official page:
  - returns a `Calendar` resource object

### 2) List calendars visible to the user
- Method: `GET`
- Path: `/users/me/calendarList`
- Full URL: `https://www.googleapis.com/calendar/v3/users/me/calendarList`
- Purpose: return the calendars on the authenticated user's calendar list.
- Query parameters confirmed from the official method page:
  - `maxResults`
  - `minAccessRole`
  - `pageToken`
  - `showDeleted`
  - `showHidden`
  - `syncToken`
- Authorization scopes confirmed on the official page:
  - `https://www.googleapis.com/auth/calendar.calendarlist`
  - `https://www.googleapis.com/auth/calendar.calendarlist.readonly`
  - `https://www.googleapis.com/auth/calendar.readonly`
  - `https://www.googleapis.com/auth/calendar`
- Response notes confirmed on the official page:
  - returns a `CalendarList` collection with list items and paging / sync tokens

### 3) Create an event
- Method: `POST`
- Path: `/calendars/{calendarId}/events`
- Full URL pattern: `https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events`
- Purpose: create an event on a calendar.
- Path parameters confirmed on the official page:
  - `calendarId`
- Optional query parameters confirmed on the official page:
  - `conferenceDataVersion`
  - `maxAttendees`
  - `sendNotifications` (deprecated in Google Calendar docs but still surfaced on method pages)
  - `sendUpdates`
  - `supportsAttachments`
- Request body notes confirmed on the official page:
  - request body is an `Event` resource
- Authorization scopes confirmed on the official page include calendar write scopes such as:
  - `https://www.googleapis.com/auth/calendar`
  - `https://www.googleapis.com/auth/calendar.events`
  - `https://www.googleapis.com/auth/calendar.app.created`
- Response notes confirmed on the official page:
  - returns the created `Event` resource

### 4) List events on a calendar
- Method: `GET`
- Path: `/calendars/{calendarId}/events`
- Full URL pattern: `https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events`
- Purpose: list events on a specific calendar, with both filtering and incremental-sync support.
- Path parameters confirmed on the official page:
  - `calendarId`
- Query parameters confirmed on the official page:
  - `alwaysIncludeEmail` - deprecated and ignored
  - `eventTypes` - repeatable; examples include `birthday`, `default`, `focusTime`, `fromGmail`, `outOfOffice`, `workingLocation`
  - `iCalUID`
  - `maxAttendees`
  - `maxResults` - default `250`, maximum `2500`
  - `orderBy` - `startTime` or `updated`
  - `pageToken`
  - `privateExtendedProperty`
  - `q`
  - `sharedExtendedProperty`
  - `showDeleted`
  - `showHiddenInvitations`
  - `singleEvents`
  - `syncToken`
  - `timeMax`
  - `timeMin`
  - `timeZone`
  - `updatedMin`
- Incremental sync notes confirmed on the official page:
  - use `nextSyncToken` from a prior response as `syncToken`
  - if the sync token expires, the server returns `410 GONE`
  - certain filters cannot be combined with `syncToken`, including `iCalUID`, `orderBy`, `privateExtendedProperty`, `q`, `sharedExtendedProperty`, `timeMin`, `timeMax`, and `updatedMin`
- Response notes confirmed on the official page:
  - returns an events collection with `kind`, `etag`, `summary`, `description`, `updated`, `timeZone`, `accessRole`, `defaultReminders`, `items`, `nextPageToken`, and `nextSyncToken`

### 5) Query free/busy across calendars
- Method: `POST`
- Path: `/freeBusy`
- Full URL: `https://www.googleapis.com/calendar/v3/freeBusy`
- Purpose: return free/busy windows for a set of calendars.
- Request body fields confirmed on the official page:
  - `timeMin`
  - `timeMax`
  - `timeZone`
  - `groupExpansionMax`
  - `calendarExpansionMax`
  - `items[]` with calendar/group identifiers
- Authorization scopes confirmed on the official page:
  - `https://www.googleapis.com/auth/calendar.readonly`
  - `https://www.googleapis.com/auth/calendar`
  - `https://www.googleapis.com/auth/calendar.events.freebusy`
  - `https://www.googleapis.com/auth/calendar.freebusy`
- Response notes confirmed on the official page:
  - returns grouped and per-calendar busy-window data

### 6) Watch for event changes / stop a watch channel
- Methods: `POST`, `POST`
- Paths:
  - `/calendars/{calendarId}/events/watch`
  - `/channels/stop`
- Full URL patterns:
  - `https://www.googleapis.com/calendar/v3/calendars/{calendarId}/events/watch`
  - `https://www.googleapis.com/calendar/v3/channels/stop`
- Purpose:
  - create a push-notification watch on event resources
  - later stop watching the resource through the returned channel
- `events.watch` parameters confirmed on the official page:
  - path parameter `calendarId`
  - query parameters mirror event-list filtering controls such as `eventTypes`, `iCalUID`, `maxAttendees`, `maxResults`, `orderBy`, `pageToken`, `privateExtendedProperty`, `q`, `sharedExtendedProperty`, `showDeleted`, `showHiddenInvitations`, `singleEvents`, `syncToken`, `timeMax`, `timeMin`, `timeZone`, and `updatedMin`
  - request body is a `Channel` resource
- `channels.stop` request body fields confirmed on the official page:
  - `id` - unique channel identifier
  - `resourceId` - opaque watched-resource identifier
  - `token` - optional caller-defined token
- Response notes confirmed on the official page:
  - `channels.stop` returns an empty response body on success

## Pagination
From the official usage-limits page and route pages:
- list-style Calendar endpoints use tokens rather than offset pagination
- `calendarList.list` uses `pageToken` and `syncToken`
- `events.list` uses `pageToken` and `nextSyncToken`
- `events.list` defaults to `250` items and caps at `2500` per page
- incremental synchronization is first-class in the Events API; expired sync tokens return `410 GONE`

## Rate limits
From the official Calendar usage-limits page:
- as of `2026-05-01`, Google documents updated quotas for projects created on or after `2026-05-01`, while older active projects may retain earlier quota settings
- per-minute per-project quota: `10,000 requests`
- per-minute per-user per-project quota: `600 requests`
- daily billing-threshold limit: `1,000,000 requests` per project
- quotas are calculated with a sliding one-minute window
- Google recommends truncated exponential backoff for time-based quota failures
- documented responses for quota exhaustion include `403 usageLimits` and `429 usageLimits`
- Google also recommends randomizing traffic patterns and using push notifications instead of tight polling loops
- for service-account domain-wide delegation, quota can be attributed with `quotaUser` or `x-goog-quota-user`

## Error and response notes
- The usage-limits page documents `403 usageLimits` and `429 usageLimits` for quota overruns.
- The Events incremental-sync docs explicitly document `410 GONE` for expired `syncToken` values.
- Time filters must be RFC3339 timestamps with mandatory timezone offsets.
- The Calendar docs strongly recommend exponential backoff and avoiding synchronized retry waves.

## Important usage notes
- Google Calendar has both API quotas and broader product-level operational limits; staying within API quota does not guarantee that high-frequency writes to one calendar will avoid operational throttling.
- Use `primary` as the `calendarId` shortcut for a current user's primary calendar.
- Push notifications are the preferred alternative to aggressive polling and are explicitly recommended by Google in the quota docs.
- Service-account traffic can accidentally collapse into one per-user quota bucket unless `quotaUser` / `x-goog-quota-user` is set appropriately.

## Verification notes
This file was manually rebuilt from the official Google Calendar reference, usage-limit, and Google Workspace authentication pages using browser inspection.