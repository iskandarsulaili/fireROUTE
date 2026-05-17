# Pokémon TCG

## Overview
- Provider: Pokémon TCG API
- Category: Games & Comics
- Official docs: `https://docs.pokemontcg.io/`
- Official developer portal: `https://dev.pokemontcg.io/`
- Main site: `https://pokemontcg.io/`
- Base URL: `https://api.pokemontcg.io/v2`
- Auth: optional API key via `X-Api-Key` header
- HTTPS: required; the docs say plain HTTP redirects to HTTPS automatically
- Response format: JSON
- Pagination: documented on search endpoints via `page` and `pageSize`
- Confirmed routes: `8`

## Confirmed endpoints

| Method | Path | Parameters | Auth | Notes |
|---|---|---|---|---|
| GET | `/cards/{id}` | path `id` required; query `select` optional | optional `X-Api-Key` | Fetch one card by card id. |
| GET | `/cards` | query `q`, `page`, `pageSize` (max `250`), `orderBy`, `select` | optional `X-Api-Key` | Search cards with Lucene-like query syntax. |
| GET | `/sets/{id}` | path `id` required; query `select` optional | optional `X-Api-Key` | Fetch one set by set id. |
| GET | `/sets` | query `q`, `page`, `pageSize` (max `250`), `orderBy`, `select` | optional `X-Api-Key` | Search sets. |
| GET | `/types` | none | optional `X-Api-Key` | Returns all possible card types. |
| GET | `/subtypes` | none | optional `X-Api-Key` | Returns all possible card subtypes. |
| GET | `/supertypes` | none | optional `X-Api-Key` | Returns all possible card supertypes. |
| GET | `/rarities` | none | optional `X-Api-Key` | Returns all possible card rarities. |

## Query and parameter notes
- `select`
  - Supported on `GET /cards/{id}`, `GET /cards`, `GET /sets/{id}`, and `GET /sets`.
  - Value is a comma-delimited list of response fields such as `select=id,name`.
- Card search route `GET /cards`
  - `q`: Lucene-like search string.
  - `page`: page number; default `1`.
  - `pageSize`: default `250`, maximum `250`.
  - `orderBy`: comma-delimited sort list; prefix a field with `-` for descending order.
- Set search route `GET /sets`
  - `q`, `page`, `pageSize`, `orderBy`, and `select` follow the same pattern as card search.
- The docs explicitly say every field in the card response is searchable on `GET /cards`.
- Nested search fields use dot notation such as `set.id:sm1`, `attacks.name:Spelunk`, and `legalities.standard:banned`.

## Search syntax and response behavior
- The official docs describe the `q` syntax as Lucene-like.
- Documented search patterns include:
  - keyword matching: `name:charizard`
  - phrase matching: `name:"venusaur v"`
  - AND / OR composition: `name:charizard (subtypes:mega OR subtypes:vmax)`
  - negation: `subtypes:mega -types:water`
  - wildcard matching: `name:char*` and `name:char*der`
  - exact matching with `!`: `!name:charizard`
  - inclusive ranges: `nationalPokedexNumbers:[1 TO 151]`
  - open-ended ranges: `hp:[150 TO *]`
- Search responses include pagination metadata fields:
  - `page`
  - `pageSize`
  - `count`
  - `totalCount`
- Live check: `GET /cards?q=set.id:xy1&page=2&pageSize=2&orderBy=number&select=id,name,number` returned `200` JSON with `page`, `pageSize`, `count`, and `totalCount` fields.
- Live check: `GET /sets?q=series:xy&page=1&pageSize=2&orderBy=releaseDate&select=id,name,releaseDate` returned `200` JSON with the same pagination wrapper fields.

## Auth and rate limits
- The docs say API keys are obtained from the official Developer Portal.
- Authentication is performed with the `X-Api-Key` header.
- The docs explicitly say requests without authentication do not fail, but have much lower limits.
- Official documented V2 limits:
  - authenticated default: `20,000/day`
  - unauthenticated: `1,000/day`
  - unauthenticated burst cap: `30/minute`
- The docs say higher limits can be discussed via Discord or email.

## Errors and status codes
- Official documented status codes:
  - `200` — success
  - `400` — bad request, often due to an incorrect query string parameter
  - `402` — request failed even though parameters were valid
  - `403` — forbidden
  - `404` — resource not found
  - `429` — rate limit exceeded
  - `500`, `502`, `503`, `504` — server-side errors
- Official sample error schema:
  - `error.message`
  - `error.code`
- Live check: `GET /cards/not-a-real-card-id` returned `404` JSON with `{"error":{"message":"The requested resource was not found.","code":404}}`.

## Response format notes
- The docs describe the API as REST with JSON-encoded responses and standard HTTP verbs/status codes.
- Single-record routes return a top-level `data` object.
- Search/list routes return a top-level `data` array plus pagination metadata.
- Live check: `GET /cards/xy1-1?select=id,name,set` returned `200` JSON with a reduced `data` object that honored the `select` parameter.
- Live check: `GET /types` returned `200` JSON with a top-level `data` array of strings.

## Important usage notes
- Version 1 is deprecated and no longer receives data updates; the docs say the last V1 set is Chilling Reign.
- The API is resource-oriented and exposes only `GET` routes in the public v2 docs inspected here.
- Use `select` aggressively when building fireROUTE adapters because card objects are large and nested.
- Do not assume the same searchable field set for sets that exists for cards; the set search page points users to `/cards` for the advanced query syntax details.

## Integration notes for fireROUTE
- Treat Pokémon TCG as a JSON REST API with one shared base URL and a small set of stable collection/look-up routes.
- Map card and set search as separate route families because both share pagination and `select`, but their query semantics and result shapes differ.
- Preserve the official `orderBy` syntax, including descending fields prefixed with `-`.
- Support optional anonymous mode, but document much tighter quota ceilings when `X-Api-Key` is absent.

## Sources inspected
- `https://docs.pokemontcg.io/`
- `https://docs.pokemontcg.io/getting-started/authentication`
- `https://docs.pokemontcg.io/getting-started/rate-limits`
- `https://docs.pokemontcg.io/getting-started/errors`
- `https://docs.pokemontcg.io/api-reference/cards/get-card`
- `https://docs.pokemontcg.io/api-reference/cards/search-cards`
- `https://docs.pokemontcg.io/api-reference/sets/get-set`
- `https://docs.pokemontcg.io/api-reference/sets/search-sets`
- `https://docs.pokemontcg.io/api-reference/types/get-types`
- `https://docs.pokemontcg.io/api-reference/subtypes/get-subtypes`
- `https://docs.pokemontcg.io/api-reference/supertypes/get-supertypes`
- `https://docs.pokemontcg.io/api-reference/rarities/get-rarities`
- Live checks via browser fetch against:
  - `https://api.pokemontcg.io/v2/cards/xy1-1?select=id,name,set`
  - `https://api.pokemontcg.io/v2/cards?q=set.id:xy1&page=2&pageSize=2&orderBy=number&select=id,name,number`
  - `https://api.pokemontcg.io/v2/sets?q=series:xy&page=1&pageSize=2&orderBy=releaseDate&select=id,name,releaseDate`
  - `https://api.pokemontcg.io/v2/types`
  - `https://api.pokemontcg.io/v2/cards/not-a-real-card-id`
