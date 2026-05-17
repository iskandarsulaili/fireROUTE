# Brazilian Chamber of Deputies Open Data

## Provider metadata
- Category: `Government`
- Provider slug: `brazilian-chamber-of-deputies-open-data`
- Official docs pages used:
  - `https://dadosabertos.camara.leg.br/swagger/api.html`
  - official OpenAPI document exposed by that page: `https://dadosabertos.camara.leg.br/api/v2/api-docs`
- Current documented API base URL: `https://dadosabertos.camara.leg.br/api/v2`
- Auth model: no auth scheme or API key requirement is documented on the official Swagger page or official OpenAPI document
- Response formats: `application/json`, `application/xml`, `text/xml`
- Methods documented in the OpenAPI document: `GET` for every listed operation
- Official page note: the HTML reference also says `HEAD` can be used with any service
- Manually confirmed canonical route count: `78` unique `GET` routes from the official OpenAPI document

## Official usage notes
- The official Swagger page says this API returns raw data in JSON and XML and aims to follow REST architecture.
- The official page says list endpoints return `15` items by default and accept a maximum of `100` items per request.
- The official page says query-string parameters are used for filtering and selecting results.
- The OpenAPI server selector exposes one production server: `https://dadosabertos.camara.leg.br/api/v2/`.
- The Swagger UI repeats a few routes in multiple sections, so the count here is based on unique `method + path` pairs from the official OpenAPI document rather than repeated UI placements.

## Common parameters and request conventions
Common parameters repeated across many operations in the official OpenAPI document:
- Header `Accept`
  - Allowed values shown by the spec: `application/json, application/xml`
- Path parameter `id`
  - Used across deputy, proposition, vote, organ, party, bloc, front, group, event, and legislature detail routes
- Pagination parameters
  - `pagina` - page number starting at `1`
  - `itens` - page size, with official page note that list endpoints default to `15` and cap at `100`
- Sorting parameters
  - `ordem` - `asc` or `desc`
  - `ordenarPor` - route-specific field name
- Date-range filters
  - `dataInicio`
  - `dataFim`

Frequently used route-family-specific parameters documented in the spec include:
- Deputies: `id`, `nome`, `idLegislatura`, `siglaUf`, `siglaPartido`, `siglaSexo`
- Propositions: `siglaTipo`, `numero`, `ano`, `codTipo`, `idDeputadoAutor`, `autor`, `siglaPartidoAutor`, `idPartidoAutor`, `siglaUfAutor`, `keywords`, `tramitacaoSenado`, `dataApresentacaoInicio`, `dataApresentacaoFim`, `codTema`
- Events: `codTipoEvento`, `codSituacao`, `codTipoOrgao`, `idOrgao`, `horaInicio`, `horaFim`
- Votes: `idProposicao`, `idEvento`, `idOrgao`
- Parties and legislatures: `sigla`, `data`
- Reference lookups expose fixed code lists rather than additional request bodies

## Response, pagination, and error notes
- List-style responses use wrapper objects with top-level fields such as `dados` and `links`.
- The `links` array is part of the documented response schema and is the main navigation/pagination signal in the official schema.
- The OpenAPI document lists `200`, `400`, and `404` responses for all `78` documented operations.
- The shared default response component is named `Resposta padrão` and advertises JSON and XML media types.
- No rate-limit policy, throttle header, or retry/backoff guidance is published on the official Swagger page or in the OpenAPI document used here.

## Canonical endpoint inventory from the official OpenAPI document

### Deputados - 15 routes
1. `GET /deputados`
2. `GET /deputados/{id}`
3. `GET /deputados/{id}/despesas`
4. `GET /deputados/{id}/discursos`
5. `GET /deputados/{id}/eventos`
6. `GET /deputados/{id}/frentes`
7. `GET /deputados/{id}/historico`
8. `GET /deputados/{id}/mandatosExternos`
9. `GET /deputados/{id}/ocupacoes`
10. `GET /deputados/{id}/orgaos`
11. `GET /deputados/{id}/profissoes`
12. `GET /legislaturas/{id}/lideres`
13. `GET /legislaturas/{id}/mesa`
14. `GET /referencias/deputados/codSituacao`
15. `GET /referencias/situacoesDeputado`

