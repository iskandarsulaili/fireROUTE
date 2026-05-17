# PeakMetrics

## Manual review status
- Category: `Open Data`
- Provider slug: `peakmetrics`
- Official pages used in this run:
  - `https://www.peakmetrics.com/`
  - `https://www.peakmetrics.com/platform`
- Manual review outcome: `manual_blocked`
- Confirmed route count: `0`

## Evidence from this run
- `https://www.peakmetrics.com/` loaded successfully in this run with the title `PeakMetrics | Narrative intelligence for the manipulated internet`.
- The homepage content is a marketing surface for PeakMetrics narrative-intelligence software, including product language such as `Detect`, `Decipher`, `Defend`, `Request a Demo`, and customer-facing positioning rather than developer documentation.
- Manual inspection of homepage links did not reveal a provider-controlled API reference, developer portal, Swagger UI, ReDoc page, or downloadable OpenAPI schema.
- `https://www.peakmetrics.com/platform` loaded successfully with the title `Platform | PeakMetrics`.
- The `/platform` page describes platform capabilities such as narrative detection, bot and coordination detection, deepfake detection, risk scoring, alerting, and white-glove onboarding, but it still does not publish a base URL, endpoint inventory, HTTP methods, parameter tables, authentication instructions, pagination rules, rate limits, response examples, or error schemas.

## Why fireROUTE remains blocked
- PeakMetrics currently exposes public marketing/product pages, not a verifiable public API contract.
- No official route-level documentation is available from the reviewed provider-controlled pages.
- fireROUTE should not infer API routes or usage details from product marketing copy alone.

## Revisit checkpoint
- Keep `PeakMetrics` as `manual_blocked` until PeakMetrics publishes an official developer or API reference surface with route-level documentation.
