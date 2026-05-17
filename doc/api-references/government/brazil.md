# Brazil

## Provider metadata
- Category: `Government`
- Provider slug: `brazil`
- Official docs/pages used:
  - `https://brasilapi.com.br/`
  - `https://brasilapi.com.br/#termos-de-uso`
  - `https://brasilapi.com.br/docs`
  - live checks against:
    - `https://brasilapi.com.br/api/banks/v1`
    - `https://brasilapi.com.br/api/cvm/fundos/v1?page=1&size=1`
    - `https://brasilapi.com.br/api/tuss/v1/autocomplete?q=ab&limit=2`
    - `https://brasilapi.com.br/api/cep/v2/00000000`
    - `https://brasilapi.com.br/api/ddd/v1/00`
- Current documented API base URL: `https://brasilapi.com.br/api`
- Auth model: none documented on the official site or docs
- Response format: JSON
- Methods documented in the official spec: `GET` only
- Manually confirmed canonical route count: `43`

## Official usage notes
- The official docs page publishes one public server URL: `https://brasilapi.com.br/api`.
- The homepage and terms section describe BrasilAPI as an experimental public service and explicitly ask users not to abuse it.
- The official terms text says not to use automated crawling or full scans of the API and specifically warns against looped requests such as enumerating every CEP.
- No numeric rate-limit policy or quota header is published on the reviewed official pages.
- The docs use tag sections rather than a separate auth or SDK guide; all documented operations are unauthenticated `GET` routes.
- The docs expose both `Fundos` and `Fundos de investimento` tags, but both point to the same two `/cvm/fundos/v1...` routes; they are counted once here.
- The NCM search operation is documented as `GET /ncm/v1?search={code}` on the official docs page; it is listed separately here because the official route inventory presents it as its own search operation.

## Common parameters and request conventions
Common path parameters documented across the official spec:
- `ano` - holiday year, integer, official bounds `1900` to `2199`
- `cep` - CEP string/integer depending on route version
- `cityCode` - CPTEC city id
- `cityName` - CPTEC city-name search string
- `cnpj` - Brazilian company identifier, accepted in plain or formatted forms on the documented CNPJ route
- `code` - reused for bank code, NCM code, and state identifier depending on route
- `codigoFipe` - FIPE code in `000000-0` format
- `codigoMarca` - FIPE brand id
- `data` - date string in `YYYY-MM-DD` format for exchange-rate lookup
- `days` - forecast horizon for CPTEC forecast/ocean routes
- `ddd` - two-digit DDD code
- `domain` - `.br` domain name
- `icaoCode` - four-character airport ICAO code
- `isbn` - ISBN-10 or ISBN-13, with or without formatting
- `lat`, `long` - latitude/longitude floats for CPTEC weekly forecast
- `moeda` - target currency code
- `siglaUF` - Brazilian state abbreviation
- `tipoVeiculo` - vehicle type such as `caminhoes`, `carros`, or `motos`
- `tuss` - TUSS code
- `typeFund` - B3 fund type, officially one of `FII`, `SETORIAL`, `FIAGRO-FII`, `FIAGRO-FIDC`, `FIAGRO-FIP`, `FIP`, `FIA`

Common query parameters documented across the official spec:
- `providers` - upstream-provider selection on some IBGE and ISBN routes
- `tabela_referencia` - FIPE reference table selector
- `page`, `size` - pagination on CVM funds list
- `name`, `tuss`, `q`, `match`, `sort`, `order`, `fields`, `limit`, `offset` - TUSS list/search/autocomplete controls

## Response, pagination, and error notes
- Live checks confirmed `application/json; charset=utf-8` responses on public routes.
- `GET /cvm/fundos/v1?page=1&size=1` returned an object with `data`, `page`, and `size`, confirming explicit page-number pagination on that collection.
- The official docs say the CVM funds `size` parameter supports `1` to `200` items per page.
- The TUSS routes document `limit` and `offset` pagination, with the autocomplete route documenting maximum `limit` `20` and default `10`.
- Live invalid-request checks returned structured JSON errors, including:
  - `GET /api/cep/v2/00000000` -> HTTP `404` with `name`, `message`, `type`, and nested `errors`
  - `GET /api/ddd/v1/00` -> HTTP `400` with `message`, `type`, and `name`
- Across the official spec, documented response codes include `200`, `400`, `404`, `422`, and `500` depending on route family.

## Canonical endpoint inventory from the official docs

### BANKS - 2 routes
1. `GET /banks/v1`
   - Purpose: return all Brazilian banks
   - Parameters: none documented
2. `GET /banks/v1/{code}`
   - Purpose: return one bank by numeric bank code
   - Path parameters:
     - `code` - required integer bank code