### Proposições - 7 routes
16. `GET /proposicoes`
17. `GET /proposicoes/{id}`
18. `GET /proposicoes/{id}/autores`
19. `GET /proposicoes/{id}/relacionadas`
20. `GET /proposicoes/{id}/temas`
21. `GET /proposicoes/{id}/tramitacoes`
22. `GET /proposicoes/{id}/votacoes`

### Votações - 4 routes
23. `GET /votacoes`
24. `GET /votacoes/{id}`
25. `GET /votacoes/{id}/orientacoes`
26. `GET /votacoes/{id}/votos`

### Órgãos - 7 routes
27. `GET /orgaos`
28. `GET /orgaos/{id}`
29. `GET /orgaos/{id}/eventos`
30. `GET /orgaos/{id}/membros`
31. `GET /orgaos/{id}/votacoes`
32. `GET /referencias/orgaos/codSituacao`
33. `GET /referencias/situacoesOrgao`

### Partidos - 4 routes
34. `GET /partidos`
35. `GET /partidos/{id}`
36. `GET /partidos/{id}/lideres`
37. `GET /partidos/{id}/membros`

### Legislaturas - 2 routes
38. `GET /legislaturas`
39. `GET /legislaturas/{id}`

### Blocos - 3 routes
40. `GET /blocos`
41. `GET /blocos/{id}`
42. `GET /blocos/{id}/partidos`

### Frentes - 3 routes
43. `GET /frentes`
44. `GET /frentes/{id}`
45. `GET /frentes/{id}/membros`

### Grupos - 4 routes
46. `GET /grupos`
47. `GET /grupos/{id}`
48. `GET /grupos/{id}/historico`
49. `GET /grupos/{id}/membros`

### Eventos - 10 routes
50. `GET /eventos`
51. `GET /eventos/{id}`
52. `GET /eventos/{id}/deputados`
53. `GET /eventos/{id}/orgaos`
54. `GET /eventos/{id}/pauta`
55. `GET /eventos/{id}/votacoes`
56. `GET /referencias/eventos/codSituacaoEvento`
57. `GET /referencias/eventos/codTipoEvento`
58. `GET /referencias/situacoesEvento`
59. `GET /referencias/tiposEvento`

### Referências - 19 routes
60. `GET /referencias/deputados`
61. `GET /referencias/deputados/codTipoProfissao`
62. `GET /referencias/deputados/siglaUF`
63. `GET /referencias/deputados/tipoDespesa`
64. `GET /referencias/eventos`
65. `GET /referencias/orgaos`
66. `GET /referencias/orgaos/codTipoOrgao`
67. `GET /referencias/proposicoes`
68. `GET /referencias/proposicoes/codSituacao`
69. `GET /referencias/proposicoes/codTema`
70. `GET /referencias/proposicoes/codTipoAutor`
71. `GET /referencias/proposicoes/codTipoTramitacao`
72. `GET /referencias/proposicoes/siglaTipo`
73. `GET /referencias/situacoesProposicao`
74. `GET /referencias/tiposAutor`
75. `GET /referencias/tiposOrgao`
76. `GET /referencias/tiposProposicao`
77. `GET /referencias/tiposTramitacao`
78. `GET /referencias/uf`

## fireROUTE integration notes
- This provider is a large read-oriented legislative catalog with a single official base URL and consistent response wrappers, so it fits raw passthrough well.
- `Accept` handling matters because the official docs still advertise both JSON and XML outputs.
- Reference endpoints are important because many filter parameters depend on code lists published under `/referencias/...`.
- For adapters, treat `pagina` and `itens` as the canonical pagination controls and preserve `links` from upstream responses when possible.
