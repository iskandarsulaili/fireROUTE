# Nomics

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `nomics`
- Official pages manually reviewed in this pass:
  - `https://nomics.com/`
  - `https://nomics.com/docs/`
  - `https://www.nomics.com/`
  - `https://www.nomics.com/docs/`
  - `http://nomics.com/`
  - `http://www.nomics.com/`
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked Nomics through both the root site and the historical docs path on the bare and `www` hostnames. In this run, none of the reviewed official entrypoints produced a usable first-party product or documentation page.

## What the reviewed official pages currently confirm
1. `https://nomics.com/` failed before a browsable page loaded.
2. `https://nomics.com/docs/` also failed before any documentation content rendered.
3. `https://www.nomics.com/` and `https://www.nomics.com/docs/` likewise did not yield a usable first-party site in this browser session.
4. Additional fallback attempts against `http://nomics.com/` and `http://www.nomics.com/` also failed before a route reference or product page could be inspected.
5. Because every reviewed official Nomics hostname/path failed before loading a provider-controlled page, no current base URL, auth documentation, endpoint inventory, pagination note, rate-limit note, response format, or error schema could be confirmed from first-party materials.

## Blocker details
This provider is currently blocked by first-party reachability failure rather than by a small gap in the docs.

Because of that, I could not responsibly confirm:
- a live API base URL
- endpoint paths or methods
- authentication requirements
- pagination behavior
- rate limits
- response formats
- error models

## fireROUTE normalization notes
- Keep Nomics marked as `manually_documented` with `0` confirmed current routes.
- Treat the provider as unreachable in the current manual-review environment until an official Nomics page again loads successfully.
- Do not rely on archived route lists or third-party mirrors as evidence of a current Nomics API surface.
