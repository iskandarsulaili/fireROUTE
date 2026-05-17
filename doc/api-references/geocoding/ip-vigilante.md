# IP Vigilante

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ip-vigilante`
- Docs URL from category index: `https://www.ipvigilante.com/`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `https://www.ipvigilante.com/`
  - `https://ipvigilante.com/`
- Transport attempted on reviewed pages: `HTTPS`

## What the official pages currently show
- The indexed `www` host currently redirects away from the provider domain into an Afternic parked-domain sale page.
- The browser-visible title on that parked page is `ipvigilante.com`, and the visible headline says `The domain name ipvigilante.com is for sale!`.
- The bare official domain `https://ipvigilante.com/` currently resolves to the same Afternic parked-domain sale flow.
- The parked page exposes a domain-purchase lead form rather than any API base URL, route reference, auth instructions, parameter list, pagination guidance, rate-limit policy, error schema, or response-format documentation.

## Confirmed API surface
- Confirmed base URL: none currently published
- Confirmed endpoint paths: none currently published
- Confirmed HTTP methods: none currently published
- Confirmed parameters: none currently published
- Confirmed authentication contract: none currently published
- Confirmed pagination model: none currently published
- Confirmed rate-limit policy: none currently published
- Confirmed error schema: none currently published
- Confirmed response formats: none currently published
- Confirmed route count: `0`

## Explicit blocker
- Both official hostname variants currently resolve to a parked-domain sale flow rather than a live provider-controlled API/docs surface.
- No readable official alternative page was exposed from the provider-controlled domain in this pass.
- fireROUTE should keep this provider at `manual_blocker_documented` until the official IPvigilante domain again publishes a provider-controlled API/docs surface.

## Important usage notes
- Do not infer canonical routes from old code samples, community mirrors, or stale marketplace listings while the official domain is parked.
- Reattempt this provider only if the official host stops resolving to the Afternic sale flow and publishes current route-level documentation.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser CDP tools and file tools only.
