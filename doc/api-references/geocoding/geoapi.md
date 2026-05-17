# GeoApi

## Provider metadata
- Category: `Geocoding`
- Provider slug: `geoapi`
- Official docs used manually:
  - `https://api.gouv.fr/api/geoapi.html` (currently redirects to the data.gouv.fr API catalogue)
  - `https://guides.data.gouv.fr/guides/reutiliser-des-donnees/utiliser-les-api-geographiques`
  - `https://guides.data.gouv.fr/guides/reutiliser-des-donnees/utiliser-les-api-geographiques/utiliser-lapi-decoupage-administratif`
  - `https://geo.api.gouv.fr/decoupage-administratif`
  - `https://geo.api.gouv.fr/decoupage-administratif/communes`
  - `https://geo.api.gouv.fr/decoupage-administratif/communes-associees-deleguees`
  - `https://geo.api.gouv.fr/decoupage-administratif/epcis`
  - `https://geo.api.gouv.fr/decoupage-administratif/departements`
  - `https://geo.api.gouv.fr/decoupage-administratif/regions`
- Public API base URL documented by provider: `https://geo.api.gouv.fr`
- Transport: HTTPS
- Auth model: none documented
- Response formats documented: `json`, `geojson`

## Product and access notes
- The current data.gouv guide identifies this provider as `API Découpage administratif (API Geo)`.
- The guide says it is mainly intended for form/search use cases based on commune name, postal code, INSEE code, or coordinates.
- The guide explicitly recommends the API for commune lookup and autocompletion, while noting that departments and regions are more static datasets.
- The provider landing page describes the service as covering communes, communes associées/déléguées, EPCI, départements, and régions.

## Authentication, rate limits, pagination, and errors
- No authentication requirement is documented on the inspected official pages.
- No explicit rate-limit section or numeric quota was published on the inspected pages.
- No pagination/cursor model is documented; the official pages present direct search/list requests instead.
- The inspected pages focus on parameters and examples and do not expose a detailed HTTP error taxonomy in accessible text.

## Shared parameter and format notes
- `format=geojson` is documented on the advanced-search style pages; default output is standard JSON.
- When `format=geojson` is used, the docs say a primary geometry must be chosen.
- Documented geometry values across the inspected pages:
  - `centre`
  - `contour`
  - `mairie` (communes and communes associées/déléguées pages)
  - `bbox`
- `fields` is documented as the response-field filter parameter on the advanced-search pages.
- `boost=population` is documented on commune and EPCI name-search pages to prioritize larger-population matches.

## Confirmed API surface
The inspected official pages expose `14` route patterns:
1. `GET /communes`
2. `GET /communes/{code}`
3. `GET /epcis/{code}/communes`
4. `GET /departements/{code}/communes`
5. `GET /communes_associees_deleguees`
6. `GET /communes_associees_deleguees/{code}`
7. `GET /epcis`
8. `GET /epcis/{code}`
9. `GET /departements`
10. `GET /departements/{code}`
11. `GET /regions/{code}/departements`
12. `GET /regions`
13. `GET /regions/{code}`
14. `GET /communes?codeRegion={code}` as the documented region-filtered commune list mode on the `/communes` search route

## 1) Commune search/list
- Method: `GET`
- Path: `/communes`
- Full URL: `https://geo.api.gouv.fr/communes`
- Purpose: commune lookup/search plus filtered commune listing

Documented query modes and parameters from the commune docs + official guide:
- `codePostal` - search communes by postal code
- `code` - search by commune code / code INSEE
- `nom` - search by commune name
- `boost=population` - prioritize larger-population matches
- `lat` and `lon` - geographic lookup by coordinates
- `codeDepartement` - filter communes by department code
- `codeRegion` - filter communes by region code
- `limit` - explicitly shown in guide examples for search narrowing
- `fields` - filter returned fields
- `format` - `json` or `geojson`
- `geometry` - `centre`, `contour`, `mairie`, `bbox`

Important official notes:
- the official guide says this route is the main one for autocompletion and form search
- the same guide warns that `format=geojson&geometry=contour` can produce very large responses (example given: `34Mo` for a region-wide contour response)
- `format=geojson&geometry=centre` is recommended when only a light geometry is needed

## 2) Commune lookup by code
- Method: `GET`
- Path pattern: `/communes/{code}`
- Full URL pattern: `https://geo.api.gouv.fr/communes/{code}`
- Purpose: return details for a specific commune

Path parameter:
- `code` - commune code

Notes:
- the commune docs describe this as retrieving information concerning one commune
- response filtering/format controls are presented on the commune documentation page as advanced options for commune data requests

