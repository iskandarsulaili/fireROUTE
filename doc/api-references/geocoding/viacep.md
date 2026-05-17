# ViaCep

## Provider metadata
- Category: `Geocoding`
- Provider slug: `viacep`
- Official docs used manually: `https://viacep.com.br/`
- Documented API base URL: `https://viacep.com.br/ws`
- Coverage: Brazilian CEP lookup and address-based CEP search
- Auth model: none
- Response formats documented: JSON, JSONP, XML

## Rate limits / usage notes
Official site warns:
- massive use for validating local databases may automatically block access for an indefinite period
- provider does not distribute or commercialize bulk databases

## Confirmed API surface
The official site documents these public route patterns:
- `GET /ws/{cep}/json/`
- `GET /ws/{cep}/xml/`
- `GET /ws/{uf}/{cidade}/{logradouro}/json/`
- `GET /ws/{uf}/{cidade}/{logradouro}/xml/`
- JSONP variant of CEP lookup via `GET /ws/{cep}/json/?callback={callback_name}`

For fireROUTE route counting, the provider exposes two canonical operations:
1. lookup address data by CEP
2. search CEPs by state/city/street

## 1) Lookup by CEP
- Method: `GET`
- Canonical path pattern: `/ws/{cep}/{format}/`
- Example documented URL: `https://viacep.com.br/ws/01001000/json/`
- Purpose: return address details for a single Brazilian CEP

Path parameters:
- `cep` - required; exactly `8` digits
- `format` - required; `json` or `xml`

Optional query parameters:
- `callback` - only for JSONP usage on JSON format

Documented validation/error behavior:
- invalid CEP format returns HTTP `400 Bad Request`
- docs give invalid examples such as 9-digit values, alphanumeric values, or values containing spaces
- valid-format but nonexistent CEP returns a body containing `"erro": true`

Documented JSON response example fields:
- `cep`
- `logradouro`
- `complemento`
- `unidade`
- `bairro`
- `localidade`
- `uf`
- `estado`
- `regiao`
- `ibge`
- `gia`
- `ddd`
- `siafi`

## 2) Search by address
- Method: `GET`
- Canonical path pattern: `/ws/{uf}/{cidade}/{logradouro}/{format}/`
- Example documented URLs:
  - `https://viacep.com.br/ws/RS/Porto Alegre/Domingos/json/`
  - `https://viacep.com.br/ws/RS/Porto Alegre/Domingos Jose/json/`
  - `https://viacep.com.br/ws/RS/Porto Alegre/Domingos+Jose/json/`
- Purpose: find CEPs matching state, city, and street name

Path parameters:
- `uf` - required state abbreviation
- `cidade` - required city name
- `logradouro` - required street / address term
- `format` - required; `json` or `xml`

Provider constraints documented on the homepage:
- `UF`, `Cidade`, and `Logradouro` are all mandatory
- `Cidade` and `Logradouro` must each contain at least `3` characters
- results are ordered by proximity of the street name
- maximum `50` CEPs are returned
- if city or street has fewer than 3 characters, response is HTTP `400 Bad Request`

## Response / error notes
- JSON and XML are both first-class response formats.
- JSONP is only documented for direct CEP lookup.
- Nonexistent-but-well-formed CEPs are signaled in-body instead of through a 404.
- Address search returns a collection of matching CEP records.

## Canonical fireROUTE notes
- This provider is path-driven rather than query-driven.
- CEP validation should happen client-side before calling the API to avoid documented `400` responses.
- For nonexistent CEPs, fireROUTE should watch for `erro: true` even when the HTTP request itself succeeds.
- Address search is not fuzzy across arbitrary fields; it requires `uf`, `cidade`, and `logradouro` together.

## Verification notes
This file was manually rebuilt from the live official ViaCep homepage using browser tools.