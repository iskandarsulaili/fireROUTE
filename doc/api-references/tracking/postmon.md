# Postmon

## Provider metadata
- Category: `Tracking`
- Provider slug: `postmon`
- Docs used manually:
  - `https://postmon.com.br/`
- Confirmed API base URL: `https://api.postmon.com.br/v1`
- Primary media types: JSON by default, optional XML via query parameter
- Authentication model surfaced in docs: none
- Manually confirmed routes in this pass: `2`

## Authentication
From the official Postmon homepage/docs page:
- no API key, bearer token, OAuth flow, or login requirement is documented
- the page presents the API as free and directly callable over HTTP(S)

## Common request/response conventions
- Base URL: `https://api.postmon.com.br/v1`
- The reviewed official page exposes two public `GET` route families.
- Default response format is JSON.
- The page says XML output is available by appending `?format=xml` to requests.
- No rate-limit policy or quota window was published on the reviewed official page.

## Manually confirmed endpoint set

### 1) Look up a Brazilian ZIP code (CEP)
- Method: `GET`
- Path: `/cep/{cep}`
- Full URL pattern: `https://api.postmon.com.br/v1/cep/{cep}`
- Path parameters:
  - `{cep}`
- Purpose: return address information for a Brazilian CEP
- Format note:
  - default response is JSON
  - append `?format=xml` for XML output

### 2) Track a shipment
- Method: `GET`
- Path: `/rastreio/{provider}/{codigo_rastreio}`
- Full URL pattern: `https://api.postmon.com.br/v1/rastreio/{provider}/{codigo_rastreio}`
- Path parameters:
  - `{provider}`
  - `{codigo_rastreio}`
- Purpose: return tracking information for a shipment
- Format note:
  - default response is JSON
  - append `?format=xml` for XML output
- Provider note from the reviewed page:
  - accepted provider explicitly listed: `ect` for Correios - Empresa Brasileira de Correios e Telegrafos

## Parameters
- path:
  - `cep`
  - `provider`
  - `codigo_rastreio`
- query:
  - `format=xml` for XML output

## Pagination
- none documented

## Rate limits
- no official rate-limit values were published on the reviewed Postmon page

## Error and response notes
- the reviewed page confirms JSON as the default response format
- the reviewed page also confirms XML output through `?format=xml`
- the page does not publish a structured error schema or status-code table

## Important usage notes
- the public homepage doubles as the documentation page; there is no separate standalone route reference host in the reviewed materials
- the shipment-tracking surface is provider-based, and the reviewed page only explicitly names `ect` as an accepted provider
- Postmon also includes a CEP example form on the official page, which matches the published `/cep/{cep}` route

## Verification notes
This file was manually rebuilt from the official Postmon site using browser inspection only. The `2` route families above were directly described on the reviewed first-party page.