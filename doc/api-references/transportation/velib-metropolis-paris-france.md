# Velib metropolis, Paris, France

## Provider metadata
- Category: `Transportation`
- Provider slug: `velib-metropolis-paris-france`
- Provider identity confirmed from reviewed official pages in this pass as: `Vélib' Métropole`
- Official sources reviewed manually in this pass:
  - assigned docs URL: `https://www.velib-metropole.fr/donnees-open-data-gbfs-du-service-velib-metropole`
  - official homepage: `https://www.velib-metropole.fr/`

## Manual review result
- Status: `manual_blocked`
- Confirmed route count for this exact provider row: `0`

## Verified findings from official pages
- In this pass, both the assigned docs URL and the official homepage resolved with the title `Site not reachable`.
- Neither reviewed official page exposed a readable GBFS discovery URL, feed list, schema reference, developer navigation, auth guide, or endpoint inventory in this pass.
- The reviewed official pages likewise did not expose readable request parameters, rate limits, pagination notes, error references, or fallback official JSON feed links.
- Because both reviewed official URLs remained in the same outage state during this pass, no trustworthy route-level documentation became available.

## fireROUTE publication fields
- Official website base URL: `https://www.velib-metropole.fr/`
- Assigned docs URL confirmed: `https://www.velib-metropole.fr/donnees-open-data-gbfs-du-service-velib-metropole`
- Publicly readable API or GBFS base URL: not exposed on the reviewed official pages.
- Endpoint paths: not exposed.
- HTTP methods: not exposed.
- Parameters or request bodies: not exposed.
- Authentication: not exposed.
- Rate limits: not exposed.
- Pagination: not exposed.
- Errors or blockers observed during manual review:
  - both reviewed official URLs rendered the same outage-state title `Site not reachable`
  - no official fallback links to JSON feeds, schema files, or API reference pages were visible in this pass
- Response formats:
  - the assigned slug references `open data` and `GBFS`
  - the reviewed official pages did not publish any readable JSON examples, schema links, or feed-discovery metadata in this pass
- Important usage notes:
  - documenting guessed GBFS feed URLs from prior knowledge would be speculative
  - no routes are recorded without currently readable official documentation

## Why this provider remains blocked
- I manually checked the assigned official docs URL and one official alternative page on the same official domain in this pass.
- Both reviewed official URLs were in the same outage-style `Site not reachable` state during this pass.
- Because no readable official endpoint documentation is currently available on the reviewed official pages, this provider remains `manual_blocked`.

## Sources inspected
- `https://www.velib-metropole.fr/donnees-open-data-gbfs-du-service-velib-metropole`
- `https://www.velib-metropole.fr/`
