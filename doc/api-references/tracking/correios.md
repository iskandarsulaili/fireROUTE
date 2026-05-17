# Correios

## Provider metadata
- Category: `Tracking`
- Provider slug: `correios`
- Official pages reviewed manually in this pass:
  - `https://www.correios.com.br/atendimento/developers/manuais/correioswebservice`
  - `https://cws.correios.com.br/`
  - `https://cws.correios.com.br/bem-vindo`
  - redirected official auth page: `https://auth.correios.com.br/login?service=https%3A%2F%2Fcws.correios.com.br%2Flogin%2Fcas`
- Manually confirmed current route count: `0`

## Overview
Correios still operates an active first-party Correios Web Services platform (`CWS`). The current public materials are much stronger than a dead-site blocker: the official manual now clearly documents the platform model, environments, authentication flow, token concepts, and request-format expectations. However, the reviewed public pages still do not expose a publicly browsable method+path inventory for the actual business APIs. The live endpoint-level documentation remains inside the authenticated CWS experience.

## Official platform details confirmed manually
### Public portal / environment hosts
- production CWS portal: `https://cws.correios.com.br`
- homologation CWS portal: `https://cwshom.correios.com.br`
- production Meu Correios portal: `https://meucorreios.correios.com.br`
- homologation Meu Correios portal: `https://meucorreioshom.correios.com.br`
- authentication service observed during manual review: `https://auth.correios.com.br`

### Product scope confirmed from first-party pages
The official CWS root page says the platform covers business functions including:
- price calculation
- delivery-time estimates
- CEP lookup
- other Correios web services

The official manual says CWS is aimed at customers integrating directly with Correios systems and that access may be open or restricted depending on the API and granted authorization.

## Authentication and access model
The public manual now exposes the overall auth model even though it does not publish the route table itself.

### Account and portal access
- CWS access requires a `Meu Correios` account.
- The reviewed `https://cws.correios.com.br/bem-vindo` page redirected to the official login service at `auth.correios.com.br`.
- The live auth page visibly requires `User` and `Password` and offers `Sign up for idCorreios`.

### API credentials / token flow
From the official manual:
- users generate a `código de acesso` for APIs inside CWS
- third-party access can be delegated through `chaves de acesso`
- subdelegated keys are sent in the `Authorization` parameter as a `Bearer Token`
- token generation supports three authorization modes:
  - user / access code
  - contract
  - postage card (`cartão de postagem`)
- the manual says the token generated for API use has `24h` validity
- the manual says the public `API – Token` is available to all CWS users
- the manual says a successful tested token-generation request returned HTTP `201`

### Documentation visibility restriction
The same official manual also states:
- only APIs authorized and/or validated for the logged-in user are available for consultation
- after validating a delegated key, the documentation for the authorized APIs becomes available in the `Documentação` section inside CWS

That restriction is the main reason the public fireROUTE route count remains `0`.

## Transport / format notes confirmed manually
The official manual explicitly states:
- CWS uses HTTP
- integrations may use `REST` or `SOAP`
- responses may be provided as `JSON` or `XML`
- in the REST model, a base URL is provided and HTTP verbs such as `GET`, `POST`, `PUT`, and `DELETE` determine the requested action

The public root and manual therefore confirm the overall integration shape, but not the concrete business-API path inventory.

## Base URL assessment
Confirmed public portal hosts:
- `https://cws.correios.com.br`
- `https://cwshom.correios.com.br`

Important limitation:
- these are confirmed CWS portal / environment hosts, not a publicly exposed route-by-route API base inventory
- the reviewed public manual did not disclose the concrete path patterns for the individual logistics/tracking APIs themselves
- the manual indicates those exact docs are surfaced only after authorization inside CWS

## Route inventory
Publicly confirmable current route count for fireROUTE purposes: `0`

Why the count remains `0` despite stronger documentation:
- the official manual confirms the platform architecture and auth flow, but not exact business API paths
- the live `Documentação` section for APIs is described as user-specific and authorization-gated
- the reviewed public pages did not expose a stable anonymous OpenAPI, Swagger, WSDL, or endpoint table with exact method+path combinations for tracking-related APIs

## Parameters, pagination, errors, and limits
### Parameters
Could not be confirmed route-by-route from public anonymous pages because no endpoint table was exposed.

### Pagination
No public pagination contract was visible in the reviewed first-party materials.

### Errors
The public materials did confirm a few operational signals:
- CWS login requires authenticated `User` / `Password`
- token generation success is illustrated with HTTP `201`
- expired or revoked delegated keys cannot be validated

No general route-level JSON/XML error schema was published on the anonymous pages reviewed.

### Rate limits
No numeric rate-limit policy was published in the reviewed official public pages.

## Important usage notes
- Treat Correios as an active authenticated platform, not a dead provider.
- Public anonymous materials are now sufficient to confirm environment hosts, REST/SOAP + JSON/XML support, bearer-token usage, and the existence of a token API flow.
- Do not infer exact tracking endpoints from screenshots, old index metadata, or third-party copies while the current route-level docs remain gated inside CWS.
- The official manual strongly suggests that exact API docs become visible only after login plus authorization / credential validation for the relevant APIs.

## Blocker
I manually reviewed the official public manual, the live CWS root, and the official login redirect flow. The blocker is now specifically a public route-visibility blocker: Correios documents the platform and credential workflow publicly, but keeps the exact business API method/path documentation behind authenticated, authorization-scoped CWS access.

## Verification note
This file was manually rebuilt from current first-party Correios pages using browser inspection only. The richer public auth/platform details above are current and official, but no anonymous route table was exposed strongly enough to count above `0`.