### CAMBIO - 2 routes
3. `GET /cambio/v1/moedas`
   - Purpose: list supported currencies for exchange-rate queries
   - Parameters: none documented
4. `GET /cambio/v1/cotacao/{moeda}/{data}`
   - Purpose: return BRL exchange rate for a target currency on a specific date
   - Path parameters:
     - `moeda` - required string currency code
     - `data` - required date string in `YYYY-MM-DD`
   - Official note: weekends and holidays return the latest previous business day with data

### CEP - 1 route
5. `GET /cep/v1/{cep}`
   - Purpose: CEP lookup with multiple fallback providers
   - Path parameters:
     - `cep` - required CEP value

### CEP V2 - 1 route
6. `GET /cep/v2/{cep}`
   - Purpose: CEP lookup with geolocation fields
   - Path parameters:
     - `cep` - required CEP string matching `^[0-9]{8}$|^[0-9]{5}-[0-9]{3}$`
   - Official note: geolocation is sourced from OpenStreetMap and may contain errors

### CNPJ - 1 route
7. `GET /cnpj/v1/{cnpj}`
   - Purpose: company lookup by CNPJ
   - Path parameters:
     - `cnpj` - required CNPJ string; plain or formatted forms accepted by the documented pattern

### Corretoras - 2 routes
8. `GET /cvm/corretoras/v1`
   - Purpose: list active brokers from CVM files
   - Parameters: none documented
9. `GET /cvm/corretoras/v1/{cnpj}`
   - Purpose: return one broker record by CNPJ
   - Path parameters:
     - `cnpj` - required CNPJ string

### CPTEC - 9 routes
10. `GET /cptec/v1/cidade`
    - Purpose: list all CPTEC-supported localities and codes
11. `GET /cptec/v1/cidade/{cityName}`
    - Purpose: search localities by city name
    - Path parameters:
      - `cityName` - required string
12. `GET /cptec/v1/clima/capital`
    - Purpose: current weather conditions for Brazilian capitals
13. `GET /cptec/v1/clima/aeroporto/{icaoCode}`
    - Purpose: current airport weather by ICAO code
    - Path parameters:
      - `icaoCode` - required ICAO code string
14. `GET /cptec/v1/clima/previsao/{cityCode}`
    - Purpose: one-day weather forecast by CPTEC city code
    - Path parameters:
      - `cityCode` - required integer
15. `GET /cptec/v1/clima/previsao/{cityCode}/{days}`
    - Purpose: weather forecast for up to 6 days
    - Path parameters:
      - `cityCode` - required integer
      - `days` - required integer day count
16. `GET /cptec/v1/clima/previsao/semana/{lat}/{long}`
    - Purpose: weekly forecast by latitude/longitude
    - Path parameters:
      - `lat` - required float
      - `long` - required float
17. `GET /cptec/v1/ondas/{cityCode}`
    - Purpose: one-day ocean forecast by city code
    - Path parameters:
      - `cityCode` - required integer
18. `GET /cptec/v1/ondas/{cityCode}/{days}`
    - Purpose: ocean forecast for up to 6 days
    - Path parameters:
      - `cityCode` - required integer
      - `days` - required integer day count

### DDD - 1 route
19. `GET /ddd/v1/{ddd}`
   - Purpose: return the state and city list for a DDD code
   - Path parameters:
     - `ddd` - required integer, official bounds `10` to `99`

### FIPE - 4 routes
20. `GET /fipe/marcas/v1/{tipoVeiculo}`
   - Purpose: list vehicle brands for a vehicle type
   - Path parameters:
     - `tipoVeiculo` - optional string in the official docs; supported values described as `caminhoes`, `carros`, `motos`
   - Query parameters:
     - `tabela_referencia` - optional integer reference-table code
21. `GET /fipe/preco/v1/{codigoFipe}`
   - Purpose: return FIPE price details for a vehicle
   - Path parameters:
     - `codigoFipe` - required string matching `^[0-9]{6}-[0-9]$`
   - Query parameters:
     - `tabela_referencia` - optional integer reference-table code
22. `GET /fipe/tabelas/v1`
   - Purpose: list FIPE reference tables
   - Parameters: none documented
23. `GET /fipe/veiculos/v1/{tipoVeiculo}/{codigoMarca}`
   - Purpose: list vehicles for a brand and vehicle type
   - Path parameters:
     - `tipoVeiculo` - required string
     - `codigoMarca` - required integer brand code
   - Query parameters:
     - `tabela_referencia` - optional integer reference-table code

### Fundos / Fundos de investimento - 2 routes
24. `GET /cvm/fundos/v1`
   - Purpose: list CVM investment funds
   - Query parameters:
     - `page` - optional page number
     - `size` - optional page size, official docs say `1` to `200`
25. `GET /cvm/fundos/v1/{cnpj}`
   - Purpose: return one fund by CNPJ
   - Path parameters:
     - `cnpj` - required CNPJ string

