# ObjectCut

## Overview
- Provider: ObjectCut
- Category: Photography
- Official docs URL from index: `https://objectcut.com/`
- Documentation status: explicit blocker after manual review
- Confirmed public route count: `0`

## What the official pages currently expose
The official ObjectCut site is still live and clearly describes a background/foreground-removal API product, but it does not publish a stable first-party route reference with concrete public paths.

From the inspected official landing page:
- It describes a real-time RESTful API delivered through RapidAPI
- It shows a `POST` curl example using a placeholder `BASE_RAPIDAPI_URL`
- It shows auth headers `x-rapidapi-host` and `x-rapidapi-key`
- It shows form data fields `image_url` and `to_remove`
- It publishes plan/rate information of `50`, `300`, `2000`, and `10000` images per month, with `1`, `1`, `3`, and `5` requests per second across plans

From the linked official GitHub repository:
- The repo states it contains the logic necessary to run the ObjectCut API
- The repo confirms the project is an online image background-removal service
- The inspected repository page still did not expose a concrete public production hostname/path pair that could replace the placeholder `BASE_RAPIDAPI_URL`

## Why the route count remains zero
A route count here is based on confirmed first-party method + path combinations. The inspected official materials confirm that a POST-based API exists, but they do not publish a concrete public path to pair with that method. Because the public route itself is not named, the confirmed route count remains `0`.

## What was and was not confirmable
- Product type: AI background/foreground removal API
- Auth: RapidAPI-style host/key headers are explicitly shown
- Parameters confirmed on the official page: `image_url`, `to_remove`
- Pricing / throughput signals: monthly quotas and requests-per-second limits are published on the landing page
- Concrete public base URL/path: not confirmable from inspected first-party pages
- Error schema, pagination, and response schema: not confirmable

## fireROUTE note
Keep ObjectCut blocked until the provider exposes a concrete public endpoint path or a full first-party API reference instead of the placeholder RapidAPI URL.

## Sources inspected
- `https://objectcut.com/`
- `https://github.com/AlbertSuarez/object-cut`
