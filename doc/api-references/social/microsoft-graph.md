# Microsoft Graph

## Provider metadata
- Category: `Social`
- Provider slug: `microsoft-graph`
- Official docs pages manually reviewed in this pass:
  - `https://learn.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0`
  - `https://learn.microsoft.com/en-us/graph/use-the-api`
  - `https://learn.microsoft.com/en-us/graph/auth/auth-concepts`
  - `https://learn.microsoft.com/en-us/graph/paging`
  - `https://learn.microsoft.com/en-us/graph/throttling`
  - `https://learn.microsoft.com/en-us/graph/errors`
  - `https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-1.0`
  - `https://learn.microsoft.com/en-us/graph/api/user-get?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/api/user-list-people?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/api/message-get?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/api/calendar-get?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/api/user-list-events?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/api/event-get?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/api/user-list-calendarview?view=graph-rest-1.0&tabs=http`
  - `https://learn.microsoft.com/en-us/graph/api/event-post-attachments?view=graph-rest-1.0&tabs=http`
- Main REST API host confirmed: `https://graph.microsoft.com`
- Stable versioned base URL confirmed on the reviewed pages: `https://graph.microsoft.com/v1.0`
- Preview base URL mentioned on the reviewed pages: `https://graph.microsoft.com/beta`
- Primary transport and format: HTTPS + JSON
- Auth model confirmed on the reviewed pages: Microsoft identity platform OAuth 2.0 access tokens in the HTTP Authorization bearer-token header.
- Manually confirmed route count in this reviewed subset: `56`

## Authentication and authorization
- Microsoft Graph requires app registration plus an OAuth 2.0 access token.
- The reviewed auth pages describe both delegated access (on behalf of a signed-in user) and application access (without a user).
- The reviewed API pages repeatedly list delegated and application permissions per endpoint family.
- Requests use the standard pattern `{HTTP method} https://graph.microsoft.com/{version}/{resource}`.
- The `v1.0` endpoint is the stable production surface. `beta` exists but is preview-oriented and was not counted in the route inventory below.

## Confirmed route inventory

### Users
1. `GET /users` — list users.
2. `GET /me` — get the signed-in user.
3. `GET /users/{id | userPrincipalName}` — get a specific user.

### People
4. `GET /me/people` — list people relevant to the signed-in user.
5. `GET /users/{id | userPrincipalName}/people` — list people relevant to a specific user.

### Mail: list messages
6. `GET /me/messages` — list messages in the signed-in user's mailbox.
7. `GET /users/{id | userPrincipalName}/messages` — list messages in another user's mailbox.
8. `GET /me/mailFolders/{id}/messages` — list messages in one signed-in-user mail folder.
9. `GET /users/{id | userPrincipalName}/mailFolders/{id}/messages` — list messages in one specific mail folder for another user.

### Mail: get message and MIME content
10. `GET /me/messages/{id}` — get one message for the signed-in user.
11. `GET /users/{id | userPrincipalName}/messages/{id}` — get one message for another user.
12. `GET /me/mailFolders/{id}/messages/{id}` — get one message from a signed-in-user mail folder.
13. `GET /users/{id | userPrincipalName}/mailFolders/{id}/messages/{id}` — get one message from another user's mail folder.
14. `GET /me/messages/{id}/$value` — get MIME content for one signed-in-user message.
15. `GET /users/{id | userPrincipalName}/messages/{id}/$value` — get MIME content for one other-user message.
16. `GET /me/mailFolders/{id}/messages/{id}/$value` — get MIME content for one signed-in-user folder message.
17. `GET /users/{id | userPrincipalName}/mailFolders/{id}/messages/{id}/$value` — get MIME content for one other-user folder message.

