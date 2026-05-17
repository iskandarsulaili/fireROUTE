# Open Government, Mexico

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-mexico`
- Official docs/pages used:
  - `https://www.inegi.org.mx/datos/`
  - `https://www.inegi.org.mx/servicios/api_indicadores.html`
  - live official route syntax and examples published on the same developer page under `https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/...`
- Assigned docs URL behavior: the assigned `https://www.inegi.org.mx/datos/` entry point did not expose route-level API documentation directly in this review, so the official INEGI developer page was used as the official alternative documentation page
- Current documented API base URL: `https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml`
- Auth model: token required on every reviewed route; the official docs say a valid token is obtained by registering with INEGI
- Response formats: `json`, `jsonp`, and `xml`
- Manually confirmed canonical route count: `2`

## Official usage notes
- The reviewed official developer page is `API del Banco de Indicadores`, version `2.0`.
- The docs describe one route family for indicator series/data and one route family for metadata catalog lookups.
- The same page explicitly says the API is used to consult indicator data and metadata at national, state, and municipality levels.
- The docs also note that users of the older SOAP service `http://www2.inegi.org.mx/servicioindicadores/Indicadores.asmx` should migrate to this newer URL-based API.

## Canonical endpoint inventory confirmed from the official INEGI developer docs
1. `GET /app/api/indicadores/desarrolladores/jsonxml/INDICATOR/{indicator_id}/{language}/{area}/{recent}/{source}/{version}/{token}?type={format}`
   - Purpose: return indicator data and metadata for one indicator
   - Official example from the docs:
     - `https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/INDICATOR/1002000001/es/00/true/BISE/2.0/{token}?type=json`
   - Path/query parameters documented by INEGI:
     - `indicator_id` - indicator key obtained through the official query builder
     - `language` - `es` or `en`
     - `area` - geographic scope such as national `00`, state `99`, or municipality `999`, depending on the indicator
     - `recent` - `true` for only the most recent value, `false` for full historical series
     - `source` - dissemination source, for example `BISE`
     - `version` - API version, documented as `2.0`
     - `token` - required access token
     - `type` - output format `json`, `jsonp`, or `xml`

2. `GET /app/api/indicadores/desarrolladores/jsonxml/{catalog}/{catalog_id}/{language}/{source}/{version}/{token}?type={format}`
   - Purpose: return metadata catalog entries that complement indicator responses
   - Official syntax from the docs:
     - `https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/{Catalogo}/{IdCatalogo}/{Idioma}/{Fuente de datos}/{Version}/{Token}?type={Formato}`
   - Official example from the docs:
     - `https://www.inegi.org.mx/app/api/indicadores/desarrolladores/jsonxml/CL_STATUS/null/es/BISE/2.0/{token}?type=json`
   - Catalog examples explicitly published on the official page:
     - `CL_INDICATOR`
     - `CL_UNIT`
     - `CL_NOTE`
     - `CL_SOURCE`
     - `CL_TOPIC`
     - `CL_FREQ`
     - `CL_GEO_AREA`
     - `CL_STATUS`
   - Path/query parameters documented by INEGI:
     - `catalog` - catalog identifier such as `CL_STATUS` or `CL_UNIT`
     - `catalog_id` - a specific record id or `null` to request all records
     - `language` - `es` or `en`
     - `source` - dissemination source, for example `BISE`
     - `version` - documented as `2.0`
     - `token` - required access token
     - `type` - output format `json`, `jsonp`, or `xml`

## Response structure notes from the official docs
- Indicator responses are documented as a JSON object with:
  - `Header` containing fields such as `Name` and `Email`
  - `Series`, where each series contains fields such as `INDICADOR`, `FREQ`, `TOPIC`, `UNIT`, `NOTE`, `SOURCE`, `LASTUPDATE`, `STATUS`, and `OBSERVATIONS`
  - `OBSERVATIONS` entries include fields such as `TIME_PERIOD`, `OBS_VALUE`, `OBS_EXCEPTION`, `OBS_STATUS`, `OBS_SOURCE`, `OBS_NOTE`, and `COBER_GEO`
- Metadata catalog responses are documented as an object with:
  - `id`
  - `agencyID`
  - `version`
  - `lang`
  - `CODE`, where each item contains `value` and `Description`

## Authentication, pagination, errors, and format notes
- The official docs repeatedly state that a valid token is required and must be requested through registration.
- No public rate-limit policy was published on the reviewed official pages.
- No offset/page pagination scheme was documented for either route family; indicator routes return either the latest value or the full series depending on `recent`, and metadata catalog routes return one record or all records depending on `catalog_id`.
- During this review, requests using both the stale sample token from the docs and an obviously invalid token returned the same live unauthorized response:
  - HTTP `401`
  - `[
      "ErrorInfo:No autorizado",
      "ErrorDetails:No autorizado",
      "ErrorCode:110"
    ]`
- The docs explicitly publish the output-format selector as the `type` query parameter with `json`, `jsonp`, or `xml`.

## Important integration notes
- Treat the INEGI provider here as the officially documented Banco de Indicadores API rather than the broader marketing/data landing page listed in the public-apis index.
- Preserve the token as part of the path exactly as documented by INEGI; the official API does not use an `Authorization` header for this route family.
- Keep the indicator route and metadata-catalog route separate in fireROUTE because they return materially different shapes.
- Expect live calls to fail with `401 No autorizado` until the caller supplies a fresh INEGI-issued token.
