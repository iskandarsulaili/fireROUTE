# Graph Countries

## Provider metadata
- Category: `Geocoding`
- Provider slug: `graph-countries`
- Official docs used manually:
  - `https://github.com/lennertVanSever/graphcountries`
  - live public deployment root `https://countries-274616.ew.r.appspot.com/`
  - official alternative schema-explorer page `https://graph-countries-voyager.netlify.app/`
- Public API base URL documented by provider: `https://countries-274616.ew.r.appspot.com`
- Confirmed endpoint path: `/`
- Transport: `HTTPS`
- Auth model: none documented
- Response format documented: GraphQL over `JSON`

## Product and access notes
- The official README describes Graph Countries as `an easy to use GraphQL API to query country-related data for free and without restrictions`.
- The README says the dataset is based on `restcountries.eu` plus additional flag emoji data.
- The repository explains that data is scraped into Neo4j, the GraphQL schema is inferred via `neo4j-graphql-js`, and Apollo Server exposes the endpoint and playground.
- The README also includes self-hosting instructions for running the service locally with your own Neo4j database.

## Confirmed API surface
The inspected official repository documentation confirms `1` public endpoint:
1. `POST /`

Additional access behavior confirmed from official examples:
- the README's browser/playground examples also use `GET /?query=...` links against the same root path
- the canonical programmatic example in the README uses `POST /` with JSON body

## 1) GraphQL endpoint
- Method: `POST`
- Path: `/`
- Full URL: `https://countries-274616.ew.r.appspot.com/`
- Purpose: execute GraphQL queries for country-related data

Official request example from the README:
```javascript
fetch('https://countries-274616.ew.r.appspot.com', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: `
    query {
      CallingCode {
        name
        countries {
          name
        }
      }
    }
  ` }),
})
```

## GraphQL capabilities documented in the official README
The official example links and prose explicitly show or mention queries/relationships for:
- `Country`
- `Timezone`
- `Currency`
- `Language`
- `Region`
- `TopLevelDomain`
- `CallingCode`
- `Flag`
- bordering countries
- translations
- `shortestPathToOtherCountry(otherCountryAlpha2Code: ...)`
- `distanceToOtherCountries(first: ...)`

Official usage notes stated by the provider:
- callers can `select, paginate, filter, search and order any entity`
- the README recommends using the endpoint like any other GraphQL endpoint and suggests Apollo Client for consumers

## Parameters, pagination, and query notes
The provider does not publish a route-by-route argument table outside of the schema itself, but the official README examples confirm these GraphQL input patterns:
- GraphQL document is supplied in the JSON request body under `query`
- selection sets determine returned fields
- entity pagination is supported through GraphQL arguments such as `first`
- filtering is supported through GraphQL arguments such as:
  - `alpha2Code: "BE"` on `Country`
  - `orderBy: name_asc` on `Timezone`
  - nested filter examples such as `nameTranslations(filter: { languageCode_in: ["fr", "nl"] })`
- custom graph operations accept provider-specific arguments such as `otherCountryAlpha2Code`

## Response and format notes
- The official examples and fetch sample use JSON GraphQL responses.
- The README examples show standard GraphQL behavior where the client chooses fields through the selection set.
- No XML, CSV, REST resource list, or versioned alternate path is documented in the inspected official material.

## Rate limits, auth, and errors
- Auth: no API key or auth header is documented.
- Rate limits: the README explicitly markets the API as `free of charge and without restrictions`; no numeric quota or throttle headers are documented.
- Error format: the repository README does not publish a custom error schema or status-code catalog.

Observed live availability notes from official provider-controlled surfaces during this manual pass:
- visiting `https://countries-274616.ew.r.appspot.com/` currently returned a provider deployment page stating `503 Server Error` and `The service you requested is not available yet. Please try again in 30 seconds.`
- visiting the official alternative explorer page `https://graph-countries-voyager.netlify.app/` currently returned Netlify `Site not found`
- these availability issues affect the currently hosted public deployment, but the repository README still clearly documents the endpoint URL, request method, and self-hosting path

## Self-hosting notes from the official repository
The README says self-hosting requires:
- Node.js and npm
- a local or cloud Neo4j graph database
- the APOC Neo4j plugin
- environment variables such as `ENGINE_API_KEY`, `BOLT_ADDRESS`, `DB_USERNAME`, and `DB_PASSWORD`
- `npm run dataScraping` to populate Neo4j and infer schema
- `npm run dev` to start the API, with local discovery at `http://localhost:8080/`

## Canonical fireROUTE notes
- Treat this provider as a single GraphQL root endpoint, not a REST API family.
- Keep route count at `1` because the public API surface is one GraphQL endpoint even though the schema exposes many entity types.
- Preserve the current deployment-health warning in downstream docs, because the official hosted endpoint was returning `503` during manual verification.
- If fireROUTE later offers a stable adapter for this provider, prefer a raw GraphQL passthrough or a separately hosted self-managed deployment rather than assuming the public demo endpoint is reliable.

## Verification notes
- This file was manually rebuilt from the live official GitHub repository page plus the current official hosted endpoint and official Voyager link using browser tools only.
