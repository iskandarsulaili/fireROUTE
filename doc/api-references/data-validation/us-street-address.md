# US Street Address

Official docs manually reviewed:
- https://www.smarty.com/docs/apis/us-street-api/reference
- https://www.smarty.com/docs/account/authentication

## Overview
Smarty’s US Street Address API validates, standardizes, and enriches US postal addresses. The reviewed official docs document one canonical path with different supported methods for single-address and batch workflows.

Confirmed from the reviewed official docs:
- Base URL: `https://us-street.api.smarty.com`
- Canonical path: `/street-address`
- Supported methods: `GET`, `POST`, and `OPTIONS`
- Auth modes discussed by Smarty docs: embedded-key auth and secret-key auth
- Important auth limitation: embedded-key auth supports only `GET`; secret-key auth supports both `GET` and `POST`

## Authentication
The reviewed official docs show credential query parameters for Smarty auth:
- `auth-id`
- `auth-token`

Confirmed canonical request URL shape:

```text
https://us-street.api.smarty.com/street-address?auth-id=123&auth-token=abc
```

Confirmed auth/method rules from the docs:
- embedded-key auth: `GET` only
- secret-key auth: `GET` and `POST`

## Confirmed endpoints
The reviewed official docs expose one path with two practical operation forms.

| Method | Path | Purpose |
|---|---|---|
| GET | `/street-address` | Validate a single address submitted via query parameters |
| POST | `/street-address` | Validate multiple addresses submitted in JSON or XML request bodies |

Manual route count confirmed from the official docs: **2**.

## Request details

### `GET /street-address`
Confirmed from the official docs:
- used for a single address lookup
- request data is sent in query parameters
- reviewed examples include standard address validation plus optional formatting/enrichment toggles

### `POST /street-address`
Confirmed from the official docs:
- used for multiple addresses in one request
- request body may be JSON or XML
- documented maximum request body size: **32 KB (32,768 bytes)**

## Input fields
The reviewed official docs state that each submitted address must contain one of these field combinations to be eligible for a positive match:
- `street + city + state`
- `street + zipcode`
- `street` alone as a freeform full-address input

Confirmed documented input/request fields include:
- `input_id`
- `street`
- `street2`
- `secondary`
- `city`
- `state`
- `zipcode`
- `lastline`
- `addressee`
- `urbanization`
- `candidates`
- `match`
- `format`
- `county_source`

Confirmed important parameter notes from the docs:
- `candidates` max value: `10`
- `match` default: `strict`
- supported `match` values include `strict`, `invalid`, and `enhanced`
- `format` default: `default`
- supported `format` values include `default` and `project-usa`
- freeform street input should not include country information like `USA`
- `county_source` supports `postal` and `geographic`

The reviewed docs also show optional feature examples such as:
- `features=component-analysis`
- `features=iana-timezone`

## Required headers
The official docs explicitly call out these headers:
- `Content-type`
- `Host`

Confirmed example values:
- `Content-type: application/json`
- `Host: us-street.api.smarty.com`

## Response format
Confirmed from the reviewed docs:
- `200` responses contain the only body format that should be parsed
- both `GET` and `POST` return the same overall response structure semantics
- success bodies are arrays containing zero or more address matches
- an empty array `[]` means no full or partial match was returned

The reviewed docs provide structured output definitions for:
- root object
- `components`
- `metadata`
- `analysis`
- footnotes/component-analysis values

## Errors
The reviewed official docs publish these status codes:
- `200` — success; parse the response body
- `400` — malformed request, including missing `street` on a `GET` request or malformed JSON on `POST`
- `401` — invalid credentials
- `402` — no active subscription
- `413` — request body too large (over 32 KB)
- `422` — `POST` request missing a `street` field
- `429` — too many requests / plan or embedded-key rate restrictions

## Rate limits
The reviewed docs do not publish a simple fixed numeric rate-limit table for this API page.

What is explicitly documented:
- `429 Too many requests` can occur
- embedded-key auth is more restricted
- plan limits can also cause `429`

## Pagination
Not applicable. Each request returns results only for the submitted address or address batch.

## Important usage notes
- The same `/street-address` path supports both single-address `GET` and multi-address `POST` workflows.
- Embedded-key auth cannot be used for the batch `POST` workflow.
- `invalid` matching is not compatible with freeform input; the docs say freeform input automatically falls back to `strict` behavior.
- `enhanced` matching requires a US Core or US Rooftop Geocoding license.
- The official docs also publish XML and JSONP usage notes in addition to JSON examples.

## fireROUTE notes
- Model this provider as one canonical path with two operational modes rather than unrelated routes.
- Preserve Smarty’s query-parameter auth scheme exactly as documented.
- Support both single-address and batch-address workflows, because batching is one of the main provider-specific advantages.
- Keep `match`, `candidates`, and `format` exposed; they materially affect result quality and output shape.