### Calendars
18. `GET /me/calendar` — get the signed-in user's primary calendar.
19. `GET /users/{id | userPrincipalName}/calendar` — get another user's primary calendar.
20. `GET /groups/{id}/calendar` — get a Microsoft 365 group's default calendar.
21. `GET /me/calendars/{id}` — get one calendar for the signed-in user.
22. `GET /users/{id | userPrincipalName}/calendars/{id}` — get one calendar for another user.
23. `GET /me/calendarGroups/{id}/calendars/{id}` — get one signed-in-user calendar nested in a calendar group.
24. `GET /users/{id | userPrincipalName}/calendarGroups/{id}/calendars/{id}` — get one other-user grouped calendar.

### Events: list
25. `GET /me/events` — list events for the signed-in user.
26. `GET /users/{id | userPrincipalName}/events` — list events for another user.
27. `GET /me/calendar/events` — list events from the signed-in user's default calendar.
28. `GET /users/{id | userPrincipalName}/calendar/events` — list events from another user's default calendar.
29. `GET /me/calendars/{id}/events` — list events from one signed-in-user calendar.
30. `GET /users/{id | userPrincipalName}/calendars/{id}/events` — list events from one other-user calendar.
31. `GET /me/calendarGroups/{id}/calendars/{id}/events` — list events from a grouped signed-in-user calendar.
32. `GET /users/{id | userPrincipalName}/calendarGroups/{id}/calendars/{id}/events` — list events from a grouped other-user calendar.

### Events: get
33. `GET /me/events/{id}` — get one event for the signed-in user.
34. `GET /users/{id | userPrincipalName}/events/{id}` — get one event for another user.
35. `GET /groups/{id}/events/{id}` — get one group event.
36. `GET /me/calendar/events/{id}` — get one event from the signed-in user's default calendar.
37. `GET /users/{id | userPrincipalName}/calendar/events/{id}` — get one event from another user's default calendar.
38. `GET /groups/{id}/calendar/events/{id}` — get one event from a group's default calendar.
39. `GET /me/calendars/{id}/events/{id}` — get one event from a signed-in-user calendar.
40. `GET /users/{id | userPrincipalName}/calendars/{id}/events/{id}` — get one event from another user's calendar.
41. `GET /me/calendarGroups/{id}/calendars/{id}/events/{id}` — get one event from a grouped signed-in-user calendar.
42. `GET /users/{id | userPrincipalName}/calendarGroups/{id}/calendars/{id}/events/{id}` — get one event from a grouped other-user calendar.

### Calendar view
43. `GET /me/calendar/calendarView?startDateTime={start_datetime}&endDateTime={end_datetime}` — list event instances in the signed-in user's default calendar for a required time window.
44. `GET /users/{id | userPrincipalName}/calendarView?startDateTime={start_datetime}&endDateTime={end_datetime}` — list event instances for another user's primary calendar for a required time window.
45. `GET /me/calendars/{id}/calendarView?startDateTime={start_datetime}&endDateTime={end_datetime}` — list event instances for one signed-in-user calendar for a required time window.
46. `GET /users/{id | userPrincipalName}/calendars/{id}/calendarView?startDateTime={start_datetime}&endDateTime={end_datetime}` — list event instances for one other-user calendar for a required time window.
47. `GET /me/calendarGroups/{id}/calendars/{id}/calendarView?startDateTime={start_datetime}&endDateTime={end_datetime}` — list event instances for one grouped signed-in-user calendar for a required time window.
48. `GET /users/{id | userPrincipalName}/calendarGroups/{id}/calendars/{id}/calendarView?startDateTime={start_datetime}&endDateTime={end_datetime}` — list event instances for one grouped other-user calendar for a required time window.

