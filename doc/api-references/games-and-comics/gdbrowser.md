# GDBrowser

## Overview
- Provider: `GDBrowser`
- Category: `Games & Comics`
- Shard: `fireROUTE-SHARD::games-and-comics::10`
- Official docs URL reviewed first: `https://gdbrowser.com/api/`
- Official alternative page reviewed: `https://gdbrowser.com/`
- Manual status: `manual_blocked`
- Confirmed route count: `0`

## What the official pages showed
- `https://gdbrowser.com/api/` loaded with title `GD Level Browser API`.
- The visible page heading was `Hi there!`.
- The visible body text said `Please don't use this API.` and warned that it is `slow, unreliable, stressful on my servers, and will likely be removed in the future.`
- The same official page linked readers to `gddocs`, but it did not publish a route table, endpoint list, parameter contract, auth guide, rate-limit notes, pagination notes, error schema, or example API payloads on the reviewed page itself.
- `https://gdbrowser.com/` loaded with title `Geometry Dash Browser!`.
- The visible root-page snapshot exposed only the heading `Yikes!`, not API documentation.

## Confirmed integration details
- Stable official API base URL: not verifiable from the currently reachable official pages.
- Endpoint paths manually checked:
  - `/api/`
  - `/`
- Methods confirmed in this pass:
  - anonymous browser `GET` requests to the listed public URLs
- Parameters: not published on the reviewed official pages.
- Authentication: not published on the reviewed official pages.
- Rate limits: not published on the reviewed official pages.
- Pagination: not published on the reviewed official pages.
- Errors: no official API error contract was exposed on the reviewed pages.
- Format notes: the reviewed official pages exposed HTML only.

## Why this remains blocked for fireROUTE
- The indexed official API page is now only a deprecation-style warning page.
- The official root page did not expose route-level API documentation either.
- Because the reviewed official pages do not publish a trustworthy current route contract, fireROUTE cannot safely confirm endpoints, methods, parameters, auth, rate limits, pagination, error behavior, response formats, or a route count above zero.

## fireROUTE integration note
- Keep this provider in `manual_blocked` state until `gdbrowser.com` again exposes a current official route reference on a provider-controlled page.
- Do not reconstruct the contract from `gddocs`, mirrors, or community lists while the assigned official pages do not themselves expose a verifiable route inventory.

## Sources inspected
- `https://gdbrowser.com/api/`
- `https://gdbrowser.com/`
