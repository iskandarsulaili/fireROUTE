# Systembolaget

Official pages manually reviewed in this run:
- https://api-portal.systembolaget.se/
- https://leverantor.systembolaget.se/
- https://www.systembolaget.se/

## Overview
- Provider: Systembolaget
- Category: Food & Drink
- Status: `manual_blocked`
- Confirmed route count from this review: **0**
- Blocker type: the published public API portal is unavailable, while the reachable official alternatives are a supplier login flow and the consumer storefront rather than a public developer reference

## What I verified manually in this run
- Fresh manual review of `https://api-portal.systembolaget.se/` failed with Chrome's `ERR_NAME_NOT_RESOLVED` error page (`This site can’t be reached`, `api-portal.systembolaget.se’s server IP address could not be found`).
- Fresh manual review of `https://leverantor.systembolaget.se/` redirected into a Microsoft-hosted authorize flow under `https://konto.leverantor.systembolaget.se/.../oauth2/v2.0/authorize`.
- The final reviewed supplier-host page title was `Logga in`.
- The visible supplier-host content was supplier-login text rather than public docs, including `Om du är anställd på Systembolaget`, `En sida för leverantörer och distributörer till Systembolaget AB`, `E-postadress`, `Lösenord`, and `Logga in`.
- Fresh manual review of `https://www.systembolaget.se/` loaded the normal consumer storefront with the title `Systembolaget - ansvarsfull försäljning av alkohol online & i butik`.
- The reviewed storefront exposed retail/discovery content such as `Öppettider`, `Vin`, `Öl`, `Sprit`, `Dryck & Mat`, `Hitta varor i butik`, and `Handla online`, but no public API reference.
- Because none of the reviewed official pages exposed public API route documentation, I could not confirm a Systembolaget base URL, endpoint inventory, methods, parameters, authentication guide, rate limits, pagination behavior, response schemas, or errors.

## Confirmed routes
- None confirmable from the current official pages.

## Confirmed blocker
- The published public API portal is currently unavailable.
- The supplier host is a login/authentication flow, not a public route reference.
- The public storefront is live, but it only exposes consumer-site content rather than developer documentation.
- Until Systembolaget republishes a stable public developer/docs host, this API cannot be completed from official sources.

## fireROUTE notes
- Keep this provider blocked at `0` confirmed routes.
- Reattempt only if `api-portal.systembolaget.se` or another provider-owned public docs location starts serving stable Systembolaget API reference material again.
