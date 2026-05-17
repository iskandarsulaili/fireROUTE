# PlayerDB

## Overview
- Provider: PlayerDB
- Category: Games & Comics
- Official docs: `https://playerdb.co/`
- Base URL: `https://playerdb.co/api/player`
- Auth: no API key documented
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `4`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/minecraft/:id` | path `id` = Minecraft username or UUID | Returns player lookup data for Minecraft accounts. |
| GET | `/hytale/:id` | path `id` = Hytale username or ID | Returns player lookup data for Hytale accounts. |
| GET | `/steam/:id` | path `id` = Steam ID in any Steam ID format | Steam account lookup. |
| GET | `/xbox/:id` | path `id` = Xbox ID or username | Xbox account lookup. |

## Response schema notes
- The docs state player lookup routes follow this schema shape:
  - `username`
  - `id`
  - `avatar`
  - `meta`
- A live official example request to the Minecraft route returned a JSON wrapper with:
  - `code`
  - `message`
  - `data.player`
  - `success`
- The live Minecraft example also exposed provider-specific fields under `data.player`, including:
  - `meta.cached_at`
  - `raw_id`
  - `skin_texture`
  - `properties`
  - `name_history`

## Parameters and usage notes
- Each route takes a single path parameter representing the account identifier for that platform.
- Platform-specific parameter rules documented on the homepage:
  - Minecraft: username or ID
  - Hytale: username or ID
  - Steam: any Steam ID format
  - Xbox: ID or username
- The site does not document pagination for these routes, which is consistent with the single-player lookup behavior.

## Rate limits and headers
- The official site says there are no rate limits in place.
- The provider explicitly asks clients to include an identifying `user-agent` header so they can contact heavy users if necessary.

## Errors and auth
- No authentication scheme is documented on the official site.
- No formal error-object schema is documented on the homepage.
- The live example confirms JSON responses, but the site does not publish a broader error matrix or HTTP-status reference.

## Integration notes for fireROUTE
- Treat PlayerDB as a lightweight account-lookup API rather than a search or listing API.
- Require a platform selector in any adapter because route structure is platform-specific.
- Send an identifying `User-Agent` even though the provider does not enforce API keys or rate limits.
- Do not assume a shared field set beyond the documented `username`, `id`, `avatar`, and `meta`; platform-specific metadata varies.

## Sources inspected
- `https://playerdb.co/`
- `https://playerdb.co/api/player/minecraft/notch`
