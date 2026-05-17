# Crafatar

## Overview
- Provider: `Crafatar`
- Category: `Games & Comics`
- Historical public base URL confirmed from official first-party sources: `https://crafatar.com`
- Official sources inspected manually in this execution:
  - `https://crafatar.com/`
  - `https://github.com/crafatar/crafatar`
  - `https://raw.githubusercontent.com/crafatar/crafatar/master/README.md`
  - `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/server.js`
  - `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/routes/avatars.js`
  - `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/routes/skins.js`
  - `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/routes/renders.js`
  - `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/routes/capes.js`
  - `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/views/index.html.ejs`
  - `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/response.js`
  - `https://raw.githubusercontent.com/crafatar/crafatar/master/config.js`
- Manual status: `manually_documented`
- Confirmed route count: `6`
- Documentation basis: repository-backed first-party contract recovery, because the live root docs host is currently unavailable

## Current live-site status
- `https://crafatar.com/` currently returns Cloudflare `521` with title `crafatar.com | 521: Web server is down`.
- The live public host is therefore not currently trustworthy as the primary documentation surface.
- The official `crafatar/crafatar` repository still preserves the site template, route handlers, configuration defaults, and response logic, which is enough to reconstruct the canonical public contract from first-party material.

## Confirmed base URL and protocol notes
- Historical public base URL: `https://crafatar.com`
- Routes are documented as path-based image endpoints under the public host.
- The official site template says clients may append `.png` or any other file extension to the URL path, but all returned images are PNG.
- The route handlers strip dashes from UUID path values before validation, and the site docs say blank and dashed Mojang UUID formats are accepted.

## Confirmed routes
1. `GET /`
   - Returns the HTML documentation/landing page.
2. `GET /avatars/{uuid}`
   - Returns a 2D avatar image.
3. `GET /renders/head/{uuid}`
   - Returns a 3D head render.
4. `GET /renders/body/{uuid}`
   - Returns a 3D body render.
5. `GET /skins/{uuid}`
   - Returns the full skin image.
6. `GET /capes/{uuid}`
   - Returns the cape image when present.

## Route details

### `GET /`
- Purpose: public documentation and examples page.
- Response format: HTML.
- Auth: none.

### `GET /avatars/{uuid}`
- Path parameter:
  - `uuid`: any valid Mojang UUID in blank or dashed format; malformed UUIDs are rejected.
- Query parameters:
  - `size`: avatar size in pixels. Confirmed allowed range from `config.js`: `1` to `512`. Default: `160`.
  - `overlay`: boolean flag parameter; presence means `true`. Applies the overlay layer.
  - `helm`: legacy alias for `overlay`; the route handler accepts either name.
  - `default`: fallback to use if the requested image cannot be served. The official site template says this may be a custom URL, another UUID, `MHF_Steve`, or `MHF_Alex`. If omitted, the service falls back to the Minecraft default skin for the requested UUID.
- Response format: `image/png`.
- Important behavior:
  - Extra path segments return `404 Invalid Path`.
  - Invalid UUID returns a user error.
  - Invalid `size` returns a user error.

### `GET /renders/head/{uuid}`
- Path parameter:
  - `uuid`: valid Mojang UUID in blank or dashed format.
- Query parameters:
  - `scale`: render scale factor. Confirmed allowed range from `config.js`: `1` to `10`. Default: `6`.
  - `overlay`: boolean flag parameter; presence means `true`.
  - `helm`: legacy alias for `overlay`.
  - `default`: fallback custom URL, UUID, `MHF_Steve`, or `MHF_Alex`.
- Response format: `image/png`.
- Important behavior:
  - Invalid render type is rejected by the shared render handler.
  - Extra path segments return `404 Invalid Path`.
  - Invalid UUID or invalid `scale` returns a user error.

### `GET /renders/body/{uuid}`
- Path parameter:
  - `uuid`: valid Mojang UUID in blank or dashed format.
- Query parameters:
  - `scale`: `1` to `10`, default `6`.
  - `overlay`: boolean flag parameter; presence means `true`.
  - `helm`: legacy alias for `overlay`.
  - `default`: fallback custom URL, UUID, `MHF_Steve`, or `MHF_Alex`.
- Response format: `image/png`.
- Important behavior:
  - Shares the same validation and fallback logic as the head-render route.

### `GET /skins/{uuid}`
- Path parameter:
  - `uuid`: valid Mojang UUID in blank or dashed format.
