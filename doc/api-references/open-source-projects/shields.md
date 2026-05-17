# Shields

## Provider metadata
- Category: `Open Source Projects`
- Provider slug: `shields`
- Docs used manually:
  - `https://shields.io/`
  - `https://shields.io/badges`
  - `https://shields.io/badges/static-badge`
  - `https://shields.io/badges/endpoint-badge`
  - `https://shields.io/badges/dynamic-json-badge`
  - `https://shields.io/badges/dynamic-regex-badge`
  - `https://shields.io/badges/dynamic-toml-badge`
  - `https://shields.io/badges/dynamic-xml-badge`
  - `https://shields.io/badges/dynamic-yaml-badge`
  - `https://shields.io/docs/logos`
- Confirmed badge host / API-style base URL: `https://img.shields.io`
- Authentication model surfaced in the reviewed docs: none
- Primary response formats: rendered badge images (SVG-style badge responses rather than JSON API envelopes), plus remote-source JSON/TOML/XML/YAML/plain-text inputs for the dynamic families
- Manually confirmed route families in this pass: `7`

## Authentication
- The reviewed official Shields docs do not require an API key, OAuth flow, session, or account setup.
- All reviewed badge URLs are public `GET` endpoints under `https://img.shields.io`.
- Source-document access for dynamic badges is indirect: Shields fetches the remote `url=` target on the caller's behalf and renders the result as a badge.

## Common request/response conventions
- Base host: `https://img.shields.io`
- Confirmed method on all reviewed route families: `GET`
- The reviewed families are badge-rendering routes, so the output is an image badge rather than a JSON response body.
- Shared styling query parameters repeatedly documented across the reviewed badge pages:
  - `style` - one of `flat`, `flat-square`, `plastic`, `for-the-badge`, or `social`
  - `logo` - Simple Icons slug for a named logo
  - `logoColor` - logo color; docs explicitly allow hex, rgb/rgba, hsl/hsla, and CSS named colors
  - `logoSize` - adaptive icon resizing via `auto` for supported logos
  - `label` - override the left-side label text
  - `labelColor` - left-side background color
  - `color` - right-side background color
  - `cacheSeconds` - requested HTTP cache lifetime, subject to Shields defaults/minimums
  - `link` - click targets for the left/right sides of a badge, but the docs say this only works in an HTML `<object>` tag, not in `<img>` tags or markup renderers
- The reviewed logos docs confirm two logo modes:
  - named logos from Simple Icons via `logo=<slug>`
  - custom logos encoded into the URL as a base64 data URL on routes that accept logo customization

## Manually confirmed endpoint set

### 1) Static badge
- Method: `GET`
- Path family: `/badge/{badgeContent}`
- Example docs URLs:
  - `https://img.shields.io/badge/any_text-you_like-blue`
  - `https://img.shields.io/badge/just%20the%20message-8A2BE2`
  - `https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge`
- Purpose: generate a badge directly from path-encoded static text and colors.
- Path parameter:
  - `badgeContent` - required; encodes either `label-message-color` or `message-color`
- Query parameters explicitly documented on the static-badge page:
  - `style`, `logo`, `logoColor`, `logoSize`, `label`, `labelColor`, `color`, `cacheSeconds`, `link`
- Static-badge path encoding rules explicitly documented on the page:
  - underscore `_` or `%20` becomes a space
  - double underscore `__` becomes a literal underscore
  - double dash `--` becomes a literal dash
- Important notes:
  - named colors and hex/rgb/rgba/hsl/hsla/CSS color values are supported
  - custom logos can be passed as base64-encoded image data URLs per the official logos page

### 2) Endpoint badge
- Method: `GET`
- Path: `/endpoint`
- Full URL: `https://img.shields.io/endpoint`
- Purpose: render a badge from a caller-controlled JSON endpoint.
- Required query parameter:
  - `url` - URL of the remote JSON endpoint that returns the badge schema
- Additional documented query parameters:
  - `style`, `logo`, `logoColor`, `logoSize`, `label`, `labelColor`, `color`, `cacheSeconds`, `link`
- Official JSON schema fields confirmed on the docs page:
  - `schemaVersion` - required; always `1`
  - `label` - required; may be the empty string to suppress the left side
  - `message` - required; cannot be empty
  - `color` - optional right-side color; defaults to `lightgrey`
  - `labelColor` - optional left-side color; defaults to `grey`
  - `isError` - optional boolean; when `true`, users cannot override the color via query string
  - `namedLogo` - optional Simple Icons slug
  - `logoSvg` - optional custom SVG string
  - `logoColor` - optional logo color for supported named logos
  - `logoSize` - optional adaptive logo sizing
  - `style` - optional default style; defaults to `flat`
- Important notes:
  - the docs explicitly say Shields fetches the remote endpoint and then formats the badge
  - cache behavior is configurable but remains subject to the Shields minimum/default behavior

### 3) Dynamic JSON badge
- Method: `GET`
- Path: `/badge/dynamic/json`
- Full URL: `https://img.shields.io/badge/dynamic/json`
- Purpose: extract a value from a remote JSON document and render it as a badge.
- Required query parameters:
  - `url` - URL to the JSON document
  - `query` - JSONPath expression used to extract the value
