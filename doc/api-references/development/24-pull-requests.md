# 24 Pull Requests

## Provider metadata
- Category: `Development`
- Provider slug: `24-pull-requests`
- Docs used manually:
  - `https://24pullrequests.com/api`
- Confirmed REST API base URL: `https://24pullrequests.com`
- Primary media type: JSON, with optional JSONP wrapping for GET requests
- Authentication model surfaced in docs: none
- Manually confirmed routes in this pass: `7`

## Authentication
- The official API page does not document API keys, OAuth, session cookies, or any other authentication requirement.
- All documented example calls are anonymous `GET` requests.
- The docs explicitly describe the API as a public JSON API.

## Common request/response conventions
- Base URL: `https://24pullrequests.com`
- All manually confirmed operations use `GET`.
- Collection endpoints return JSON arrays.
- Detail/metadata endpoints return JSON objects.
- Any documented GET call can be wrapped as JSONP with the `callback` query parameter.
- The docs' sample payloads show nested user, organisation, and pull request objects with stable hyperlink fields back to the website.

## Manually confirmed endpoint set

### 1) List projects
- Method: `GET`
- Path: `/projects.json`
- Full URL: `https://24pullrequests.com/projects.json`
- Purpose: return all suggested projects on the site, ordered alphabetically.
- Query parameters confirmed on the official page:
  - `page` - optional pagination selector shared by multi-item endpoints
  - `callback` - optional JSONP wrapper function name
- Response notes confirmed on the official page:
  - returns a JSON array
  - sampled fields include `description`, `github_url`, and `main_language`

### 2) List contributions / pull requests
- Method: `GET`
- Path: `/pull_requests.json`
- Full URL: `https://24pullrequests.com/pull_requests.json`
- Purpose: load all user contributions during December, ordered newest first.
- Query parameters confirmed on the official page:
  - `page`
  - `callback`
- Response notes confirmed on the official page:
  - returns a JSON array of pull request objects
  - sampled fields include `title`, `issue_url`, `repo_name`, `body`
  - each entry includes a nested `user` object with `id`, `nickname`, `gravatar_id`, `github_profile`, `contributions_count`, and `link`

### 3) Get contribution metadata totals
- Method: `GET`
- Path: `/pull_requests/meta.json`
- Full URL: `https://24pullrequests.com/pull_requests/meta.json`
- Purpose: return summary metadata for the yearly contributions feed.
- Query parameters confirmed on the official page:
  - `callback`
- Response notes confirmed on the official page:
  - returns a JSON object
  - sampled fields are `count` and `total_pages`

### 4) List users
- Method: `GET`
- Path: `/users.json`
- Full URL: `https://24pullrequests.com/users.json`
- Purpose: load all registered users ordered by number of December contributions.
- Query parameters confirmed on the official page:
  - `page`
  - `callback`
- Response notes confirmed on the official page:
  - returns a JSON array of users
  - sampled top-level fields include `id`, `nickname`, `gravatar_id`, `github_profile`, `contributions_count`, and `link`
  - each user object can include nested `organisations[]` and `pull_requests[]`

### 5) Get a single user
- Method: `GET`
- Path: `/users/{nickname}.json`
- Full URL example: `https://24pullrequests.com/users/andrew.json`
- Purpose: return profile and contribution details for a specific user.
- Path parameters confirmed on the official page:
  - `nickname` - site username / slug
- Query parameters confirmed on the official page:
  - `callback`
- Response notes confirmed on the official page:
  - returns a JSON object with the same shape shown in list results, including nested organisations and pull requests

### 6) List organisations
- Method: `GET`
- Path: `/organisations.json`
- Full URL: `https://24pullrequests.com/organisations.json`
- Purpose: return organisations represented on the site.
- Query parameters confirmed on the official page:
  - `page`
  - `callback`
- Response notes confirmed on the official page:
  - returns a JSON array
  - sampled fields include `login`, `avatar_url`, `link`, and nested `users[]`

### 7) Get a single organisation
- Method: `GET`
- Path: `/organisations/{login}.json`
- Full URL example: `https://24pullrequests.com/organisations/uswitch.json`
- Purpose: return a single organisation with its members.
- Path parameters confirmed on the official page:
  - `login` - organisation slug / login name
- Query parameters confirmed on the official page:
  - `callback`
- Response notes confirmed on the official page:
  - returns a JSON object with `login`, `avatar_url`, `link`, and nested `users[]`

## Pagination
- The official API page says requests that return multiple items are paginated to `99` items by default.
- Use the `?page=` query parameter to request additional pages.
- The only explicitly documented total-count helper in the reviewed page is `/pull_requests/meta.json`, which returns `count` and `total_pages`.

## Rate limits
- No numeric rate-limit policy is published on the official API page.
- The reviewed official page does not mention throttle headers or retry windows.

## Error and response notes
- The official page focuses on happy-path examples and does not publish a dedicated error schema.
- JSONP responses return the same payload wrapped in the function name passed via `callback`.
- Sample link fields in examples sometimes point to localhost / mixed hostnames in older examples; route paths themselves were still clearly documented on the official page.

## Important usage notes
- The service is route-light and page-oriented; every reviewed route is a website-hosted JSON feed rather than a separate API hostname.
- JSONP is globally documented for GET routes, which is unusual for modern APIs but still explicitly supported here.
- Collections are December-campaign oriented, so consumers should not assume year-round activity levels or continuously changing datasets.

## Verification notes
This file was manually rebuilt from the official 24 Pull Requests API page using browser inspection.