# Disqus

## Provider metadata
- Category: `Social`
- Provider slug: `disqus`
- Official docs pages used:
  - `https://disqus.com/api/docs/auth/`
  - `https://disqus.com/api/docs/requests/`
  - `https://disqus.com/api/docs/cursors/`
  - `https://disqus.com/api/docs/errors/`
- OAuth host: `https://disqus.com/api/oauth/2.0`
- Main REST API pattern documented: `https://disqus.com/api/3.0/{resource}.json`
- Auth model: OAuth 2 plus public/private API key usage; optional SSO support for Business tier subscriptions
- Response formats documented: JSON and JSONP for GET requests
- Manually confirmed route count: `5`

## Authentication
- The docs describe two authenticated API methods:
  - OAuth 2
  - Single sign-on
- OAuth-enabled applications are treated as anonymous until a valid `access_token` is supplied.
- Public browser-facing requests use `api_key`.
- Server-side requests use `api_secret`.
- The docs say account owners can also use a long-lived access token from their account details page.
- SSO access is documented as Business-tier only.

## Request construction
- The official request pattern is:
  - `https://disqus.com/api/{version}/{resource}.{output_type}`
- The only documented API version on the reviewed pages is `3.0`.
- The only documented output format is JSON, with JSONP also supported for GET requests when a callback is supplied.
- The docs recommend SSL/HTTPS for all requests.
- Read requests generally use `GET`; write requests generally use `POST`.

## Canonical endpoints

### 1) Authorize a user
- Method: `GET`
- Path: `/api/oauth/2.0/authorize/`
- Base URL: `https://disqus.com`
- Purpose: send a user through Disqus consent and receive a temporary authorization code or app-creation code

Query parameters documented:
- `client_id` - required for standard OAuth user authorization
- `scope` - required; available values listed are `read`, `write`, `email`, `admin`
- `response_type` - required; reviewed values are `code` and `api_key`
- `redirect_uri` - required callback URL and its domain must be in the app's trusted domains

Response notes:
- After the user accepts, Disqus redirects back with a temporary `code` query parameter.

### 2) Exchange authorization code for access token
- Method: `POST`
- Path: `/api/oauth/2.0/access_token/`
- Base URL: `https://disqus.com`
- Purpose: exchange the callback code for a user `access_token`

Form/body parameters documented:
- `grant_type` - required; value `authorization_code`
- `client_id` - required
- `client_secret` - required
- `redirect_uri` - required
- `code` - required temporary code from the authorize step

Usage notes:
- The docs refer readers to the token response documentation for token payload details.
- Requests are made over HTTPS.

### 3) Refresh an OAuth token
- Method: `POST`
- Path: `/api/oauth/2.0/access_token/`
- Base URL: `https://disqus.com`
- Purpose: replace an expired user token with a new one

Form/body parameters documented:
- `grant_type` - required; value `refresh_token`
- `client_id` - required
- `client_secret` - required
- `refresh_token` - required

Refresh notes:
- The docs recommend refreshing before expiry to account for network lag.
- The docs also say each user only has one active token at a time per application, so refreshing invalidates the prior token.

### 4) Create a new application through OAuth
- Method: `POST`
- Path: `/api/oauth/2.0/api_key/`
- Base URL: `https://disqus.com`
- Purpose: exchange an app-creation authorization code for a new `api_key`

Form/body parameters documented:
- `grant_type` - required; value `api_key`
- `redirect_uri` - required
- `code` - required temporary code obtained with `response_type=api_key`
- `application[label]` - optional app label
- `application[description]` - optional app description
- `application[website]` - optional app website
- `application[organization]` - optional organization name

### 5) Fetch details for the authenticated user
- Method: `GET`
- Path: `/api/3.0/users/details.json`
- Base URL: `https://disqus.com`
- Purpose: example authenticated resource request shown by the official auth docs

Query parameters documented in the example:
- `access_token` - required to act on behalf of the user
- `api_key` - required public key
- `api_secret` - required only for server-side flow according to the auth page note

## Pagination
- Disqus uses cursor-based pagination.
- When an endpoint supports pagination, the response includes a top-level `cursor` object with:
  - `prev`
  - `hasNext`
  - `next`
  - `hasPrev`
  - `total`
- The docs note that `total` is often `null`.
- Clients pass the returned `cursor.next` value back as the `cursor` query parameter on the next request.
- The docs say a `next` cursor is always generated, even when the next page may not yet contain results.

## Errors, rate limits, and format notes
- Every normal API response includes an HTTP status code plus a JSON body with an API code and message.
- Two documented exceptions:
  - Invalid formats return HTTP `415` with an error message as the response body.
  - JSONP without a callback returns a JavaScript-commented response.
- The reviewed error-code page documents these notable codes:
  - `401 / code 4` - must be authenticated
  - `403 / code 5` - invalid API key
  - `400 / code 13` - exceeded the rate limit for the resource
  - `400 / code 14` - exceeded the rate limit for the account
  - `500 / code 15` - internal server error
  - `408 / code 16` - request timed out
  - `503 / code 20` and `21` - maintenance modes
- The reviewed docs do not publish numeric rate-limit ceilings.

## Parameter and request notes
- Multi-value parameters can be sent either as repeated keys (`param=foo&param=bar`) or bracket syntax (`param[]=foo&param[]=bar`), with repeated keys marked as preferred.
- Some parameters support typed query suffixes such as `user:username=foobar`.
- JSONP callbacks are allowed only on `GET` requests.

## fireROUTE normalization notes
- Preserve the distinction between public `api_key` flows, server-side `api_secret` flows, and OAuth `access_token` flows.
- Keep Disqus cursor pagination as-is rather than trying to flatten it into offset/limit.
- Model OAuth authorize, code exchange, refresh, and app-creation as separate operations even though two flows share the same token endpoint.
