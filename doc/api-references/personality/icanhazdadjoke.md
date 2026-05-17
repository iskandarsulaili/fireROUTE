# icanhazdadjoke

## Provider metadata
- Category: `Personality`
- Provider slug: `icanhazdadjoke`
- Docs used manually:
  - `https://icanhazdadjoke.com/api`
- Confirmed base URL: `https://icanhazdadjoke.com`
- Primary media types: `application/json`, `text/plain`, `text/html`, plus PNG image output for the image route
- Authentication: none
- Manually confirmed routes in this pass: `6`

## Authentication
From the official API page:
- no authentication is required
- the provider asks API consumers to send a custom `User-Agent` header for all requests
- the recommended `User-Agent` should identify the app/library and include a contact URL or email

## Common request/response conventions
- Base URL: `https://icanhazdadjoke.com`
- the same browser URLs double as API URLs
- response format is selected primarily via the `Accept` header
- accepted `Accept` values explicitly documented:
  - `text/html` - HTML response, documented as the default browser format
  - `application/json` - JSON response
  - `text/plain` - plain-text response
- the docs explicitly note that `curl` requests without an `Accept` header default to `text/plain`
- successful JSON joke responses include:
  - `id`
  - `joke`
  - `status`
- search responses use a paginated JSON envelope rather than a single joke object

## Manually confirmed endpoint set

### 1) Fetch a random dad joke
- Method: `GET`
- Path: `/`
- Full URL: `https://icanhazdadjoke.com/`
- Purpose: return one random dad joke
- Request headers confirmed on the official page:
  - `Accept: application/json` for JSON
  - `Accept: text/plain` for plain text
  - `User-Agent: <custom app identifier>` recommended
- JSON response fields shown in the official example:
  - `id`
  - `joke`
  - `status`
- Important usage notes from the official page:
  - the same route can return HTML, JSON, or plain text depending on `Accept`
  - the page shows both JSON and text examples for this route

### 2) Fetch a random dad joke formatted for Slack
- Method: `GET`
- Path: `/slack`
- Full URL: `https://icanhazdadjoke.com/slack`
- Purpose: return one random dad joke wrapped as a Slack message payload
- Response format note from the official page:
  - this endpoint only returns JSON
- JSON response fields shown in the official example:
  - `attachments[].fallback`
  - `attachments[].footer`
  - `attachments[].text`
  - `response_type`
  - `username`
- Important usage notes from the official page:
  - this route is used by the official icanhazdadjoke Slack app
  - third parties may call it directly when they need Slack-formatted output

### 3) Fetch a specific dad joke
- Method: `GET`
- Path: `/j/{joke_id}`
- Full URL pattern: `https://icanhazdadjoke.com/j/{joke_id}`
- Purpose: return one known joke by ID
- Path parameter confirmed on the official page:
  - `joke_id` - the dad joke identifier, shown in examples like `R7UfaahVfFd`
- Request headers confirmed on the official page:
  - `Accept: application/json` for JSON
  - `Accept: text/plain` for plain text
  - custom `User-Agent` recommended globally
- JSON response fields shown in the official example:
  - `id`
  - `joke`
  - `status`
- Important usage notes from the official page:
  - this route follows the same content-negotiation pattern as the random-joke route
  - the text example returns only the joke line, not a JSON envelope

### 4) Fetch a specific dad joke as an image
- Method: `GET`
- Path: `/j/{joke_id}.png`
- Full URL pattern: `https://icanhazdadjoke.com/j/{joke_id}.png`
- Purpose: render a joke as a PNG image
- Path parameter confirmed on the official page:
  - `joke_id` - joke identifier used in the filename stem
- Response format note from the official page:
  - returns an image instead of JSON/text
- Important usage notes from the official page:
  - the docs show this as a direct embeddable image URL
  - the page demonstrates usage with an HTML `<img>` tag

### 5) Search for dad jokes
- Method: `GET`
- Path: `/search`
- Full URL: `https://icanhazdadjoke.com/search`
- Purpose: list jokes, optionally filtered by a search term
- Query parameters confirmed on the official page:
  - `page` - which page of results to fetch; default `1`
  - `limit` - number of results per page; default `20`, maximum `30`
  - `term` - search term; defaults to listing all jokes
- JSON response fields shown in the official example:
  - `current_page`
  - `limit`
  - `next_page`
  - `previous_page`
  - `results[].id`
  - `results[].joke`
  - `search_term`
  - `status`
  - `total_jokes`
  - `total_pages`
- Important usage notes from the official page:
  - the route can also return `text/plain`
  - the plain-text response is a newline-delimited joke list rather than a JSON envelope

### 6) GraphQL query endpoint
- Method: `POST`
- Path: `/graphql`
- Full URL: `https://icanhazdadjoke.com/graphql`
- Purpose: query joke data through GraphQL
- Request headers confirmed on the official page:
  - `Content-Type: application/json`
- Request body shape shown in the official example:
  - `query` - GraphQL query string
- Schema elements explicitly shown on the official page:
  - root type `Query`
  - field `joke(query: String): Joke`
  - `Joke.id`
  - `Joke.joke`
  - `Joke.permalink`
- Response structure shown in the official example:
  - `data.joke.id`
  - `data.joke.joke`
  - `data.joke.permalink`
- Important usage notes from the official page:
  - the route is documented separately from the REST-style endpoints
  - the page points readers to GraphQL-over-HTTP conventions for access details

## Pagination
- only `/search` is documented as paginated
- `/search` uses page-number pagination via `page`
- `/search` response includes `current_page`, `next_page`, `previous_page`, and `total_pages`
- page size is controlled by `limit` with a documented maximum of `30`

## Rate limits
- the reviewed official API page did not publish numeric rate limits
- the strongest operational guidance on the reviewed page is the request to send a custom `User-Agent`

## Error and response notes
- the official page documents success examples only
- no dedicated error-schema table or status-code matrix was published on the reviewed page
- JSON success payloads consistently include a `status` field in the examples
- image responses for `/j/{joke_id}.png` are rendered rather than wrapped in JSON

## Important usage notes
- content negotiation is central to this API; callers should not assume JSON unless they set `Accept: application/json`
- the API page explicitly says all endpoints follow their corresponding browser URLs
- the GraphQL route is an additional API surface rather than a replacement for the REST-like endpoints
- Slack formatting is exposed as a separate endpoint rather than a query option on the random-joke route

## Verification notes
This file was manually rebuilt from the official icanhazdadjoke API page using browser inspection.