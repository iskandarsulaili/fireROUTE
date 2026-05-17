# Czech National Bank

Official pages manually reviewed:
- https://www.cnb.cz/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml
- https://www.cnb.cz/en/financial_markets/foreign_exchange_market/exchange_rate_fixing/

## Overview
The index entry for this provider points directly to the Czech National Bank's daily exchange-rate XML feed. During manual review, that XML feed was live and browsable. The obvious English-language overview URL I checked returned a 404 page, so I only manually confirmed the direct published feed route itself.

## Confirmed base URL / host
- Host: `https://www.cnb.cz`
- Confirmed feed path: `/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml`

## Confirmed endpoint
| Method | Path | Format | Notes |
|---|---|---|---|
| GET | `/cs/financni_trhy/devizovy_trh/kurzy_devizoveho_trhu/denni_kurz.xml` | XML | Daily exchange-rate fixing feed with `<kurzy>`, `<tabulka>`, and repeated `<radek>` rows |

Manual route count confirmed from reviewed official pages: **1**.

## Response format
The live feed returned XML with a structure like:
- root `<kurzy banka="CNB" datum="..." poradi="...">`
- child `<tabulka typ="XML_TYP_CNB_KURZY_DEVIZOVEHO_TRHU">`
- repeated `<radek .../>` entries per currency

Observed row attributes include:
- `kod`
- `mena`
- `mnozstvi`
- `kurz`
- `zeme`

## Authentication and limits
- No API key, OAuth flow, or auth header was visible on the confirmed XML feed.
- No official numeric rate-limit guidance was visible on the reviewed pages.

## Blocker / scope note
I manually checked an obvious English-language alternative overview URL as well, but it returned a 404 page. Because of that, I am only documenting the direct official XML feed I could verify in-browser, not inferring any broader unpublished route family.

## fireROUTE notes
- Treat this provider as a raw XML feed, not a modern JSON REST API.
- Consumers should normalize locale-specific numeric formatting from the XML fields when parsing rates.