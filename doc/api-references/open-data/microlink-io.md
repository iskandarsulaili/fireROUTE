# Microlink.io

## Provider metadata
- Category: `Open Data`
- Provider slug: `microlink-io`
- Description: `Extract structured data from any website`
- Official docs/pages used:
  - `https://microlink.io/`
  - `https://microlink.io/docs/api/getting-started/overview`
  - `https://microlink.io/docs/api/getting-started/data-fields`
  - `https://microlink.io/docs/api/basics/endpoint`
  - `https://microlink.io/docs/api/basics/authentication`
  - `https://microlink.io/docs/api/basics/rate-limit`
  - `https://microlink.io/docs/api/basics/error-codes`
- Confirmed API base URLs:
  - Free endpoint: `https://api.microlink.io`
  - Pro endpoint: `https://pro.microlink.io`
- Auth model:
  - Free endpoint: no authentication
  - Pro endpoint: `x-api-key: <YOUR_API_TOKEN>` header
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON responses with top-level `status` plus `data` on success; error payloads with `id`, `code`, `message`, `more`, and `report`
- Rate limits officially documented on the reviewed pages:
  - Free endpoint: soft limit of `50` requests
  - Pro endpoint: quota depends on the purchased plan and starts from `14,000` requests
  - Quota exhaustion returns HTTP `429`
  - Free-endpoint responses expose `x-rate-limit-limit`, `x-rate-limit-remaining`, and `x-rate-limit-reset`
- Manually confirmed route count: `1`

## API shape and behavior
- The official Microlink docs describe one HTTP interface: send a `GET` request to the API root with a target `url` and optional feature parameters.
- The same route powers metadata extraction, screenshots, PDFs, embeds, browser automation, technology detection, palette extraction, and other workflows by toggling query parameters.
- Host selection changes entitlement and quota behavior:
  - `api.microlink.io` for unauthenticated/free usage.
  - `pro.microlink.io` for authenticated paid usage.

## Canonical endpoint
1. `GET /`
   - Query Microlink with a target `url` and optional query parameters.
   - Official examples call it as `https://api.microlink.io?url=https://github.com/microlinkhq`.
   - The same path is documented for both the free and pro hosts.

## Core parameters and query conventions

### Required parameter
- `url` - target URL to inspect/render.

### Important optional parameters explicitly exposed in the official docs navigation
- Output/data controls: `data`, `meta`, `modules`, `format`, `filter`, `embed`, `mediaType`, `palette`
- Rendering controls: `screenshot`, `pdf`, `width`, `height`, `landscape`, `margin`, `pageRanges`, `scale`, `type`, `fullPage`, `element`, `overlay`, `omitBackground`
- Browser behavior controls: `adblock`, `animations`, `audio`, `click`, `device`, `headers`, `iframe`, `javascript`, `ping`, `prerender`, `proxy`, `retry`, `scripts`, `scroll`, `styles`, `timeout`, `waitForSelector`, `waitForTimeout`, `waitUntil`, `viewport`
- Caching and freshness controls: `ttl`, `staleTtl`, `force`
- Insight modules exposed in the docs: `insights`, `lighthouse`, `technologies`
- Miscellaneous documented parameters: `colorScheme`, `codeScheme`, `filename`, `function`, `video`

## Response notes
- The overview page shows successful responses as JSON with:
  - `status`
  - `data`
- The documented default `data` fields include `author`, `date`, `description`, `image`, `video`, `lang`, `logo`, `publisher`, `title`, and `url`.
- The docs present Microlink as an extraction-and-rendering envelope: optional parameters extend the returned payload rather than changing the HTTP method or path.
- No pagination model is documented on the reviewed official pages.

## Error notes
- The official error page says any response whose status is different from `success` is treated as an error state.
- Error payloads include `id`, `code`, `message`, `more`, and `report`.
- The reviewed error reference explicitly includes examples such as:
  - `EAUTH` - invalid API key
  - `EBRWSRTIMEOUT` - browser navigation timeout reached
- The rate-limit page says quota exhaustion produces HTTP `429`.

## Usage notes
- The endpoint page explicitly says to use HTTP `GET`, nothing else.
- The free and pro hosts expose the same route shape; the difference is auth/quota/plan level.
- The homepage and docs position screenshots, PDFs, metadata extraction, and insights as parameter-driven capabilities of the same API rather than separate endpoint trees.
- If you need authenticated/pro behavior, attach the API token as `x-api-key`; the docs do not document query-string auth for the raw HTTP API.

## fireROUTE normalization notes
- Treat Microlink as one route family with two documented base hosts.
- Preserve the target-site URL as the required query argument rather than attempting to map it into a path variable.
- Preserve parameter passthrough because the official docs expose a large and growing parameter surface on the same `GET /` endpoint.
- Treat screenshots/PDF/insights as parameterized modes, not separate hardcoded routes.
