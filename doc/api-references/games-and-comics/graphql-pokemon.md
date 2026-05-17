# GraphQL Pokemon

## Overview
- Provider: GraphQL Pokemon
- Category: Games & Comics
- Official repository inspected: `https://github.com/favware/graphql-pokemon`
- Official text documentation inspected: `https://graphql-pokemon.js.org/introduction/welcome`
- Live official endpoint inspected: `https://graphqlpokemon.favware.tech/v8`
- Base URL: `https://graphqlpokemon.favware.tech`
- Primary endpoint path: `/v8`
- Status: `manually_documented`
- Confirmed routes: `1`
- Auth: none documented in the official README/docs, and live `POST` requests succeeded without any API key or bearer token
- HTTPS: yes
- Response formats confirmed during review:
  - HTML Apollo landing page / embedded sandbox on browser `GET /v8`
  - JSON GraphQL responses on `POST /v8`
- Pagination: query-specific `offset` / `take` / `reverse` arguments on fuzzy and collection-style queries, plus `offsetFlavorTexts` / `takeFlavorTexts` / `reverseFlavorTexts` on Pokémon lookups
- Rate limits: no numeric rate limit documented in the official repository, docs site, or landing page

## Confirmed endpoint

| Methods | Path | Parameters | Notes |
|---|---|---|---|
| `GET`, `POST` | `/v8` | `POST` body uses GraphQL `query` and, per the official README example, optional `variables`; successful requests must avoid Apollo's CSRF guard by sending a non-simple content type such as `application/json` (confirmed) or one of the documented Apollo preflight headers | Single GraphQL endpoint. `GET /v8` serves the Apollo landing page / sandbox, while `POST /v8` executes GraphQL operations and returns JSON. |

## Confirmed top-level query fields on the single GraphQL route
- `getAbility(ability: AbilitiesEnum!)`
- `getFuzzyAbility(offset: Int = 0, take: Int = 1, reverse: Boolean = false, ability: String!)`
- `getPokemonByDexNumber(offsetFlavorTexts: Int = 0, takeFlavorTexts: Int = 1, reverseFlavorTexts: Boolean = true, number: Int!)`
- `getPokemon(offsetFlavorTexts: Int = 0, takeFlavorTexts: Int = 1, reverseFlavorTexts: Boolean = true, pokemon: PokemonEnum!)`
- `getFuzzyPokemon(offset: Int = 0, take: Int = 1, reverse: Boolean = false, pokemon: String!, offsetFlavorTexts: Int = 0, takeFlavorTexts: Int = 1, reverseFlavorTexts: Boolean = true)`
- `getAllPokemon(offset: Int = 0, take: Int = 1469, reverse: Boolean = false, offsetFlavorTexts: Int = 0, takeFlavorTexts: Int = 1, reverseFlavorTexts: Boolean = true)`
- `getItem(item: ItemsEnum!)`
- `getFuzzyItem(offset: Int = 0, take: Int = 1, reverse: Boolean = false, item: String!)`
- `getLearnset(generation: Int, moves: [MovesEnum!]!, pokemon: PokemonEnum!)`
- `getFuzzyLearnset(generation: Int, moves: [String!]!, pokemon: String!)`
- `getMove(move: MovesEnum!)`
- `getFuzzyMove(offset: Int = 0, take: Int = 1, reverse: Boolean = false, move: String!)`
- `getTypeMatchup(primaryType: TypesEnum!, secondaryType: TypesEnum)`
- `getNature(nature: NaturesEnum!)`
- `getAllNatures()`

## Request and parameter notes
- The official README's fetch example sends `POST https://graphqlpokemon.favware.tech/v8` with header `Content-Type: application/json` and a JSON body containing `query` and `variables`.
- Canonical object lookups use enum arguments such as `PokemonEnum`, `MovesEnum`, `ItemsEnum`, `AbilitiesEnum`, `TypesEnum`, and `NaturesEnum`.
- Fuzzy lookups switch to `String!` inputs and expose lightweight result-window controls through `offset`, `take`, and `reverse`.
- Pokémon queries additionally expose flavor-text windowing through `offsetFlavorTexts`, `takeFlavorTexts`, and `reverseFlavorTexts`.
- `getAllPokemon` publishes a default `take` of `1469`, but the official README also warns that it is not currently possible to fetch all data for all Pokémon in one huge query because the resulting object is too large for Node.js to process.

## Response format notes
- Confirmed successful JSON response shape from a live request:
  - `{"data":{"getPokemon":{"num":149,"species":"dragonite","color":"Brown"}}}`
- The endpoint behaves like a standard GraphQL service and returns successful payloads under `data`.
- Browser `GET /v8` renders the Apollo Server landing page, which embeds Apollo Sandbox and identifies the same endpoint as `https://graphqlpokemon.favware.tech/v8`.

## Error handling
- Invalid enum input returned HTTP `400` with a GraphQL error envelope:
  - `errors[0].message` explained that the provided enum value did not exist
  - `errors[0].locations` was present
  - `errors[0].extensions.code` was `BAD_USER_INPUT`
- A direct `GET /v8?query=...` attempt without the required non-simple content type / Apollo preflight headers returned HTTP `400` with `errors[0].extensions.code` = `BAD_REQUEST` and a message explaining Apollo's CSRF protection requirements.
- No broader status-code matrix is published in the official README or docs site beyond these live-observed GraphQL / Apollo behaviors.

## Pagination
- There is no platform-wide page-number, cursor, or link-header pagination contract documented for the API as a whole.
- Instead, pagination/windowing is query-specific:
  - `offset`, `take`, `reverse` on fuzzy list-style queries and `getAllPokemon`
  - `offsetFlavorTexts`, `takeFlavorTexts`, `reverseFlavorTexts` on Pokémon lookups that include flavor text data

## Usage notes
- The official README and docs site position this as a single GraphQL endpoint with two documentation surfaces:
  - text documentation at `https://graphql-pokemon.js.org/`
  - interactive embedded playground at `https://graphqlpokemon.favware.tech/v8`
- The official README says the dataset is sourced from Pokémon Showdown GitHub, Serebii, and Bulbapedia.
- The README explicitly highlights a known limitation: querying all data for all Pokémon in one shot is currently impractical because the payload is too large for Node.js to process.
- For fireROUTE, model this provider as one GraphQL route with schema-driven operations rather than as many REST endpoints.

## Sources inspected
- `https://github.com/favware/graphql-pokemon`
- `https://graphql-pokemon.js.org/introduction/welcome`
- `https://graphqlpokemon.favware.tech/v8`
