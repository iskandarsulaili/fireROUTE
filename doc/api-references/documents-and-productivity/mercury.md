# Mercury

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `mercury`
- Official pages reviewed manually in this pass:
  - `https://mercury.postlight.com/web-parser/`
  - `https://github.com/postlight/parser`
- Manually confirmed current live-route count: `0`

## Current provider state
The original first-party Mercury Web Parser docs host is no longer reachable.
- `https://mercury.postlight.com/web-parser/` failed with `net::ERR_NAME_NOT_RESOLVED` during manual browser review.

The official Postlight repository is still live on GitHub.
- The reviewed repository page loaded as `GitHub - postlight/parser: 📜 Extract meaningful content from the chaos of a web page · GitHub`.
- The visible repository shell confirmed this is a public `postlight/parser` code repository with normal GitHub project tabs such as `Code`, `Issues`, `Pull requests`, `Actions`, `Security and quality`, and `Insights`.

## Why the route count remains zero
The currently reachable first-party source is the GitHub repository for the parser library, not a live hosted Mercury API reference.
- No current hosted API base URL was exposed on the reviewed official pages.
- No route-by-route HTTP method/path inventory was exposed on the reviewed official pages.
- No current auth contract, request schema, error schema, pagination rules, or rate-limit table for a hosted Mercury API was publicly visible in this pass.

Because the hosted Mercury API documentation is gone and the surviving official repository does not surface a current hosted endpoint contract strongly enough to count, the confirmed fireROUTE route count remains `0`.

## Base URL assessment
- No trustworthy current production API base URL was confirmable from the reviewed official sources.
- The surviving official GitHub repository documents the parser project itself, not a current hosted Mercury API endpoint surface.

## Authentication
- Not confirmable from the currently reachable official pages.
- No current API-key header, OAuth flow, bearer-token flow, or signed-request model was exposed in this pass.

## Endpoint inventory
- No current Mercury hosted API endpoints were manually confirmable from the reviewed official materials.

## Pagination
- Not confirmable from current official sources.

## Rate limits
- Not confirmable from current official sources.

## Error and format notes
- The original docs host currently fails DNS resolution.
- The surviving official GitHub page is HTML repository content rather than a hosted API console or route reference.
- No current response-media-type contract for a hosted Mercury API was visible in this pass.

## Important usage notes
- Treat Mercury as a current first-party continuity blocker for fireROUTE routing purposes.
- Do not promote historical third-party examples of the old Mercury Web Parser service as current source-of-truth routes when the original hosted docs are gone.
- If this provider becomes recoverable later, re-check for a newly published first-party hosted API reference rather than inferring routes from the parser source repository alone.

## Verification note
This file was rebuilt manually from the original Mercury docs host and the live official Postlight GitHub repository using browser tools only.