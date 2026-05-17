# Serialif Color

## Provider metadata
- Category: `Development`
- Provider slug: `serialif-color`
- Docs used manually:
  - `https://color.serialif.com/`
- Confirmed API base URL: `https://color.serialif.com`
- Primary response/content type confirmed from the official page: JSON
- Authentication model: none documented or required on the reviewed official page
- Manually confirmed routes in this pass: `7`

## Authentication
- The reviewed official page documents Serialif Color as a public color-conversion utility API.
- No API key, Bearer token, OAuth flow, cookie session, or signed-request requirement is described.

## Common request/response conventions
- Base URL: `https://color.serialif.com`
- The official page describes request formats entirely through fetchable URL examples.
- All reviewed examples are read-only URL fetches, so the documented interaction pattern is `GET`.
- Confirmed accepted input families from the official page:
  - keyword color names
  - HEX values with `3`, `4`, `6`, or `8` characters, supplied without a leading `#`
  - RGB / RGBA component lists supplied without the `rgb(...)` or `rgba(...)` wrapper and without spaces
  - HSL / HSLA component lists supplied without the `hsl(...)` or `hsla(...)` wrapper and without spaces
- The docs say successful responses include the requested/base color, complementary color, grayscale color, alpha-stripped variants where applicable, and black/white contrasted-text variants chosen according to brightness.

## Manually confirmed endpoint set

### 1) Generic path-style color lookup
- Method: `GET`
- Path pattern: `/{color}`
- Full URL pattern: `https://color.serialif.com/{color}`
- Purpose: resolve a color expressed directly in the path
- Officially shown accepted examples:
  - `https://color.serialif.com/aquamarine`
  - `https://color.serialif.com/55667788`
  - `https://color.serialif.com/85,102,119`
  - `https://color.serialif.com/85,102,119,0.53`
- Confirmed path parameter:
  - `color` - keyword, HEX-without-`#`, RGB CSV, or RGBA CSV value

### 2) Keyword lookup alias
- Method: `GET`
- Path pattern: `/keyword={keyword}`
- Full URL pattern: `https://color.serialif.com/keyword={keyword}`
- Purpose: resolve a named keyword color explicitly
- Official example:
  - `https://color.serialif.com/keyword=aquamarine`

### 3) HEX lookup alias
- Method: `GET`
- Path pattern: `/hex={hex}`
- Full URL pattern: `https://color.serialif.com/hex={hex}`
- Purpose: resolve a HEX color explicitly
- Official example:
  - `https://color.serialif.com/hex=55667788`
- Confirmed parameter note:
  - `hex` is supplied without a leading `#`

### 4) RGB lookup alias
- Method: `GET`
- Path pattern: `/rgb={rgb_or_rgba_csv}`
- Full URL pattern: `https://color.serialif.com/rgb={rgb_or_rgba_csv}`
- Purpose: resolve RGB or RGBA component values through the `rgb=` alias
- Official examples:
  - `https://color.serialif.com/rgb=85,102,119`
  - `https://color.serialif.com/rgb=85,102,119,0.53`

### 5) RGBA lookup alias
- Method: `GET`
- Path pattern: `/rgba={rgba_csv}`
- Full URL pattern: `https://color.serialif.com/rgba={rgba_csv}`
- Purpose: resolve an RGBA color explicitly
- Official example:
  - `https://color.serialif.com/rgba=85,102,119,0.53`

### 6) HSL lookup alias
- Method: `GET`
- Path pattern: `/hsl={hsl_or_hsla_csv}`
- Full URL pattern: `https://color.serialif.com/hsl={hsl_or_hsla_csv}`
- Purpose: resolve HSL or HSLA component values through the `hsl=` alias
- Official examples:
  - `https://color.serialif.com/hsl=85,102,119`
  - `https://color.serialif.com/hsl=85,102,119,0.53`

### 7) HSLA lookup alias
- Method: `GET`
- Path pattern: `/hsla={hsla_csv}`
- Full URL pattern: `https://color.serialif.com/hsla={hsla_csv}`
- Purpose: resolve an HSLA color explicitly
- Official example:
  - `https://color.serialif.com/hsla=85,102,119,0.53`

## Response format notes
- The official page shows JSON success and error envelopes.
- The top-level success example includes `status: "success"` and nested color objects such as:
  - `base`
  - `base_without_alpha`
  - `base_without_alpha_contrasted_text`
  - `complementary`
  - `complementary_without_alpha`
  - `complementary_without_alpha_contrasted_text`
  - `grayscale`
  - `grayscale_without_alpha`
  - `grayscale_without_alpha_contrasted_text`
- Each color object is documented with converted representations including keyword (when applicable), HEX, RGB/RGBA, and HSL/HSLA values plus component breakdowns.

## Pagination
- None documented on the reviewed official page.

## Rate limits
- No numeric rate-limit or quota policy is published on the reviewed official page.

## Error handling
- The official page includes a structured JSON error example:
  - top-level `status` of `error`
  - nested `error.type`
  - nested `error.value`
  - nested `error.message`
- The shown example error type is `wrong color format` with a message such as `not a valid KEYWORD color`.

## Important usage notes
- This is a small, read-only utility API whose capability is expressed mainly through alternate URL input syntaxes rather than through many resource types.
- The bare `/{color}` path is the most flexible input form because the docs show it handling keyword, HEX, RGB, and RGBA values directly.
- The `keyword=`, `hex=`, `rgb=`, `rgba=`, `hsl=`, and `hsla=` forms are path-style aliases, not standard `?query=value` parameters.

## Verification notes
This file was manually rebuilt from the current official Serialif Color homepage after reviewing the live request-format table, response examples, and error example published on that page.