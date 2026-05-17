# Squiggle

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `squiggle`
- Official docs/pages used:
  - `https://api.squiggle.com.au/`
- Current public API base URLs:
  - Standard API: `https://api.squiggle.com.au/`
  - Event API: `https://sse.squiggle.com.au/`
- Auth model: no API key or login, but the official requirements mandate a descriptive `User-Agent` containing contact email
- Response formats:
  - Standard API: JSON (default), XML, CSV
  - Event API: Server-Sent Events (text/event-stream style payloads)
- Public rate-limit note: no numeric quota is published, but the official requirements explicitly forbid abuse, excessive repeated fetches, and large numbers of simultaneous requests
- Manually confirmed route count: `12`

## Authentication and access
- The reviewed docs describe Squiggle as currently free and open.
- The official requirements say clients must set a `User-Agent` that identifies the bot and contains a contact email.
- The docs also warn that non-compliant bots may be blocked at edge level.

## Canonical endpoints
### Standard API query families
The Standard API uses `GET /` plus a required `q` selector.

1. `GET /?q=teams` - team metadata
2. `GET /?q=games` - fixture and score data
3. `GET /?q=sources` - model/source metadata
4. `GET /?q=tips` - model tips and predictions
5. `GET /?q=standings` - actual ladder standings
6. `GET /?q=ladder` - projected ladders
7. `GET /?q=power` - model power rankings

### Event API streams
8. `GET https://sse.squiggle.com.au/games` - stream current and soon-to-start games
9. `GET https://sse.squiggle.com.au/games/{teamId}` - stream games involving one team
10. `GET https://sse.squiggle.com.au/events` - stream events from all in-progress games
11. `GET https://sse.squiggle.com.au/events/{gameId}` - stream events from one game
12. `GET https://sse.squiggle.com.au/test` - test stream with random data

## Parameters and filters
### Shared Standard API parameters
- `q` - required query type selector
- `format` - optional output format: `json` (default), `xml`, or `csv`

The docs also state that parameter exclusion can be expressed by prefixing a value with `!`.

### Standard API query-specific parameters
#### `q=teams`
- `team` - team ID
- `year` - year

#### `q=games`
- `year` - required unless `game` is supplied
- `round` - round number
- `game` - game ID
- `team` - team ID
- `complete` - percent complete filter
- `live` - whether the game is currently in progress

#### `q=sources`
- `source` - source ID

#### `q=tips`
- `year`
- `round`
- `game` - game ID
- `source` - source ID
- `team` - team ID
- `complete` - percent complete filter

#### `q=standings`
- `year`
- `round`

#### `q=ladder`
- `year`
- `round`
- `source`
- `dummy` - placeholder/not-yet-updated flag

#### `q=power`
- `year`
- `round`
- `source`
- `team`
- `dummy` - placeholder/not-yet-updated flag

### Event API path parameters
- `teamId` - team selector for `/games/{teamId}`
- `gameId` - game selector for `/events/{gameId}`

## Response, pagination, and error notes
- The Standard API returns JSON by default and can also emit XML or CSV.
- The Event API returns long-lived event streams; the docs show event names such as `games`, `addGame`, `removeGame`, `game`, `complete`, `timestr`, `score`, and `winner`.
- The docs do not publish page/offset pagination.
- The docs warn that long-lived Event API connections may occasionally restart, so clients should handle disconnect and auto-reconnect.
- A legacy HTTP fallback for low-power devices is documented at `http://api.squiggle.com.au/legacy-sse/`, but it is explicitly described as limited to one simultaneous connection and may disappear in the future.

## Usage notes from the official docs
- The docs strongly recommend supplying exact parameters instead of relying on unspecified defaults.
- The provider explicitly says not to use the Standard API like an event stream by polling the same data constantly.
- The provider also says websites should fetch data server-side rather than sending end users' browsers directly to Squiggle.
- The docs note that the Standard API now serves some data with intentional delay; for timely live game data, the Event API is the recommended interface.

## fireROUTE normalization notes
- Represent the Standard API as one root `GET /` route family with `q` as the primary operation discriminator.
- Keep `standings` and `ladder` distinct because the official docs separate actual ladder state from projected ladder output.
- Model the Event API separately from the Standard API because its transport, connection lifecycle, and usage rules are different.
- Preserve the `format` selector and the `User-Agent` requirement in downstream adapter guidance.