### Feriados Nacionais - 1 route
26. `GET /feriados/v1/{ano}`
   - Purpose: list Brazilian national holidays for a year
   - Path parameters:
     - `ano` - required integer year, `1900` to `2199`

### IBGE - 3 routes
27. `GET /ibge/municipios/v1/{siglaUF}`
   - Purpose: list municipalities for a state
   - Path parameters:
     - `siglaUF` - required state abbreviation
   - Query parameters:
     - `providers` - optional comma-separated provider list
28. `GET /ibge/uf/v1`
   - Purpose: list all Brazilian states
   - Parameters: none documented
29. `GET /ibge/uf/v1/{code}`
   - Purpose: return one state by abbreviation or code
   - Official docs expose no explicit parameter table on this route, but the path variable is `code`

### ISBN - 1 route
30. `GET /isbn/v1/{isbn}`
   - Purpose: return book metadata by ISBN
   - Path parameters:
     - `isbn` - required ISBN string; ISBN-10, ISBN-13, and formatted variants are documented
   - Query parameters:
     - `providers` - optional provider list; docs name `cbl`, `mercado-editorial`, `open-library`, and `google-books`

### NCM - 3 routes
31. `GET /ncm/v1`
   - Purpose: list all NCM codes
   - Parameters: none documented
32. `GET /ncm/v1?search={code}`
   - Purpose: search NCM codes by code fragment or description
   - Query parameters:
     - `search` - documented as the search term in the official route inventory
33. `GET /ncm/v1/{code}`
   - Purpose: return one NCM code by identifier
   - Path parameters:
     - `code` - required NCM code string

### PIX - 1 route
34. `GET /pix/v1/participants`
   - Purpose: list PIX participants for the current or most recent business day
   - Parameters: none documented

### REGISTRO BR - 1 route
35. `GET /registrobr/v1/{domain}`
   - Purpose: inspect `.br` domain status
   - Path parameters:
     - `domain` - required domain string

### TAXAS - 2 routes
36. `GET /taxas/v1`
   - Purpose: list official rates and indexes
   - Parameters: none documented
37. `GET /taxas/v1/{sigla}`
   - Purpose: return one rate by name/symbol
   - Official docs expose the path variable in the route but do not provide a separate parameter table in the reviewed snippet

### TICKERS - 2 routes
38. `GET /tickers/b3/acoes/v1`
   - Purpose: list B3 stock tickers
   - Parameters: none documented
39. `GET /tickers/b3/fundos/v1/{typeFund}`
   - Purpose: list B3 fund tickers by fund type
   - Path parameters:
     - `typeFund` - required string enum: `FII`, `SETORIAL`, `FIAGRO-FII`, `FIAGRO-FIDC`, `FIAGRO-FIP`, `FIP`, `FIA`

### TUSS - 4 routes
40. `GET /tuss/v1`
   - Purpose: list TUSS terms with basic search support
   - Query parameters:
     - `name` - optional term-name filter
     - `tuss` - optional code filter
     - `limit` - optional integer, minimum `1`
     - `offset` - optional integer, minimum `0`
41. `GET /tuss/v1/{tuss}`
   - Purpose: return one TUSS term by code
   - Path parameters:
     - `tuss` - required TUSS code string
42. `GET /tuss/v1/search`
   - Purpose: advanced TUSS search
   - Query parameters:
     - `q` - optional free-text search
     - `name` - optional name filter
     - `tuss` - optional TUSS-code filter
     - `match` - optional enum `prefix|exact`
     - `sort` - optional enum `tuss|name`
     - `order` - optional enum `asc|desc`
     - `fields` - optional comma-separated field projection
     - `limit` - optional integer, minimum `1`
     - `offset` - optional integer, minimum `0`
43. `GET /tuss/v1/autocomplete`
   - Purpose: lightweight TUSS autocomplete
   - Query parameters:
     - `q` - optional free-text input
     - `name` - optional name prefix
     - `tuss` - optional code prefix
     - `limit` - optional integer, minimum `1`, maximum `20`

## fireROUTE integration notes
- Treat `https://brasilapi.com.br/api` as the canonical base URL for this provider.
- Preserve query-driven variants that change collection behavior, especially `/cvm/fundos/v1`, `/isbn/v1/{isbn}`, `/ibge/municipios/v1/{siglaUF}`, and the TUSS search family.
- The provider is public and easy to call, but the official terms explicitly prohibit abusive crawling/full-scan patterns; fireROUTE adapters should avoid enumeration-heavy fallback behavior.
- CEP V1 and CEP V2 should stay separate because V2 adds geolocation and has stricter validation/error behavior.
- Preserve the NCM search route as a query-style lookup rather than collapsing it into the plain list route.