### Event attachments
49. `POST /me/events/{id}/attachments` — add an attachment to one signed-in-user event.
50. `POST /users/{id | userPrincipalName}/events/{id}/attachments` — add an attachment to one other-user event.
51. `POST /me/calendar/events/{id}/attachments` — add an attachment to one event in the signed-in user's default calendar.
52. `POST /users/{id | userPrincipalName}/calendar/events/{id}/attachments` — add an attachment to one event in another user's default calendar.
53. `POST /me/calendars/{id}/events/{id}/attachments` — add an attachment to one event in a signed-in-user calendar.
54. `POST /users/{id | userPrincipalName}/calendars/{id}/events/{id}/attachments` — add an attachment to one event in another user's calendar.
55. `POST /me/calendarGroups/{id}/calendars/{id}/events/{id}/attachments` — add an attachment to one event in a grouped signed-in-user calendar.
56. `POST /users/{id | userPrincipalName}/calendarGroups/{id}/calendars/{id}/events/{id}/attachments` — add an attachment to one event in a grouped other-user calendar.

## Parameters, headers, and request-body notes
- Reused path placeholders confirmed on the reviewed pages:
  - `id` — resource identifier whose meaning depends on route position: user, group, mail folder, calendar, calendar group, event, or message.
  - `userPrincipalName` — allowed alternate user identifier on many `/users/...` routes.
- Confirmed query parameters and query-option families from the reviewed pages:
  - `$select` — narrow returned properties.
  - `$filter` — OData filtering.
  - `$top` — page size control.
  - `startDateTime` and `endDateTime` — required on calendar-view routes.
- Confirmed headers and request conventions:
  - `Authorization` bearer token header.
  - `Prefer: outlook.timezone="{Windows time zone name}"` for event/calendar reads that should return start and end times in a chosen time zone.
  - `Content-Type: application/json` for attachment creation.
- Confirmed request-body note for attachments:
  - The reviewed attachment page shows JSON bodies such as `{"@odata.type":"#microsoft.graph.fileAttachment","name":"menu.txt","contentBytes":"...base64..."}`.

## Pagination

- Microsoft Graph supports both server-side and client-side paging depending on the collection.
- Collection responses can return `@odata.nextLink`; the paging guidance says to follow the entire returned URL for the next request.
- The paging guidance explicitly warns not to extract or manipulate `$skip` from `@odata.nextLink`.
- The reviewed messages-list page says the default page size is `10` messages and `$top` can request from `1` to `1000`.

## Rate limits and throttling
- The throttling guidance says Microsoft Graph throttling varies by scenario; large write volumes are more likely to be throttled than ordinary reads.
- When throttling occurs, Microsoft Graph returns `429 Too Many Requests` and includes a suggested wait time in the failed response headers.
- For very large bulk extraction use cases, the official guidance points users to Microsoft Graph Data Connect instead of the REST API.

## Errors and format notes
- Microsoft Graph returns standard HTTP status codes plus a JSON error object.
- The reviewed error page explicitly lists these statuses among the documented possibilities: `400 Bad Request`, `401 Unauthorized`, `402 Payment Required`, `403 Forbidden`, `404 Not Found`, `405 Method Not Allowed`, `406 Not Acceptable`, `409 Conflict`, `410 Gone`, `411 Length Required`, and `412 Precondition Failed`.
- The reviewed error page notes that a conditional-access failure can surface as `403 Forbidden` with `error=insufficient_claims`.
- The `409 Conflict` entry specifically mentions retrying after delay for `Directory_ConcurrencyViolation`, using exponential backoff and `Retry-After` if present.

## Important usage notes
- Keep production integrations on `v1.0` unless a preview-only capability is truly required.
- Many Microsoft Graph pages document multiple resource-context path variants for the same conceptual operation; preserve those path variants instead of collapsing them into one synthetic fireROUTE alias.
- The reviewed messages-list page recommends using `$select` to reduce payload size and improve response times.
- The reviewed event pages say event bodies are currently returned only in HTML format.
- The reviewed attachment page limits newly added event attachments to under `3 MB`.
- Calendar-view requests require both `startDateTime` and `endDateTime`.
- On paged reads, replay the whole `@odata.nextLink` URL exactly as returned.