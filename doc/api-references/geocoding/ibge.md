# IBGE

## Provider metadata
- Category: `Geocoding`
- Provider slug: `ibge`
- Official docs used manually:
  - `https://servicodados.ibge.gov.br/api/docs/`
  - `https://servicodados.ibge.gov.br/api/docs/localidades`
- Public API base URL documented by provider for the inspected geocoding surface: `https://servicodados.ibge.gov.br/api/v1/localidades`
- Transport: HTTPS
- Auth model: none documented
- Response format: JSON
- Inspected product area: `Localidades`

## Product and access notes
- The root IBGE API catalogue describes `Localidades` as the API for the political-administrative divisions of Brazil.
- The `Localidades` page says the API covers countries plus Brazil's official political-administrative divisions, as well as meso/microrregions.
- The page explicitly notes that, except for country routes, the identifiers exposed by this API are official IBGE identifiers.
- The page also notes that `regiões geográficas imediatas` and `regiões geográficas intermediárias` progressively replace meso/microrregions and are revised over time.
- The page links a `Query Builder`, but the route documentation itself is already explicit enough to confirm the public URL patterns.

## Authentication, rate limits, pagination, and errors
- No authentication requirement is documented on the inspected pages.
- No rate-limit section or numeric request quota is published on the inspected pages.
- No pagination model is documented; the API is presented as direct collection/item retrieval.
- The accessible route documentation repeatedly exposes `Status: 200` response sections, but the inspected pages do not publish a detailed non-200 error matrix.

## Shared request/parameter notes
- Many path parameters accept one or more identifiers separated by the pipe character `|`.
- Repeated list-style query parameters documented across multiple resources include:
  - `orderBy=nome` for alphabetical ordering
  - `view=nivelado` where the docs say the default JSON preserves hierarchy and `nivelado` flattens the locality structure
- The `aglomeracoes-urbanas` collection route additionally documents `municipio={id}` as a filter.
- The municipality item route is documented with examples using both numeric IBGE codes and municipality-name slugs such as `rio-de-janeiro|perola-doeste`.

## Confirmed API surface
The inspected `Localidades` documentation confirms `59` route patterns under `https://servicodados.ibge.gov.br/api/v1/localidades`:

1. `GET /aglomeracoes-urbanas`
2. `GET /aglomeracoes-urbanas/{aglomeracao-urbana}`
3. `GET /distritos`
4. `GET /distritos/{id}`
5. `GET /estados/{UF}/distritos`
6. `GET /mesorregioes/{mesorregiao}/distritos`
7. `GET /microrregioes/{microrregiao}/distritos`
8. `GET /municipios/{municipio}/distritos`
9. `GET /regioes-imediatas/{regiao-imediata}/distritos`
10. `GET /regioes-intermediarias/{regiao-intermediaria}/distritos`
11. `GET /regioes/{macrorregiao}/distritos`
12. `GET /estados/{UF}/mesorregioes`
13. `GET /mesorregioes`
14. `GET /mesorregioes/{mesorregiao}`
15. `GET /regioes/{macrorregiao}/mesorregioes`
16. `GET /estados/{UF}/microrregioes`
17. `GET /mesorregioes/{mesorregiao}/microrregioes`
18. `GET /microrregioes`
19. `GET /microrregioes/{microrregiao}`
20. `GET /regioes/{macrorregiao}/microrregioes`
21. `GET /estados/{UF}/municipios`
22. `GET /mesorregioes/{mesorregiao}/municipios`
23. `GET /microrregioes/{microrregiao}/municipios`
24. `GET /municipios`
25. `GET /municipios/{municipio}`
26. `GET /regioes-imediatas/{regiao-imediata}/municipios`
27. `GET /regioes-intermediarias/{regiao-intermediaria}/municipios`
28. `GET /regioes/{macrorregiao}/municipios`
29. `GET /paises`
30. `GET /paises/{pais}`
31. `GET /regioes`
32. `GET /regioes/{macrorregiao}`
33. `GET /estados/{UF}/regioes-imediatas`
34. `GET /regioes-imediatas`
35. `GET /regioes-imediatas/{regiao-imediata}`
36. `GET /regioes-intermediarias/{regiao-intermediaria}/regioes-imediatas`
37. `GET /regioes/{macrorregiao}/regioes-imediatas`
38. `GET /regioes-integradas-de-desenvolvimento`
39. `GET /regioes-integradas-de-desenvolvimento/{regiao-integrada-de-desenvolvimento}`
40. `GET /estados/{UF}/regioes-intermediarias`
41. `GET /regioes-intermediarias`
42. `GET /regioes-intermediarias/{regiao-intermediaria}`
43. `GET /regioes/{macrorregiao}/regioes-intermediarias`
44. `GET /estados/{UF}/regioes-metropolitanas`
45. `GET /regioes/{macrorregiao}/regioes-metropolitanas`
46. `GET /regioes-metropolitanas`
47. `GET /regioes-metropolitanas/{regiao-metropolitana}`
48. `GET /distritos/{distrito}/subdistritos`
49. `GET /subdistritos`
50. `GET /estados/{UF}/subdistritos`
51. `GET /mesorregioes/{mesorregiao}/subdistritos`
52. `GET /microrregioes/{microrregiao}/subdistritos`
53. `GET /municipios/{municipio}/subdistritos`
54. `GET /regioes-imediatas/{regiao-imediata}/subdistritos`
55. `GET /regioes/{macrorregiao}/subdistritos`
56. `GET /subdistritos/{id}`
57. `GET /estados`
58. `GET /estados/{UF}`
59. `GET /regioes/{macrorregiao}/estados`

