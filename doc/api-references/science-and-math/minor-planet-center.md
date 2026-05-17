# Minor Planet Center

## Provider metadata
- Category: `Science & Math`
- Provider slug: `minor-planet-center`
- Description: `Asterank wrapper over Minor Planet Center MPCORB data`
- Official docs/pages used:
  - `https://www.asterank.com/mpc`
  - `https://www.asterank.com/api/mpc` (live example endpoint linked directly from the official docs page)
- Current public API base URL: `http://asterank.com/api`
- Auth model: no authentication documented on the reviewed official page
- Methods officially documented on the reviewed page: `GET`
- Response formats officially documented on the reviewed page: `JSON`
- Rate limits: no numeric rate-limit policy was published on the reviewed official page
- Manually confirmed route count: `1`

## API shape and behavior
- The official page describes this as a database API over the Minor Planet Center `MPCORB.DAT` dataset.
- The service lets clients apply constraints across asteroid attributes using a MongoDB-style JSON `find()` query.
- The docs say the underlying MPC data is updated nightly from `MPCORB.dat`.
- The sample responses are JSON arrays of asteroid records.

## Canonical endpoint
1. `GET /api/mpc`
   - Search or list asteroid records from the Asterank/MPC dataset.

## Query parameters
- `query` - optional JSON object expressed in MongoDB `find()` style syntax.
  - The docs explicitly show operators such as `$lt`.
  - Example documented filters:
    - `e` - eccentricity
    - `i` - inclination
    - `a` - semi-major axis
- `limit` - optional maximum number of results to return.

## Request format notes
- Official request shape documented as:
  - `http://asterank.com/api/mpc?query={query}&limit={limit}`
- Both `query` and `limit` are explicitly described as optional.
- The sample "list all asteroids" request omits both parameters and uses just `/api/mpc`.

## Response notes
- Responses are JSON arrays.
- Field presence may vary: the official docs say some fields may be absent when the source `MPCORB.dat` record does not contain them.
- The official examples expose fields such as:
  - `readable_des`
  - `H`
  - `G`
  - `e`
  - `a`
  - `i`
  - `epoch`
  - `last_obs`
  - `num_obs`
  - `num_opp`
  - `flags`
  - `des`

## Pagination and limits
- No page-number or offset pagination is documented.
- `limit` is the only documented response-size control.

## Error notes
- The reviewed official page does not publish an HTTP error table or a structured error schema.

## Important usage notes
- The docs link the data-field interpretation to the MPC orbit-format specification and note that records are parsed according to that format.
- Because the `query` parameter is JSON embedded in the URL, callers should URL-encode it.
- The docs present the service as a simple filterable dataset endpoint, not as a larger multi-route API.

## fireROUTE normalization notes
- Normalize on the single collection route `GET /api/mpc`.
- Treat `query` as an opaque provider-native JSON filter object rather than attempting to canonicalize each possible Mongo operator.
- Preserve the absence of formal pagination; only `limit` is documented.
