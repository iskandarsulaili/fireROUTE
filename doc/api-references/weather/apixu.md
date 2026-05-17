# APIXU

## Provider metadata
- Category: `Weather`
- Provider slug: `apixu`
- Official docs/site checked manually in this pass:
  - `https://www.apixu.com/doc/request.aspx`
  - `https://www.apixu.com/`
- Manual review outcome: `blocked - original APIXU surfaces now resolve to Weatherstack marketing pages rather than preserved APIXU docs`
- Manually confirmed routes in this pass: `0`

## What was confirmed live
- A fresh manual browser check of `https://www.apixu.com/doc/request.aspx` redirected to `https://weatherstack.com/`.
- The final page title for that legacy docs URL was `Best Free Weather API for Accurate Global Weather Data`.
- A separate manual browser check of the APIXU site root `https://www.apixu.com/` also redirected to `https://weatherstack.com/` in this run.
- The APIXU-branded domain therefore no longer exposed an APIXU-specific documentation or product surface during this verification pass.

## Blocker summary
The original APIXU documentation URL and the APIXU site root both resolved to Weatherstack marketing pages instead of a preserved APIXU API reference. Because the official APIXU domain no longer serves APIXU-specific route documentation, I could not safely confirm any current APIXU base URL, endpoint inventory, parameter schema, or usage policy from official APIXU-controlled content.

## What could not be confirmed from current official APIXU URLs
- APIXU-specific base URL
- APIXU-specific endpoint paths
- APIXU-specific request methods
- APIXU-specific parameters
- APIXU-specific authentication requirements
- APIXU-specific rate limits
- APIXU-specific pagination or error-format notes

## Important fireROUTE notes
- Treat `apixu` as a legacy provider slug whose original official surfaces now funnel into Weatherstack rather than preserving APIXU route-level docs.
- Do not copy Weatherstack's current route inventory into this legacy APIXU entry unless the repository intentionally decides to alias APIXU to Weatherstack.
- Keep the confirmed route count at `0` until an APIXU-specific official archive or replacement reference is available.

## Verification notes
This file was manually rebuilt from fresh browser checks of the two official APIXU URLs in this run. It replaces the earlier split-destination blocker note with the currently observed same-destination Weatherstack redirect state.
