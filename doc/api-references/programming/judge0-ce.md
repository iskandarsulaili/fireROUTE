# Judge0 CE

## Provider metadata
- Category: `Programming`
- Provider slug: `judge0-ce`
- Docs used manually:
  - `https://ce.judge0.com/`
- Confirmed API base URL: `https://ce.judge0.com`
- Primary media type: JSON
- Version noted on the official docs page: `v1.13.1`
- Authentication model surfaced in docs: instance-configurable header-based tokens
- Manually confirmed routes in this pass: `20`

## Authentication and authorization
From the official Judge0 CE docs:
- administrators can configure an instance to require an authentication token on every request
- the default authentication header name is `X-Auth-Token`
- administrators can also configure authorization for privileged operations
- the default authorization header name is `X-Auth-User`
- the docs explicitly say tokens may also be sent as URI parameters, but recommend always sending them via headers
- `POST /authenticate` checks whether the authentication token is valid
- `POST /authorize` checks whether the authorization token is valid, and the docs note that authentication may also be required on that call when enabled

## Common request/response conventions
- Base URL: `https://ce.judge0.com`
- most endpoints return JSON objects or JSON arrays
- date/time values use `ISO 8601`
- source text fields that cannot be represented safely as JSON UTF-8 can be sent and received with `base64_encoded=true`
- submission creation normally returns a `token` that is later used to retrieve, list, batch-fetch, or delete results

## Manually confirmed endpoint set

### Authentication
1. `POST /authenticate`
   - Validate the current authentication token
   - Default required header when auth is enabled: `X-Auth-Token`
2. `POST /authorize`
   - Validate the current authorization token
   - Default required header when authorization is enabled: `X-Auth-User`

### Submissions
3. `POST /submissions`
   - Create a submission for execution
   - Query parameters confirmed in the docs:
     - `base64_encoded` - whether `source_code`, `stdin`, and `expected_output` are Base64-encoded
     - `wait` - request synchronous completion; the docs warn this may be disabled and does not scale well
   - The docs state a successful create normally returns a submission `token`
4. `GET /submissions/{token}`
   - Retrieve a specific submission by token
   - Query parameters:
     - `base64_encoded`
     - `fields` - comma-separated field selection; `*` returns all attributes
5. `GET /submissions`
   - List submissions
   - Query parameters:
     - `base64_encoded`
     - `fields`
     - `page`
     - `per_page`
   - The docs show pagination metadata including `current_page`, `next_page`, `prev_page`, and `total_pages`
6. `DELETE /submissions/{token}`
   - Delete a submission and return selected attributes
   - Query parameter:
     - `fields`
   - The docs note `base64_encoded` is implicitly `true` for this operation and cannot be changed
7. `POST /submissions/batch`
   - Create multiple submissions in one request
   - Query parameter:
     - `base64_encoded`
8. `GET /submissions/batch`
   - Retrieve multiple submissions in one call
   - Query parameters:
     - `tokens` - comma-separated submission tokens
     - `base64_encoded`
     - `fields`

### Languages and statuses
9. `GET /languages/`
   - Return active languages
10. `GET /languages/{id}`
   - Return a specific language by numeric ID
11. `GET /languages/all`
   - Return active and archived languages
12. `GET /statuses`
   - Return Judge0 status definitions

### System and service information
13. `GET /system_info`
   - Return detailed host system information
14. `GET /config_info`
   - Return Judge0 configuration details, including features like `enable_wait_result` and queue sizing
15. `GET /statistics`
   - Return Judge0 statistics
16. `GET /workers`
   - Return worker/queue health details such as queue size and worker availability
17. `GET /about`
   - Return general service information
18. `GET /version`
   - Return current Judge0 version
19. `GET /isolate`
   - Return the result of `isolate --version`
20. `GET /license`
   - Return license information

## Submission request/body notes
The official submission section documents many submission attributes. The reviewed page explicitly showed these notable fields and limits/semantics:
- `source_code` - program source
- `language_id` - target runtime/language identifier
- `stdin` - standard input
- `expected_output` - optional output for comparison
- resource-control fields such as `cpu_time_limit`, `cpu_extra_time`, and `wall_time_limit`
- the response includes a unique `token`

## Pagination
From the official list-submissions docs:
- pagination is supported on `GET /submissions`
- request parameters:
  - `page`
  - `per_page`
- the response examples include:
  - `current_page`
  - `next_page`
  - `prev_page`
  - `total_pages`
- documented validation errors include:
  - `invalid page: -4`
  - `invalid per_page: -2`

## Rate limits
- the reviewed official Judge0 CE docs did not publish numeric HTTP rate limits
- the docs do publish queue- and worker-related operational configuration such as `max_queue_size`
- the docs explicitly discourage `wait=true` because it does not scale well

## Error and response notes
The official docs explicitly document these important response/error behaviors:
- when text attributes cannot be serialized to UTF-8, the API returns an error instructing the client to use `base64_encoded=true`
- `wait=true` can fail with `{"error":"wait not allowed"}` when disabled on the instance
- privileged calls can fail with authentication or authorization errors when those features are enabled
- submission retrieval defaults to a limited field set unless `fields` is supplied

## Important usage notes
- Judge0 CE is open source and self-hostable; some behavior is instance-specific because administrators can change header names and enable/disable features
- `wait=true` is convenient for testing but not recommended for scalable production use
- the docs are clear that `base64_encoded=true` should be set whenever any of `source_code`, `stdin`, or `expected_output` contains non-printable characters or characters that cannot be sent safely in JSON
- `GET /languages/all` is the documented way to include archived languages; `GET /languages/` is the active-language surface
- `GET /workers` is useful for health monitoring because it reports queue size and worker availability

## Verification notes
This file was manually rebuilt from the official Judge0 CE API docs using browser inspection.