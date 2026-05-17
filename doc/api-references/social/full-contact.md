# Full Contact

## Provider metadata
- Category: `Social`
- Provider slug: `full-contact`
- Official docs pages used:
  - `https://docs.fullcontact.com/`
  - `https://docs.fullcontact.com/docs/authorization`
  - `https://docs.fullcontact.com/docs/getting-started-with-enrich-1`
  - `https://docs.fullcontact.com/docs/getting-started-with-resolve`
  - `https://docs.fullcontact.com/docs/request-properties`
  - `https://docs.fullcontact.com/docs/rate-limiting`
  - `https://docs.fullcontact.com/docs/response-codes-errors`
  - `https://docs.fullcontact.com/docs/company-enrich-overview`
  - `https://docs.fullcontact.com/docs/v3-company-search-by-name-migration`
- Main API base URL: `https://api.fullcontact.com`
- Versioned base path confirmed in official docs: `/v3`
- Canonical API base URL: `https://api.fullcontact.com/v3`
- Auth model: `Authorization: Bearer FULLCONTACT_API_KEY`
- Request format: JSON over HTTPS
- Publicly confirmed request method for the documented live routes: `POST`
- Manually confirmed current route count: `3`

## Authentication
- The official Authorization page says FullContact API access uses an API key.
- The docs say to generate and manage keys from the FullContact Platform UI.
- Requests must send the key in the `Authorization` header with the `Bearer` prefix.
- Official examples also send:
  - `Content-Type: application/json`

## API-wide behavior
- The official `Getting Started with Enrich` page says the Enrich API uses an RPC-style interface.
- The same page says all requests are sent over HTTPS using the `POST` method with JSON in the request body.
- The public docs reviewed in this pass expose three currently usable v3 route patterns from first-party examples and migration guidance:
  - `POST /v3/person.enrich`
  - `POST /v3/identity.resolve`
  - `POST /v3/company.enrich`
- The migration page also documents a legacy route that is being sunset and should not be treated as a current canonical route:
  - legacy `POST /v3/company.search`

## Current canonical routes

### 1) Enrich a person
- Method: `POST`
- Path: `/v3/person.enrich`
- Officially shown on:
  - `Getting Started with Enrich`
  - `Request Properties`
  - `Getting Started with Resolve` (person-id enrichment follow-up example)
- Purpose: enrich a person record using one or more identifiers and return account-enabled insight bundles
- Confirmed request-body examples and fields from the public docs:
  - identifiers: `email`, `emails`, `personId`, `maids`, `twitter`
  - request modifiers: `confidenceLevel`, `dataFilter`, `dataFilterLogic`, `hemType`, `infer`, `maxEmails`, `maxMaids`, `minFields`
  - permissions payload support: `permission`
  - permission subfields shown in the official example: `consentPurposes`, `locale`, `ipAddress`, `language`, `collectionMethod`, `collectionLocation`, `policyUrl`, `termsService`
- Confirmed request headers:
  - `Authorization: Bearer FULLCONTACT_API_KEY`
  - `Content-Type: application/json`
- Important usage notes from official docs:
  - if `dataFilter` is omitted, FullContact returns all insight bundles enabled on the account
  - `dataFilterLogic` defaults to `OR`
  - `confidenceLevel` accepts `LOW`, `MED`, `HIGH`, `MAX`, with the docs saying default is `HIGH`
  - optional webhook delivery is supported by including a webhook URL in the request body

### 2) Resolve an identity
- Method: `POST`
- Path: `/v3/identity.resolve`
- Officially shown on:
  - `Getting Started with Resolve`
- Purpose: resolve one or more identifiers to a FullContact person identity / person ID
- Confirmed request-body fields from the official example:
  - `emails` array
- Confirmed request headers:
  - `Authorization: Bearer FULLCONTACT_API_KEY`
  - `Content-Type: application/json`
- Important usage notes from official docs:
  - the resolve example explains that FullContact can locate a person in its identity graph and assign a unique `personID` to the calling account
  - the resulting `personId` can then be supplied to `POST /v3/person.enrich`

### 3) Enrich a company by domain
- Method: `POST`
- Path: `/v3/company.enrich`
- Officially shown on:
  - `V3 Company Search by Name Migration`
