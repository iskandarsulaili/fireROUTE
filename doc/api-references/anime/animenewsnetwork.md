# AnimeNewsNetwork

## Overview
- Provider: Anime News Network Encyclopedia API
- Category: Anime
- Official docs: `https://www.animenewsnetwork.com/encyclopedia/api.php`
- Base URLs: `https://cdn.animenewsnetwork.com/encyclopedia/api.xml`, `https://www.animenewsnetwork.com/encyclopedia/reports.xml`, and `https://www.animenewsnetwork.com/encyclopedia/nodelay.api.xml`
- Auth: none documented on the API page
- HTTPS: yes
- Response format: XML
- Pagination: report endpoints support `nskip` and `nlist`; docs note `nlist=all` for full export
- Rate limits: `1 request per second per IP`; `nodelay.api.xml` returns `503` if requests exceed the threshold instead of queueing

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/encyclopedia/reports` | HTML report-specific params | Human-facing report index page referenced by the API docs. |
| GET | `/encyclopedia/reports.xml` | `id`, `nskip`, `nlist`, plus report-specific filters such as `type` and `name` | Machine-readable XML export of report results. |
| GET | `/encyclopedia/api.xml?anime={id}` | repeated `anime` allowed | Fetch detailed anime records. |
| GET | `/encyclopedia/api.xml?manga={id}` | repeated `manga` allowed | Fetch detailed manga records. |
| GET | `/encyclopedia/api.xml?title={idOrListOr~name}` | can batch slash-separated IDs or search primary title via `~name` | Unified title-detail endpoint for anime and manga. |
| GET | `/encyclopedia/nodelay.api.xml?...` | same query model as `api.xml` | Immediate-fail version of the detail API for clients that do not want server-side delaying. |

## Request notes
- The docs explicitly support batching up to 50 titles at once by repeating parameters or passing slash-separated ID lists.
- `api.xml?title=~name` searches by primary title only, not alternate titles.
- The docs recommend caching detail lookups rather than repeatedly refetching large title payloads.

## Usage notes
- ANN asks clients to use the reports feed for bulk title discovery and the detail API only as needed.
- Responses are XML, not JSON.
- Terms-of-service and rate-limit guidance are published directly on the official API page.

## Route-count note
- The official docs page currently exposes `6` confirmed GET endpoint shapes.

## Sources inspected
- `https://www.animenewsnetwork.com/encyclopedia/api.php`
