# Cryptonator

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `cryptonator`
- Official pages manually reviewed in this pass:
  - `https://www.cryptonator.com/api/`
  - `https://www.cryptonator.com/`
- Current first-party status confirmed from the reviewed pages: the API path is origin-down behind Cloudflare, and the root domain no longer serves the former product site at all
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked the historical Cryptonator API path and the official site root. The API path now returns a Cloudflare timeout page, while the root domain resolves directly to a seizure-notice image hosted on a U.S. government S3 domain instead of to a live Cryptonator product or documentation surface.

## What the official pages currently confirm
1. `https://www.cryptonator.com/api/` currently renders `cryptonator.com | 522: Connection timed out`.
2. That confirms the API path is failing at the origin-host step before any route reference can load.
3. `https://www.cryptonator.com/` no longer serves the former site; it resolves to `https://seized-domain.s3-us-gov-east-1.amazonaws.com/cryptonator-com/seizure-notice1.png`.
4. The reviewed root-domain behavior means the former official domain is no longer presenting a live provider-controlled application or docs surface.
5. The reviewed official pages do not expose any current API base URL, path inventory, authentication guidance, pagination behavior, rate limits, response formats, or error-schema reference.

## Blocker details
This provider is blocked by severe first-party availability / control failure rather than by a simple docs outage:
- the API path is origin-down behind Cloudflare
- the root domain no longer behaves like an active product or documentation site
- no current provider-controlled developer surface was reachable in this pass

## What could not be confirmed manually
Because of that blocker, I could not responsibly confirm:
- a current API base URL
- endpoint paths or methods
- authentication requirements
- pagination semantics
- rate limits
- response formats
- error objects

## Important usage notes
- Treat Cryptonator as a `0`-route provider until an active first-party technical surface reappears.
- Do not rely on historical Cryptonator examples or mirrors without new first-party confirmation.
- Use the root-domain seizure redirect plus the API-path timeout together when describing the current blocker state.

## fireROUTE normalization notes
- Keep Cryptonator marked `manually_documented` with `0` confirmed current routes.
- Keep the category README docs URL pointed at `https://www.cryptonator.com/`, which is the clearest current first-party state indicator even though it no longer behaves like a docs surface.
