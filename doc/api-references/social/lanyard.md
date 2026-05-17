# Lanyard

## Provider metadata
- Category: `Social`
- Provider slug: `lanyard`
- Official docs pages used:
  - `https://github.com/Phineas/lanyard`
  - `https://raw.githubusercontent.com/Phineas/lanyard/main/README.md`
- Main API base URL: `https://api.lanyard.rest`
- Main WebSocket URL: `wss://api.lanyard.rest/socket`
- Auth model: no auth for presence reads; KV writes require `Authorization` header with a Lanyard API key obtained from the bot
- Response format: JSON
- Manually confirmed route count: `4`

## Authentication
- Presence lookups are public.
- KV write routes require an API key. The official docs say to DM the Lanyard bot with `.apikey`, then send the returned key in the `Authorization` header.

## Canonical REST endpoints

### 1) Get a user's presence
- Method: `GET`
- Path: `/v1/users/{user_id}`
- Purpose: retrieve live Discord presence, activity, Spotify data, and KV data for a monitored user

Path parameters:
- `user_id` - Discord user id

Response notes:
- The docs show fields such as `active_on_discord_mobile`, `active_on_discord_desktop`, `listening_to_spotify`, `kv`, `spotify`, `discord_user`, `discord_status`, and `activities[]`.

### 2) Set one KV pair
- Method: `PUT`
- Path: `/v1/users/{user_id}/kv/{key}`
- Purpose: set or overwrite one key/value pair for the user

Path parameters:
- `user_id` - Discord user id
- `key` - alphanumeric key name

Request notes:
- The request body becomes the value.
- The docs say the body may be any type of data, but it is string-encoded when stored.

### 3) Merge multiple KV pairs
- Method: `PATCH`
- Path: `/v1/users/{user_id}/kv`
- Purpose: merge a shallow key/value object into the user's KV store

Path parameters:
- `user_id` - Discord user id

Request notes:
- Body must be a key/value object with maximum depth `1`.
- Conflicting keys are overwritten.

### 4) Delete one KV key
- Method: `DELETE`
- Path: `/v1/users/{user_id}/kv/{key}`
- Purpose: remove a stored key from the user's KV store

Path parameters:
- `user_id` - Discord user id
- `key` - stored key to delete

## KV limits documented by provider
- Keys and values are strings.
- Values may be up to `30,000` characters.
- Keys must be alphanumeric (`a-zA-Z0-9`) and up to `255` characters.
- A user may have at most `512` key/value pairs.

## WebSocket notes
- Socket endpoint: `wss://api.lanyard.rest/socket`
- Optional compression query string: `?compression=zlib_json`
- After connect, the server sends opcode `1` (`Hello`) with `heartbeat_interval`.
- Clients then send opcode `2` (`Initialize`) and opcode `3` heartbeats on the required interval.
- Initialization supports `subscribe_to_ids`, `subscribe_to_id`, or `subscribe_to_all`.
- Documented events are `INIT_STATE` and `PRESENCE_UPDATE`.
- Documented disconnect/error codes are `4004 unknown_opcode`, `4005 requires_data_object`, and `4006 invalid_payload`.

## Additional official route-like utility not counted above
- Quicklink asset URL format: `https://api.lanyard.rest/{id}.{file_type}` for Discord user icons, where `file_type` can be `png`, `gif`, `webp`, `jpg`, or `jpeg`.
- This is documented as a convenience URL pattern, not part of the core REST API count above.

## Pagination, rate limits, and format notes
- No pagination is documented for the REST routes.
- The docs page reviewed does not publish a numeric rate limit.
- REST responses are JSON.

## fireROUTE normalization notes
- Keep KV routes separate from public presence reads because they have a different auth model.
- Presence payloads intentionally mirror Discord activity structures and Spotify metadata; adapters should preserve nested objects rather than flatten aggressively.
- Lanyard is both REST and WebSocket; the WebSocket should be modeled as a live-subscription capability, not as an HTTP fallback.
