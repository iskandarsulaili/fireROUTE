# BreezoMeter Pollen

## Provider metadata
- Category: `Environment`
- Provider slug: `breezometer-pollen`
- Official docs inspected manually:
  - `https://docs.breezometer.com/api-documentation/pollen-api/v2/`
  - `https://docs.breezometer.com/`
- Manual review outcome: official legacy docs no longer expose a browsable BreezoMeter Pollen API reference
- Manually confirmed routes in this pass: `0`

## Blocker note
Both inspected `docs.breezometer.com` URLs redirected to Google Maps Platform product pages rather than a preserved BreezoMeter Pollen API reference. The current official pages reached in this pass did not provide a route list, auth model, request schema, or response schema for the former BreezoMeter pollen product.

## What was still confirmed
- The legacy BreezoMeter documentation host is no longer serving the old pollen v2 reference directly.
- The product lineage appears to have been absorbed into Google Maps Platform environment offerings, but the inspected official pages did not preserve the historical BreezoMeter Pollen endpoint details needed for a reliable fireROUTE provider adapter.

## fireROUTE note
Treat this provider as blocked until an official archived BreezoMeter/Google reference page with route-level details is located.