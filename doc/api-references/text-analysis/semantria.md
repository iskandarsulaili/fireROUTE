# Semantria

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `semantria`
- Docs used manually:
  - `https://semantria-docs.lexalytics.com/docs/authenticate`
  - `https://semantria-docs.lexalytics.com/reference/semantria-api`
  - `https://semantria-docs.lexalytics.com/reference/regional-environments`
  - `https://semantria-docs.lexalytics.com/reference/api-limits`
  - `https://semantria-docs.lexalytics.com/reference/error-statuses`
- Confirmed regional API base URLs:
  - `https://api5.semantria.com` for North America accounts
  - `https://api5-eu.semantria.com` for Europe accounts
  - `https://api5-au.semantria.com` for Australia accounts
- Primary request/response format confirmed from the reviewed pages: JSON request and response bodies for the sampled REST endpoints
- Authentication model confirmed from the reviewed docs: access-token sessions created from login/password or account-admin-created service sessions
- Manually confirmed routes in this pass: `15`

## Authentication
The current official Lexalytics-hosted docs confirm that Semantria 5 authenticates with access tokens called sessions.

Confirmed auth details from the reviewed pages:
- `POST /auth/sessions/` creates a session from `login` and `password`
- default session behavior is one-hour expiration after last use
- session creation supports:
  - `expiration=default|custom|forever`
  - `expire_after_minutes`
  - `renewal_type=auto|manual`
  - `notes`
- `POST /auth/service-sessions/{userId}` creates a service session for a specific user and requires `ACCOUNT_ADMIN`
- the service-session page explicitly documents header `x-api-version: 5.0`
- the auth guide and security-model page confirm that sessions can be listed and deleted, although this file only counts the route pages manually reviewed below

Important auth limitation from the reviewed pages:
- the reviewed public pages clearly document session creation and lifecycle semantics, but they do not explicitly spell out the downstream raw HTTP header name used to present an access token on every subsequent request; only the token/session model itself was directly confirmed

## Common request/response conventions
- Base host depends on account region; the default reference examples use `api5.semantria.com`
- the sampled processing endpoints use JSON payloads for documents, collections, and route objects
- polling-style retrieval is built into the processing routes themselves rather than through a separate jobs endpoint
- configuration routes support response types `POLLING`, `CALLBACK`, and `AUTORESPONSE`
- several processing endpoints accept a `using` selector that can point to a configuration, industry pack, or language
- `job_id` is used to correlate related processing requests and retrievals

## Manually confirmed endpoint set

### 1) Create a session from login/password
- Method: `POST`
- Path: `/auth/sessions/`
- Full URL example: `https://api5.semantria.com/auth/sessions/`
- Purpose: create a Semantria session from account credentials
- Confirmed query params:
  - `expiration` - `default`, `custom`, or `forever`
  - `expire_after_minutes` - custom-expiration minutes
  - `notes` - purpose/use note for the token
  - `renewal_type` - `auto` or `manual`
- Confirmed body fields:
  - `login` - required account login/email
  - `password` - required account password
- Confirmed response notes from the auth guide:
  - response JSON includes `access_token`, `account_id`, `user_login`, `authenticated`, `expiration`, and `permissions`

### 2) Create a service session for a specific user
- Method: `POST`
- Path: `/auth/service-sessions/{userId}`
- Full URL example: `https://api5.semantria.com/auth/service-sessions/{userId}`
- Purpose: create a long-running service token for a specified user
- Permission note: requires `ACCOUNT_ADMIN`
- Confirmed path param:
  - `userId` - required target user id
- Confirmed query params:
  - `expiration`
  - `expire_after_minutes`
  - `notes`
  - `renewal_type`
- Confirmed header:
  - `x-api-version: 5.0`

### 3) Get an existing session
- Method: `GET`
- Path: `/auth/sessions/{sessionId}`
- Full URL example: `https://api5.semantria.com/auth/sessions/{sessionId}`
- Purpose: read session details
- Confirmed path param:
  - `sessionId` - the same value as the auth token returned when the session was created

### 4) Renew session expiration
- Method: `POST`
- Path: `/auth/renew`
- Full URL example: `https://api5.semantria.com/auth/renew`
- Purpose: renew session expiration
- Confirmed statuses on the route page:
  - `200`, `403`, `404`

### 5) Poll processed documents
- Method: `GET`
- Path: `/documents/`
- Full URL example: `https://api5.semantria.com/documents/`
- Purpose: retrieve processed document results for an account
- Confirmed query params:
  - `job_id` - filter by related job id
  - `request_limit` - return at most this many results

### 6) Queue a batch of documents
- Method: `POST`
- Path: `/documents/`
- Full URL example: `https://api5.semantria.com/documents/`
- Purpose: send one document or a batch of documents for analysis
- Confirmed query params:
  - `ignore_sections` - comma-separated metadata fields not to include as document sections
  - `job_id` - link related documents together
  - `language_id` - language to use with a configuration route
  - `limit` - return at most this many results
  - `return_source_text` - include source text in error results
  - `using` - configuration, industry pack, or language to use
- Confirmed body note:
  - body is a JSON document batch to analyze

### 7) Poll processed collections
- Method: `GET`
- Path: `/collections/`
- Full URL example: `https://api5.semantria.com/collections/`
- Purpose: retrieve processed collection results for an account
- Confirmed query param:
  - `job_id` - retrieve only collection results for this job id

