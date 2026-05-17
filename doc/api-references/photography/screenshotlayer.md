# Screenshotlayer

## Overview
- Provider: Screenshotlayer API
- Category: Photography
- Official docs: `https://screenshotlayer.com/`
- API reference: `https://docs.apilayer.com/screenshotlayer/docs/screenshotlayer-api-v-1-0-0`
- Base URL: `https://api.screenshotlayer.com/api`
- Auth: required `access_key` query parameter; optional `secret_key` query parameter for URL-protected/publicly exposed requests and some restricted resources
- HTTPS: yes
- Response format: binary image on success (`image/png`, `image/jpeg`, `image/gif`, or `image/webp`); JSON error bodies on failure
- Pagination: none
- Rate limits: no numeric per-second/minute limits were published in the inspected docs; the docs define a `429` `rate_limit_reached` error and the marketing page states the free tier includes 100 monthly snapshots

## Confirmed endpoint

| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/capture` | required `access_key`, `url`; optional `format`, `fullpage`, `width`, `viewport`, `css_url`, `delay`, `ttl`, `force`, `placeholder`, `user_agent`, `accept_lang`, `export`, `secret_key`, `scale`, `quality` | Captures a screenshot of the target URL and returns the rendered image directly. |

Confirmed route count: **1**.

## Confirmed parameter notes

### Required
- `access_key` — API key from Screenshotlayer / APILayer
- `url` — target page URL to capture; docs say it must include protocol and should be URL-encoded when it already contains `?` or `&`

### Output and rendering controls
- `format` — `PNG` (default), `JPG`, `JPEG`, `GIF`, or `WEBP`
- `fullpage` — `1` captures the full page height; `0`/omitted keeps the normal viewport capture
- `width` — output thumbnail width in pixels; docs say aspect ratio is preserved
- `viewport` — render viewport in `WIDTHxHEIGHT` format; docs say default is `1440x900` and max is `5000x5000`
- `scale` — device-pixel-ratio style scaling; docs mention `1`, `1.5`, and `2` for Retina-style output
- `quality` — output quality level, documented as `1` to `100`, with `70` used as the default example

### Page customization and timing
- `css_url` — external CSS file to inject before rendering; docs note it must be renderer-accessible and roughly under 100 KB
- `delay` — wait time in seconds before capture; docs cap it at `20`
- `ttl` — cache lifetime in seconds; docs say minimum `300`, maximum/default `2592000` (30 days)
- `force` — `1` forces a fresh capture even when a cached result exists
- `placeholder` — `1` for the default placeholder image, or a custom placeholder image URL while the real capture is being prepared
- `user_agent` — custom outbound User-Agent header for the target site
- `accept_lang` — custom outbound `Accept-Language` header

### Export and protection
- `export` — asynchronous export target; docs support:
  - `s3://API_KEY:API_SECRET@bucket/path`
  - `ftp://user:password@server/path`
- `secret_key` — MD5-based URL-encryption value used when the API URL will be exposed publicly, such as in an `<img>` tag

## Success, errors, and format notes
- Successful responses are binary image bodies, not JSON.
- The API reference documents success content types:
  - `image/png`
  - `image/jpeg`
  - `image/gif`
  - `image/webp`
- Error responses use JSON shaped like:
  - `{ "success": false, "error": { "code": 101, "type": "invalid_access_key", "info": "..." } }`
- Documented HTTP/status combinations include:
  - `400` — invalid request / malformed value (example code `210`, `invalid_url`)
  - `401` — missing or invalid access key (example code `101`)
  - `403` — inactive account or `secret_key` requirement / mismatch (example codes `102`, `310`)
  - `404` — target/resource not found
  - `406` — invalid viewport format (example code `410`)
  - `410` — viewport too large (example code `411`)
  - `422` — invalid parameter such as bad `css_url` (example code `510`)
  - `429` — rate limit reached (example code `106`)
  - `500` — unexpected internal error (example code `999`)

## Auth and usage notes
- Although older indexes sometimes marked Screenshotlayer as unauthenticated, the current official API reference requires `access_key` on requests.
- The service is effectively a single render endpoint with extensive query-string controls.
- The landing page and docs both describe direct URL-style integration, including use inside image tags and other client-side contexts.
- When exposing requests publicly, the docs recommend using the `secret_key` URL-protection flow.
- The docs describe export as asynchronous and explicitly say completion is not guaranteed.

## fireROUTE integration notes
- Treat Screenshotlayer as a one-route image-generation API rather than a multi-resource REST collection.
- Preserve arbitrary query passthrough for rendering controls because most functionality is encoded in optional query parameters.
- Expect binary image bodies on success and JSON on failure; content negotiation should be driven by the requested `format`.
- Respect caching semantics around `ttl` and `force` instead of assuming every request produces a fresh render.

## Sources inspected
- `https://screenshotlayer.com/`
- `https://docs.apilayer.com/screenshotlayer/docs/api-documentation`
- `https://docs.apilayer.com/screenshotlayer/docs/screenshotlayer-api-v-1-0-0`
- `https://api.swaggerhub.com/apis/apilayer-863/ScreenshotlayerAPI/1.0.0/swagger.json`
