# SLF

## Provider metadata
- Category: `Geocoding`
- Provider slug: `slf`
- Official docs used manually:
  - `https://github.com/slftool/slftool.github.io/blob/master/API.md`
  - `https://raw.githubusercontent.com/slftool/slftool.github.io/master/API.md`
- Public API base URL documented by the official project page: `https://slftool.github.io`
- Transport: `HTTPS`
- Auth model: none documented
- Response format documented on the official page: `JSON`

## Product and access notes
- The official `API.md` page documents SLF as a single JSON data feed for the Stadt-Land-Fluss word list.
- The page does not describe multiple resources, authentication, or version negotiation.
- The documentation only shows one fetchable JSON URL.

## Confirmed API surface
The inspected official project page confirms `1` public route:
1. `GET /data.json`

## 1) Fetch the SLF dataset
- Method: `GET`
- Path: `/data.json`
- Full URL: `https://slftool.github.io/data.json`
- Purpose: return the published SLF lookup dataset as JSON

Documented response shape on the official page:
- top-level object keyed by starting letter
- each letter maps to arrays for:
  - `stadt`
  - `land`
  - `fluss`
  - `name`
  - `beruf`
  - `tier`
  - `marke`

Example schema shown on the official page:
```json
"letter": {
  "stadt": ["", "", ""],
  "land": ["", "", ""],
  "fluss": ["", "", ""],
  "name": ["", "", ""],
  "beruf": ["", "", ""],
  "tier": ["", "", ""],
  "marke": ["", "", ""]
}
```

## Parameters, pagination, and errors
- No query parameters are documented.
- No path parameters are documented beyond the fixed `data.json` path.
- No pagination model is documented.
- No rate-limit policy is documented.
- No explicit error payloads are documented on the inspected official page.

## Canonical fireROUTE notes
- This provider is a static JSON dataset, not a multi-operation search API.
- fireROUTE should treat it as a single raw-resource fetch rather than trying to infer hidden CRUD routes.
- Because the official page only documents the JSON file itself, downstream normalization should be based on observed payload structure rather than undocumented assumptions.

## Verification notes
- This file was manually rebuilt from the live official SLF project documentation page using browser tools.
