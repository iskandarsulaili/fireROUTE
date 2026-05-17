# Wandbox

## Provider metadata
- Category: `Development`
- Provider slug: `wandbox`
- Docs used manually:
  - `https://github.com/melpon/wandbox`
  - official source file `https://github.com/melpon/wandbox/blob/master/README.md`
  - official source file `https://github.com/melpon/wandbox/blob/master/feline/src/main.rs`
  - official source files under `feline/src/` for route handlers and request/response types
  - official source files under `canine/app/routes/` for the Cloudflare/Remix API wrapper routes
- Confirmed API base URL: `https://wandbox.org`
- Primary media types: JSON for most routes; newline-delimited JSON for compile streaming
- Authentication: none
- Manually confirmed routes in this pass: `8`

## Authentication
- The reviewed official source does not require API keys, bearer tokens, OAuth, or signed query parameters.
- The current Cloudflare/Remix wrapper preserves anonymous access and adds CORS handling for browser clients.

## Common request/response conventions
- Base URL: `https://wandbox.org`
- Confirmed API prefix: `/api`
- Documented route methods in current source: `GET` and `POST`
- Most routes return JSON objects or arrays.
- `POST /api/compile.ndjson` streams newline-delimited JSON events rather than a single JSON object.
- The compile/permlink request bodies use JSON and include string fields such as `compiler`, `code`, `options`, `title`, `description`, `github_user`, plus optional nested arrays like `codes` and `results`.
- The official type definitions serialize `stdin` and NDJSON `data` fields as strings even though they are stored internally as byte arrays.

## Manually confirmed endpoint set

### 1) List available compilers
- Method: `GET`
- Path: `/api/list.json`
- Full URL: `https://wandbox.org/api/list.json`
- Purpose: return the current compiler catalog
- Parameters: none documented in the reviewed source
- Response fields confirmed in type definitions/tests:
  - `name`
  - `version`
  - `language`
  - `display-name`
  - `templates`
  - `compiler-option-raw`
  - `runtime-option-raw`
  - `display-compile-command`
  - `switches`

### 2) Compile and stream execution events
- Method: `POST`
- Path: `/api/compile.ndjson`
- Full URL: `https://wandbox.org/api/compile.ndjson`
- Purpose: compile/run code and stream structured events as NDJSON
- Required JSON body fields confirmed in current source:
  - `compiler`
  - `code`
- Additional JSON body fields confirmed in type definitions/tests:
  - `codes` - array of extra source files with `file` and `code`
  - `options`
  - `stdin`
  - `compiler-option-raw`
  - `runtime-option-raw`
  - `github_user`
  - `title`
  - `description`
  - `save`
  - `created_at`
  - `is_private`
  - `compiler-info`
- Response notes:
  - emits NDJSON objects with fields `type` and `data`
  - reviewed tests show event types such as `Control`, `CompilerMessageS`, `StdOut`, and `ExitCode`

### 3) Compile and return an aggregated JSON result
- Method: `POST`
- Path: `/api/compile.json`
- Full URL: `https://wandbox.org/api/compile.json`
- Purpose: compile/run code and return a merged JSON result object instead of an NDJSON stream
- Required JSON body fields confirmed in current source:
  - `compiler`
  - `code`
- Additional JSON body fields confirmed in type definitions/tests:
  - `codes`
  - `options`
  - `stdin`
  - `compiler-option-raw`
  - `runtime-option-raw`
  - `github_user`
  - `title`
  - `description`
  - `save`
  - `created_at`
  - `is_private`
  - `compiler-info`
- Response fields confirmed in type definitions/tests:
  - `status`
  - `signal`
  - `compiler_output`
  - `compiler_error`
  - `compiler_message`
  - `program_output`
  - `program_error`
  - `program_message`
  - `permlink`
  - `url`
- Usage note:
  - when `save` is true, the server also creates a saved permlink and fills `permlink` and `url`

