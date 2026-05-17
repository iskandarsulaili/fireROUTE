# Kelley Blue Book

## Provider metadata
- Category: `Vehicle`
- Provider slug: `kelley-blue-book`
- Official pages reviewed manually in this pass:
  - `https://developer.kbb.com/data/1-Default`
  - `https://developer.kbb.com/idws/1-Default`
  - `https://developer.kbb.com/batchvin/1-Default`
  - `https://developer.kbb.com/access`
- Manually confirmed current live-route count: `0`

## Current provider state
Kelley Blue Book still exposes a live first-party developer portal, but the public route reference remains unavailable.

Across the reviewed official pages, the visible portal chrome still exposes navigation for:
- `Home`
- `Our APIs`
- `IDWS 4.0`
- `Batch VIN`
- `API Documentation`
- `Contact Us`

The reviewed product pages still surface the same blocking public dialog:
- `Unable to load webpage`
- `Sorry, we were unable to load the requested page. Please try again.`

## Access and onboarding clues currently visible
The reviewed access page resolves to `https://developer.kbb.com/access#!/access` and visibly exposes these headings:
- `API ACCESS`
- `Getting API Access`
- `How do i obtain credentials?`
- `Requesting Access`

Those public headings confirm that credentials are still part of the official onboarding flow, but the currently visible portal does not expose the route-by-route API contract needed for fireROUTE extraction.

## Base URL assessment
- No trustworthy production API base URL could be confirmed from the currently visible public portal pages.
- The reviewed URLs are clearly documentation/onboarding pages under `https://developer.kbb.com`, not confirmed API endpoint bases.
- Because the visible docs viewer fails before showing endpoint content, no exact backend API host, version path, or transport details could be safely extracted.

## Authentication
- The public access page confirms a credential-request flow exists.
- However, the current public portal pages do not expose the concrete auth mechanism strongly enough to confirm whether the live products use API-key headers, OAuth, signed requests, or another credential model.
- No token endpoint, header name, or query credential parameter was visible in this pass.

## Route inventory
- No concrete HTTP method+path operations were publicly confirmable from the reviewed official pages.
- Confirmed fireROUTE route count remains `0`.

## Parameters, pagination, errors, and limits
### Parameters
- No route-level parameters were visible on the reviewed public pages.

### Pagination
- No pagination model was exposed.

### Errors
- The only directly visible current public failure signal was the repeated portal dialog:
  - `Unable to load webpage`
  - `Sorry, we were unable to load the requested page. Please try again.`

### Rate limits
- No public numeric rate-limit policy or quota table was visible on the reviewed pages in this pass.

## Format notes
- The currently visible public portal pages did not expose a usable OpenAPI document, route table, request example, or response schema.
- The present blocker is route visibility from the official portal, not total provider disappearance.

## Important usage notes
- Treat Kelley Blue Book as a live provider whose current public docs viewer is failing or withholding endpoint details.
- The public portal still advertises products such as `IDWS 4.0` and `Batch VIN`, but that is not sufficient to count concrete routes.
- Do not infer active routes from stale unofficial examples while the first-party portal is not publishing a trustworthy route inventory.

## Verification note
This file was rebuilt manually from live first-party Kelley Blue Book developer pages using browser tools only. No concrete API routes were counted because the current public portal still exposes onboarding/product shell pages while failing to show a usable route reference.
