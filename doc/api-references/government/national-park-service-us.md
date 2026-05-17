# National Park Service, US

## Provider metadata
- Category: `Government`
- Provider slug: `national-park-service-us`
- Official docs/pages used:
  - `https://www.nps.gov/subjects/developer/`
  - `https://www.nps.gov/subjects/developer/get-started.htm`
  - `https://www.nps.gov/subjects/developer/guides.htm`
  - `https://www.nps.gov/subjects/developer/api-documentation.htm`
  - `https://www.nps.gov/subjects/developer/customcf/swagger.json?03142019`
- Current public API base URL: `https://developer.nps.gov/api/v1`
- Auth model: API key required; official guides document `X-Api-Key` header, `api_key` query parameter, and the interactive docs also use API-key authorization
- Response format: JSON
- Default rate limit: `1,000 requests per hour` per API key
- Manually confirmed route count: `29`

## Authentication
The official guides page says every NPS API request must include an API key.

Documented ways to pass the key:
1. HTTP header: `X-Api-Key`
2. Query parameter: `api_key`

Official examples:
```bash
curl -H 'X-Api-Key: INSERT-API-KEY-HERE' 'https://developer.nps.gov/api/v1/parks?parkCode=acad'
```

```bash
curl 'https://developer.nps.gov/api/v1/parks?parkCode=acad&api_key=INSERT-API-KEY-HERE'
```

The published Swagger JSON also defines an `api_key` security definition with `in: query`.

## Rate limiting
From the official API guides:
- Default limit: `1,000 requests per hour`
- Limits apply across all `developer.nps.gov` API requests for the key
- Rate windows reset on a rolling hourly basis
- Exceeding the limit temporarily blocks the key until the hour window rolls forward
- The docs explicitly mention `429 Too Many Requests` for rate-limit violations

Headers documented for usage inspection:
- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`

## Canonical endpoints
All manually confirmed operations in the official Swagger are `GET` routes.

### Activities and topics
1. `GET /activities`
2. `GET /activities/parks`
3. `GET /thingstodo`
4. `GET /topics`
5. `GET /topics/parks`

### Park content and visitor information
6. `GET /parks`
7. `GET /alerts`
8. `GET /articles`
9. `GET /campgrounds`
10. `GET /events`
11. `GET /feespasses`
12. `GET /lessonplans`
13. `GET /newsreleases`
14. `GET /parkinglots`
15. `GET /passportstamplocations`
16. `GET /people`
17. `GET /places`
18. `GET /roadevents`
19. `GET /tours`
20. `GET /visitorcenters`
21. `GET /webcams`

### Amenities
22. `GET /amenities`
23. `GET /amenities/parksplaces`
24. `GET /amenities/parksvisitorcenters`

### Multimedia
25. `GET /multimedia/audio`
26. `GET /multimedia/galleries`
27. `GET /multimedia/galleries/assets`
28. `GET /multimedia/videos`

### Map data
29. `GET /mapdata/parkboundaries/{sitecode}`

## Parameter notes
### Common query parameters reused across many collection endpoints
The Swagger repeatedly documents these list/search parameters:
- `parkCode` - park code filter; often modeled as an array for multi-park filtering
- `stateCode` - state filter; commonly array-typed
- `q` - free-text query string
- `limit` - page size / result limit
- `start` - starting offset / record position
- `sort` - sort option on endpoints that expose sorting

### Frequently reused identity filters
- `id` - resource identifier on routes such as `/activities`, `/amenities`, `/events`, `/multimedia/galleries/assets`, `/thingstodo`, `/topics`, `/tours`, and `/webcams`
- `parkCode` - present on most park-related resources
- `stateCode` / `statecode` - state filter; the swagger contains both spellings depending on route

### Endpoint-specific parameters explicitly present in the Swagger
#### Events
`GET /events` supports additional filters:
- `organization`
- `subject`
- `portal`
- `tagsAll`
- `tagsOne`
- `tagsNone`
- `dateStart`
- `dateEnd`
- `eventType`
- `pageSize`
- `pageNumber`
- `expandRecurring`

#### Map boundaries
`GET /mapdata/parkboundaries/{sitecode}` requires:
- `sitecode` - path parameter

#### Multimedia galleries assets
`GET /multimedia/galleries/assets` additionally supports:
- `galleryId`

#### Road events
`GET /roadevents` supports:
- `parkCode`
- `type`

## Response and schema notes
The official Swagger JSON publishes named schemas/definitions for the resource families returned by the API, including:
- `Activity`
- `ActivityPark`
- `Alert`
- `Amenities`
- `AmenitiesParksPlaces`
- `AmenitiesParksVisitorCenters`
- `Article`
- `Campground`
- `Event`
- `FeesPasses`
- `LessonPlan`
- `MapdataParkboundary`
- `MultimediaAudio`
- `MultimediaGalleries`
- `MultimediaGalleriesAssets`
- `MultimediaVideos`
- `NewsRelease`
- `Parkinglot`
- `Park`
- `Passportstamplocations`
- `People`
- `Place`
- `RoadEvent`
- `ThingToDo`
- `Topic`
- `TopicPark`
- `Tour`
- `VisitorCenter`
- `Webcam`

The 200-response schemas in the published Swagger are array responses for the documented collection endpoints. Examples confirmed directly from the spec include:
- `/parks` -> array of `Park`
- `/events` -> array of `Event`
- `/mapdata/parkboundaries/{sitecode}` -> array of `MapdataParkboundary`

## Pagination notes
Two pagination styles are present in the official Swagger:
- Most list endpoints use `limit` + `start`
- `GET /events` uses `pageSize` + `pageNumber`

## Error notes
- The API guides explicitly document `429 Too Many Requests` for rate-limit breaches.
- The pages reviewed do not publish a single centralized shared table of auth/validation error codes comparable to the `api.data.gov` gateway manual.

## Usage notes
- The developer landing page describes the API as authoritative NPS data about parks, facilities, events, news, alerts, articles, people, places, multimedia, and related resources.
- The interactive documentation and the raw Swagger JSON are the canonical route inventory sources for this provider.
- The docs use both array-valued and string-valued filters depending on endpoint; downstream normalization should preserve the endpoint-specific parameter typing from the Swagger.

## fireROUTE normalization notes
- Normalize this provider as a read-only API suite of park-content collections plus one path-parameterized map-boundary route.
- Preserve the two pagination patterns (`limit`/`start` and `pageSize`/`pageNumber`) because the events endpoint differs from the rest of the catalog.
- Treat `parkCode` and `stateCode` as the primary cross-resource join/filter keys for consumer integrations.
