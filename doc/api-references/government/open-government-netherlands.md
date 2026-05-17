# Open Government, Netherlands

## Provider metadata
- Category: `Government`
- Provider slug: `open-government-netherlands`
- Assigned docs URL: `https://data.overheid.nl/en/ondersteuning/data-publiceren/api`
- Official docs/pages used:
  - `https://data.overheid.nl/en/ondersteuning/data-publiceren/api`
  - `https://docs.datacommunities.nl/data-overheid-nl-documentatie/data.overheid.nl-werking/apis-met-de-data-van-data.overheid.nl`
  - live official endpoint checks on the published API host:
    - `https://data.overheid.nl/data/api/3/action/package_search?rows=1`
    - `https://data.overheid.nl/data/api/3/action/help_show?name=package_search`
    - `https://data.overheid.nl/data/api/3/action/package_show?id=7cc95d10-bb52-4211-bbe8-8a18bb6e0f0d`
- Current documented API host: `https://data.overheid.nl`
- Current documented action base path: `/data/api/3/action`
- Auth model for reviewed metadata endpoints: no API key or login requirement observed
- Response format confirmed in this pass: JSON
- Manually confirmed route count: `3`

## Official usage notes
- The assigned support page loaded successfully as `API | Data overheid`.
- That official page states that an API is available for `data.overheid.nl` and that it makes the metadata of all available datasets available.
- The same official page explicitly publishes `https://data.overheid.nl/data/api/3/` as the API location.
- The support page also states that all information on `data.overheid.nl` can be reused under the `CC-0` license.
- The support page points developers to CKAN documentation and explicitly warns that `CKAN API v3` is not a REST API and does not have one complete OpenAPI specification.
- The official alternative documentation page on `docs.datacommunities.nl` did not finish loading in this browser session, so the route inventory below is grounded in the live official `data.overheid.nl` responses that were directly confirmed during this pass.
- A live check of `package_search?rows=1` returned JSON with `success: true`, a dataset count of `20455`, and an official `help_show` URL under the same host.
- A live check of `help_show?name=package_search` returned a JSON-wrapped help document describing the `package_search` action and its Solr-style parameters.
- A live check of `package_show?id=7cc95d10-bb52-4211-bbe8-8a18bb6e0f0d` returned JSON dataset metadata on the official host.

## Canonical endpoints confirmed from the official site
1. `GET /data/api/3/action/package_search`
   - Base URL: `https://data.overheid.nl`
   - Purpose: search dataset metadata records.
   - Query parameters confirmed in this pass:
     - `rows` - limit the number of returned records
     - `q` - Solr query string documented in the official `help_show` output
   - Live confirmation:
     - `GET /data/api/3/action/package_search?rows=1` returned JSON with `success: true`, `count: 20455`, and one dataset result.

2. `GET /data/api/3/action/help_show`
   - Base URL: `https://data.overheid.nl`
   - Purpose: return action-level help text.
   - Query parameter:
     - `name` - action name to describe
   - Live confirmation:
     - `GET /data/api/3/action/help_show?name=package_search` returned JSON help text for `package_search`.

3. `GET /data/api/3/action/package_show`
   - Base URL: `https://data.overheid.nl`
   - Purpose: return one dataset metadata record.
   - Query parameter:
     - `id` - dataset identifier
   - Live confirmation:
     - `GET /data/api/3/action/package_show?id=7cc95d10-bb52-4211-bbe8-8a18bb6e0f0d` returned JSON metadata for the dataset `wpozittenblijvers-v1`.

## Auth, rate limits, pagination, errors, and format notes
- Auth: no authentication requirement was visible on the reviewed support page or required by the live `package_search`, `help_show`, and `package_show` checks.
- Rate limits: no official quota or throttling policy was visible on the reviewed official pages.
- Pagination: the live `package_search` route accepted `rows`; the reviewed support page did not publish a provider-specific pagination guide beyond its CKAN linkage.
- Errors: no shared structured error schema was published on the reviewed official pages, but all live action checks in this pass returned JSON envelopes containing `success` and `result` fields.
- Format notes: the directly confirmed official action endpoints returned JSON.

## fireROUTE normalization notes
- Treat `https://data.overheid.nl/data/api/3/action` as the canonical action surface for this provider record.
- Keep the provider grounded in live official `data.overheid.nl` action endpoints that were directly reviewed, not in generic CKAN route assumptions beyond the routes confirmed above.
- Preserve the official warning that this deployment is CKAN API v3 and not a conventional REST API with one complete OpenAPI file.
