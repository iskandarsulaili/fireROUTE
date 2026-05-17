# Movebank

## Overview
- Provider: Movebank REST API
- Category: Animals
- Official docs: `https://github.com/movebank/movebank-api-doc`
- Base URL: `https://www.movebank.org/movebank/service`
- Auth: public reads can be anonymous; private-data access can use Movebank credentials or an `api-token` depending on the documented flow
- HTTPS: yes
- Response formats: CSV via `direct-read`, JSON via `public/json` and `json-auth`
- Pagination: not traditional page-number pagination; JSON docs describe `max_events_per_individual`, while CSV/HTTP reads are filtered through query parameters
- Rate limits: the official doc currently states `one concurrent request per IP` and `20 concurrent requests total`

## Confirmed endpoint surfaces

| Method | Path | Parameters / mode | Notes |
|---|---|---|---|
| GET | `/direct-read` | required mode is expressed with query parameters such as `entity_type`, `study_id`, `attributes`, `sensor_type_id`, `timestamp_start`, `timestamp_end`, `event_reduction_profile` | Main CSV/HTTP download surface for attributes, studies, entities, and event data. |
| GET | `/direct-read?service=request-token` | no body; used to obtain API token in documented token flow | Token-request variant of the `direct-read` service. |
| GET | `/public/json` | JSON query params including `study_id`, repeated `individual_local_identifiers`, `sensor_type`, `max_events_per_individual`, `timestamp_start`, `timestamp_end`, `attributes`, `event_reduction_profile` | Public JSON event-data surface. |
| GET | `/json-auth` | same JSON query model as `public/json`, but for authenticated/private data access | Authenticated JSON event-data surface. |

## Request notes
- The docs repeatedly use query-driven routing rather than many distinct REST paths.
- `direct-read` is the workhorse endpoint: the dataset returned depends on `entity_type` and related query parameters.
- Documented entity types include `study`, `tag`, `individual`, `deployment`, `sensor`, `study_attribute`, and `event`.
- The JSON endpoints focus on event retrieval and reduced-event profiles rather than broad CRUD operations.

## Usage notes
- Movebank warns that all users must follow its terms of use, data policy, citation guidance, and per-study license terms.
- Some studies require users to accept license terms before first download.
- The docs advise against treating internal database identifiers as stable external IDs.

## Integration notes for fireROUTE
- Treat Movebank as a query-driven data export API, not a conventional resource-per-path CRUD API.
- Keep CSV `direct-read` and JSON event endpoints separate in any adapter mapping.
- Preserve repeated query parameters and date/timestamp semantics exactly as documented.

## Route-count note
- The official documentation currently exposes `4` confirmed endpoint surfaces.

## Sources inspected
- `https://github.com/movebank/movebank-api-doc`
- `https://raw.githubusercontent.com/movebank/movebank-api-doc/master/movebank-api.md`
