# Times Adder

## Provider metadata
- Category: `Science & Math`
- Provider slug: `times-adder`
- Description: `With this API you can add each of the times introduced in the array sended`
- Official docs/pages used:
  - `https://raw.githubusercontent.com/FranP-code/API-Times-Adder/master/README.md` (official project README)
  - `https://api-times-adder.up.railway.app/api/v1` (live endpoint check; `GET` returns `404 Not Found`, consistent with the README's POST-only instructions)
- Current public API base URL: `https://api-times-adder.up.railway.app/api/v1`
- Auth model: no authentication mentioned on the reviewed official pages
- Methods officially documented on the reviewed pages: `POST`
- Response formats officially documented on the reviewed pages: JSON is the documented request-body format and the project is described as an API, but the reviewed README does not publish a full success-response schema
- Rate limits: no numeric rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `1`

## API shape and behavior
- The official README says usage consists of sending a `POST request` to `https://api-times-adder.up.railway.app/api/v1`.
- The request body must be JSON with a top-level `data` array.
- The README sets a maximum of `200` values in the `data` array.
- The reviewed live `GET` request to the same path returns `404 Not Found`, reinforcing that the documented route is intended for POST submissions rather than browsing.

## Canonical endpoint
1. `POST /api/v1`
   - Add together the times supplied in the `data` array.

## Request body contract
### JSON body
```json
{
  "data": ["4:20:01", "6:16", "69", "x", "y", "..."]
}
```

### Documented input rules
- `data` - required array of time-like string values
- Maximum array length: `200`
- The official README says supported time structures are:
  - `HH:MM:SS`
  - `MM:SS`
  - `MM`

## Response and error notes
- The reviewed official README does not publish a detailed response-body schema or formal error-code table.
- The reviewed official pages likewise do not document pagination, because this is a single request/response computation endpoint rather than a listing API.

## Usage notes
- Send JSON in the request body; the README's only documented usage example is JSON.
- Keep this provider modeled as a single POST compute endpoint rather than a resource collection.
- Because the provider does not publish a detailed response schema on the reviewed pages, downstream integrations should treat the returned JSON shape as lightly documented until separately validated.

## fireROUTE normalization notes
- Preserve the exact `/api/v1` path.
- Preserve the `data` array as the only documented request payload field.
- Do not add inferred GET routes just because the host is publicly reachable; the official docs only describe POST usage and the live GET check returned `404`.
