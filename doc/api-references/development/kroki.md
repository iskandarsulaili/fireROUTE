# Kroki

## Provider metadata
- Category: `Development`
- Provider slug: `kroki`
- Docs used manually:
  - `https://kroki.io/`
  - `https://docs.kroki.io/kroki/setup/usage/`
- Confirmed base URL: `https://kroki.io`
- Primary response/content types confirmed from the official docs: rendered diagram outputs such as `svg`, `png`, `jpeg`, `pdf`, `txt`, and `base64` depending on diagram type and output support
- Authentication model confirmed from the reviewed official docs: none documented for the public hosted API
- Manually confirmed routes in this pass: `4`

## Authentication
- The reviewed official Kroki pages do not document an API key, OAuth flow, or required auth header for the hosted public API.
- The public examples are unauthenticated `GET` and `POST` requests.

## Common request and response conventions
- Base URL: `https://kroki.io`
- Kroki converts text-based diagram source into rendered outputs over HTTP
- `GET` requests require the diagram source to be URL-safe `deflate + base64` encoded in the path
- `POST` requests can send plain text or JSON without pre-encoding the diagram
- Diagram options can be passed three ways, with this precedence explicitly documented by Kroki:
  1. JSON body
  2. HTTP headers
  3. Query parameters
- The main output format is controlled either by the path segment or the `Accept` header

## Manually confirmed endpoint set

### 1) Render an encoded diagram via path-based GET
- Method: `GET`
- Path pattern: `/{diagram_type}/{output_format}/{diagram_source}`
- Example from the official docs: `GET /graphviz/svg/eNpLyUwvSizIUHBXqPZIzcnJ17ULzy_KSanlAgB1EAjQ`
- Full URL pattern: `https://kroki.io/{diagram_type}/{output_format}/{diagram_source}`
- Purpose: render a diagram whose source has already been compressed and base64-url encoded
- Confirmed path parameters:
  - `diagram_type` - renderer family such as `graphviz`, `plantuml`, `mermaid`, etc.
  - `output_format` - output type supported by the chosen renderer, such as `svg`, `png`, `jpeg`, `pdf`, `txt`, or `base64`
  - `diagram_source` - deflate+base64-encoded diagram text
- Confirmed option-passing behavior:
  - query parameters may be used to pass diagram-library options on `GET`
- Important notes:
  - this route is the canonical encoded-URL form shown in the official getting-started guide
  - actual output-format availability varies by diagram type, as shown in Kroki's official diagram-type matrix

### 2) Render a diagram via JSON POST to the root endpoint
- Method: `POST`
- Path: `/`
- Full URL: `https://kroki.io/`
- Content type: `application/json`
- Purpose: submit plain-text diagram source without URL encoding
- Confirmed JSON body fields from the official docs:
  - `diagram_source` - required diagram definition text
  - `diagram_type` - required renderer selection
  - `output_format` - required desired output format
  - `diagram_options` - optional object for renderer-specific options
- Important notes:
  - this route avoids URL-length and encoding complexity
  - Kroki's docs position this as the simplest path when callers do not want to pre-encode diagram text

### 3) Render a diagram via plain-text POST with output negotiated by `Accept`
- Method: `POST`
- Path pattern: `/{diagram_type}`
- Example from the official docs: `POST /graphviz`
- Full URL pattern: `https://kroki.io/{diagram_type}`
- Request headers confirmed in the docs:
  - `Content-Type: text/plain`
  - `Accept: image/svg+xml` or another appropriate media type for the desired output
- Request body:
  - raw plain-text diagram source
- Purpose: send plain text directly while selecting output format through content negotiation
- Important notes:
  - the docs explicitly show `Accept` controlling the output format for this route family
  - renderer-specific options may also be sent via `Kroki-Diagram-Options-*` headers

### 4) Render a diagram via POST with explicit output format in the path
- Method: `POST`
- Path pattern: `/{diagram_type}/{output_format}`
- Example from the official docs: `POST /graphviz/svg`
- Full URL pattern: `https://kroki.io/{diagram_type}/{output_format}`
- Supported request styles confirmed in the docs:
  - `Content-Type: text/plain` with raw diagram source in the body
  - `application/json` body containing at least `diagram_source`
- Purpose: render a diagram without relying on the `Accept` header for output selection
- Important notes:
  - this is the clearest route family for integrations that prefer stable path-based output selection
  - JSON and plain-text request bodies are both documented here

## Diagram options and request controls
From Kroki's official usage page:
- Query-parameter example for `GET`: `GET /graphviz/svg/{encoded}?key=value`
- JSON-body example for `POST /`: `diagram_options: { "key": "value" }`
- Header-based options use the prefix `Kroki-Diagram-Options-`, e.g. `Kroki-Diagram-Options-Key: value`
- Kroki explicitly documents precedence as JSON body > HTTP header > query parameter

## Response format notes
- output format depends on both the chosen renderer and the selected output format or `Accept` header
- the official Kroki homepage shows renderer-by-renderer support for `png`, `svg`, `jpeg`, `pdf`, `txt`, and `base64`
- some renderers support only a subset of those formats

## Pagination
- None of the reviewed Kroki pages document paginated endpoints.

## Error handling
- The reviewed official pages do not publish a standalone numeric error-code matrix on the sampled routes.
- The docs do make it clear that invalid renderer names, unsupported output formats, malformed encoded source, or invalid diagram source can prevent rendering.
- fireROUTE should therefore treat Kroki as primarily content-rendering oriented, with failures tied to invalid request shape, invalid diagram source, or unsupported renderer/format combinations.

## Rate limits
- The official Kroki pages reviewed in this pass do not publish numeric public rate limits for the hosted service.

## Important usage notes
- `GET` is best suited to pre-encoded diagrams and sharable URLs
- `POST` is the easier integration path for large or human-authored diagrams because the source does not need deflate+base64 encoding
- output-format support is renderer-dependent, so integrations should validate the chosen format against Kroki's official diagram-type matrix
- when the same diagram option is sent multiple ways, Kroki applies JSON-body values first, then header values, then query values

## Verification notes
This file was manually rebuilt from Kroki's official hosted site and documentation, replacing the earlier low-fidelity generated summary.
