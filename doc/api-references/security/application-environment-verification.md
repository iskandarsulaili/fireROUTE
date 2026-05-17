# Application Environment Verification

## Provider metadata
- Category: `Security`
- Provider slug: `application-environment-verification`
- Official pages manually reviewed:
  - `https://github.com/fingerprintjs/aev`
  - `https://fingerprint.com/blog/aev/`
- Manual review outcome: `manually_documented_no_public_http_api`
- Confirmed public HTTP routes in this pass: `0`

## Manual review result
The official material reviewed in this pass documents an Android device-safety library, not a public HTTP API surface.

## What the official pages currently show
- The GitHub repository title currently says: `Android library to verify the safety of user devices. Make sure that API calls from your app can be trusted. Instantly detect rooted devices, emulators, cloned apps, and other risk factors.`
- The GitHub repository page also shows that the repository is archived and read-only.
- The obvious current Fingerprint-hosted alternative page `https://fingerprint.com/blog/aev/` returned a Fingerprint `Not found` page instead of product/API reference content.

## What could be confirmed
- The reviewed official repository is distributed as an Android library / SDK rather than a documented public REST API.
- No provider-controlled page reviewed in this pass exposed:
  - a public API base URL
  - HTTP endpoint paths
  - HTTP methods
  - request parameter contracts
  - pagination behavior
  - rate limits
  - error payload schemas
- Because no public HTTP endpoint reference was present, the catalog's historical auth/CORS hints could not be re-verified from live official docs.

## Confirmed routes
No public HTTP routes were manually confirmed.

Manual route count confirmed: **0**.

## fireROUTE note
Treat AEV as a library/SDK integration rather than a fireROUTE-routable web API unless new official HTTP API documentation appears on provider-controlled pages.