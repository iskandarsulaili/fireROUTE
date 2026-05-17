# Mangapi

## Overview
- Provider: Mangapi
- Category: Anime
- Official docs page reviewed: `https://rapidapi.com/pierre.carcellermeunier/api/mangapi3/`
- Official endpoint playground reviewed: `https://rapidapi.com/pierre.carcellermeunier/api/mangapi3/playground/apiendpoint_e3f976f6-b66c-4b62-ac11-89f14ebfb935`
- Base URL: `https://mangapi3.p.rapidapi.com`
- Auth: RapidAPI-hosted subscription endpoint; the reviewed docs exposed `X-RapidAPI-Host: mangapi3.p.rapidapi.com`, pricing plans, and an `Authorizations` section, but the anonymous view did not reveal a concrete secret-key field/value
- HTTPS: yes
- Response format: not clearly documented in the anonymous public view; no response schema or example body was exposed during this pass
- Pagination: none documented
- Rate limits: Basic plan `50 / Month` and `1 requests per minute`; Pro `280 / Month`; Ultra `2,000 / Month`; Mega `5,000 / Month`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| POST | `/api/translate` | Body includes `image` file upload and `to` string target-language field | The official RapidAPI playground names this operation `Translate` and the visible cURL snippet posts to `https://mangapi3.p.rapidapi.com/api/translate`. |

## Request and parameter notes
- The overview page currently exposes exactly one endpoint entry: `POST Translate`.
- The endpoint playground shows a body editor with `image` plus an `Upload` control and a `to` field labeled `String` with the visible example/default value `FRENCH`.
- The same playground also shows `Headers(3)` and visibly labels `X-RapidAPI-Host` plus `Content-Type`.
- The code snippet shown in the public docs uses:
  - `--url https://mangapi3.p.rapidapi.com/api/translate`
  - `--header 'Content-Type: application/x-www-form-urlencoded'`
  - `--header 'x-rapidapi-host: mangapi3.p.rapidapi.com'`
  - `--data image=`
  - `--data to=FRENCH`
- The interactive body editor simultaneously identifies the body `Media Type` as `FORM_DATA`, so the official docs surface is internally inconsistent about exact encoding. The safest fireROUTE interpretation is that the endpoint expects an uploaded image plus a target-language string.

## Auth and usage notes
- The reviewed provider surface is RapidAPI-hosted rather than a standalone first-party docs site.
- The public anonymous view did not reveal an actual `x-rapidapi-key` value or editable secret field, but the endpoint is clearly presented as a RapidAPI product with plan-based access.
- Treat this route as requiring RapidAPI subscription credentials at call time even though the unsigned browser view redacts the credential entry flow.

## Pagination, errors, and format notes
- No pagination behavior is documented or implied for this single translation endpoint.
- No error-code table, response example, or schema block was exposed in the reviewed public pages.
- The docs do not publish a formal response-format contract in the anonymous view available from this environment.

## Integration notes for fireROUTE
- Count Mangapi as `1` confirmed route family.
- Model the request body as file-upload capable and keep the `to` field configurable rather than hard-coding the visible example value `FRENCH`.
- Preserve a note that the reviewed public docs are inconsistent about `FORM_DATA` versus the sample `application/x-www-form-urlencoded` header.

## Route-count note
- The official RapidAPI docs currently expose `1` confirmed operation.

## Sources inspected
- `https://rapidapi.com/pierre.carcellermeunier/api/mangapi3/`
- `https://rapidapi.com/pierre.carcellermeunier/api/mangapi3/playground/apiendpoint_e3f976f6-b66c-4b62-ac11-89f14ebfb935`
- `https://rapidapi.com/pierre.carcellermeunier/api/mangapi3/pricing`
