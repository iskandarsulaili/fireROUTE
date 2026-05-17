# PokéAPI (GraphQL)

## Overview
- Provider: graphql-pokeapi
- Category: Games & Comics
- Official repository inspected: `https://github.com/mazipan/graphql-pokeapi`
- Official README inspected directly: `https://raw.githubusercontent.com/mazipan/graphql-pokeapi/master/README.md`
- Official homepage inspected: `https://graphql-pokeapi.vercel.app`
- Base URL: `https://graphql-pokeapi.vercel.app`
- Alternate official deployment published in the README: `https://graphql-pokeapi.graphcdn.app`
- Primary endpoint path: `/api/graphql`
- Status: `manually_documented`
- Confirmed routes: `1` logical public GraphQL route, published on two official hosts
- Auth: none documented in the official README, and no auth was required for live GET and POST checks in this review
- HTTPS: yes
- Response formats observed in this review:
  - JSON GraphQL responses for successful `GET` and `POST` requests
  - HTML playground UI when the origin endpoint is opened in a browser tab
- Pagination: only the `pokemons` query is explicitly documented with `limit` and `offset`
- Rate limits: none documented in the official README or homepage inspected in this review

## Confirmed endpoint

| Methods | Path | Parameters | Notes |
|---|---|---|---|
| `GET`, `POST` | `/api/graphql` | Standard GraphQL transport with `query`; optional `variables` JSON object on `POST`; `GET` accepts `query` in the query string | Canonical origin endpoint on `https://graphql-pokeapi.vercel.app`. The official README also publishes `https://graphql-pokeapi.graphcdn.app` as a cached deployment of the same GraphQL service. |

## Documented top-level query fields
- `abilities`
- `ability`
- `berries`
- `berry`
- `eggGroups`
- `eggGroup`
- `encounterMethods`
- `encounterMethod`
- `evolutionChains`
- `evolutionChain`
- `evolutionTriggers`
- `evolutionTrigger`
- `genders`
- `gender`
- `growthRates`
- `growthRate`
- `locations`
- `location`
- `moves`
- `move`
- `natures`
- `nature`
- `pokemons`
- `pokemon`
- `regions`
- `region`
- `species`
- `types`

The official README query table contains `28` query fields.

## Parameter notes
- The official README publishes the endpoint section with two official URLs:
  - GraphCDN cache: `https://graphql-pokeapi.graphcdn.app`
  - Origin: `https://graphql-pokeapi.vercel.app/api/graphql`
- The README's request examples document both `GET` and `POST` usage.
- `POST` requests use a JSON body containing GraphQL `query` and optional `variables`.
- The README explicitly documents variables for these root fields:
  - `ability(ability)`
  - `berry(berry)`
  - `eggGroup(eggGroup)`
  - `encounterMethod(encounterMethod)`
  - `evolutionChain(id)`
  - `evolutionTrigger(name)`
  - `gender(gender)`
  - `growthRate(growthRate)`
  - `location(location)`
  - `move(move)`
  - `nature(nature)`
  - `pokemons(limit, offset)`
  - `pokemon(name)`
  - `region(region)`
- Queries documented without variables in the README table are the list-style fields `abilities`, `berries`, `eggGroups`, `encounterMethods`, `evolutionChains`, `evolutionTriggers`, `genders`, `growthRates`, `locations`, `moves`, `natures`, `regions`, `species`, and `types`.
- The README's sample `pokemons` query shows `limit` and `offset` variables, and the sample `pokemon` query shows a required `name: String!` variable.

## Response format notes
- A live anonymous `GET https://graphql-pokeapi.vercel.app/api/graphql?query={ __typename }` check returned HTTP `200` and JSON `{"data":{"__typename":"Query"}}`.
- A live anonymous `POST https://graphql-pokeapi.vercel.app/api/graphql` check with the README-style `pokemons(limit, offset)` query returned HTTP `200` and JSON with:
  - `data.pokemons.count`
  - `data.pokemons.next`
  - `data.pokemons.previous`
  - `data.pokemons.status`
  - `data.pokemons.message`
  - `data.pokemons.results[]` objects containing `url`, `name`, and `image`
- A live anonymous `POST` query for `pokemon(name: "ditto")` returned HTTP `200` and JSON with `data.pokemon.id`, `data.pokemon.name`, and nested `abilities` data.
- When the origin endpoint is opened directly in a browser tab, it serves an interactive GraphQL playground rather than raw JSON.

## Error handling
- A live anonymous invalid GraphQL query sent to `POST /api/graphql` returned HTTP `400` with a standard GraphQL error envelope:
  - `errors[0].message`: `Cannot query field "noSuchField" on type "Query".`
  - `errors[0].extensions.code`: `GRAPHQL_VALIDATION_FAILED`
- A direct `GET https://graphql-pokeapi.vercel.app/api/graphql` request without a `query` parameter returned HTTP `400` with HTML/plain text body `GET query missing.` during this review.
- No broader official error-status matrix was documented in the README inspected here.

## Pagination
- The official README only explicitly documents pagination on the `pokemons` root field.
- `pokemons` accepts `limit` and `offset` variables.
- The sample result includes `count`, `next`, and `previous`, mirroring the underlying PokéAPI pagination style.
- No cursor pagination contract or global page envelope is documented for the schema as a whole.

## Important usage notes
- The official README labels this project as `The Unofficial GraphQL for PokeAPI`.
- For fireROUTE purposes, this provider is best modeled as one GraphQL route with schema-driven operations rather than as many REST endpoints.
- The GraphCDN host is presented by the maintainer as a cache layer, while the Vercel `/api/graphql` URL is the origin endpoint.
- The origin endpoint supports both browser-playground access and programmatic GraphQL requests.
- The README examples show Pokémon image URLs resolving to the raw GitHub sprite repository.

## Live checks performed
- `GET https://graphql-pokeapi.vercel.app/api/graphql?query={ __typename }`
- `POST https://graphql-pokeapi.vercel.app/api/graphql` with `pokemons(limit, offset)`
- `POST https://graphql-pokeapi.vercel.app/api/graphql` with `pokemon(name)`
- `POST https://graphql-pokeapi.vercel.app/api/graphql` with invalid field `noSuchField`
- `GET https://graphql-pokeapi.vercel.app/api/graphql`
- `GET https://graphql-pokeapi.graphcdn.app?query={ __typename }`

## Sources inspected
- `https://github.com/mazipan/graphql-pokeapi`
- `https://raw.githubusercontent.com/mazipan/graphql-pokeapi/master/README.md`
- `https://graphql-pokeapi.vercel.app`
- `https://graphql-pokeapi.vercel.app/api/graphql`
- `https://graphql-pokeapi.graphcdn.app`
