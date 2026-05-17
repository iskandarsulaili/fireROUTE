# Cep.la

## Provider metadata
- Category: `Geocoding`
- Provider slug: `cep-la`
- Docs URL from category index: `http://cep.la/`
- Manual review outcome: `manual_blocker_documented`
- Official pages checked manually in this pass:
  - `https://cep.la/`
  - `https://cep.la/about/`
  - `https://cep.la/?cep=01001-000`
- Transport attempted on reviewed pages: `HTTP`, `HTTPS`

## What the official pages currently show
- The indexed root now loads at `https://cep.la/` with title `Buscar CEP no Brasil | Consulta CEP por Endereço e Cidade – CEP.LA`.
- The homepage is an end-user HTML search site, not a developer portal. The visible UI is a CEP lookup form with the field `Digite o CEP (ex: 01001-000)`, example CEP links, and a second city/neighborhood search form.
- The official About page `https://cep.la/about/` loads with title `About – cep.la`, but it only describes CEP.LA as a simple website for finding Brazilian CEPs and addresses.
- The same-site result page `https://cep.la/?cep=01001-000` renders a normal website result view headed `Resultado do CEP`, with address details and a `Ver no Google Maps` link.
- Across the reviewed official pages in this run, Cep.la does not publish a canonical API base URL, route list, method list, parameter table, authentication model, rate-limit policy, pagination contract, error catalog, or machine-readable response-format reference.

## Confirmed API surface
- Confirmed base URL: none documented as an official API contract
- Confirmed endpoint paths: none documented as an official API contract
- Confirmed HTTP methods: none documented as an official API contract
- Confirmed parameters: none documented as an official API contract
- Confirmed authentication contract: none
- Confirmed pagination model: none
- Confirmed rate-limit policy: none published
- Confirmed error schema: none published
- Confirmed response formats: none published as an API contract
- Confirmed route count: `0`

## Explicit blocker
- The official site currently exposes consumer HTML search and result pages rather than route-level developer documentation.
- Query-string behavior visible in the website UI is not presented by Cep.la as a supported public API contract.
- fireROUTE should keep this provider at `manual_blocker_documented` until Cep.la publishes official API documentation or an explicitly supported machine-readable endpoint surface.

## Important usage notes
- Do not turn the website search forms or `?cep=` result pages into canonical fireROUTE routes without provider-controlled API documentation.
- Reattempt this provider only if the official domain adds a developer/API reference page or a clearly documented JSON/XML endpoint contract.

## Verification notes
- This file was manually rebuilt from live official-page checks using browser tools and file tools only.
