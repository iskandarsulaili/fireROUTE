# PRC Exam Schedule

## Provider metadata
- Category: `Government`
- Provider slug: `prc-exam-schedule`
- Assigned docs URL: `https://api.whenisthenextboardexam.com/docs/`
- Official docs/pages reviewed in this run:
  - `https://api.whenisthenextboardexam.com/docs/`
  - `https://api.whenisthenextboardexam.com/`
  - `https://whenisthenextboardexam.com/`
- Current status after official review: `manual_blocker_documented`
- Current public API base URL: none confirmed from the reviewed official URLs in this run
- Authentication model: not confirmable because no official page or endpoint could be reached successfully
- Response format: not confirmable because no official page or endpoint could be reached successfully
- Rate limits: not confirmable because no official page or endpoint could be reached successfully
- Pagination: not confirmable because no official page or endpoint could be reached successfully
- Error format: no provider-owned API error schema could be confirmed from the reviewed official URLs in this run
- Manually confirmed canonical route count: `0`

## What was confirmed from the official site
- Direct navigation to the assigned docs page `https://api.whenisthenextboardexam.com/docs/` failed with `Page.navigate` error text `net::ERR_NAME_NOT_RESOLVED`.
- Direct navigation to the reviewed API root `https://api.whenisthenextboardexam.com/` failed with the same `Page.navigate` error text `net::ERR_NAME_NOT_RESOLVED`.
- Direct navigation to the reviewed provider-controlled site root `https://whenisthenextboardexam.com/` also failed with `Page.navigate` error text `net::ERR_NAME_NOT_RESOLVED`.
- Browser error pages for both the docs host and the site root stated that the server IP address could not be found.
- Because the docs host, API host, and main site domain all failed DNS resolution, no live official documentation, API explorer, or route inventory could be opened in this run.

## Why this remains blocked
- The provider-controlled domain family is still not resolvable from the configured browser environment.
- With the docs host, API root, and site root all failing DNS resolution, no canonical base URL, endpoint list, methods, parameters, authentication model, pagination rules, rate-limit policy, error schema, or response format can be confirmed from live official sources.

## Auth, rate limits, pagination, errors, and format notes
- Auth: not confirmable because no official page or endpoint could be reached.
- Rate limits: not confirmable because no official page or endpoint could be reached.
- Pagination: not confirmable because no official page or endpoint could be reached.
- Errors: the only directly confirmed behavior in this run was browser-level DNS failure, `ERR_NAME_NOT_RESOLVED`, on the docs host, API root, and site root.
- Format notes: no official response envelope or media type could be verified in this run.

## Important usage notes
- Keep this provider at `manual_blocker_documented` until the `whenisthenextboardexam.com` domain family becomes reachable again with a live provider-controlled docs page or API site.
- Do not normalize historical or third-party route descriptions into fireROUTE without a live official reference.
- Reattempt this provider only after the official domains resolve successfully and expose a current API reference.