- Query parameters:
  - `default`: fallback custom URL, UUID, `MHF_Steve`, or `MHF_Alex`.
- Response format: `image/png`.
- Important behavior:
  - Extra path segments return `404 Invalid Path`.
  - Invalid UUID returns a user error.

### `GET /capes/{uuid}`
- Path parameter:
  - `uuid`: valid Mojang UUID in blank or dashed format.
- Query parameters:
  - `default`: fallback redirect target if no cape image is available.
- Response format: `image/png` when a cape image exists.
- Important behavior:
  - Extra path segments return `404 Invalid Path`.
  - Invalid UUID returns a user error.
  - If no cape image exists and no `default` is supplied, the shared response layer returns `404`.
  - If no cape image exists and `default` is supplied, the shared response layer can redirect to that fallback.

## Authentication
- No authentication requirement is documented in the official site template or repository route handlers.
- The service is designed as anonymous public image endpoints.

## Rate limits and caching
- No published client-facing numeric request quota was exposed in the official site template or README.
- The official `config.js` defaults confirm cache behavior:
  - local recheck interval: `1200` seconds (`20` minutes)
  - browser cache max age: `3600` seconds (`60` minutes)
- The site template says Crafatar checks for skin updates every `20` minutes and caches images in the browser for `60` minutes.
- `config.js` also notes the Mojang session-server recheck interval should stay above `60` seconds to comply with Mojang rate limits, but that note is about Crafatar's upstream dependency, not a documented inbound client quota for Crafatar consumers.

## Pagination
- None. The confirmed contract is image-serving routes only.

## Error handling and response headers
Confirmed from `lib/response.js` and the route handlers:
- `200 OK`
  - Successful image responses.
  - Also used in some stale-cache situations where Crafatar serves a cached image during upstream/server trouble.
- `304 Not Modified`
  - Returned when the incoming `If-None-Match` matches the generated `Etag`.
- `307 Temporary Redirect`
  - Returned when a `default` fallback target or fallback UUID/custom URL redirect is used.
- `404 Not Found`
  - Used for invalid extra path segments.
  - Also used when the shared response layer has no body to send for a non-error image route result.
- `405 Method Not Allowed`
  - Any method other than `GET` or `HEAD`.
- `422 Unprocessable Entity`
  - Default user-error status from shared response handling, including malformed UUID, invalid size, invalid scale, or invalid render type unless a route explicitly overrides the code.
- `500` or `502`
  - Server or upstream failures when no usable cached image is available.
  - The response layer uses `500` instead of `502` when Cloudflare mode is enabled to avoid Cloudflare replacing the response with its own error page.

Confirmed response headers:
- `Content-Type`
- `Content-Length`
- `Cache-Control`
- `Response-Time`
- `X-Request-ID`
- `X-Storage-Type`
- `Access-Control-Allow-Origin: *`
- `Etag`
- `Warning` when serving stale or revalidation-failed cached content
- `Location` on redirects

Confirmed `X-Storage-Type` values from the shared response layer:
- `none`
- `cached`
- `downloaded`
- `checked`
- `server error`
- `server error;cached`
- `user error`

## Format notes
- The root route serves HTML.
- All documented media routes serve PNG images.
- The site template explicitly says all images are PNG even if clients append another file extension.
- The shared response layer enables CORS with `Access-Control-Allow-Origin: *`.

## Important usage notes
- The official site template says usernames are not supported; use UUIDs only.
- The site template explicitly says malformed UUIDs are rejected.
- The route handlers accept dashed UUIDs because they normalize them by removing dashes before validation.
- `default` fallbacks can resolve to a built-in Steve/Alex image, another UUID-based route, or a caller-supplied custom URL, depending on the route and fallback value.
- The current live public host is unstable or unavailable, so repository-backed first-party documentation is the authoritative source used for this fireROUTE reference.

## Sources inspected in this execution
- `https://crafatar.com/`
- `https://github.com/crafatar/crafatar`
- `https://raw.githubusercontent.com/crafatar/crafatar/master/README.md`
- `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/server.js`
- `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/routes/avatars.js`
- `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/routes/skins.js`
- `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/routes/renders.js`
- `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/routes/capes.js`
- `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/views/index.html.ejs`
- `https://raw.githubusercontent.com/crafatar/crafatar/master/lib/response.js`
- `https://raw.githubusercontent.com/crafatar/crafatar/master/config.js`