## Route groups and documented parameters

### A) Aglomerações urbanas (`2` routes)
Routes:
- `GET /aglomeracoes-urbanas`
- `GET /aglomeracoes-urbanas/{aglomeracao-urbana}`

Documented parameters:
- `{aglomeracao-urbana}` - one or more agglomeration identifiers separated by `|`
- `orderBy=nome` - alphabetical ordering
- `municipio={id}` - on the collection route, return the urban agglomeration associated with a municipality

Response notes:
- documented as an array with fields such as `id`, `nome`, and `municipios`

### B) Distritos (`9` routes)
Routes:
- `GET /distritos`
- `GET /distritos/{id}`
- `GET /estados/{UF}/distritos`
- `GET /mesorregioes/{mesorregiao}/distritos`
- `GET /microrregioes/{microrregiao}/distritos`
- `GET /municipios/{municipio}/distritos`
- `GET /regioes-imediatas/{regiao-imediata}/distritos`
- `GET /regioes-intermediarias/{regiao-intermediaria}/distritos`
- `GET /regioes/{macrorregiao}/distritos`

Documented parameters:
- `{id}` - one or more district identifiers separated by `|`
- `{UF}`, `{mesorregiao}`, `{microrregiao}`, `{municipio}`, `{regiao-imediata}`, `{regiao-intermediaria}`, `{macrorregiao}` - one or more identifiers separated by `|`
- `orderBy=nome`
- `view=nivelado`

Response notes:
- the schema examples show district objects with `id`, `nome`, and nested `municipio` data

### C) Mesorregiões (`4` routes)
Routes:
- `GET /estados/{UF}/mesorregioes`
- `GET /mesorregioes`
- `GET /mesorregioes/{mesorregiao}`
- `GET /regioes/{macrorregiao}/mesorregioes`

Documented parameters:
- `{UF}`, `{mesorregiao}`, `{macrorregiao}` - one or more identifiers separated by `|`
- `orderBy=nome`

### D) Microrregiões (`5` routes)
Routes:
- `GET /estados/{UF}/microrregioes`
- `GET /mesorregioes/{mesorregiao}/microrregioes`
- `GET /microrregioes`
- `GET /microrregioes/{microrregiao}`
- `GET /regioes/{macrorregiao}/microrregioes`

Documented parameters:
- `{UF}`, `{mesorregiao}`, `{microrregiao}`, `{macrorregiao}` - one or more identifiers separated by `|`
- `orderBy=nome`

### E) Municípios (`8` routes)
Routes:
- `GET /estados/{UF}/municipios`
- `GET /mesorregioes/{mesorregiao}/municipios`
- `GET /microrregioes/{microrregiao}/municipios`
- `GET /municipios`
- `GET /municipios/{municipio}`
- `GET /regioes-imediatas/{regiao-imediata}/municipios`
- `GET /regioes-intermediarias/{regiao-intermediaria}/municipios`
- `GET /regioes/{macrorregiao}/municipios`