### 8) Queue a collection
- Method: `POST`
- Path: `/collections/`
- Full URL example: `https://api5.semantria.com/collections/`
- Purpose: analyze an array of documents in relation to each other
- Confirmed query params:
  - `job_id`
  - `language_id`
  - `using`
- Confirmed body fields:
  - `documents` - required array of strings
  - `id`
  - `metadata` - JSON metadata returned with document results
  - `tag` - up to 50 alphanumeric characters plus `-`, `_`, `:`, `.`

### 9) List configuration routes
- Method: `GET`
- Path: `/routes/`
- Full URL example: `https://api5.semantria.com/routes/`
- Purpose: list configuration routes in an account
- Permission note: requires `ACCOUNT_ADMIN`
- Confirmed query param:
  - `group_id` - security group id to search in

### 10) Create a configuration route
- Method: `POST`
- Path: `/routes/`
- Full URL example: `https://api5.semantria.com/routes/`
- Purpose: create a configuration route
- Permission note: requires `ACCOUNT_ADMIN`
- Confirmed query param:
  - `group_id` - required when the account has more than one security group
- Confirmed body fields:
  - `callback_url`
  - `default_language_id`
  - `name`
  - `notes`
  - `response_type` - `POLLING`, `CALLBACK`, or `AUTORESPONSE`
  - `translation_target_language_id`

### 11) Get a configuration route
- Method: `GET`
- Path: `/routes/{routeId}`
- Full URL example: `https://api5.semantria.com/routes/{routeId}`
- Purpose: retrieve one configuration route
- Permission note: requires `ACCOUNT_ADMIN`
- Confirmed path param:
  - `routeId` - required route id

### 12) Patch configuration-route configs
- Method: `PATCH`
- Path: `/routes/{routeId}/configs`
- Full URL example: `https://api5.semantria.com/routes/{routeId}/configs?action=add`
- Purpose: add or remove configs from an existing route
- Permission note: requires `ACCOUNT_ADMIN`
- Confirmed path param:
  - `routeId`
- Confirmed query param:
  - `action` - `add` or `delete`
- Confirmed body shape:
  - `configs` - array of config identifiers

### 13) List supported languages
- Method: `GET`
- Path: `/languages/`
- Full URL example: `https://api5.semantria.com/languages/`
- Purpose: retrieve all languages supported by Semantria

### 14) Get one supported language
- Method: `GET`
- Path: `/languages/{languageId}`
- Full URL example: `https://api5.semantria.com/languages/{languageId}`
- Purpose: retrieve one supported language
- Confirmed path param:
  - `languageId` - required language id

### 15) List account limit types
- Method: `GET`
- Path: `/limit-types/`
- Full URL example: `https://api5.semantria.com/limit-types/`
- Purpose: list all limit types an account can have

## Pagination
- No cursor, page, or offset pagination parameters were documented on the fifteen reviewed routes.
- The processing retrieval routes are polling-oriented and expose bounded-result controls like `request_limit` instead.

## Error handling
The reviewed official error-code page confirms these shared status meanings:
- `200` request accepted and data returned
- `202` request accepted with no immediate data returned
- `400` wrong request format, with details
- `401` authentication failed
- `402` unauthorized due to call-limit exhaustion or expired license
- `403` forbidden, with details
- `404` missing documents, collections, configurations, or NLP items by id
- `406` batch, collection, or configuration limits reached
- `413` single-document character limit exceeded
- `500` server-side issue

Route-specific pages reviewed in this pass reuse subsets of those statuses, especially `200`, `202`, `400`, `401`, `403`, `404`, `406`, and `413`.

## Rate limits and size limits
From the official `API Limits` page reviewed in this pass:
- data calls (`POST` data to Semantria): `10 calls/second`
- settings calls (configuration-changing calls): `10 calls/second`
- polling calls (`GET` processed data): `10 calls/second`
- max document size: `2048 characters`
- document id length: `36 characters`
- max incoming/outgoing batch size in Detailed Mode: `100 documents / batch`
- max analysis size in Discovery Mode: `1000 documents / analysis`
- query text character count: `1500 characters`
- number of entities: `1000`
- number of sentiment-bearing phrases: `1000`

The limits page explicitly says the published numbers are for the Starter edition.

## Response format notes
- the auth guide's sample session response is JSON
- the processing and route-reference pages reviewed in this pass all present JSON-oriented request/response examples
- collection requests allow caller-supplied `metadata` that is documented as being returned with document results
- configuration routes expose response-mode behavior (`POLLING`, `CALLBACK`, `AUTORESPONSE`) that affects delivery style even though the transport remains HTTP/JSON

## Important usage notes
- choose the correct regional host before integrating; the default NA host in examples is not universal
- `ACCOUNT_ADMIN` is required for the reviewed service-session and configuration-route management endpoints
- session expiration can be sliding (`auto`) or fixed (`manual`) depending on `renewal_type`
- the current reference exposes a much larger Semantria surface than the fifteen routes sampled here; this file documents only the routes manually opened and verified in this pass

## Verification notes
This file was manually rebuilt from the current official Lexalytics-hosted Semantria docs and reference pages, replacing the earlier blocker/no-routes note.