# IQAir

## Provider metadata
- Category: `Environment`
- Provider slug: `iqair`
- Official docs inspected manually:
  - `https://www.iqair.com/air-pollution-data-api`
  - `https://www.iqair.com/commercial-air-quality-monitors/api`
- Manual review outcome: product page reachable, but no public route-level API reference exposed
- Manually confirmed routes in this pass: `0`

## Blocker note
The inspected official IQAir pages describe the AirVisual API product and promote enrollment/contact flows, but they do not publish a browsable endpoint reference with concrete paths, query parameters, authentication headers, example payloads, pagination rules, or error schemas. No public Swagger/OpenAPI or route catalog was exposed on the inspected official pages.

## What was still confirmed
- IQAir still markets a commercial AirVisual API product.
- The offering covers worldwide air quality, air pollution, and weather data.
- Access appears to be commercial/onboarding driven rather than openly documented on the inspected pages.

## fireROUTE note
Treat this provider as blocked for adapter implementation until IQAir exposes public developer docs or authenticated customer documentation with route-level detail.