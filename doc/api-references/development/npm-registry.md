# npm Registry

## Provider metadata
- Category: `Development`
- Provider slug: `npm-registry`
- Docs used manually:
  - `https://github.com/npm/registry/blob/master/docs/REGISTRY-API.md`
  - `https://github.com/npm/registry/blob/master/docs/responses/package-metadata.md`
- Confirmed REST API base URL: `https://registry.npmjs.org`
- Primary media type: JSON
- Auth model from the official docs: public registry read endpoints documented here do not require authentication
- Manually confirmed routes in this pass: `4`

## Authentication
The official public registry API docs used here describe read-only package metadata and search routes and do not require authentication for the confirmed endpoints in this file.

Relevant auth notes from the docs:
- the documented metadata and search routes are public
- the docs here are specifically for the public registry API, not package publish/write flows
- no API key or bearer token is required for the confirmed routes below

## Common request/response conventions
- Base URL: `https://registry.npmjs.org`
- Response format: JSON
- Package metadata is returned in full form by default
- Clients can request abbreviated install-oriented metadata with:
  - `Accept: application/vnd.npm.install-v1+json`
- A broader accept header example shown in the docs is:
  - `application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*`
- Package tarball URLs are exposed inside `dist.tarball` values in metadata responses

## Manually confirmed endpoint set

### 1) Registry root metadata
- Method: `GET`
- Path: `/`
- Full URL: `https://registry.npmjs.org/`
- Purpose: return CouchDB-style registry metadata for the public npm registry
- Request parameters: none documented
- Response fields shown in the official example include:
  - `db_name`
  - `doc_count`
  - `doc_del_count`
  - `update_seq`
  - `purge_seq`
  - `compact_running`
  - `disk_size`
  - `data_size`
  - `instance_start_time`
  - `disk_format_version`
  - `committed_update_seq`
- Usage note:
  - this is registry-level metadata, not package search results or package documents

### 2) Get package metadata
- Method: `GET`
- Path: `/{package}`
- Full URL: `https://registry.npmjs.org/{package}`
- Purpose: retrieve the package metadata document, often called a packument
- Path parameters:
  - `package` - required package name
- Accept header options documented:
  - omit `Accept` to receive the full metadata document
  - use `Accept: application/vnd.npm.install-v1+json` to receive abbreviated metadata for installation use cases
- Response shape documented in the official package metadata page includes fields such as:
  - `_id`, `_rev`, `name`, `description`, `dist-tags`, `maintainers`, `time`, `readme`, `readmeFilename`, `versions`
- Important usage notes from the docs:
  - abbreviated metadata is preferred when the full document is unnecessarily large
  - full metadata for popular packages can exceed `10MB` uncompressed

### 3) Get a specific package version
- Method: `GET`
- Path: `/{package}/{version}`
- Full URL: `https://registry.npmjs.org/{package}/{version}`
- Purpose: retrieve a specific version document for a package
- Path parameters:
  - `package` - required package name
  - `version` - required version string or `latest`
- Response fields documented for version objects include:
  - `name`
  - `version`
  - `homepage`
  - `repository`
  - `dependencies`
  - `devDependencies`
  - `scripts`
  - `author`
  - `license`
  - `readme`
  - `readmeFilename`
  - `dist`
  - `_npmVersion`
  - `_npmUser`
  - `maintainers`
- Important usage note:
  - `dist.tarball` typically points to `https://registry.npmjs.org/<name>/-/<name>-<version>.tgz`

### 4) Search packages
- Method: `GET`
- Path: `/-/v1/search`
- Full URL: `https://registry.npmjs.org/-/v1/search`
- Purpose: full-text search across public packages
- Confirmed query parameters:
  - `text` - full-text query
  - `size` - result count, default `20`, max `250`
  - `from` - result offset
  - `quality` - search weighting component
  - `popularity` - search weighting component
  - `maintenance` - search weighting component
- Search qualifier examples explicitly documented:
  - `author:bcoe`
  - `maintainer:bcoe`
  - `scope:foo`
  - `keywords:batman`
  - `not:unstable`
  - `not:insecure`
  - `is:unstable`
  - `is:insecure`
  - `boost-exact:false`
- Response structure shown in the docs includes:
  - top-level `objects`, `total`, `time`
  - per-result `package`, `score`, and `searchScore`
  - package subfields such as `name`, `version`, `description`, `keywords`, `date`, `links`, `publisher`, `maintainers`

## Pagination
The official search endpoint uses offset-style pagination:
- `size` controls page size
- `from` controls the starting offset
- the docs do not describe Link headers or cursor tokens for this route

## Rate limits
- No numeric public rate limit was stated in the official pages used for this pass
- The docs used here do not publish a request-per-minute or request-per-day quota for the confirmed routes
- fireROUTE should therefore treat rate limiting as undocumented unless npm publishes a newer official limit page

## Error format and response notes
- The route docs used for this pass do not publish a formal shared error schema
- Responses for the confirmed routes are JSON documents
- Consumers should surface HTTP status and response body when registry lookups fail

## Important usage notes
- The package metadata docs distinguish between full metadata and abbreviated install metadata via the `Accept` header
- `dist` objects are documented as npm-generated and reliable for fields like `tarball`, `shasum`, `integrity`, `fileCount`, and `unpackedSize`
- Search weighting fields `quality`, `popularity`, and `maintenance` are normalized into a unit vector, so callers should keep them in the `0..1` range when customizing ranking

## Verification notes
This file was manually rebuilt from the official npm registry documentation pages listed above, replacing the earlier low-fidelity autogenerated summary.