- Purpose: enrich company data using a company domain
- Confirmed request-body field from the official migration example:
  - `domain`
- Important usage notes from official docs:
  - FullContact says this route replaces the older company-search-by-name flow
  - the public `Company Enrich Overview` page currently loads but reports `Unable to render content`; the migration page was needed to confirm the live route and parameter shape from first-party material

## Deprecated / migration-only route noted by the official docs
- Deprecated legacy route:
  - `POST /v3/company.search`
- Deprecated request-body field shown on the migration page:
  - `companyName`
- Official migration guidance says to update requests from `v3/company.search` to `v3/company.enrich` and use `domain` instead of `companyName`.

## Request properties and filters confirmed from public docs
These were explicitly shown on the official `Request Properties` page for `person.enrich`:
- `confidenceLevel`
- `dataFilter`
- `dataFilterLogic`
- `hemType`
- `infer`
- `maxEmails`
- `maxMaids`
- `minFields`
- `permission`

Officially named `dataFilter` bundle values shown during this review:
- `individual_plus_insights`
- `individual`
- `demographic_insights`
- `automotive_insights`
- `cpg_insights`
- `education_insights`
- `hem_amplification`
- `employment_history`
- `energy_and_utilities_insights`
- `financial_services_and_insurance_insights`
- `health_insights`
- `media_and_entertainment_insights`
- `maid_amplification`
- `non_profit_insights`
- `professional`
- `quick_serve_and_restaurants_insights`
- `resolve_crm`
- `retail_insights`
- `social`
- `technology_and_communications_insights`
- `travel_and_hospitality_insights`

## Rate limits
- The official Rate Limiting page says API request limits are separate from the API key's monthly usage allowance.
- Official default rate limit: `6,000 QPM`
- Official response headers documented:
  - `X-FullContact-RateDelay` - milliseconds of delay inserted to stay within the configured rate
  - `X-Rate-Limit` - legacy static ceiling value for backward compatibility
  - `X-Rate-Limit-Remaining` - legacy static remaining count for backward compatibility
  - `X-Rate-Limit-Reset` - legacy static UTC-epoch seconds until the 60-second window resets
- The docs say requests may be delayed up to `1000` milliseconds before a `429 Too Many Requests` response is returned.
- The docs also say the delayed `429` behavior is designed so clients can safely retry immediately.

## Response format and errors
- The official Response Codes & Errors page says FullContact returns HTTPS status codes plus additional details encoded as JSON in the response body, especially in the `message` field.
- Confirmed general response codes:
  - `200 OK` - request successful
  - `202 Accepted` - request is still being processed
  - `400 Bad Request` - malformed request
  - `403 Forbidden` - invalid API key, missing API key, or quota/rate-limit issue
  - `404 Not Found` - query searched in the past 24 hours and nothing was found
  - `405 Method Not Allowed` - unsupported HTTPS method
  - `410 Gone` - deprecated v1 resource
  - `422 Invalid` - invalid or missing API query parameter
  - `500 Server Error` - server-side problem on FullContact
  - `503 Service Unavailable` - transient downstream error; docs say a `Retry-After` header is included

## Pagination
- No page-based pagination rules were documented on the public pages reviewed in this pass.
- The three confirmed live routes are RPC-style POST calls rather than page-oriented list endpoints.
- fireROUTE should currently treat pagination as `not publicly documented for the reviewed routes`.

## Important usage notes
- `person.enrich` billing/usage behavior depends on the enabled bundles on the account and on any explicit `dataFilter` supplied in the request.
- The docs state that if a `personID` is generated with anonymous identifiers such as a MAID or hashed email, only anonymous data can be returned in the associated insight bundles.
- The docs mention client libraries for Go, Java 8, Java 11+, and Python for Enrich and Resolve.
- The public company-enrich page is partially broken in the docs renderer, so future work should re-check whether FullContact restores the rendered company documentation.

## fireROUTE integration notes
- Treat FullContact as a small set of RPC-style POST endpoints rather than a large REST collection.
- Implement first-class support for bearer auth and JSON request bodies.
- Preserve optional request-property passthrough for `person.enrich` because the official docs expose meaningful filtering and confidence controls.
- Expect possible async handling because the official docs explicitly document `202 Accepted`.