## 3) Communes by EPCI
- Method: `GET`
- Path pattern: `/epcis/{code}/communes`
- Full URL pattern: `https://geo.api.gouv.fr/epcis/{code}/communes`
- Purpose: return the communes attached to an EPCI

Path parameter:
- `code` - EPCI code

## 4) Communes by department
- Method: `GET`
- Path pattern: `/departements/{code}/communes`
- Full URL pattern: `https://geo.api.gouv.fr/departements/{code}/communes`
- Purpose: return the communes attached to a department

Path parameter:
- `code` - department code

## 5) Communes associées / déléguées search/list
- Method: `GET`
- Path: `/communes_associees_deleguees`
- Full URL: `https://geo.api.gouv.fr/communes_associees_deleguees`
- Purpose: search or filter associated/delegated communes

Documented query parameters:
- `nom` - name search
- `codeDepartement` - list/filter by department
- `type` - `commune-associee` or `commune-deleguee`
- `fields` - response field filter
- `format` - `json` or `geojson`
- `geometry` - `centre`, `contour`, `mairie`, `bbox`

Important notes:
- the docs describe this route as serving both associated and delegated communes
- the department-filtered mode is documented directly on this same route rather than as a separate nested path

## 6) Commune associée / déléguée lookup by code
- Method: `GET`
- Path pattern: `/communes_associees_deleguees/{code}`
- Full URL pattern: `https://geo.api.gouv.fr/communes_associees_deleguees/{code}`
- Purpose: return details for one associated/delegated commune

Path parameter:
- `code` - commune code

## 7) EPCI search/list
- Method: `GET`
- Path: `/epcis`
- Full URL: `https://geo.api.gouv.fr/epcis`
- Purpose: search or list EPCI records

Documented query parameters:
- `nom` - name search
- `boost=population` - prioritize larger-population matches
- `fields` - response field filter
- `format` - `json` or `geojson`
- `geometry` - `centre`, `contour`, `bbox`

Official response-field groups shown on the page:
- identity: `code`, `nom`
- relations: `codesRegions`, `codesDepartements`
- geography: `centre`, `contour`, `bbox`
- information: `surface`, `population`, `type`, `financement`, `zone`

## 8) EPCI lookup by code
- Method: `GET`
- Path pattern: `/epcis/{code}`
- Full URL pattern: `https://geo.api.gouv.fr/epcis/{code}`
- Purpose: return details for one EPCI

Path parameter:
- `code` - EPCI code

## 9) Department search/list
- Method: `GET`
- Path: `/departements`
- Full URL: `https://geo.api.gouv.fr/departements`
- Purpose: search or list departments

Documented query parameter:
- `nom` - department-name search

Official note:
- the department docs explicitly say the name-search route can also be used for autocompletion

## 10) Department lookup by code
- Method: `GET`
- Path pattern: `/departements/{code}`
- Full URL pattern: `https://geo.api.gouv.fr/departements/{code}`
- Purpose: return details for a specific department

Path parameter:
- `code` - department code

## 11) Departments by region
- Method: `GET`
- Path pattern: `/regions/{code}/departements`
- Full URL pattern: `https://geo.api.gouv.fr/regions/{code}/departements`
- Purpose: list departments belonging to a region

Path parameter:
- `code` - region code

## 12) Region search/list
- Method: `GET`
- Path: `/regions`
- Full URL: `https://geo.api.gouv.fr/regions`
- Purpose: search or list French regions

Documented query parameter:
- `nom` - region-name search

Official note:
- the region docs also describe name search as suitable for autocompletion

## 13) Region lookup by code
- Method: `GET`
- Path pattern: `/regions/{code}`
- Full URL pattern: `https://geo.api.gouv.fr/regions/{code}`
- Purpose: return details for a specific region

Path parameter:
- `code` - region code

## 14) Region-filtered commune list mode
- Method: `GET`
- Path: `/communes`
- Full URL pattern: `https://geo.api.gouv.fr/communes?codeRegion={code}`
- Purpose: return all communes for one region while staying on the commune search/list route

Documented query parameter:
- `codeRegion` - region code

Why it is counted separately here:
- the official guide explicitly documents region-wide commune retrieval as a first-class usage pattern (`https://geo.api.gouv.fr/communes?codeRegion=84`)
- unlike departments and EPCI, this mode is not exposed as a dedicated nested route on the inspected docs pages

## fireROUTE integration notes
- GeoApi is especially useful for French administrative lookup and autocomplete flows rather than general global geocoding.
- fireROUTE should treat `/communes` as the primary flexible search surface and preserve its filter/geometry knobs.
- GeoJSON requests can become very large when contours are requested; for latency-sensitive flows, prefer JSON or `geometry=centre` unless polygons are explicitly required.
