# PhishStats

## Provider metadata
- Category: `Security`
- Provider slug: `phishstats`
- Docs used manually:
  - `https://phishstats.info/`
  - attempted official docs page from the site navigation: `https://phishstats.info:2096/docs`
  - attempted official API endpoint page linked from the homepage: `https://phishstats.info:2096/api/phishing`
- Confirmed base URLs:
  - homepage confirms there is a JSON phishing-feed API, but the route-level docs host behind port `2096` timed out during this pass
- Primary response/content types confirmed from the docs: JSON is advertised on the homepage, but route-level schemas were blocked
- Authentication model confirmed from the docs used in this pass: none for read-only access according to the official FAQ/homepage copy
- Manually confirmed routes in this pass: `0`

## Authentication
- The homepage FAQ text states the service provides verified phishing URLs, IPs, domains, and threat scores through both the web search interface and a JSON REST API, with `no signup required for read-only access`.
- Because the route-level docs host timed out, no header/query auth contract beyond that statement could be verified in this pass.

## What the official site confirms
From the reachable official homepage and FAQ content:
- PhishStats is a phishing database and real-time phishing feed.
- The database is updated every `90 minutes`.
- The homepage describes the API as a JSON-formatted phishing feed.
- The homepage says the search interface supports filtering by URL, IP, country, ASN, date range, and more.
- The FAQ states users can make up to `20 requests per minute` on the public API.
- The FAQ says higher limits are available through a custom plan.
- The FAQ states the `phishscore` is calculated using `22` different features and machine-learning algorithms.
- Support contact on the official homepage/FAQ text: `contact@phishstats.info`

## Blocker details
I attempted both of the official route-level surfaces linked or implied by the official site:
- `https://phishstats.info:2096/docs`
- `https://phishstats.info:2096/api/phishing`

Both returned Cloudflare `522 Connection timed out` pages in this browser session, with Cloudflare reporting the browser edge as working but the `phishstats.info` host as erroring. Because of that blocker, I could not responsibly confirm:
- the live base hostname/port contract beyond the fact that the homepage links to a port-`2096` API surface
- exact endpoint paths, methods, parameters, or response schemas from the official route docs

## Pagination
- Not manually confirmed in this pass because the official route-level docs were unavailable.
- The homepage/FAQ does say the API docs contain filtering, sorting, and pagination examples, but the docs page itself timed out.

## Rate limits
- Official FAQ text on the homepage says: `Users can make up to 20 requests per minute.`
- The FAQ also says custom plans are available for higher limits.

## Error handling
- Route-level error schemas were not manually confirmable because the official docs/API pages timed out with Cloudflare `522` responses.
- The only directly observed error behavior in this pass was the docs/API-host timeout itself.

## Response format notes
- The homepage markets the feed as `JSON-formatted threat intelligence` / `JSON REST API`.
- No route-level sample payload could be verified in this pass due the timeout blocker.

## Important usage notes
- The homepage recommends checking for updates no more frequently than the `90-minute` refresh cadence.
- The public site advertises search/filtering by URL, IP, country, ASN, and date range.
- Until the official docs host is reachable again, fireROUTE should treat this provider as blocked for high-confidence adapter work.

## Verification notes
This file was manually rebuilt from the reachable official homepage plus two attempted official route-level pages. Because both official docs/API pages timed out with Cloudflare `522` errors, this provider remains blocked for route-level documentation in this pass.