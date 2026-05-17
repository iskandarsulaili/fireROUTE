# OwlBot

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `owlbot`
- Official pages reviewed manually in this pass:
  - `https://owlbot.info/`
  - `https://owlbot.info/api/v4/dictionary/example`
- Confirmed API base URL in this pass: none safely confirmable from current official materials
- Manually confirmed route count: `0`

## Manual review result
I could not confirm a current OwlBot API contract from the live first-party domain. The official root no longer acts like a product or documentation landing page, and the tested official-host API path is blocked behind Cloudflare verification before any dictionary payload or technical reference becomes visible.

## What the official pages currently show
### 1) Official root domain
- URL reviewed: `https://owlbot.info/`
- Page title during review: `404 Page not found`
- Visible first-party text:
  - `Error: Page not found`
  - `The requested URL was not found on this server.`
- No provider landing page, docs links, auth guide, or endpoint inventory were visible.

### 2) Official-host API path candidate
- URL reviewed: `https://owlbot.info/api/v4/dictionary/example`
- Page title during review: `Just a moment...`
- Visible text during review:
  - `Performing security verification`
  - `This website uses a security service to protect against malicious bots.`
- The page stopped on Cloudflare verification and did not reveal a dictionary response body, schema, or browsable documentation.

## What could not be confirmed manually
Because the current first-party surfaces are either missing or challenge-blocked, I could not responsibly confirm:
- a live API base URL
- confirmed endpoint paths or methods
- request parameters
- authentication requirements
- response schema
- error schema
- rate limits
- pagination behavior

## Important usage notes
- Treat OwlBot as a current first-party continuity blocker.
- Do not promote historical OwlBot route patterns as current without a live provider-controlled docs surface.
- If revisited later, start with the root domain and then re-check whether the official host again exposes a stable docs page or a readable API response.

## fireROUTE normalization notes
- Keep `OwlBot` marked `manually_documented` with `0` confirmed current routes.
- The blocker is a combination of missing first-party docs/root content and challenge-blocked endpoint visibility.

## Verification note
This file was rebuilt from live manual browser review of the current official root page and an official-host API-path candidate only.