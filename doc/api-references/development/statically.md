# Statically

## Provider metadata
- Category: `Development`
- Provider slug: `statically`
- Docs used manually:
  - `https://statically.io/`
- Confirmed API/CDN base URL: `https://cdn.statically.io`
- Primary response/content types confirmed from the official page: file passthrough from the requested upstream asset type (for example JavaScript, CSS, images, fonts, or other static files)
- Authentication model: none documented or required on the reviewed official page
- Manually confirmed routes in this pass: `6`

## Authentication
- The reviewed official homepage presents Statically as a public CDN URL builder.
- No API key, Bearer token, OAuth flow, cookie-backed session, or signed-request requirement is documented on the page.

## Common request/response conventions
- Base URL: `https://cdn.statically.io`
- The official page documents direct URL fetching rather than JSON RPC or REST resource mutation.
- All reviewed examples are simple fetchable CDN URLs, so the documented interaction pattern is `GET`.
- Confirmed path variables from the official page:
  - `:user` - source account / namespace on GitHub, GitLab, Bitbucket, or Gist
  - `:repo` - repository name
  - `:tag` - repository revision selector shown in the docs pattern
  - `:file` - file path to serve through the CDN
  - `:gist_id` - GitHub Gist identifier
  - `:commit` - Gist revision / commit identifier
  - `:package` - npm package name
  - `:version` - npm package version
- The official page positions the service as a CDN for open-source assets rather than an authenticated management API.
- Important operational note from the homepage: the `/img/` endpoint has been disabled due to abuse and high traffic.

## Manually confirmed endpoint set

### 1) GitHub repository file CDN route
- Method: `GET`
- Path pattern: `/gh/:user/:repo@:tag/:file`
- Full URL pattern: `https://cdn.statically.io/gh/:user/:repo@:tag/:file`
- Purpose: serve a file from a GitHub repository through the Statically CDN
- Confirmed path parameters:
  - `:user`
  - `:repo`
  - `:tag`
  - `:file`

### 2) GitLab repository file CDN route
- Method: `GET`
- Path pattern: `/gl/:user/:repo@:tag/:file`
- Full URL pattern: `https://cdn.statically.io/gl/:user/:repo@:tag/:file`
- Purpose: serve a file from a GitLab repository through the Statically CDN
- Confirmed path parameters:
  - `:user`
  - `:repo`
  - `:tag`
  - `:file`

### 3) Bitbucket repository file CDN route
- Method: `GET`
- Path pattern: `/bb/:user/:repo@:tag/:file`
- Full URL pattern: `https://cdn.statically.io/bb/:user/:repo@:tag/:file`
- Purpose: serve a file from a Bitbucket repository through the Statically CDN
- Confirmed path parameters:
  - `:user`
  - `:repo`
  - `:tag`
  - `:file`

### 4) GitHub Gist raw file CDN route
- Method: `GET`
- Path pattern: `/gist/:user/:gist_id/raw/:commit/:file`
- Full URL pattern: `https://cdn.statically.io/gist/:user/:gist_id/raw/:commit/:file`
- Purpose: serve a raw file from a GitHub Gist through the Statically CDN
- Confirmed path parameters:
  - `:user`
  - `:gist_id`
  - `:commit`
  - `:file`

### 5) npm package default route
- Method: `GET`
- Path pattern: `/npm/:package`
- Full URL pattern: `https://cdn.statically.io/npm/:package`
- Purpose: serve the default package entry from an npm package through the CDN
- Confirmed path parameters:
  - `:package`

### 6) npm package versioned file route
- Method: `GET`
- Path pattern: `/npm/:package@:version/:file`
- Full URL pattern: `https://cdn.statically.io/npm/:package@:version/:file`
- Purpose: serve a specific versioned file from an npm package through the CDN
- Confirmed path parameters:
  - `:package`
  - `:version`
  - `:file`

## Pagination
- None documented on the reviewed official page.

## Rate limits
- No numeric rate-limit or quota policy is published on the reviewed official page.
- The only directly confirmed operational restriction from the homepage is that the historical `/img/` endpoint is disabled.

## Error handling
- The reviewed official homepage does not publish a structured error-schema or status-code table.
- This file does not infer undocumented CDN miss or upstream failure behavior.

## Response format notes
- Statically is documented as a CDN passthrough for static assets, so response media types depend on the requested upstream file.
- The homepage does not describe a single canonical JSON response envelope.

## Important usage notes
- The official documentation is a compact landing page rather than a multi-page API reference.
- This provider is route-light but format-flexible: the main variation is which source ecosystem is being proxied (`gh`, `gl`, `bb`, `gist`, or `npm`).
- The disabled `/img/` note matters for fireROUTE because older references to Statically image optimization should not be treated as live routes.

## Verification notes
This file was manually rebuilt from the current official Statically homepage after reviewing the live route patterns shown in the provider's own usage section.