# MeowFacts

## Overview
- Provider: MeowFacts API
- Category: Animals
- Official docs/source pages inspected:
  - `https://github.com/wh-iterabb-it/meowfacts`
  - `https://raw.githubusercontent.com/wh-iterabb-it/meowfacts/main/docs/api.yaml`
  - live endpoints under `https://meowfacts.herokuapp.com`
- Base URL: `https://meowfacts.herokuapp.com`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: none documented
- Rate limits: no numeric rate limit documented in the official repo or OpenAPI file
- Version note: the checked-in OpenAPI document says `0.4.10`, while the live `/health` response reported `0.4.14` during this manual review

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/` | optional `factID`, `count`, `lang` | Returns one or more cat facts. |
| GET | `/health` | none | Health/status endpoint with uptime, version, and request count. |
| GET | `/options` | none | Lists available language/localization options. |

## Endpoint details

### `GET /`
- The official OpenAPI file documents three query parameters:
  - `factID` — optional specific fact identifier
  - `count` — optional number of facts to return; minimum `1`
  - `lang` — optional locale/language selector
- The repository OpenAPI enum only lists `eng`, `ukr`, and `rus`, but the live `/options` endpoint currently returns a much larger language catalog including entries such as `ben`, `ces`, `eng`, `esp`, `fil`, `fra`, `ger`, `ita`, `kor`, `por`, `rus`, `ukr`, `urd`, and `zho` with locale variants.
- Observed live response shape at `/` during review:
  ```json
  {
    "data": [
      "Today there are about 100 distinct breeds of the domestic cat."
    ]
  }
  ```

### `GET /health`
- The OpenAPI description says this endpoint is meant to confirm the API is up and accepting connections.
- Observed live response shape during review:
  ```json
  {
    "data": {
      "uptime": "00:18:12:19",
      "version": "0.4.14",
      "requests": 113089
    }
  }
  ```
- Confirmed fields:
  - `data.uptime`
  - `data.version`
  - `data.requests`

### `GET /options`
- The official OpenAPI file says this endpoint lists all languages available to the root endpoint.
- Observed response structure:
  - top-level `lang` array
  - each item includes `locale_code`, `iso_code`, `full_code`, `local_name`, `english_name`, `full_name`, and `fact_count`
- This is the safest source for currently supported locales because it reflects the live service better than the older enum in the checked-in OpenAPI spec.

## Error handling
- The OpenAPI file explicitly documents:
  - `400` — bad input parameter
  - `404` — fact not found
- The documented error object fields are:
  - `code`
  - `message`
  - `type`
- The example error text in the spec references invalid language handling.

## Response format notes
- The OpenAPI components describe fact payloads using a `data` array of strings.
- The root endpoint's 200-response schema in the YAML is slightly inconsistent with the observed live response: the live API returned a single JSON object containing `data`, not a top-level array.
- fireROUTE should trust the live payload shape over the stale schema wording when implementing adapters.

## Integration notes for fireROUTE
- Treat `/options` as the canonical source for supported locales because it appears more current than the bundled OpenAPI enum.
- Preserve `count` and `lang` as passthrough query options on the root route.
- Expect light schema drift between the repository docs and the live Heroku-hosted service.

## Sources inspected
- `https://github.com/wh-iterabb-it/meowfacts`
- `https://raw.githubusercontent.com/wh-iterabb-it/meowfacts/main/docs/api.yaml`
- `https://meowfacts.herokuapp.com/`
- `https://meowfacts.herokuapp.com/health`
- `https://meowfacts.herokuapp.com/options`
