# Dribbble

## Manual review status
- Category: `Art & Design`
- Official pages reviewed:
  - `https://developer.dribbble.com/`
  - `https://developer.dribbble.com/v2/`
  - `https://developer.dribbble.com/v2/oauth/`
  - `https://developer.dribbble.com/v2/attachments/`
  - `https://developer.dribbble.com/v2/projects/`
  - `https://developer.dribbble.com/v2/shots/`
  - `https://developer.dribbble.com/v2/user/`
  - `https://developer.dribbble.com/v2/jobs/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `17`

## API overview
- Core API base URL: `https://api.dribbble.com/v2`
- OAuth host surfaced in docs: `https://dribbble.com`
- Transport: HTTPS only
- Primary format: JSON
- Authentication:
  - OAuth2 is required
  - bearer token can be sent in the `Authorization: Bearer ACCESS_TOKEN` header
  - the overview page also documents `access_token` query-parameter usage
- OAuth scopes explicitly documented:
  - `public` — read-only access to public information; default if no scope is requested
  - `upload` — create, update, and delete shots and attachments

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `https://dribbble.com/oauth/authorize` | OAuth authorization endpoint. Query parameters include `client_id`, optional `redirect_uri`, optional `scope`, optional `state`. |
| POST | `https://dribbble.com/oauth/token` | Exchanges an authorization code for an access token. |
| POST | `/shots/{shot}/attachments` | Create an attachment for a shot. Requires `upload` scope; owner must also be pro, a team, or a team member. |
| DELETE | `/shots/{shot}/attachments/{id}` | Delete an attachment from a shot. Requires `upload` scope and ownership. |
| GET | `/user/projects` | List the authenticated user's projects. |
| POST | `/projects` | Create a project. |
| PUT | `/projects/{id}` | Update a project. |
| DELETE | `/projects/{id}` | Delete a project. |
| GET | `/user/shots` | List the authenticated user's shots. |
| GET | `/shots/{id}` | Get one shot; docs note this returns only shots owned by the currently authenticated user. |
| POST | `/shots` | Create a shot. Requires `upload` scope. |
| PUT | `/shots/{id}` | Update a shot. Requires `upload` scope. |
| DELETE | `/shots/{id}` | Delete a shot. Requires `upload` scope. |
| GET | `/user` | Get the authenticated user. |
| POST | `/jobs` | Create a job. Requires a special jobs token obtained by contacting Dribbble. |
| PUT | `/jobs/{id}` | Update a job. Requires a special jobs token. |
| GET | `/jobs/{id}` | Show a job. Requires a special jobs token. |

## Parameters manually confirmed
### OAuth authorization and token exchange
- `client_id` — required on both authorize and token calls
- `client_secret` — required on token exchange
- `code` — required on token exchange after the authorization redirect
- `redirect_uri` — optional on authorize, accepted on token exchange, and constrained to the registered callback host/port/path rules
- `scope` — optional space-separated scope list on authorize
- `state` — optional anti-CSRF value echoed back on redirect

### Pagination and common query parameters
- `page` — supported on paginated list calls; default first page when omitted
- `per_page` — some list resources support custom page sizes up to `100`
- `access_token` — token can be passed as a query parameter instead of a header

### Attachment parameters
- `file` — required file upload for `POST /shots/{shot}/attachments`
- attachment files must be no larger than `10` megabytes

### Project parameters
- `name` — required on create, optional on update
- `description` — optional on create and update

### Shot parameters
- `image` — required upload file on shot creation
- `title` — required on create, optional on update
- `description` — optional shot body text
- `low_profile` — boolean
- `rebound_source_id` — integer
- `scheduled_for` — timestamp
- `tags` — array
- `team_id` — integer
- the create-shot page also notes a `404 Not Found` condition for invalid rebound sources

### Job parameters
- required on create: `organization_name`, `title`, `location`, `link_to_apply`, `description`
- optional job controls: `active`, `team`, `category`, `role_type`, `website`, `twitter`, `instagram`, `facebook`, `onsite_or_remote`, `onsite_only`, `remote_only`
- documented `category` values include roles such as `Graphic Designer`, `UI/UX Designer`, `Product Designer`, `Illustrator`, `Animator`, `Front-end Developer`, and `Other`
- documented `role_type` values: `full-time`, `part-time`, `freelance`, `contract`
- job descriptions allow only the tags `a`, `ol`, `ul`, `li`, `h1`, `h2`, `h3`, `p`, `strong`, `em`, and `br`

## Response, pagination, and error notes
- all reviewed responses are JSON
- timestamps are documented as ISO 8601: `YYYY-MM-DDTHH:MM:SSZ`
- list responses are paginated to `30` items by default
- `Link` headers expose `rel="prev"` and `rel="next"` URLs for pagination
- many responses return `ETag`; many also return `Last-Modified`
- the docs explicitly support conditional requests with `If-None-Match` and `If-Modified-Since`
- unchanged resources return `304 Not Modified`
- reviewed client-side error examples:
  - `400 Bad Request` for invalid JSON with `{"message":"Problem parsing JSON."}`
  - `422 Unprocessable Entity` for validation failures with an `errors` array
  - `429 Too Many Requests` with `{"message":"API rate limit exceeded."}` when the limit is exceeded
- `POST /shots` returns `202 Accepted` and a `Location` header rather than an immediate final shot payload
- `POST /shots/{shot}/attachments` is also documented as asynchronous and returns `202 Accepted`

## Rate limits and transport notes
- the overview page documents `60` requests per minute and `1,440` requests per day per authenticated user
- reviewed responses expose `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`
- `X-RateLimit-Reset` is documented as a UTC epoch-seconds timestamp
- the API supports CORS for AJAX requests
- the reviewed CORS examples expose:
  - `Access-Control-Allow-Origin`
  - `Access-Control-Expose-Headers: ETag, Link, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset`
  - `Access-Control-Allow-Credentials: true`
  - preflight `OPTIONS, GET` support with `Access-Control-Max-Age: 86400`

## Important usage notes
- Dribbble requires application registration before OAuth use.
- The OAuth page says Dribbble currently supports no authentication method other than OAuth.
- Redirect URI validation is strict: the docs require the provided host and port to exactly match the registered callback, and the path must be the callback path or one of its subdirectories.
- The jobs API is not generally available with ordinary OAuth tokens; the docs explicitly say you need a special token and must contact Dribbble for partnership access.
- Some list endpoints support `per_page`, but the overview warns that not every endpoint respects it.
- The overview recommends following pagination links from the `Link` header instead of constructing URLs manually.

## Sources inspected
- `https://developer.dribbble.com/`
- `https://developer.dribbble.com/v2/`
- `https://developer.dribbble.com/v2/oauth/`
- `https://developer.dribbble.com/v2/attachments/`
- `https://developer.dribbble.com/v2/projects/`
- `https://developer.dribbble.com/v2/shots/`
- `https://developer.dribbble.com/v2/user/`
- `https://developer.dribbble.com/v2/jobs/`
