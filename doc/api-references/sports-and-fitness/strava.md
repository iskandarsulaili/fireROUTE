# Strava

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `strava`
- Official docs/pages used:
  - `https://strava.github.io/api/`
  - `https://strava.github.io/api/v3/oauth/`
  - `https://strava.github.io/api/v3/athlete/`
  - `https://strava.github.io/api/v3/activities/`
  - `https://strava.github.io/api/v3/clubs/`
  - `https://strava.github.io/api/v3/gear/`
  - `https://strava.github.io/api/v3/routes/`
  - `https://strava.github.io/api/v3/running_races/`
  - `https://strava.github.io/api/v3/segments/`
  - `https://strava.github.io/api/v3/efforts/`
  - `https://strava.github.io/api/v3/streams/`
  - `https://strava.github.io/api/v3/uploads/`
  - `https://strava.github.io/api/v3/events/`
- Current REST API base URL: `https://www.strava.com/api/v3`
- OAuth base URL: `https://www.strava.com/oauth`
- Webhook subscription base URL: `https://api.strava.com/api/v3`
- Auth model: OAuth2 access tokens for REST calls; the docs allow Bearer auth in the `Authorization` header and also mention `access_token` in the query string or POST/PUT body. OAuth and webhook-subscription creation/list/delete use `client_id` and `client_secret`.
- Response format: JSON; the summary page also documents optional JSONP callback responses.
- Public rate-limit note: the summary page says the default application limit is `600` requests every `15` minutes and `30,000` requests per day, reported in `X-RateLimit-Limit` and `X-RateLimit-Usage` response headers.
- Manually confirmed route count: `46`

## Canonical endpoints

### OAuth and auth lifecycle
1. `GET /oauth/authorize` - start the OAuth authorization flow.
2. `POST /oauth/token` - exchange an authorization code for an access token.
3. `POST /oauth/deauthorize` - revoke the current athlete/application token pair.

### Athlete endpoints
4. `GET /api/v3/athlete` - fetch the authenticated athlete profile.
5. `PUT /api/v3/athlete` - update the authenticated athlete profile.
6. `GET /api/v3/athlete/zones` - fetch the authenticated athlete's heart-rate and pace zones.
7. `GET /api/v3/athletes/:id/stats` - fetch stats for one athlete.
8. `GET /api/v3/athletes/:id/koms` - fetch one athlete's KOM/QOM efforts.

### Activity endpoints
9. `POST /api/v3/activities` - create an activity manually.
10. `GET /api/v3/activities/:id` - fetch one activity.
11. `PUT /api/v3/activities/:id` - update one activity.
12. `GET /api/v3/athlete/activities` - list the authenticated athlete's activities.
13. `GET /api/v3/activities/:id/zones` - fetch activity zones.
14. `GET /api/v3/activities/:id/laps` - fetch activity laps.

### Club endpoints
15. `GET /api/v3/clubs/:id` - fetch one club.
16. `GET /api/v3/athlete/clubs` - list clubs for the authenticated athlete.
17. `GET /api/v3/clubs/:id/members` - list club members.
18. `PUT /api/v3/clubs/:club_id/members/:athlete_id` - approve or manage a club membership relationship documented on the club page.
19. `DELETE /api/v3/clubs/:club_id/members/:athlete_id` - remove a club membership relationship.
20. `GET /api/v3/clubs/:id/admins` - list club admins.
21. `PUT /api/v3/clubs/:club_id/admins/:athlete_id` - grant or manage a club admin relationship.
22. `DELETE /api/v3/clubs/:club_id/admins/:athlete_id` - remove a club admin relationship.
23. `GET /api/v3/clubs/:id/activities` - list a club feed of activities.
24. `POST /api/v3/clubs/:id/join` - request to join a club.
25. `POST /api/v3/clubs/:id/leave` - leave a club.

### Gear and route endpoints
26. `GET /api/v3/gear/:ids` - fetch gear details.
27. `GET /api/v3/routes/:route_id` - fetch one route.
28. `GET /api/v3/athletes/routes` - list routes for the authenticated athlete.

### Running-race endpoints
29. `GET /api/v3/running_races/:year` - list race resources for a year.
30. `GET /api/v3/running_races/:id` - fetch one running race.

