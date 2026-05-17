# Duply

## Overview
- Provider: Duply
- Category: Photography
- Official docs URL from index: `https://duply.co/docs#getting-started-api`
- Documentation status: explicit blocker after manual review
- Confirmed public route count: `0`

## Blocker summary
Duply's main product site is live and clearly markets image/video generation through an API, but the published docs URL currently returns a 404 and the visible marketing pages do not expose a concrete endpoint inventory.

- `https://duply.co/docs#getting-started-api` returned `404: This page could not be found.`
- `https://duply.co/` is live and markets Duply as a service that can generate images/videos via API, URL, and integrations
- `https://duply.co/image-api` is live and describes the image-API product and use cases, but does not publish concrete method + path combinations, base URL details, auth headers, or parameter schemas

## What was and was not confirmable
- Brand/product hostname: `duply.co`
- Product positioning: image/video generation via API, URL, and integrations
- Concrete API base URL: not confirmable from the reachable first-party pages
- Endpoint paths and HTTP methods: not confirmable
- Auth details: the old index labeled the provider as `apiKey`, but the reachable first-party pages do not publish the request format
- Rate limits, pagination, errors, and response format: not confirmable

## Important usage note
The product still appears active, but the public docs page that should carry the API reference is gone. fireROUTE should keep Duply blocked until the company restores a first-party reference with actual routes.

## Sources inspected
- `https://duply.co/docs#getting-started-api`
- `https://duply.co/`
- `https://duply.co/image-api`