# Covid-19 Government Response

## Provider metadata
- Category: `Health`
- Provider slug: `covid-19-government-response`
- Official docs/pages used:
  - `https://www.bsg.ox.ac.uk/research/covid-19-government-response-tracker`
  - `https://github.com/OxCGRT/covid-policy-dataset`
- Current public API base URL: none documented on the reviewed official pages
- Auth model: no public HTTP API documented
- Response format: HTML project pages plus repository-hosted dataset files/documentation rather than a route-level API reference
- Public rate-limit note: no numeric rate limit or quota was published because no public HTTP API reference was exposed on the reviewed official pages
- Manually confirmed route count: `0`

## Why no public routes were confirmed
- The official Blavatnik School of Government project page describes OxCGRT as a completed research dataset and links users to a GitHub repository and working paper rather than to an API reference.
- The official GitHub repository presents repository contents such as `data/`, `README.md`, and `documentation_and_codebook.md`, which indicates file-based dataset distribution instead of a documented REST/HTTP API.
- Across the reviewed official pages, no route list, base URL, request examples, auth header names, pagination rules, or API error schema were published.

## Official pages reviewed
### `https://www.bsg.ox.ac.uk/research/covid-19-government-response-tracker`
- The page describes the Oxford Covid-19 Government Response Tracker as a project that collected policy-response data for 2020-2022.
- The page prominently links to the official GitHub repository as the place to access project assets.
- The reviewed content did not expose route-level API documentation.

### `https://github.com/OxCGRT/covid-policy-dataset`
- The repository homepage describes the repo as the final version of the Oxford Covid-19 Government Response Tracker dataset.
- The visible root contents included a `data` directory and documentation files, consistent with downloadable research data rather than a web API.
- No official OpenAPI/Swagger file, route table, or hosted API base URL was exposed on the reviewed repository pages.

## Response, pagination, and error notes
- Because no public HTTP API reference was published, there were no official pagination rules, request/response schemas, or error models to confirm.
- The reviewed official materials point to repository data files and research documentation instead of API responses.

## Usage notes from the official pages
- The project page states that the tracker shifted away from ongoing policy collection after the WHO ended the COVID-19 public health emergency period.
- The repository positioning and project text both frame OxCGRT as a final research dataset for reuse and analysis.
- Any future fireROUTE integration would need to be file-ingestion or repository-sync based unless Oxford publishes a new official API reference.

## fireROUTE normalization notes
- Treat the provider as a manual blocker for live API routing: the reviewed official distribution model is dataset-file access, not a documented HTTP API.
- Do not invent CSV download routes or raw GitHub URLs as if they were stable API operations.
- If fireROUTE later needs this source, model it as dataset ingestion from official published files after a fresh review of the repository structure.
