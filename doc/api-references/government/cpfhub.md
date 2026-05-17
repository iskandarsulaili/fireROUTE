# CPFHub

## Provider metadata
- Category: `Government`
- Provider slug: `cpfhub`
- Official docs/pages reviewed in this run:
  - `https://cpfhub.io/documentacao/api-reference`
  - `https://cpfhub.io/documentacao/api-reference#consulta-cpf`
- Assigned docs URL: `https://cpfhub.io`
- Current public API base URL: `https://api.cpfhub.io`
- Auth model: API key via the `x-api-key` header on every request
- Response format: `application/json`
- Rate limits:
  - Free: `1 request every 2 seconds`
  - Pro: `1 request per second`
  - Corporate: `custom`
- Pagination: none documented on the reviewed lookup route
- Error format: no shared JSON error-body schema was published on the reviewed page; the docs do publish HTTP status meanings
- Manually confirmed route count: `1`

## Official usage notes
- The official API reference describes CPFHub as a REST API for CPF data access through simple, secure endpoints.
- The reviewed docs explicitly say all requests should use the base URL `https://api.cpfhub.io`.
- The docs say API keys are created in the dashboard at `app.cpfhub.io` and must be sent using the `x-api-key` request header.
- The authentication example also sends `Accept: application/json`.
- The reviewed page was marked `Última atualização: 25/01/2026`.

## Canonical endpoint
1. `GET /cpf/{cpf}`
   - Base URL: `https://api.cpfhub.io`
   - Purpose: CPF lookup / CPF data retrieval
   - Required headers documented on the reviewed page:
     - `x-api-key: YOUR_API_KEY`
     - `Accept: application/json`
   - Path parameter:
     - `cpf` - required CPF identifier; the official example uses an 11-digit value like `00000000000`
   - Official example:
     - `GET https://api.cpfhub.io/cpf/00000000000`

## Parameters and request notes
- No query parameters were documented on the reviewed API reference page for the visible CPF lookup route.
- The error-code table explicitly says malformed CPF input is handled as HTTP `400 Bad Request`, which is the clearest official validation hint for the path parameter.
- The docs did not publish alternate methods for this route; the reviewed example uses `GET`.

## Rate-limit and error notes
- The official docs say rate limiting varies by plan.
- When rate limits are exceeded, the API returns HTTP `429 Too Many Requests`.
- The docs also say the response headers include information about the current limit and when it resets.
- The reviewed response-code table documents:
  - `200` - successful request
  - `400` - invalid request, for example malformed CPF
  - `401` - invalid or missing API key
  - `404` - resource not found
  - `429` - rate limit exceeded
  - `500` - internal server error
  - `503` - service temporarily unavailable

## Format and pagination notes
- The reviewed authentication example explicitly requests `application/json`.
- The reviewed CPF lookup route is a single-resource lookup route, and the visible docs did not describe any pagination parameters or paginated response envelope for it.
- The reviewed page did not publish a shared field-by-field response schema in the visible sections captured during this run.

## fireROUTE normalization notes
- Normalize CPFHub as a simple authenticated JSON REST provider rooted at `https://api.cpfhub.io`.
- Preserve `x-api-key` header auth as the canonical authentication mechanism.
- Model the confirmed public surface from this run as one path-parameterized lookup endpoint: `GET /cpf/{cpf}`.
- Do not invent additional routes from sidebar labels like `OpenAPI Spec`, `Web SDKs`, or `Agent Skills` unless those pages are separately reviewed and confirmed.
