# Travis CI

## Provider metadata
- Category: `Continuous Integration`
- Provider slug: `travis-ci`
- Docs used manually:
  - `https://docs.travis-ci.com/api/`
- Confirmed API bases from the official page:
  - `https://api.travis-ci.org`
  - `https://api.travis-ci.com`
  - `https://travis.example.com/api` for Enterprise/self-hosted installations
- API versioning note from the official page: the page documents API `V2` / `V2.1` and explicitly says new users should prefer API `V3`
- Primary media type: JSON, with plain-text log retrieval also documented
- Authentication model surfaced in docs: Travis access token via `Authorization: token "..."`; token exchange via `POST /auth/github`
- Manually confirmed routes in this pass: `20`

## Authentication and headers
From the official Travis API reference page:
- authenticated requests use `Authorization: token "YOUR TRAVIS ACCESS TOKEN"`
- the page explicitly warns not to confuse the API access token with the token shown on the profile page
- clients are told to always send:
  - `User-Agent`
  - `Accept: application/vnd.travis-ci.2.1+json`
- the docs show GitHub-token exchange at:
  - `POST /auth/github`
- the docs also describe a full browser OAuth handshake at:
  - `/auth/handshake`
  - `/auth/post_message` for safelisted embedded-postMessage flows

## Common request/response conventions
- open-source projects use `https://api.travis-ci.org`
- private projects use `https://api.travis-ci.com`
- Enterprise/custom installations use `https://travis.example.com/api`
- JSONP and CORS are both documented for browser usage
- log retrieval can return plain text instead of JSON
- API V2.1 behavior differences are called out for public/private repository auth failures and repository visibility cases

## Manually confirmed endpoint set
1. `POST /auth/github`
   - Exchange a GitHub token for a Travis access token
   - Official request body shown: `{"github_token":"YOUR GITHUB TOKEN"}`
   - Success response shown: `{"access_token":"YOUR TRAVIS ACCESS TOKEN"}`

2. `GET /config`
   - Return Travis external-service configuration data
   - Official example includes `github.api_url`, required GitHub scopes, and a `pusher.key`

3. `GET /accounts`
   - List user-accessible accounts/organizations
   - Confirmed query parameter:
     - `all` - include accounts the user does not have admin access to
   - Official note: this request always needs authentication

4. `GET /broadcasts`
   - List broadcasts/system messages
   - Official note: this request always needs authentication

5. `GET /builds`
   - List builds across repositories
   - Confirmed query parameters from the docs:
     - `ids`
     - `repository_id`
     - `slug`
     - `number`
     - `after_number` - used for pagination
     - `event_type` - `push` or `pull_request`
   - Official note: you must provide either `ids`, `repository_id`, or `slug`

6. `GET /repos/{repository.id}/builds`
   - List builds for a repository by numeric ID
   - Confirmed query parameters:
     - `number`
     - `after_number`
     - `event_type`

7. `GET /repos/{+repository.slug}/builds`
   - List builds for a repository by slug
   - Confirmed query parameters:
     - `number`
     - `after_number`
     - `event_type`

8. `GET /builds/{build.id}`
   - Fetch a build by build ID
   - The official page also shows equivalent repository-scoped variants:
     - `GET /repos/{repository.id}/builds/{build.id}`
     - `GET /repos/{+repository.slug}/builds/{build.id}`

9. `POST /builds/{build.id}/cancel`
   - Cancel a build
   - Official note: this request always needs authentication

10. `POST /builds/{build.id}/restart`
    - Restart a build
    - Official note: this request always needs authentication

11. `GET /hooks`
    - List hooks/repositories
    - Official note: this request always needs authentication

12. `PUT /hooks`
    - Enable/disable a hook using form-style parameters
    - Confirmed parameters:
      - `hook[id]`
      - `hook[active]`

13. `PUT /hooks/{hook.id}`
    - Enable/disable a specific hook by ID
    - Confirmed parameter:
      - `hook[active]`

14. `GET /jobs/{job.id}`
    - Fetch a single job
    - The jobs section also documents bulk fetch filters using exactly one of:
      - `ids`
      - `state`
      - `queue`

