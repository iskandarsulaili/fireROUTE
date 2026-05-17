# Boleto.Cloud

Official docs manually reviewed:
- https://boleto.cloud/
- https://developers.boleto.cloud/
- https://developers.boleto.cloud/v1/visao-geral/
- https://developers.boleto.cloud/v1/autenticacao/
- https://developers.boleto.cloud/v1/status-erros/
- https://developers.boleto.cloud/v1/boletos/
- https://developers.boleto.cloud/v1/boletos/criar/

## Overview
Boleto Cloud is a Brazilian boleto-emission platform with REST endpoints for boleto lifecycle management plus CNAB remittance/return workflows.

Confirmed from the reviewed official docs:
- Sandbox base URL: `https://sandbox.boletocloud.com/api/v1`
- Production base URL: `https://app.boletocloud.com/api/v1`
- Authentication: HTTP Basic Auth using the API key as username and the literal password `token`
- Primary request body format for boleto creation: `application/x-www-form-urlencoded`
- Success payloads can be binary PDFs; error payloads are JSON

## Authentication
The official authentication page explicitly documents HTTP Basic authentication.

Confirmed credential mapping:
- username: your Boleto Cloud API key
- password: the literal string `token`

Confirmed header construction from the reviewed docs:
- `Authorization: Basic base64(API_KEY:token)`

Confirmed example shown by the docs:
- credentials `api-key_123:token` produce `Authorization: Basic YXBpLWtleV8xMjM6dG9rZW4=`

The docs repeatedly instruct developers to use the sandbox host during development.

## Confirmed endpoints
| Method | Path | Purpose |
|---|---|---|
| POST | `/boletos` | Create an individual boleto and return its PDF |
| GET | `/boletos/{token}` | Fetch the original boleto PDF |
| GET | `/boletos/{token}/atualizado/` | Fetch an updated boleto PDF with recalculated charges |
| GET | `/boletos/{token}/atualizado/vencimento/{data}` | Fetch an updated boleto PDF for a specific due date |
| GET | `/boletos/{token}/registro` | Check registration status with the bank |
| PUT | `/boletos/{token}/vencimento` | Change the boleto due date |
| PUT | `/boletos/{token}/registro` | Update registration data |
| PUT | `/boletos/{token}/abatimento` | Apply a discount/abatement |
| PUT | `/boletos/{token}/baixa` | Cancel or baixa the boleto |
| POST | `/carnes` | Create a carnê / installment boleto set |
| POST | `/batch/boletos` | Create boletos in batch |
| POST | `/arquivos/cnab/remessas` | Create a CNAB remittance file |
| POST | `/arquivos/cnab/retornos` | Process a CNAB return file |

Manual route count confirmed from the reviewed official docs: **13** concrete routes.

## Endpoint details

### `POST /boletos`
The official route page describes this as the main single-boleto creation endpoint.

Confirmed request characteristics:
- body format: `application/x-www-form-urlencoded`
- successful response: `201 Created`
- success body/content: boleto PDF

Confirmed body fields visible on the reviewed docs page include:
- `boleto.numero` — optional explicit NIB / identifier; docs say automatic sequential numbering is used if omitted
- `boleto.documento` — document or order number
- `boleto.valor` — boleto amount
- `boleto.emissao` — issue date in `AAAA-MM-DD`
- `boleto.vencimento` — due date in `AAAA-MM-DD`
- `boleto.pagador.nome` — payer full name
- `boleto.pagador.cprf` — payer CPF or CNPJ
- `boleto.pagador.endereco.cep` — payer ZIP code
- `boleto.instrucao` — cashier instructions; docs note multiple lines can be sent by repeating the field

Confirmed route-level response notes from the reviewed docs page:
- `201 Created` — success
- `409 Conflict` — boleto already exists
- `400 Bad Request` — invalid input data

### `GET /boletos/{token}`
Official purpose: obtain the original boleto PDF.

Confirmed path parameter:
- `{token}` — boleto token returned/known for the resource

