# Hong Kong Observatory

## Provider metadata
- Category: `Weather`
- Provider slug: `hong-kong-obervatory`
- Official docs/site checked manually:
  - `https://www.hko.gov.hk/en/abouthko/opendata_intro.htm`
  - direct official open-data endpoint family on `https://data.weather.gov.hk/weatherAPI/opendata/`
- Manually confirmed routes in this pass: `5`
- Confirmed transport/security: HTTPS
- Confirmed response format for the direct routes opened in-browser: JSON viewer / JSON document
- Auth model observed in this pass: no key or login required for the confirmed routes

## Provider structure
Hong Kong Observatory's open-data weather surface is exposed as a dataset-style API rather than many separate REST paths. In the routes I manually confirmed, HKO uses a single GET entry point and switches datasets with a `dataType` query parameter.

Confirmed base URL:
- `https://data.weather.gov.hk/weatherAPI/opendata`

Confirmed shared path:
- `/weather.php`

Confirmed shared request shape:
- `GET /weather.php?dataType={dataset}&lang={language}`

Confirmed query parameters from the official URLs opened in-browser:
- `dataType` - required dataset selector
- `lang` - language selector; `en` was manually confirmed in this pass

## 1) Real-time weather reading dataset
- Method: `GET`
- Path: `/weather.php`
- Confirmed URL: `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=rhrread&lang=en`
- Route note: HKO exposes this dataset by setting `dataType=rhrread`

## 2) Forecast dataset
- Method: `GET`
- Path: `/weather.php`
- Confirmed URL: `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=fnd&lang=en`
- Route note: HKO exposes this dataset by setting `dataType=fnd`

## 3) Local forecast dataset
- Method: `GET`
- Path: `/weather.php`
- Confirmed URL: `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=flw&lang=en`
- Route note: HKO exposes this dataset by setting `dataType=flw`

## 4) Warning summary dataset
- Method: `GET`
- Path: `/weather.php`
- Confirmed URL: `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=warnsum&lang=en`
- Route note: HKO exposes this dataset by setting `dataType=warnsum`

## 5) Special weather tips dataset
- Method: `GET`
- Path: `/weather.php`
- Confirmed URL: `https://data.weather.gov.hk/weatherAPI/opendata/weather.php?dataType=swt&lang=en`
- Route note: HKO exposes this dataset by setting `dataType=swt`

## Auth, pagination, errors, and format notes
- The confirmed routes were reachable without any API key, token, or login step in this pass.
- The confirmed routes rendered as direct JSON documents in the browser.
- No pagination mechanism was visible on the confirmed route family.
- I did not find a reliable route-level official page in this run that documented formal error payloads or rate-limit headers for these datasets, so those remain unconfirmed.

## Important usage notes
- This provider appears to multiplex multiple weather datasets through one endpoint path, so fireROUTE should preserve the `dataType` selector rather than assuming one path per product.
- `lang=en` was directly confirmed; additional language values may exist on HKO, but they were not manually verified in this pass.
- The broader HKO open-data landing page did not yield a trustworthy route inventory in this browser run, so this reference is intentionally limited to the direct official routes I could confirm live.

## fireROUTE normalization notes
- Normalize this provider as a `GET` + query-parameter-driven upstream, not as a large path-per-resource API.
- `dataType` is the critical routing input.
- Because the provider appears unauthenticated for the confirmed routes, auth should remain optional/none unless a future HKO dataset proves otherwise.

## Verification notes
This file was manually rebuilt from live official HKO browser checks. It replaces the earlier blocker-only note with a confirmed route-level reference for the direct open-data endpoint family.