# Metro Lisboa

## Provider metadata
- Category: `Transportation`
- Provider slug: `metro-lisboa`
- Official docs used manually:
  - `https://app.metrolisboa.pt/status/getLinhas.php`
- Base URL confirmed from the official endpoint:
  - `https://app.metrolisboa.pt/status`
- Authentication:
  - no API key, OAuth flow, cookie gate, or login requirement was exposed on the tested official route
- Primary response / payload formats:
  - JSON payload returned in the response body
  - the tested route currently sends `Content-Type: text/html; charset=UTF-8` even though the payload itself is JSON text
- Transport scope documented here: Metro Lisboa line-status snapshot for the four metro lines

## Important official usage notes
- The endpoint returns one status snapshot object rather than a paginated collection.
- The observed payload has a top-level `codigo` field plus a `resposta` object.
- The `resposta` object contains four named line keys:
  - `amarela`
  - `azul`
  - `verde`
  - `vermelha`
- The same object also includes line-type code fields:
  - `tipo_msg_am`
  - `tipo_msg_az`
  - `tipo_msg_vd`
  - `tipo_msg_vm`
- In the live response inspected during this pass, all four line-status fields returned `" Ok"` and all four type-code fields returned `"0"`.
- The tested response headers include `Content-Security-Policy: frame-ancestors 'self' https://www.metrolisboa.pt/`, which strongly suggests this endpoint is intended to back an official Metro Lisboa website widget or embedded status component.

## Rate limits, pagination, and errors
- No public rate-limit or quota documentation was exposed on the tested official route.
- No pagination parameters or cursor mechanics were exposed; the route returns a single snapshot payload.
- The live response returned HTTP `200` and a top-level payload field `codigo: "200"`.
- No separate structured error schema was published on the reachable official source used in this pass.

## Confirmed API surface
The currently reachable official source exposes 1 route:
1. `GET /getLinhas.php`

## 1) Get current line-status snapshot
- Method: `GET`
- Path: `/getLinhas.php`
- Full URL: `https://app.metrolisboa.pt/status/getLinhas.php`
- Purpose: return the current status summary for the Metro Lisboa lines

Documented parameters:
- None exposed on the tested official route

Documented response notes:
- Response body is JSON text
- The payload shape observed during review was:
  - top-level `codigo`
  - top-level `resposta`
  - line-status fields `amarela`, `azul`, `verde`, `vermelha`
  - line-type fields `tipo_msg_am`, `tipo_msg_az`, `tipo_msg_vd`, `tipo_msg_vm`
- The route appears to be read-only and status-oriented; no write operations or alternate methods were exposed

## Sources inspected
- `https://app.metrolisboa.pt/status/getLinhas.php`
