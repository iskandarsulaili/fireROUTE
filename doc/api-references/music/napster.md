# Napster

## Overview
- Provider: Napster
- Category: Music
- Official docs URL from index: `https://developer.napster.com/api/v2.2`
- Documentation status: explicit blocker after manual re-review
- Confirmed public route count for the legacy music API: `0`

## What the official pages currently show
- The indexed legacy music API URL `https://developer.napster.com/api/v2.2` is no longer a browsable reference; in this pass it failed with `ERR_CONNECTION_CLOSED`.
- The current official developer portal at `https://developers.napster.com/docs` is live and titled `Overview`, but it documents the `Omniagent API`, not the historical Napster music API.
- The current docs navigation exposes `Guides`, `API Reference`, and `Changelog`, and the overview page is centered on building/deploying/monitoring Omniagents across channels such as WebRTC, WebSocket, and SIP.
- The overview page also says developers should create an API resource in the Azure Portal and then generate an API key from the dashboard, which further confirms that the live portal now belongs to a different product line.

## What was and was not confirmable for the music API
- Legacy music API base URL: not confirmable from the currently available official pages
- Endpoint paths and HTTP methods: not confirmable for the legacy music API
- Auth model: not confirmable for the legacy music API from currently exposed first-party docs
- Pagination, rate limits, errors, and response format: not confirmable for the legacy music API

## Important usage note
The provider entry still refers to a former music-service API, but Napster's current first-party developer presence has been repurposed to the Omniagent platform. Until Napster republishes a first-party reference for the legacy music API, fireROUTE should treat this provider as blocked.

## Sources inspected
- `https://developer.napster.com/api/v2.2`
- `https://developers.napster.com/docs`