Documented parameters:
- `{UF}`, `{mesorregiao}`, `{microrregiao}`, `{regiao-imediata}`, `{regiao-intermediaria}`, `{macrorregiao}` - one or more identifiers separated by `|`
- `{municipio}` - documented with numeric IDs and slug-style municipality names
- `orderBy=nome`
- `view=nivelado`

Response notes:
- municipality schemas shown on the page include nested region relationships such as microrregião and região imediata

### F) Países (`2` routes)
Routes:
- `GET /paises`
- `GET /paises/{pais}`

Documented parameters:
- `{pais}` - one or more country identifiers separated by `|`
- `orderBy=nome`

Official note:
- the page says country data follows the UN M49 methodology for regions/subregions/intermediate regions

### G) Regiões (`2` routes)
Routes:
- `GET /regioes`
- `GET /regioes/{macrorregiao}`

Documented parameters:
- `{macrorregiao}` - one or more macroregion identifiers separated by `|`
- `orderBy=nome`

### H) Regiões imediatas (`5` routes)
Routes:
- `GET /estados/{UF}/regioes-imediatas`
- `GET /regioes-imediatas`
- `GET /regioes-imediatas/{regiao-imediata}`
- `GET /regioes-intermediarias/{regiao-intermediaria}/regioes-imediatas`
- `GET /regioes/{macrorregiao}/regioes-imediatas`

Documented parameters:
- `{UF}`, `{regiao-imediata}`, `{regiao-intermediaria}`, `{macrorregiao}` - one or more identifiers separated by `|`
- `orderBy=nome`

### I) Regiões integradas de desenvolvimento (`2` routes)
Routes:
- `GET /regioes-integradas-de-desenvolvimento`
- `GET /regioes-integradas-de-desenvolvimento/{regiao-integrada-de-desenvolvimento}`

Documented parameters:
- `{regiao-integrada-de-desenvolvimento}` - one or more identifiers separated by `|`
- `orderBy=nome`

### J) Regiões intermediárias (`4` routes)
Routes:
- `GET /estados/{UF}/regioes-intermediarias`
- `GET /regioes-intermediarias`
- `GET /regioes-intermediarias/{regiao-intermediaria}`
- `GET /regioes/{macrorregiao}/regioes-intermediarias`

Documented parameters:
- `{UF}`, `{regiao-intermediaria}`, `{macrorregiao}` - one or more identifiers separated by `|`
- `orderBy=nome`

### K) Regiões metropolitanas (`4` routes)
Routes:
- `GET /estados/{UF}/regioes-metropolitanas`
- `GET /regioes/{macrorregiao}/regioes-metropolitanas`
- `GET /regioes-metropolitanas`
- `GET /regioes-metropolitanas/{regiao-metropolitana}`

Documented parameters:
- `{UF}`, `{macrorregiao}`, `{regiao-metropolitana}` - one or more identifiers separated by `|`
- `orderBy=nome`

### L) Subdistritos (`9` routes)
Routes:
- `GET /distritos/{distrito}/subdistritos`
- `GET /subdistritos`
- `GET /estados/{UF}/subdistritos`
- `GET /mesorregioes/{mesorregiao}/subdistritos`
- `GET /microrregioes/{microrregiao}/subdistritos`
- `GET /municipios/{municipio}/subdistritos`
- `GET /regioes-imediatas/{regiao-imediata}/subdistritos`
- `GET /regioes/{macrorregiao}/subdistritos`
- `GET /subdistritos/{id}`

Documented parameters:
- `{distrito}`, `{UF}`, `{mesorregiao}`, `{microrregiao}`, `{municipio}`, `{regiao-imediata}`, `{macrorregiao}`, `{id}` - one or more identifiers separated by `|`
- `orderBy=nome`
- `view=nivelado`

### M) UFs / estados (`3` routes)
Routes:
- `GET /estados`
- `GET /estados/{UF}`
- `GET /regioes/{macrorregiao}/estados`

Documented parameters:
- `{UF}` and `{macrorregiao}` - one or more identifiers separated by `|`
- `orderBy=nome`

## fireROUTE integration notes
- IBGE `Localidades` is best treated as a Brazil-specific administrative lookup provider rather than a free-form global geocoder.
- The heavy reuse of pipe-delimited multi-ID paths means fireROUTE adapters should preserve batch-by-path behavior where possible instead of forcing one-ID-per-request.
- Because hierarchy-preserving JSON is the default, adapters should make the `view=nivelado` flattening option explicit when callers need tabular output.
