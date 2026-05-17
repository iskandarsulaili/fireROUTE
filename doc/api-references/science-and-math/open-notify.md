# Open Notify

## Provider metadata
- Category: `Science & Math`
- Provider slug: `open-notify`
- Description: `ISS astronauts, current location, etc`
- Official docs/pages used:
  - `http://open-notify.org/Open-Notify-API/` (official API overview)
  - `http://open-notify.org/Open-Notify-API/ISS-Location-Now/` (official ISS current-location reference)
  - `http://open-notify.org/Open-Notify-API/People-In-Space/` (official people-in-space reference)
- Current public API base URL: `http://api.open-notify.org`
- Auth model: no authentication documented on the reviewed official pages
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON by default; JSONP when the optional `callback` query parameter is supplied
- Rate limits: no formal numeric quota is published, but the official ISS-location page says polling faster than `1 Hz` is useless and that a single client should try to poll about once every `5` seconds
- Manually confirmed route count: `2`

## Canonical endpoints
1. `GET /iss-now.json`
   - Return the current ISS latitude/longitude plus a Unix timestamp.
2. `GET /astros.json`
   - Return the current number of people in space and, when known, their names and spacecraft.

## Parameters and payload notes
### Shared query parameters
- `callback` - optional callback function name; when provided, the service returns JSONP instead of plain JSON

### Route behavior
- `GET /iss-now.json` takes no required inputs according to the official page.
- `GET /astros.json` also takes no required inputs according to the official page.

## Response notes
- `GET /iss-now.json` returns a top-level `message`, `timestamp`, and `iss_position` object.
- `iss_position` contains `latitude` and `longitude`.
- `GET /astros.json` returns a top-level `message`, `number`, and `people` array.
- Each `people` entry contains at least `name` and `craft` on the official example page.
- The official docs only show success payloads and do not publish a fuller error-schema catalog.

## Pagination and error notes
- No pagination is documented on the reviewed endpoints.
- No formal HTTP error taxonomy is documented on the reviewed pages.
- Both official examples use a success sentinel field `message: "success"` in the payload.

## Usage notes
- Preserve the `.json` suffixes; the official provider documents those as part of the public route contract.
- Treat JSONP as the same route family with an optional `callback` query parameter rather than as separate endpoints.
- The ISS location page explicitly warns against high-frequency polling because the underlying model uncertainty and one-second timestamp resolution make faster polling unhelpful.
- The people-in-space page says the dataset is manually gathered and updated by the maintainer as launches and landings occur.

## Data-source notes from the official docs
- The ISS position page says the maintainer uses published ISS tracking data and updates TLE data at least once per day.
- The people-in-space page says there is no single official source and that the maintainer updates the astronaut roster personally.

## fireROUTE normalization notes
- Preserve the base host `http://api.open-notify.org` exactly as documented.
- Normalize `iss-now` and `astros` as separate GET route families.
- Keep `callback` as an optional passthrough query parameter for JSONP consumers.