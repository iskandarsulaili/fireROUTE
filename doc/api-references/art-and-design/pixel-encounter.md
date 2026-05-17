# Pixel Encounter

## Manual review status
- Category: Art & Design
- Official pages reviewed:
  - `https://pixelencounter.com/api`
  - `https://pixelencounter.com/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `0`

## Blocker summary
- The official Pixel Encounter host is no longer serving provider-controlled API content.
- Both the indexed `/api` URL and the site root redirect away from `pixelencounter.com` into an unrelated `cf.upperch.site` tracking/parking flow.
- Because the official domain currently resolves to unrelated third-party content, no trustworthy current base URL, endpoint list, parameters, auth model, or response schema can be confirmed.

## Evidence from manual inspection
### Official page attempt 1
- URL: `https://pixelencounter.com/api`
- Result: initial page showed `Redirecting...`
- Observed final destination: a long `https://cf.upperch.site/api/v1/px?...` URL unrelated to Pixel Encounter branding or API docs

### Official page attempt 2
- URL: `https://pixelencounter.com/`
- Result: the root host followed the same pattern
- Observed final destination: another long `https://cf.upperch.site/api/v1/px?...` URL rather than provider-controlled SVG-generator documentation

## fireROUTE note
- Treat Pixel Encounter as untrustworthy from official sources until the original domain is restored.
- Do not map historical routes while the official domain is parked/redirected.

## Sources inspected
- `https://pixelencounter.com/api`
- `https://pixelencounter.com/`
