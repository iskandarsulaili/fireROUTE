# Razorpay IFSC

Official docs manually reviewed:
- https://ifsc.razorpay.com/
- https://github.com/razorpay/ifsc/wiki/API

## Overview
Razorpay publishes a simple public IFSC lookup service for Indian bank branches. The official wiki describes a single JSON lookup route keyed by the IFSC code itself.

- Base URL: `https://ifsc.razorpay.com`
- Response format: JSON
- Auth: none
- CORS: explicitly supported according to the official wiki

## Authentication
No API key or OAuth flow is documented. The official wiki presents the service as a public lookup API.

## Confirmed endpoints

| Method | Path | Purpose | Key parameters |
|---|---|---|---|
| GET | `/{ifsc}` | Look up branch metadata for a specific IFSC code | Path `{ifsc}` = branch IFSC code |

Manual route count confirmed from the reviewed docs: **1**.

## Request details
Confirmed example from the official wiki:

```text
GET https://ifsc.razorpay.com/YESB0DNB002
```

Path parameter notes from the reviewed docs:
- `{ifsc}` is the complete IFSC code to validate/resolve.
- Invalid IFSC codes return HTTP `404`.

## Confirmed response fields
The official sample response and field summary confirm these provider fields:
- `BANK`
- `IFSC`
- `BRANCH`
- `ADDRESS`
- `CONTACT`
- `CITY`
- `DISTRICT`
- `STATE`
- `RTGS`
- `NEFT`
- `IMPS`
- `UPI`
- `MICR`
- `SWIFT`
- `ISO3166`
- `BANKCODE`

Confirmed response notes from the official wiki:
- `CONTACT` may be a string or `null`.
- `MICR` and `SWIFT` may be strings or `null`.
- `RTGS` and `NEFT` are based on RBI datasets.
- `IMPS` is enabled by default unless known otherwise.
- `UPI` is based on NPCI's UPI live-member list.
- `BANK` and `BANKCODE` may reflect a sublet-branch mapping rather than the bank name a caller expects.

## Rate limits
No numeric rate limit is published on the reviewed official pages.

## Pagination
None. The API is a single-record lookup service.

## Errors
The official wiki explicitly documents:
- `404` for invalid IFSC codes

No richer structured error schema is documented on the reviewed pages.

## Important usage notes
- This is a path-based lookup API; there is no separate search/list endpoint in the reviewed official docs.
- The API supports CORS, so direct browser lookups are possible.
- The returned branch flags (`RTGS`, `NEFT`, `IMPS`, `UPI`) are dataset-driven capability indicators, not transactional guarantees.

## fireROUTE notes
- Treat Razorpay IFSC as a lightweight enrichment/validation provider for Indian bank-routing metadata.
- Preserve provider booleans and nullable banking fields exactly as returned; they are useful for downstream normalization and auditability.
