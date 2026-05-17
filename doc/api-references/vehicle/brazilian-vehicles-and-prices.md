# Brazilian Vehicles and Prices

## Provider metadata
- Category: `Vehicle`
- Provider slug: `brazilian-vehicles-and-prices`
- Official docs used manually:
  - `https://deividfortuna.github.io/fipe/`
  - provider’s v1 homepage notes the newer v2 docs at `https://deividfortuna.github.io/fipe/v2`
- Public API base URL documented on the v1 page: `https://parallelum.com.br/fipe/api/v1`
- Response format documented: JSON
- Auth model for v1 public examples: none shown on requests

## Rate limits / plan notes
The official page currently states:
- unauthenticated free usage is limited to `500 requests per day (24h)`
- creating a free access token raises the allowance to `1000 requests per day (24h)`
- paid plans on `fipe.online` are offered for unlimited requests and historical pricing access

## Coverage notes
The docs explain that the same route patterns work with vehicle-type segment values:
- `carros`
- `motos`
- `caminhoes`

## Confirmed API surface
The official v1 docs page explicitly demonstrates these route patterns:
- `GET /{tipo}/marcas`
- `GET /{tipo}/marcas/{codigoMarca}/modelos`
- `GET /{tipo}/marcas/{codigoMarca}/modelos/{codigoModelo}/anos`
- `GET /{tipo}/marcas/{codigoMarca}/modelos/{codigoModelo}/anos/{codigoAno}`

## 1) List brands
- Method: `GET`
- Path pattern: `/{tipo}/marcas`
- Full URL pattern: `https://parallelum.com.br/fipe/api/v1/{tipo}/marcas`
- Purpose: list brands for a vehicle type

Path parameters:
- `tipo` - required; docs mention `carros`, `motos`, or `caminhoes`

Documented example:
- `GET https://parallelum.com.br/fipe/api/v1/carros/marcas`

Example response fields:
- `codigo`
- `nome`

## 2) List models for a brand
- Method: `GET`
- Path pattern: `/{tipo}/marcas/{codigoMarca}/modelos`
- Full URL pattern: `https://parallelum.com.br/fipe/api/v1/{tipo}/marcas/{codigoMarca}/modelos`
- Purpose: list vehicle models for a brand and return fuel/year code options

Path parameters:
- `tipo` - required vehicle type
- `codigoMarca` - required brand code

Documented example:
- `GET https://parallelum.com.br/fipe/api/v1/carros/marcas/59/modelos`

Documented response structure:
- top-level `anos` array
- top-level `modelos` array

Example nested fields:
- `anos[].codigo`
- `anos[].nome`
- `modelos[].codigo`
- `modelos[].nome`

## 3) List available years/fuel variants for a model
- Method: `GET`
- Path pattern: `/{tipo}/marcas/{codigoMarca}/modelos/{codigoModelo}/anos`
- Full URL pattern: `https://parallelum.com.br/fipe/api/v1/{tipo}/marcas/{codigoMarca}/modelos/{codigoModelo}/anos`
- Purpose: list year/fuel combinations available for a specific model

Path parameters:
- `tipo`
- `codigoMarca`
- `codigoModelo`

Documented example:
- `GET https://parallelum.com.br/fipe/api/v1/carros/marcas/59/modelos/5940/anos`

Example response fields:
- `codigo`
- `nome`

## 4) Get current FIPE price/value
- Method: `GET`
- Path pattern: `/{tipo}/marcas/{codigoMarca}/modelos/{codigoModelo}/anos/{codigoAno}`
- Full URL pattern: `https://parallelum.com.br/fipe/api/v1/{tipo}/marcas/{codigoMarca}/modelos/{codigoModelo}/anos/{codigoAno}`
- Purpose: retrieve the current FIPE reference value for a specific vehicle/model/year-fuel combination

Path parameters:
- `tipo`
- `codigoMarca`
- `codigoModelo`
- `codigoAno` - required year/fuel code such as `2014-3`

Documented example:
- `GET https://parallelum.com.br/fipe/api/v1/carros/marcas/59/modelos/5940/anos/2014-3`

Documented response fields:
- `TipoVeiculo`
- `Valor`
- `Marca`
- `Modelo`
- `AnoModelo`
- `Combustivel`
- `CodigoFipe`
- `MesReferencia`
- `SiglaCombustivel`

## Response / usage notes
- The docs state all search data is returned as JSON.
- The provider page emphasizes these are average national-market reference prices and not binding sale prices.
- The service uses its own database rather than proxying requests to FIPE’s own upstream service on each request.

## Canonical fireROUTE notes
- This API is entirely path-parameter driven.
- `codigoAno` is not just a year; it encodes the model year plus fuel type suffix.
- Model-list responses contain both `modelos` and `anos`, so adapters should not assume a flat list.
- The docs page prominently recommends migration to v2, but the demonstrated public v1 routes above are still live and officially documented.

## Verification notes
This file was manually rebuilt from the live official FIPE API documentation page using browser tools.