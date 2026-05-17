# PostNord

## Provider metadata
- Category: `Tracking`
- Provider slug: `postnord`
- Official docs/pages reviewed manually:
  - `https://developer.postnord.com/apis/active`
  - `https://guide.developer.postnord.com/`
  - `https://developer.postnord.com/apis/details?systemName=shipment-v7-trackandtrace-findbyidentifier-public`
  - `https://developer.postnord.com/apis/details?systemName=shipment-v7-trackandtrace-findbyreference-public`
  - `https://developer.postnord.com/apis/details?systemName=shipment-v1-links-tracking`
  - `https://developer.postnord.com/apis/details?systemName=shipment-v1-proofofdelivery`
- Manually confirmed live-route count: `5`

## Overview
PostNord’s current official tracking surface is split across four separately published products in the Developer Portal:
- `PostNord Track & Trace API v7 - FindByIdentifier - Public`
- `PostNord Track & Trace API v7 - FindByReference - Public`
- `Track Shipment URL`
- `Proof of Delivery`

The `Active APIs` catalog exposes the product inventory, while the product detail pages render Swagger/OpenAPI summaries with the operation paths. The separate PostNord guide confirms the shared production host `https://api2.postnord.com`, the sandbox host `https://atapi2.postnord.com`, API-key authentication for normal customer APIs, standard HTTP error handling, and per-API throttling with `429 Too Many Requests` when limits are exceeded.

## Base URLs manually confirmed
- `https://api2.postnord.com/rest/shipment`
  - confirmed from the official guide example for track-and-trace and from the `Proof of Delivery` detail page `Servers` section
- `https://api2.postnord.com/rest/links`
  - confirmed directly on the `Track Shipment URL` detail page as `[ Base URL: api2.postnord.com/rest/links ]`

Official environment note from the guide:
- test host: `https://atapi2.postnord.com`
- production host: `https://api2.postnord.com`

## Authentication
### Public Track & Trace and Track Shipment URL
The official guide says PostNord APIs use API keys managed in the Developer Portal.
- auth type: API key
- missing or incorrect key behavior: official guide says the API responds with `403 Forbidden`
- general access note: the two public Track & Trace products and `Track Shipment URL` are presented as public tracking products rather than the scoped IAM flow used by Proof of Delivery

### Proof of Delivery
The Proof of Delivery product uses a different authenticated flow.
- requires a PostNord Business Portal user connected to the organization
- requires a Developer Portal account
- requires approval for scope `https://api.postnord.com/scopes/shipment/proofofdelivery/customer`
- official page says fetched access tokens expire in `1 hour`
- official page says personal tokens can be created for automated testing and expire in `1 year`
- official page says scope approval can take `1-2 business days`

## Route inventory
### 1) Track by shipment identifier
- Method: `GET`
- Path: `/v7/trackandtrace/id/{id}/public`
- Base: `https://api2.postnord.com/rest/shipment`
- Purpose: fetch shipment information by shipment identifier
- Parameters confirmed from the path:
  - `id` path parameter

### 2) Track by customer number and reference
- Method: `GET`
- Path: `/v7/trackandtrace/customernumber/{customerNumber}/reference/{reference}/public`
- Base: `https://api2.postnord.com/rest/shipment`
- Purpose: `Track shipment by customer number and reference`
- Parameters confirmed from the path:
  - `customerNumber` path parameter
  - `reference` path parameter

### 3) Get Track Shipment URL
- Method: `GET`
- Path: `/v1/tracking/{country}/{id}`
- Base: `https://api2.postnord.com/rest/links`
- Purpose: fetch a tracking URL by country and shipment ID
- Parameters confirmed from the path/page text:
  - `country` path parameter
  - `id` path parameter

### 4) Get proof-of-delivery signature image
- Method: `GET`
- Path: `/v1/proofofdelivery/signature/{countryCode}/{itemId}`
- Base: `https://api2.postnord.com/rest/shipment`
- Purpose: `Get delivery signature image of item by country code and itemid`
- Parameters confirmed from the path:
  - `countryCode` path parameter
  - `itemId` path parameter

### 5) Generate proof-of-delivery PDF
- Method: `GET`
- Path: `/v1/proofofdelivery/pdf/{itemId}`
- Base: `https://api2.postnord.com/rest/shipment`
- Purpose: `Generates a pdf file that serves as proof of delivery`
- Parameters confirmed from the path:
  - `itemId` path parameter

## Pagination
- No pagination behavior was exposed on the reviewed tracking product pages.
- All five currently confirmed operations are single-resource lookup/download style routes rather than list endpoints.

## Errors and limits
Official guide facts manually confirmed:
- `2xx` indicates success
- `4xx` indicates client/request error
- `5xx` indicates PostNord-side failure
- missing or wrong API key returns `403 Forbidden`
- requests above the product limit return `429 Too Many Requests`
- the guide says each API has its own limit, but the reviewed pages did not publish a numeric limit for these tracking products

## Format notes
- The `FindByIdentifier`, `FindByReference`, and `Track Shipment URL` products are rendered as Swagger/OpenAPI route docs in the portal.
- `Track Shipment URL` is explicitly labeled `OAS 2.0` and `https` scheme.
- `Proof of Delivery` explicitly serves two non-JSON download-style outputs by purpose:
  - signature image
  - PDF proof of delivery
- The reviewed public pages did not expose detailed response media-type tables for the two public Track & Trace endpoints.

## Important usage notes
- The general guide still shows an older track-and-trace example URL ending in `.json`, while the current product pages expose versioned OpenAPI paths such as `/v7/trackandtrace/.../public`. For fireROUTE, prefer the current product-specific OpenAPI paths documented above.
- Proof of Delivery is not a simple public tracking lookup. It is an approved, scoped business integration with token handling and onboarding delay.
- The guide positions rate limits as product-specific, so integrations should expect different ceilings across tracking products.
- The public route inventory is now good enough to count concrete operations, even though raw Swagger downloads still require credentials when called directly outside the portal flow.

## Verification note
This file was manually rebuilt from the live official PostNord Developer Portal and official API guide using browser inspection only.