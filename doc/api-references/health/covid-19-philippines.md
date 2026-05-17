# Covid-19 Philippines

## Provider metadata
- Category: `Health`
- Provider slug: `covid-19-philippines`
- Official docs/pages used:
  - `https://github.com/Simperfy/Covid-19-API-Philippines-DOH`
  - `https://documenter.getpostman.com/view/12463261/T1LV9jLU?version=latest`
  - `https://documenter.gw.postman.com/api/collections/12463261/T1LV9jLU?segregateAuth=true&versionTag=latest`
- Current public API base URL confirmed from the published collection: `https://covid19-api-philippines.herokuapp.com/api`
- Optional alternate base URL still published in the README: `https://covid19-ph-api.herokuapp.com/api`
- Auth model: no authentication required
- Response format: JSON
- CORS: the published Postman example responses include `Access-Control-Allow-Origin: *`
- Public rate-limit note: no numeric rate limit was published on the reviewed GitHub README or Postman collection
- Manually confirmed route count: `7`

## Authentication and access
- The reviewed GitHub README and public Postman collection describe a public read-only API with no API key requirement.
- The repo README says the service pulls data from DOH CSV files on Google Drive instead of scraping the DOH website.
- The published endpoints are all documented as HTTP `GET` operations.

## Canonical endpoints
1. `GET /summary` - national or filtered summary of Philippine COVID-19 cases
2. `GET /timeline` - daily case timeline, optionally filtered by region
3. `GET /top-regions` - regions ranked by COVID-19 case counts
4. `GET /get` - raw case-information records for analytics or machine-learning use cases
5. `GET /facilities/summary` - summary of facility bed-occupancy data
6. `GET /facilities` - raw facilities-information records
7. `GET /list-of/{field}` - list available values for one field, with dataset selection

## Parameters and path notes
### Path parameters
- `field` - target field name for `/list-of/{field}`; the README examples include `regions`, `age_groups`, and `hospitals`

### Query parameters explicitly published
- `/summary`
  - `region` - filter summary to one region
  - `hospital_name` - filter summary to one hospital
- `/timeline`
  - `region` - filter the timeline to one region
- `/get`
  - README and Postman examples show filters such as `page`, `month`, `region_res`, `age`, `removal_type`, and `sex`
  - The README's field/value reference implies this route accepts dataset-field filters such as `age_group`, `date_specimen`, `date_result_release`, `date_rep_conf`, `date_died`, `date_recover`, `admitted`, `region`, `region_res`, and `prov_res`
- `/facilities/summary`
  - `region` - filter facilities summary by region
  - `hospital_name` - filter facilities summary by hospital name
- `/facilities`
  - Postman examples show filters such as `city_mun` and `icu_v`
  - The README also shows examples using `region` and `hospital_name`
- `/list-of/{field}`
  - `dataset` - selects the dataset family; the README explicitly lists `case_information` and `facilities_information`, with `case_information` as the default

## Response, pagination, and error notes
- `/summary` returns a JSON object with a `data` object and a `last_update` field.
- `/timeline` returns a `data` array of daily records with fields such as `cases`, `recovered`, `died`, and `date`.
- `/get` and `/facilities` are documented as raw-data endpoints for downstream analysis and filtering.
- The README examples show `/get?page=1`, so page-based pagination is published for the raw case-information route.
- The reviewed docs do not publish a formal shared error-code table.

## Usage notes from the official docs
- The repo README positions this API as an unofficial DOH-focused API that stays aligned with DOH Data Drop CSV releases.
- The provider publishes both a GitHub README overview and a public Postman collection; the Postman collection is the clearest route-level source.
- The README mentions `/api/updatedatabase` for manually refreshing the database during development, but that maintenance path is not part of the published public Postman collection, so I did not count it as a stable public API route.
- The docs separate the data surface into `Case Information` and `Facilities Information` families.

## fireROUTE normalization notes
- Normalize this provider as a public, read-only JSON API rooted at `https://covid19-api-philippines.herokuapp.com/api`, with the alternate Heroku mirror retained only as a fallback host note.
- Preserve the distinction between summarized routes (`/summary`, `/timeline`, `/top-regions`, `/facilities/summary`) and raw-record routes (`/get`, `/facilities`).
- Treat `/list-of/{field}` as a schema-discovery helper route for UI filters and validation.
- Do not expose `/updatedatabase` as a public fireROUTE operation unless the provider republishes it in official route-level docs.