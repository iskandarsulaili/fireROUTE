# Freelancer

Official docs manually reviewed:
- https://developers.freelancer.com/docs
- https://developers.freelancer.com/docs/api-overview/making-a-request
- https://developers.freelancer.com/docs/authentication/authentication-with-oauth
- https://developers.freelancer.com/docs/authentication/using-access-tokens
- https://developers.freelancer.com/docs/api-overview/rate-limiting
- https://developers.freelancer.com/docs/api-overview/sandbox-environment
- https://developers.freelancer.com/docs/projects/projects

## Overview
Freelancer exposes a marketplace API for users, projects, contests, messaging, and related marketplace resources.

Confirmed from the reviewed official docs:
- Production API base: `https://www.freelancer.com/api`
- Sandbox API base: `https://www.freelancer-sandbox.com/api`
- OAuth authorization server: `https://accounts.freelancer.com`
- Primary auth model: OAuth 2.0 access tokens sent in the `freelancer-oauth-v1` request header
- The reviewed auth section also documents personal access tokens as an alternative credential flow for some use cases
- Response format: JSON
- Request model: GET endpoints accept URL or form-encoded parameters; POST / PUT / PATCH endpoints generally require a request body and usually expect JSON; some upload-style endpoints can accept form encoding
- The public reference is organized as browsable endpoint/resource pages rather than one flat OpenAPI inventory

## Confirmed reference surface
The official docs index currently exposes **38** browsable endpoint/resource pages across these families:

| Family | Count | Notes |
|---|---:|---|
| Users | 9 | Users, authenticated-user resources, reputations, portfolios, profiles, enterprises, violation reports, pools |
| Projects | 15 | Projects plus bids, milestones, reviews, currencies, categories, budgets, files, and related resources |
| Contests | 10 | Contests, entries, comments, handovers, offers, prize details, and related resources |
| Messaging | 2 | Messaging and threads |
| Common | 2 | Timezones and countries |

Manual route/reference count confirmed from the reviewed official docs index: **38**.

## Concrete endpoint paths manually confirmed from reviewed official pages
All paths below are relative to the production base `https://www.freelancer.com/api` or sandbox base `https://www.freelancer-sandbox.com/api`.

| Method | Path | Notes |
|---|---|---|
| GET | `/users/0.1/self/` | get the authenticated user; shown on the official access-token and sandbox examples |
| POST | `/users/0.1/self/jobs/` | add job/skill associations for the authenticated user in the official sandbox walkthrough |
| POST | `/projects/0.1/projects/` | create a project |
| PUT | `/projects/0.1/projects/{project_id}/` | perform a project action |
| GET | `/projects/0.1/projects/active/` | search active projects |
| GET | `/projects/0.1/projects/all/` | search all projects via GET |
| POST | `/projects/0.1/projects/all/` | search all projects via POST |
| GET | `/projects/0.1/projects/{project_id}/` | fetch a project by ID |
| DELETE | `/projects/0.1/projects/{project_id}/` | delete a project |
| GET | `/projects/0.1/projects/{project_id}/bids/` | list project bids |
| GET | `/projects/0.1/projects/{project_id}/milestones/` | list project milestones |
| GET | `/projects/0.1/projects/{project_id}/milestone_requests/` | list milestone requests |
| GET | `/projects/0.1/projects/{project_id}/upgrade_fees/` | list upgrade fees |
| GET | `/projects/0.1/projects/{project_id}/bid_upgrade_fees/` | list bid-upgrade fees |
| POST | `/projects/0.1/projects/{project_id}/invite/` | invite freelancers |
| GET | `/projects/0.1/projects/{project_id}/hourly_contract/` | get hourly-contract information |
| GET | `/projects/0.1/projects/{project_id}/ip_contract/` | get IP-contract information |
| POST | `/projects/0.1/bids/` | place a bid; shown in the official sandbox walkthrough |

## Parameters, filtering, and pagination
Confirmed from the reviewed official docs:
- Parameter names follow lower-case, underscore-separated naming such as `my_variable_name`
- Array parameters use square-bracket notation such as `param_name[]`
- Repeated values for the same filter act as a union, while different filters combine as an intersection
- Many list endpoints require at least one ID-based filter
- Standard pagination parameters are:
  - `limit`
  - `offset`
- The docs state that very large `limit` values are usually normalized internally, often effectively capped to `100`

## Auth, rate limits, and errors
Confirmed from the reviewed official docs:
- OAuth 2.0 is the main authentication model
- Access tokens are sent with the header `freelancer-oauth-v1: <oauth_access_token>`
- The official sample rate-limit headers are:
  - `RateLimit-Limit: 50, 50;window=60, 1000;window=3600`
  - `RateLimit-Remaining: 45`
- The reviewed rate-limit page explains that sample policy as `50` requests per `60` seconds and `1000` requests per `3600` seconds
- The documented rate-limit error body includes:
  - `status: "error"`
  - `message: "You have made too many of these requests."`
  - `error_code: "AuthorisationExceptionCodes.RATE_LIMITED"`
  - `request_id`

## Sandbox and environment notes
Confirmed from the reviewed official docs:
- Sandbox host: `https://www.freelancer-sandbox.com`
- Sandbox is intended for integration testing and can be reset periodically without persistence guarantees
- The reviewed sandbox docs explicitly note these current limitations:
  - no outbound email
  - no deposits or withdrawals
  - no mobile push notifications
  - no user password reset
- The sandbox guide also points to a sandbox developer control panel for setting verification flags, depositing test balances, and activating pending sandbox projects

## Important usage notes
- Preserve Freelancer's versioned path segments such as `/users/0.1/...` and `/projects/0.1/...`.
- The reviewed docs say PUT and PATCH may be used interchangeably for compatibility on some endpoints.
- The public docs surface is page-oriented; the confirmed `38` count reflects the currently browsable official endpoint/resource pages rather than a first-party flat operation total.
- Use the sandbox for connector testing before pointing integrations at the production `www.freelancer.com/api` host.