# Humble Bundle

## Overview
- Provider: Humble Bundle
- Category: Games & Comics
- Assigned docs page inspected: `https://rapidapi.com/Ziggoto/api/humble-bundle`
- Official alternative inspected from the listing's Provider Info: `https://humble-api-ziggoto.cloud.okteto.net`
- API style: REST
- Confirmed proxy host from the RapidAPI listing: `humble-bundle.p.rapidapi.com`
- Base URL confirmed from embedded page data: `https://humble-bundle.p.rapidapi.com`
- Auth: the public listing is hosted on RapidAPI and prompts `Sign Up` / `Open playground`, but the accessible public page does not expose a concrete auth-header schema
- HTTPS: yes
- Response format: not explicitly shown in the public listing
- Pagination: none documented in the public listing
- Rate limits: not publicly documented; the embedded listing data exposed `rateLimit: null`
- Confirmed routes: `1`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/get-bundles` | No path/query/body parameters were exposed in the public listing HTML or embedded page data. | Only route publicly visible on the RapidAPI listing. |

## What the public listing confirms
- The listing title is `Humble Bundle` and the version shown is `v1 (current)`.
- The endpoint inventory visible on the page contains one group, `get-bundles`, with one REST endpoint: `GET /get-bundles`.
- Embedded page data for the listing exposes one current RapidAPI proxy hostname: `humble-bundle.p.rapidapi.com`.
- The same embedded page data links a product website URL of `https://humble-api-ziggoto.cloud.okteto.net`.
- The public listing shows `Sign Up`, `Open playground`, and `Go to Playground`, so usage is clearly expected to flow through the RapidAPI platform UI.

## Authentication and access notes
- The public page is a RapidAPI-hosted listing rather than a standalone docs portal.
- The accessible public HTML does not publish a request-security block, example request headers, or a concrete auth parameter list.
- Because the endpoint is published behind RapidAPI and the page prompts signup before playground usage, fireROUTE should treat this provider as RapidAPI-gated.
- Do not hard-code a specific auth header name from this document alone; the public listing did not expose one in the accessible page content inspected here.

## Parameters, pagination, and request-shape notes
- No query parameters were shown for `GET /get-bundles`.
- No path parameters were shown.
- No request-body schema was shown.
- No pagination parameters or paging behavior were documented on the public listing.

## Response, errors, and format notes
- The public listing did not expose example responses or a JSON schema.
- The page did not publish error-status behavior or an error-body format.
- The page did not publish content-negotiation or alternate response-format notes.

## Important usage notes
- The only public route currently exposed is `GET /get-bundles`.
- The linked product website from the listing no longer resolved during manual inspection; the browser returned `ERR_NAME_NOT_RESOLVED` for `humble-api-ziggoto.cloud.okteto.net`.
- Because the alternative provider site is unavailable, the RapidAPI listing is the only currently inspectable public documentation surface for this provider entry.

## Integration notes for fireROUTE
- Treat this provider as a minimal one-route integration until a fuller official schema becomes publicly visible.
- Use the RapidAPI proxy host `humble-bundle.p.rapidapi.com` as the only confirmed base host from the inspected docs.
- Preserve the provider in a limited-confidence state operationally even though one route is documentable, because auth, response schema, and errors are not publicly described on the inspected page.

## Sources inspected
- `https://rapidapi.com/Ziggoto/api/humble-bundle`
- `https://humble-api-ziggoto.cloud.okteto.net`
