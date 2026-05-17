# Football (Soccer) Videos

## Provider metadata
- Category: `Sports & Fitness`
- Provider slug: `football-soccer-videos`
- Official docs/pages used:
  - `https://www.scorebat.com/video-api/docs/`
  - `https://www.scorebat.com/video-api/access/`
- Current public API base URL: `https://www.scorebat.com/video-api/v3`
- Auth model: access token passed as a query parameter
- Required auth parameter from the reviewed docs: `token`
- Response format: JSON
- Public rate-limit note from the reviewed docs:
  - Starter plan: `5,000` requests/month
  - Standard plan: `20,000` requests/month
  - Advanced plan: `100,000` requests/month
  - If the monthly request limit is exceeded, the account automatically falls back to the Free plan until the next billing period
- Manually confirmed route count: `6`

## Authentication and access
- The official docs say every request must include an API access token in the request URL as the `token` parameter.
- The docs direct users to the access page to obtain their token.
- The Free Feed is described as a limited preview, while richer coverage is available on paid plans.

## Canonical endpoints
1. `GET /free-feed/` - limited free preview feed of highlight videos
2. `GET /featured-feed/` - curated paid-plan feed of recent and important matches
3. `GET /competition/{competitionId}/` - latest videos for one competition
4. `GET /team/{teamId}/` - latest videos for one team
5. `GET /live-streams/` - matches with official live streams or stream replays
6. `GET /updated-endpoints/` - list recently updated competition/team feeds so clients do not have to poll everything

## Parameters and path notes
### Path parameters
- `competitionId` - competition slug used by ScoreBat, for example `england-premier-league`
- `teamId` - team slug used by ScoreBat, for example `real-madrid`

### Query parameters
- `token` - required access token on every API request

## Response, pagination, and error notes
- The docs say responses are JSON objects with a top-level `response` array.
- Match objects in the published response example include fields such as `title`, `competition`, `matchviewUrl`, `competitionUrl`, `thumbnail`, `date`, `homeTeam`, `awayTeam`, and `videos`.
- Each video object includes fields such as `title`, `embed`, and `id`.
- The reviewed docs do not publish page-number, cursor, or offset pagination.
- The reviewed docs do not publish a formal shared error-schema section.

## Usage notes from the official docs
- `free-feed` is explicitly described as a limited subset for testing and preview use.
- `featured-feed` is curated rather than exhaustive; the docs tell users to call the competition or team routes for complete coverage of a specific league or club.
- `live-streams` only includes matches with official embeddable streams and begins surfacing entries roughly five minutes before kickoff.
- `updated-endpoints` exists specifically to help clients detect which competition/team feeds changed recently.
- For mobile apps, the docs suggest extracting the video URL from the returned embed HTML and rendering it in a webview.

## fireROUTE normalization notes
- Normalize this provider as a token-in-query football video feed rooted at `https://www.scorebat.com/video-api/v3`.
- Preserve separate operations for free preview, curated featured feed, competition feed, team feed, live streams, and update discovery.
- Treat the returned `embed` HTML as provider payload, not as something fireROUTE should sanitize into a new schema without preserving the raw value.
- Do not infer undocumented search, pagination, or mutation routes beyond the six paths published on the official docs pages.