15. `POST /jobs/{job.id}/cancel`
    - Cancel a job
    - Official note: this request always needs authentication

16. `POST /jobs/{job.id}/restart`
    - Restart a job
    - Official note: this request always needs authentication

17. `GET /logs/{log.id}`
    - Fetch a log as JSON
    - The logs section documents chunked retrieval via an alternate media-type attribute `chunked=true`

18. `GET /jobs/{job.id}/logs`
    - Fetch job logs as plain text
    - Official note: archived logs may redirect

19. `GET /repos/{+repository.slug}`
    - Fetch repository details by slug
    - The repository section also documents the numeric-ID variant `GET /repos/{repository.id}`
    - The “find repositories” section confirms filter parameters:
      - `ids`
      - `member`
      - `owner_name`
      - `slug`
      - `search`
      - `active`

20. `GET /requests`
    - List requests that explain whether and why GitHub events triggered builds
    - Confirmed query parameters:
      - `repository_id`
      - `slug`
      - `limit` - default `25`, max `100`
      - `older_than` - request-id based pagination cursor
    - The request section also documents `GET /requests/{request.id}`

## Additional route families explicitly visible on the official page
The official page also visibly documents other endpoint families, though I did not count them again in the `20`-route total above:
- branches:
  - `GET /repos/{repository.id}/branches`
  - `GET /repos/{+repository.slug}/branches`
  - `GET /repos/{repository.id}/branches/{branch}`
  - `GET /repos/{+repository.slug}/branches/{branch}`
- repository caches:
  - `GET /repos/{repository.id}/caches`
  - `GET /repos/{+repository.slug}/caches`
  - `DELETE /repos/{repository.id}/caches`
  - `DELETE /repos/{+repository.slug}/caches`
- repository keys:
  - `GET /repos/{repository.id}/key`
  - `GET /repos/{+repository.slug}/key`
  - `POST /repos/{repository.id}/key`
  - `POST /repos/{+repository.slug}/key`
- settings:
  - `GET /repos/{repository.id}/settings`
  - `PATCH /repos/{repository.id}/settings`
  - environment variables under `/repos/settings/env_vars`
  - SSH key management under `/settings/ssh_key/{id}`
- users:
  - `GET /users/`
  - `GET /users/{user.id}`
  - `POST /users/sync`
  - `GET /users/permissions`
- linting:
  - `POST /lint`
  - `PUT /lint`

## Pagination
From the official Travis docs:
- builds pagination uses `after_number`
- requests pagination uses `older_than`
- branch listing explicitly says it returns the latest `25` branches
- jobs bulk fetch with `state` or `queue` is capped at a maximum of `250` jobs
- many collection endpoints expose filtering rather than a single global page-token system

## Rate limits
- the reviewed Travis V2/V2.1 page did not publish numeric rate-limit quotas
- the page did document response-behavior differences for public vs private repos and for authenticated vs unauthenticated callers

## Error and response notes
The official page explicitly documents these notable behaviors:
- API V2.1 alters auth/visibility response semantics compared with older V2 behavior
- for public repos, unauthenticated calls can return `200` or `404` depending on the endpoint/resource
- for private repos, unauthenticated calls can return `401` or `404`
- `POST /users/sync` may return `409` if the user is already syncing
- archived plain-text logs may redirect on `GET /jobs/{job.id}/logs`
- log retrieval can return JSON or plain text depending on the endpoint and `Accept` handling

## Important usage notes
- the official Travis page itself says new integrations should generally use API V3; this provider document is for the still-documented V2/V2.1 surface because that is what the assigned provider row points to
- self-hosted Enterprise installations move the API base under the installation domain with `/api`
- GitHub remains a core dependency in this API model: Travis documents GitHub-scope discovery through `/config` and GitHub-token exchange for authentication
- browser integrations can use either CORS or JSONP, but the docs recommend CORS when possible
- secure environment variables depend on repository public keys from the repository-key endpoints

## Verification notes
This file was manually rebuilt from the official Travis CI API V2 reference page.