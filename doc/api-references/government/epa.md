# EPA

## Provider metadata
- Category: `Government`
- Provider slug: `epa`
- Official docs/pages used:
  - `https://www.epa.gov/data/application-programming-interface-api` (EPA API landing page)
  - `https://www.epa.gov/developers/widgets#apis` (Developer Central / Public APIs navigation page)
- Auth model: the EPA landing page says EPA uses `api.data.gov` as an API management service and tool for the public to sign up for API keys, but the page does not define one shared auth contract for all EPA APIs
- Current provider-level base URL: no single shared EPA-owned API base URL is documented on the pages above
- Response format: not unified at the provider level; formats vary by linked sub-API
- Rate limits: not published as a single shared EPA-wide contract on the pages reviewed
- Manually confirmed route count: `0`

## Access notes
- The EPA landing page describes this provider entry as a catalog of **several publicly available APIs** rather than one unified API surface.
- The page explicitly says EPA uses `api.data.gov` as an API management service and key-signup tool.
- The official EPA page links to individual APIs such as:
  - AirData Air Quality System REST API
  - ATTAINS Web Services
  - Clean Air Markets API
  - ECHO Web Services
  - EPA System of Registries Web Services and APIs
  - Facility Registry Service API
  - Grants API
  - Insect Repellents API
  - WATERS API

## Why route count is `0`
The reviewed official EPA pages function as a directory/index for multiple separate EPA APIs and widgets. They do **not** publish:
- one shared provider-owned base URL
- one unified endpoint inventory
- one shared parameter model
- one shared error schema
- one EPA-wide pagination contract

Because of that, there are no canonical provider-level routes I can responsibly confirm for the umbrella `EPA` entry itself.

## fireROUTE guidance
- Treat this provider as a catalog/umbrella entry only.
- Route adapters should target the individual EPA sub-APIs directly rather than attempting to build a generic EPA adapter from this landing page.
- Keep route count at `0` unless the repo later splits this umbrella into separately documented EPA sub-providers or an official EPA-wide API contract is published.