### Segment and effort endpoints
31. `GET /api/v3/segments/:id` - fetch one segment.
32. `GET /api/v3/segments/starred` - list starred segments for the authenticated athlete.
33. `PUT /api/v3/segments/:id/starred` - star or unstar a segment.
34. `GET /api/v3/segments/:id/all_efforts` - list all efforts for a segment.
35. `GET /api/v3/segments/:id/leaderboard` - fetch the segment leaderboard.
36. `GET /api/v3/segments/explore` - explore segments inside a bounding box.
37. `GET /api/v3/segment_efforts/:id` - fetch one segment effort.

### Stream endpoints
38. `GET /api/v3/activities/:id/streams/:types` - fetch one activity's streams.
39. `GET /api/v3/segment_efforts/:id/streams/:types` - fetch streams for one segment effort.
40. `GET /api/v3/segments/:id/streams/:types` - fetch streams for one segment.
41. `GET /api/v3/routes/:id/streams` - fetch route streams.

### Upload endpoints
42. `POST /api/v3/uploads` - create an upload.
43. `GET /api/v3/uploads/:id` - fetch upload status/details.

### Webhook endpoints
44. `POST /api/v3/push_subscriptions` - create a webhook subscription. This uses the `https://api.strava.com` host, not the normal `https://www.strava.com` host.
45. `GET /api/v3/push_subscriptions` - list webhook subscriptions for the current application.
46. `DELETE /api/v3/push_subscriptions/:id` - delete a webhook subscription.

## Parameters and filtering notes
### OAuth parameters
- `client_id`, `redirect_uri`, and `response_type=code` are required on `GET /oauth/authorize`.
- Optional authorize parameters documented by Strava are `approval_prompt`, `scope`, and `state`.
- `client_id`, `client_secret`, and `code` are required on `POST /oauth/token`.
- The docs describe access scopes `view_private` and `write`, with blank scope meaning public read-only access.

### Common path parameters
- `id` appears across athlete, activity, club, running-race, segment, segment-effort, stream, and upload resources.
- `club_id` and `athlete_id` are used on club membership/admin relationship endpoints.
- `route_id` is used on route detail endpoints.
- `year` is used on running-race list endpoints.
- `types` is used on stream endpoints to request one or more stream types.

### Pagination and list controls
- The summary page says list endpoints default to `30` items per page.
- `page` can request later pages.
- `per_page` can be set up to `200`.
- The docs recommend iterating until an empty page is returned instead of assuming the last page is full.

### Webhook parameters
- Webhook-subscription management uses `client_id` and `client_secret`.
- `object_type`, `aspect_type`, `callback_url`, and `verify_token` are required when creating a subscription.
- The webhook docs say the request body must be URL-encoded form data rather than JSON.

### Other documented request controls
- `callback` requests a JSONP wrapper.
- `access_token` can be supplied in the query string or POST/PUT body, though the docs also show the safer Bearer-header approach.

## Authentication and access notes
- All REST calls require an access token tied to both an application and an athlete.
- The summary page says segment and segment-leaderboard data is available to all applications, while most athlete-specific data requires user authorization.
- Applications are created at `labs.strava.com/developers` according to the docs.
- The webhook API is only available to select applications and requires contacting Strava for access.

## Response, pagination, and error notes
- Strava documents `meta`, `summary`, and `detailed` resource representations, identified by `resource_state` values `1`, `2`, and `3`.
- Rate-limit breaches return `403 Forbidden` with a JSON error body containing `message` and `errors` entries.
- Revoked or invalid tokens should be treated as `401 Unauthorized` according to the OAuth docs.
- The docs explicitly document JSONP callback responses for compatible clients.
- Webhook deliveries must be acknowledged with HTTP `200` within `2` seconds or Strava retries up to `3` times.

## Usage notes from the official docs
- The REST API host is `https://www.strava.com/api`, but webhook subscription management intentionally uses `https://api.strava.com/` instead.
- OAuth callbacks must use the configured callback domain or a subdomain; `localhost` and `127.0.0.1` are specifically allowed for development.
- Google Sign-In does not work inside mobile webviews according to the OAuth page.
- Stream and polyline data are documented as encoded route/track representations rather than separate binary downloads.

## fireROUTE normalization notes
- Model Strava as an OAuth-protected athlete/activity platform, not as a public no-auth sports feed.
- Keep the REST host and the webhook host separate in any adapter.
- Preserve pagination controls (`page`, `per_page`) and representation behavior because downstream callers may need to page until empty.
- Preserve webhook verification behavior (`hub.challenge`, `verify_token`) exactly as documented.