### 4) Fetch a saved permlink by ID
- Method: `GET`
- Path: `/api/permlink/{permlink_id}`
- Full URL pattern: `https://wandbox.org/api/permlink/{permlink_id}`
- Purpose: retrieve a previously saved compile/run payload and result bundle
- Path parameters:
  - `permlink_id` - saved permlink token
- Response fields confirmed in type definitions:
  - `parameter`
  - `results`
  - `result`

### 5) Create a saved permlink record
- Method: `POST`
- Path: `/api/permlink`
- Full URL: `https://wandbox.org/api/permlink`
- Purpose: persist a compile/result bundle and receive a sharable permlink URL
- Required JSON body fields confirmed in type definitions:
  - `compiler`
  - `code`
- Additional JSON body fields confirmed in type definitions/tests:
  - `title`
  - `description`
  - `options`
  - `compiler-option-raw`
  - `runtime-option-raw`
  - `stdin`
  - `github_user`
  - `codes`
  - `results`
- Response fields:
  - `permlink`
  - `url`

### 6) Get sponsors metadata
- Method: `GET`
- Path: `/api/sponsors.json`
- Full URL: `https://wandbox.org/api/sponsors.json`
- Purpose: return sponsor lists used by the site UI
- Parameters: none documented in the reviewed source
- Response fields:
  - `corporate`
  - `personal`
- Current source note:
  - the reviewed handler currently returns empty arrays for both groups

### 7) Get a named template
- Method: `GET`
- Path: `/api/template/{template_name}`
- Full URL pattern: `https://wandbox.org/api/template/{template_name}`
- Purpose: return starter code/options for a named template
- Path parameters:
  - `template_name` - template slug, for example the reviewed test uses `gcc-c`
- Response fields confirmed in type definitions:
  - `name`
  - `code`
  - optional `codes`
  - optional `stdin`
  - optional `options`
  - optional `compiler_option_raw`
  - optional `runtime_option_raw`

### 8) Get hpplib metadata
- Method: `GET`
- Path: `/api/hpplib.json`
- Full URL: `https://wandbox.org/api/hpplib.json`
- Purpose: return the hpplib JSON data file consumed by the site
- Parameters: none documented in the reviewed source
- Response notes:
  - response content type is explicitly set to `application/json`
  - the handler returns the contents of the configured hpplib file directly

## Pagination
- None documented in the reviewed official README or source.
- All confirmed routes are direct fetch, create, or run operations without page/cursor semantics.

## Rate limits
- The reviewed README states that there are some restrictions on access from the same IP address.
- The reviewed official materials do not publish a numeric requests-per-minute, concurrency, or daily quota figure.
- The README also states there is no SLA.

## Error handling
- The Rust API server wraps internal handler failures in `AppError`, which converts them into HTTP `500` responses with plain-text bodies in the form `Error: ...`.
- Examples visible in source/tests include messages such as `Unknown compiler` and `Template not found`.
- `GET /api/permlink` is not defined as a normal read route; the Cloudflare wrapper returns `404` for that method/path while still handling `OPTIONS` for CORS.
- The reviewed official materials do not document a richer provider-specific JSON error schema.

## Response format notes
- `GET /api/list.json`, `GET /api/permlink/{permlink_id}`, `POST /api/permlink`, `GET /api/sponsors.json`, `GET /api/template/{template_name}`, and `GET /api/hpplib.json` are JSON responses.
- `POST /api/compile.json` returns one aggregated JSON object.
- `POST /api/compile.ndjson` returns NDJSON event lines.
- String-like output fields such as `stdin`, compile outputs, and NDJSON `data` are serialized as strings in the reviewed type definitions.

## Important usage notes
- The indexed API documentation file is gone, but the current official repository still exposes the live API surface clearly in the maintained server/router source.
- Wandbox is route-light but parameter-rich: most compile customization lives in the POST body rather than in many separate endpoints.
- Saving a compile result can happen either directly through `POST /api/compile.json` with `save=true` or explicitly through `POST /api/permlink`.
- The README confirms same-IP restrictions and no SLA, so fireROUTE should be conservative about retry pressure.

## Verification notes
This file was manually rebuilt from the current official Wandbox repository and route-handler source using browser-based source inspection.