### `GET /boletos/{token}/atualizado/`
Official purpose: obtain an updated boleto PDF with recalculated interest/penalties.

Confirmed path parameter:
- `{token}` — boleto token

### `GET /boletos/{token}/atualizado/vencimento/{data}`
The boleto overview page explicitly shows this dated updated-PDF route.

Confirmed path parameters:
- `{token}` — boleto token
- `{data}` — target due date used for the regenerated PDF

### `GET /boletos/{token}/registro`
Official purpose: verify whether the boleto has been registered with the bank.

### `PUT /boletos/{token}/vencimento`
Official purpose: postpone/change the boleto due date.

### `PUT /boletos/{token}/registro`
Official purpose: alter the registration data of an already registered boleto.

### `PUT /boletos/{token}/abatimento`
Official purpose: grant a discount/abatement on the boleto amount.

### `PUT /boletos/{token}/baixa`
Official purpose: perform baixa/cancel the boleto at the bank.

### `POST /carnes`
The boleto-overview page lists this as the carnê / installment creation route.

Official usage note shown on the overview page:
- carnês are presented as a grouped/bulk boleto-creation workflow

### `POST /batch/boletos`
The overview page lists this as the batch boleto-creation route.

Official usage note shown on the overview page:
- batch creation is treated separately from single boleto and carnê creation

### CNAB routes
The reviewed overview page explicitly lists these CNAB transport routes:
- `POST /arquivos/cnab/remessas`
- `POST /arquivos/cnab/retornos`

The docs position these as file-based bank-integration workflows.

## Request and response format notes
Confirmed from the reviewed official docs:
- requests are sent over HTTPS in normal operation
- boleto-creation payloads use `application/x-www-form-urlencoded`
- charset reference on the overview page: `UTF-8`
- successful boleto retrieval/creation responses can return `application/pdf`
- error responses are JSON

## Error model
The status/errors page publishes a concrete JSON error envelope.

Confirmed error schema:

```json
{
  "erro": {
    "status": 401,
    "tipo": "autenticacao",
    "causas": [
      {
        "codigo": "2CD228EA",
        "mensagem": "Mensagem do token aqui",
        "suporte": "https://developers.boleto.cloud/"
      }
    ]
  }
}
```

Confirmed error-object properties from the docs:
- `erro.status` — HTTP status code
- `erro.tipo` — API-side error category
- `erro.causas[]` — array of causes/remediation items
- `codigo` — fixed error-classification code
- `mensagem` — human-readable description
- `suporte` — support/help URL

Confirmed general HTTP status ranges table from the docs:
- `1xx` information
- `2xx` success
- `3xx` redirection
- `4xx` client error
- `5xx` server error

## Pagination
No pagination contract was documented on the reviewed pages used in this pass.

The currently confirmed surface is document-oriented and file-oriented rather than cursor/page-oriented.

## Rate limits
The reviewed official pages do **not** publish a numeric request-per-second or request-per-minute limit.

What is explicitly documented:
- use the sandbox during development
- misuse of production during development can lead to blocking and data inconsistencies

## Important usage notes
- Boleto Cloud clearly separates sandbox and production hosts; start on sandbox and switch only after validation.
- Authentication is not bearer-token based; it is HTTP Basic with the API key as username and a literal password value of `token`.
- Success and failure payload formats differ materially: PDFs on success for boleto documents, JSON on failure.
- The route docs emphasize boleto lifecycle operations after creation, especially status checking, due-date changes, abatimento, and baixa.
- The docs also expose CNAB-based integration paths for banking workflows beyond the synchronous boleto endpoints.

## fireROUTE notes
- Treat Boleto Cloud as a specialized boleto/PDF workflow provider, not a generic JSON-only payments API.
- Preserve `application/x-www-form-urlencoded` support for create/update flows where the provider expects form bodies.
- Preserve binary PDF responses instead of forcing JSON normalization.
- Surface the provider’s structured JSON error envelope directly when requests fail.
