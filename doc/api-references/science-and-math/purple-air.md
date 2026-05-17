# Purple Air

## Provider metadata
- Category: `Science & Math`
- Provider slug: `purple-air`
- Official docs/pages used:
  - `https://api.purpleair.com/`
  - official community pages linked from the docs for pricing, points, and API usage notes
- Current public API base URL: `https://api.purpleair.com/v1`
- Auth model:
  - API keys are required
  - the docs support three ways to send the key: `X-API-Key` header, `api_key` query parameter, or JSON body parameter
  - keys are typed; the docs distinguish `READ`, `WRITE`, `READ_DISABLED`, `WRITE_DISABLED`, and `UNKNOWN`
- Response format notes:
  - JSON is the default documented format for most endpoints
  - history endpoints are available in both JSON and CSV forms where documented
- Manually confirmed route count: `15`

## Canonical endpoints
1. `GET /keys`
2. `GET /organization`
3. `GET /sensors/{sensor_index}`
4. `GET /sensors/{sensor_index}/history/csv`
5. `GET /sensors/{sensor_index}/history`
6. `GET /sensors`
7. `POST /groups`
8. `POST /groups/{group_id}/members`
9. `DELETE /groups/{group_id}`
10. `DELETE /groups/{group_id}/members/{member_id}`
11. `GET /groups/{group_id}`
12. `GET /groups`
13. `GET /groups/{group_id}/members/{member_id}`
14. `GET /groups/{group_id}/members/{member_id}/history/csv`
15. `GET /groups/{group_id}/members`

## Shared parameters and request rules
### Common auth parameters
- `X-API-Key` - preferred header-based API key transport
- `api_key` - accepted in query string or JSON body

### Common path parameters
- `sensor_index` - numeric PurpleAir sensor identifier
- `group_id` - group identifier
- `member_id` - group-member identifier

### Common query/body parameters from the reviewed docs
- `read_key` - private sensor read key where needed
- `fields` - comma-separated field selection for current-data/history routes
- `start_timestamp` / `end_timestamp` - history time bounds
- `average` - history aggregation interval
- `modified_since` - incremental polling filter on multi-sensor reads
- `show_only` - targeted field selection / filtering control on list-style sensor reads
- `name` - group name on create-group requests

## Rate limits and billing notes
- PurpleAir documents endpoint-specific default rate limits instead of one universal number.
- The reviewed endpoint descriptions explicitly list these defaults:
  - `GET /keys` - `100ms`
  - `GET /organization` - `1000ms`
  - `GET /sensors/{sensor_index}` - `100ms`
  - `GET /sensors/{sensor_index}/history` - `1000ms`
  - `GET /sensors/{sensor_index}/history/csv` - `1000ms`
  - `GET /sensors` - `500ms`
  - `POST /groups` - `100ms`
  - `POST /groups/{group_id}/members` - `100ms`
  - `DELETE /groups/{group_id}` - `100ms`
  - `DELETE /groups/{group_id}/members/{member_id}` - `100ms`
  - `GET /groups/{group_id}` - `100ms`
  - `GET /groups` - `400ms`
  - `GET /groups/{group_id}/members/{member_id}` - `100ms`
  - `GET /groups/{group_id}/members/{member_id}/history/csv` - `1000ms`
  - `GET /groups/{group_id}/members` - `500ms`
- The docs also state that sending requests at least one second apart will ensure you never encounter rate limiting.
- Billing/usage is point-based:
  - organizations start with `1,000,000` free points
  - insufficient points trigger `PaymentRequiredError`
  - sensor owners can receive free points for querying their own sensor, as described in the official linked community article

## Error and response notes
### Common JSON response fields
- `api_version`
- `time_stamp`
- `data_time_stamp`

### Documented key and request errors
- `ApiKeyMissingError` - `403`
- `ApiKeyTypeMismatchError` - `403`
- `ApiKeyInvalidError` - `403`
- `ApiKeyRestrictedError` - `403`
- `ApiDisabledError` - `403`
- `InvalidTokenError` - `403`
- `RateLimitExceededError` - `429`
- `ProjectArchivedError` - `403`
- `MissingJsonPayloadError` - `415`
- `InvalidJsonPayloadError` - `400`
- `NotFoundError` - `404`
- `RequiresHttpsError` - `403`
- `PaymentRequiredError` - `402`
- `InvalidRequestUrlError` - `400`
- `DataInitializingError` - `503`

### Example documented error shape
```json
{
  "api_version": "V1.0.4-0.0.1",
  "time_stamp": 1590033300,
  "error": "ApiKeyMissingError",
  "description": "No API key was found in the request."
}
```

## Pagination and history notes
- The docs do not describe cursor/page-style pagination.
- Historical reads are windowed using `start_timestamp` and `end_timestamp` plus `average` controls.
- For repeated multi-sensor polling, the docs recommend `modified_since` to fetch only updated data.
- The docs warn that when using only one history bound, the API returns the maximum amount of data available for the selected `average` bucket.

## Important usage notes
- Group-member creation supports multiple identification styles, including sensor-based membership flows documented on the page.
- Private sensors may require their `read_key` in addition to the main API key.
- History consumers should check for the absence of a top-level error in JSON or the last CSV line to confirm complete history retrieval.
- The docs include decimal-place formatting syntax such as `fieldname|dN` for field selection, e.g. `pm2.5_atm_a|d2`.

## fireROUTE normalization notes
- Use `https://api.purpleair.com/v1` as the canonical base URL.
- Preserve PurpleAir's typed-key model (`READ` vs `WRITE`).
- Model history CSV endpoints separately from JSON endpoints.
