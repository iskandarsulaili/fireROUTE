# Transport for Lisbon, Portugal

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-lisbon-portugal`
- Provider identified from the reviewed official pages as: `EMEL` (`Empresa Municipal de Mobilidade e Estacionamento de Lisboa`)
- Official pages reviewed manually in this pass:
  - assigned docs URL: `https://emel.city-platform.com/opendata/`
  - official alternative page: `https://www.emel.pt/`
  - additional official page reviewed in this pass: `https://www.emel.pt/pt/seguranca-digital-17102024/`

## Manual review result
- Status for this pass: `manual_blocked`
- Confirmed route count for fireROUTE publication: `0`

## Verified findings from official pages
- The assigned open-data URL `https://emel.city-platform.com/opendata/` resolved to the official EMEL page `https://www.emel.pt/pt/seguranca-digital-17102024/`.
- That official notice says EMEL is restructuring the management of the company's open data as part of its digital-security strategy.
- The same official notice says this process may cause disruptions in access to those data from external channels.
- The official homepage `https://www.emel.pt/` resolved to `https://www.emel.pt/pt/` and loaded as the general EMEL corporate and mobility website.
- The public homepage exposes parking, resident permit, bicycle, and mobility-service content, but it does not publish a stable endpoint-by-endpoint API reference.
- None of the official EMEL pages reviewed in this pass exposed a route list, request URLs, auth contract, pagination model, rate limits, or error documentation for an API.

## fireROUTE publication fields
- Provider API base URL: not publicly confirmed from a current readable official route reference in this pass.
- Endpoint paths: not publicly confirmed.
- HTTP methods: not publicly confirmed.
- Parameters or request bodies: not publicly confirmed.
- Authentication: not publicly confirmed.
- Rate limits: not publicly confirmed.
- Pagination: not publicly confirmed.
- Errors:
  - official EMEL notice says external access to open data may be disrupted during the security-related restructuring
- Response formats: not publicly confirmed.
- Important usage notes:
  - the historical EMEL open-data URL currently redirects into an official notice about open-data disruption
  - the public EMEL website is readable, but only as a general service and corporate site, not as a fine-grained API reference

## Why this provider remains blocked
- I manually reviewed the assigned EMEL open-data URL, the official EMEL homepage, and the official EMEL notice page reached from the open-data URL.
- The current official materials do not expose the base URL, endpoint list, methods, parameters, pagination model, auth model, or error documentation required for fireROUTE publication.
- EMEL's own official notice also indicates ongoing disruption around external access to open data.
- Because no trustworthy route-level official API reference became readable, this provider remains `manual_blocked`.

## Sources inspected
- `https://emel.city-platform.com/opendata/`
- `https://www.emel.pt/`
- `https://www.emel.pt/pt/seguranca-digital-17102024/`
