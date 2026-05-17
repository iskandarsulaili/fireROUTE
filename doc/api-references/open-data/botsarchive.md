# BotsArchive

## Provider metadata
- Category: `Open Data`
- Provider slug: `botsarchive`
- Official docs/pages used:
  - `https://botsarchive.com/docs.html`
  - live example requests on the official API host linked from that docs page:
    - `https://api.botsarchive.com/getBotID.php?username=@vote`
    - `https://api.botsarchive.com/getUserVote.php?bot_id=1&user_id=141691961`
- Canonical API base URL: `https://api.botsarchive.com`
- Auth model: no authentication is mentioned on the official docs page and the reviewed example requests succeed without credentials
- Response format: `application/json`
- Manually confirmed route count: `2`

## Canonical endpoints
1. `GET /getBotID.php`
   - Returns the ID and metadata for a bot in the BotsArchive database.
   - Required query parameter: `username`.
2. `GET /getUserVote.php`
   - Returns the vote that a Telegram user gave to a bot.
   - Required query parameters: `bot_id`, `user_id`.

## Confirmed parameters
### `GET /getBotID.php`
- `username` - bot username, including the `@` prefix in the official example (`@vote`)

### `GET /getUserVote.php`
- `bot_id` - bot identifier in the BotsArchive database
- `user_id` - Telegram user identifier

## Response and error notes
### Successful `getBotID` example
```json
{"ok":1,"id":1,"result":{"id":1,"name":"Votebot","username":"@vote","description":"Votebot creates anonymous and public polls, you can send them everywhere using inline. This is an official Telegram bot.","warn":null,"msg":"http://t.me/BotsArchive/79","category":["poll"],"groups":0,"inline":1,"developer_id":"0","stars":984,"votes":246,"vote":4,"tags":"#vote #poll #like #polls #anonymous #private #public #inline #official","languages":"English","offline":"0","photo":true}}
```

### Successful `getUserVote` example
```json
{"ok":1,"result":"5"}
```

### Confirmed missing-parameter errors
- `GET /getBotID.php` without `username` still returns HTTP `200` with:
```json
{"ok":0,"message":"username GET parameter required"}
```
- `GET /getUserVote.php` without `bot_id` and `user_id` still returns HTTP `200` with:
```json
{"ok":0,"message":"bot_id and user_id GET parameters required"}
```

## Pagination, limits, and transport notes
- No pagination parameters are documented.
- No public rate-limit policy is published on the reviewed official page.
- The official docs show only `GET` requests.

## Important usage notes
- The public docs page is very small and route-oriented; there is no separate auth, quota, or schema reference.
- Error signaling is application-level via the JSON field `ok`, not via distinct HTTP status codes for the missing-parameter cases reviewed here.
- `getBotID` returns a richer `result` object than `getUserVote`, so integrations should not assume one shared response shape across both endpoints.

## fireROUTE normalization notes
- Use `https://api.botsarchive.com` as the canonical upstream base.
- Treat BotsArchive as a two-route unauthenticated JSON API.
- Preserve the provider’s native query parameter names: `username`, `bot_id`, and `user_id`.