- Optional query parameters documented on the page:
  - `prefix`, `suffix`, `style`, `logo`, `logoColor`, `logoSize`, `label`, `labelColor`, `color`, `cacheSeconds`, `link`
- Important notes:
  - the page explicitly uses `JSONPath` selectors
  - `prefix` and `suffix` are appended to the extracted value before rendering

### 4) Dynamic regex badge
- Method: `GET`
- Path: `/badge/dynamic/regex`
- Full URL: `https://img.shields.io/badge/dynamic/regex`
- Purpose: extract text from an arbitrary remote file using a regex and render the extracted value as a badge.
- Required query parameters:
  - `url` - URL to the file to search; the docs say the full raw content is used as the search string
  - `search` - re2 expression used to extract data; only the first matched text is returned
- Optional query parameters:
  - `replace` - replacement string; supports `$$`, `$n`, and `$<name>` syntax
  - `flags` - regex flags; documented values are `i`, `m`, and `s`
  - `style`, `logo`, `logoColor`, `logoSize`, `label`, `labelColor`, `color`, `cacheSeconds`, `link`
- Important notes:
  - the official docs mark this badge as `Experimental`
  - the docs explicitly say regex support is based on `re2`, not arbitrary PCRE behavior
  - if `replace` is omitted, the full matched text is displayed

### 5) Dynamic TOML badge
- Method: `GET`
- Path: `/badge/dynamic/toml`
- Full URL: `https://img.shields.io/badge/dynamic/toml`
- Purpose: extract a value from a remote TOML document and render it as a badge.
- Required query parameters:
  - `url` - URL to the TOML document
  - `query` - JSONPath expression used to query the parsed TOML document
- Optional query parameters:
  - `prefix`, `suffix`, `style`, `logo`, `logoColor`, `logoSize`, `label`, `labelColor`, `color`, `cacheSeconds`, `link`
- Important notes:
  - the docs explicitly describe this family as TOML input plus `JSONPath` extraction after parsing

### 6) Dynamic XML badge
- Method: `GET`
- Path: `/badge/dynamic/xml`
- Full URL: `https://img.shields.io/badge/dynamic/xml`
- Purpose: extract a value from a remote XML document and render it as a badge.
- Required query parameters:
  - `url` - URL to the XML document
  - `query` - XPath expression used to query the document
- Optional query parameters:
  - `prefix`, `suffix`, `style`, `logo`, `logoColor`, `logoSize`, `label`, `labelColor`, `color`, `cacheSeconds`, `link`
- Important notes:
  - the docs explicitly use XPath rather than JSONPath for XML
  - for XML documents with a default namespace prefix, the docs say to use `local-name()` selectors such as `/*[local-name()='myelement']` instead of plain `/myelement`

### 7) Dynamic YAML badge
- Method: `GET`
- Path: `/badge/dynamic/yaml`
- Full URL: `https://img.shields.io/badge/dynamic/yaml`
- Purpose: extract a value from a remote YAML document and render it as a badge.
- Required query parameters:
  - `url` - URL to the YAML document
  - `query` - JSONPath expression used to query the parsed YAML document
- Optional query parameters:
  - `prefix`, `suffix`, `style`, `logo`, `logoColor`, `logoSize`, `label`, `labelColor`, `color`, `cacheSeconds`, `link`
- Important notes:
  - the docs explicitly describe this family as YAML input plus `JSONPath` extraction after parsing

## Pagination
- None of the reviewed Shields badge families use cursor, page, offset, or token pagination.
- The product surface reviewed here is request-per-badge rendering, not list retrieval.

## Rate limits and caching
- The reviewed official pages do not publish a numeric public rate-limit table or quota.
- The docs do repeatedly document `cacheSeconds` and note that badge caching is subject to Shields defaults/minimums.
- The endpoint-badge page explicitly says cache behavior is configurable but balanced against bandwidth/freshness and subject to the Shields minimum.
- Several reviewed pages also state that any `cacheSeconds` value below the inferred/default cache lifetime will be ignored.

## Error handling and response notes
- The reviewed docs do not publish a structured JSON error schema for badge-generation failures.
- Badge routes are rendered image responses, so response handling is presentation-oriented rather than envelope-oriented.
- The endpoint badge is the one reviewed family with a documented upstream schema contract, and it requires `schemaVersion`, `label`, and non-empty `message` fields in the fetched JSON.
- The regex badge page narrows parsing behavior by explicitly documenting re2 syntax and first-match extraction behavior.

## Important usage notes
- Shields has a much broader badge catalog than the seven generic route families documented here; this pass only counted the first-party generic badge builder families that have dedicated official route reference pages.
- Shared badge customization options are intentionally consistent across the reviewed families, which makes it feasible to switch source modes without changing style/logo conventions.
- The `link` parameter has a narrow integration model: the docs say it works with `<object>` embeds, not with ordinary markdown image embeds.
- The logos page warns that Simple Icons slugs available upstream may temporarily outpace what Shields has already imported.
- Dynamic source families differ mainly by extraction language:
  - JSON/TOML/YAML use `JSONPath`
  - XML uses `XPath`
  - unstructured text uses `re2` regex extraction

## Verification notes
This file was manually rebuilt from the current official Shields site and the dedicated badge-family documentation pages using browser inspection.