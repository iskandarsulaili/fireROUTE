# Tokopedia

## Manual review status
- Category: Shopping
- Official pages reviewed:
  - `https://developer.tokopedia.com/openapi/guide/#/`
  - `https://developer.tokopedia.com/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `0`

## Blocker summary
- The historical Tokopedia developer docs entrypoint no longer stays on a Tokopedia-hosted API reference in this browser session.
- Both reviewed official Tokopedia developer URLs redirect to TikTok Shop partner-hosted pages instead of a clearly Tokopedia-specific OpenAPI reference.
- Because the reviewed first-party Tokopedia URLs now resolve away from a Tokopedia route catalog, no current Tokopedia-specific base URL, endpoint inventory, auth contract, parameter schema, pagination model, or error format can be manually confirmed from official sources in this run.

## Evidence from manual inspection
### Official page attempt 1
- URL: `https://developer.tokopedia.com/openapi/guide/#/`
- Result: browser navigation resolved to `https://partner.tiktokshop.com/docv2/page/overview#/`
- Visible title: `TikTok Shop Partner Center`
- Interpretation: the former Tokopedia OpenAPI guide no longer exposes an independently inspectable Tokopedia reference page from that URL

### Official page attempt 2
- URL: `https://developer.tokopedia.com/`
- Result: browser navigation resolved to `https://partner.tiktokshop.com/`
- Visible title: empty/undisclosed in the reviewed browser output after redirect
- Interpretation: the Tokopedia developer root also now redirects into TikTok Shop partner infrastructure rather than staying on Tokopedia-specific developer documentation

## Integration notes
- Keep Tokopedia blocked at `0` confirmed routes until Tokopedia-specific first-party route documentation is again available or the successor docs clearly expose a Tokopedia surface that can be manually reviewed.
- Do not treat a generic redirect into TikTok Shop partner docs as proof of Tokopedia endpoint continuity without route-level Tokopedia documentation.

## Sources inspected
- `https://developer.tokopedia.com/openapi/guide/#/`
- `https://developer.tokopedia.com/`
