# Genrenator

## Overview
- Provider: Binary Jazz Genrenator API
- Category: Music
- Official docs: `https://binaryjazz.us/genrenator-api/`
- Base URL: `https://binaryjazz.us/wp-json/genrenator/v1`
- Auth: none
- HTTPS: yes
- Response format: plain text for single-item requests; JSON arrays when requesting multiple items
- Pagination: none
- Rate limits: no numeric rate limit documented on the official page

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/genre/` | none | Returns one generated genre string. |
| GET | `/genre/{count}/` | required `count` path parameter | Returns multiple generated genres. |
| GET | `/story/` | none | Returns one generated genre-story sentence. |
| GET | `/story/{count}/` | required `count` path parameter | Returns multiple generated genre stories. |

## Path parameter notes
- `count` — optional extra path segment documented by the official page for requesting more than one result.
- The docs explicitly give `.../story/25/` as the example for returning an array of 25 stories.
- During manual review, both `/genre/{count}/` and `/story/{count}/` behaved as array-producing variants.

## Response format notes
- Observed `GET /genre/` response: a single genre string.
- Observed `GET /story/` response: a single sentence/story string.
- Observed `GET /genre/{count}/` response: JSON array of generated genre strings.
- Observed `GET /story/{count}/` response: JSON array of generated story strings.
- The official page does not document additional metadata envelopes, pagination fields, or error objects.

## Usage notes
- The docs describe the service as having "2 endpoints, one for genres and one for stories," with an additional parameter for requesting more than one result.
- The API is hosted under WordPress REST-style paths, but the payloads are simple text/array outputs rather than typical REST resource objects.
- The docs encourage repeated use for random generation and mention a related Twitter bot and Slack integration on the Binary Jazz site, but those are not separate public HTTP API endpoints documented here.

## Error handling
- No formal status-code matrix or structured error schema is documented.
- Consumers should expect normal HTTP failures for invalid path values or temporary site issues.
- Because output is intentionally generative and random, callers should not assume deterministic results between repeated requests.

## Integration notes for fireROUTE
- Keep single-result and multi-result path shapes distinct because the response type changes from string to JSON array.
- This provider is best modeled as a lightweight text-generation utility rather than a music catalog API.
- If downstream consumers require structured JSON, normalize the single-string endpoints carefully without hiding the provider's native behavior.

## Sources inspected
- `https://binaryjazz.us/genrenator-api/`
- `https://binaryjazz.us/wp-json/genrenator/v1/genre/`
- `https://binaryjazz.us/wp-json/genrenator/v1/genre/3/`
- `https://binaryjazz.us/wp-json/genrenator/v1/story/`
- `https://binaryjazz.us/wp-json/genrenator/v1/story/3/`
