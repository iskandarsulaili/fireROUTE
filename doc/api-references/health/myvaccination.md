# MyVaccination

## Provider metadata
- Category: `Health`
- Provider slug: `myvaccination`
- Official docs/pages used:
  - `https://documenter.getpostman.com/view/16605343/Tzm8GG7u`
- Current public API base URL shown in the official docs: `https://myvaccination-backend.vercel.app/api`
- Auth model: no authentication mentioned in the reviewed public collection
- Response format: JSON
- Public rate-limit note: no numeric rate limit was published in the reviewed Postman docs
- Manually confirmed route count: `5`

## Authentication and access
- The reviewed Postman collection is marked `Public`.
- The visible vaccination endpoints do not advertise API-key, bearer-token, or OAuth requirements.
- The docs describe the dataset as Malaysian vaccination data based on `CITF-Malaysia` GitHub data.

## Canonical endpoints
1. `GET /vacc` - daily national vaccination data for Malaysia
2. `GET /vacc/states` - daily vaccination data for all Malaysian states
3. `GET /vacc/states/{state-name}` - daily vaccination data for one state
4. `GET /vacc/update` - latest national vaccination update totals
5. `GET /vacc/update/states` - latest vaccination update totals for all states

## Parameters and path variables
### Path parameters
- `state-name` - lowercase state slug; the docs explicitly say the state path pattern is `state-name (all lower case)` and show `johor` as an example

## Response, pagination, and error notes
- The reviewed docs show JSON responses with a `modifiedData` envelope.
- Historical endpoints return arrays of dated records; update endpoints return a single current snapshot object.
- No pagination model is documented.
- No shared error schema is published in the reviewed collection.

## Usage notes from the official docs
- The collection labels these routes under a `Vaccination` section.
- National historical responses expose `daily` and `total` dose counts.
- State update responses return a `stateData` array for all states on a given date.

## fireROUTE normalization notes
- Normalize this provider as a public JSON API rooted at `/api/vacc`.
- Keep historical series endpoints separate from update/snapshot endpoints because the payload shapes differ.
- Preserve the lowercase `state-name` slug rule in adapter validation.