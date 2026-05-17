# Mojang

## Overview
- Provider: Mojang / Minecraft API
- Category: Games & Comics
- Assigned docs URL: `https://wiki.vg/Mojang_API`
- Assigned official alternative attempted: `https://wiki.vg/`
- Documentation successor page manually inspected: `https://minecraft.wiki/w/Mojang_API`
- Primary API hosts confirmed from the inspected docs: `https://api.mojang.com`, `https://api.minecraftservices.com`, `https://sessionserver.mojang.com`
- Additional auth-flow hosts confirmed from the inspected docs: `https://user.auth.xboxlive.com`, `https://xsts.auth.xboxlive.com`
- Auth: mixed; public profile lookups are anonymous, while account-scoped routes require Minecraft access tokens and the Microsoft/Xbox auth chain
- HTTPS: yes
- Response formats: mostly JSON; `blockedservers` returns a plain-text SHA-1 list
- Pagination: none documented
- Rate limits: most of the API is documented as `200 requests per 2 minutes` per IP; IPv6 ratelimits are bucketed by `/56`; some endpoints have different limits
- Confirmed routes: `32`

## Access-path note
- The assigned legacy docs URLs on `wiki.vg` both failed with `net::ERR_CONNECTION_REFUSED` during this shard.
- The current maintained Mojang API documentation page at `https://minecraft.wiki/w/Mojang_API` loaded successfully and was manually inspected to recover the route contract.

## Confirmed endpoints

| Method | Host | Path | Parameters | Notes |
|---|---|---|---|---|
| GET | `api.mojang.com` | `/users/profiles/minecraft/{playerName}` | path `playerName` | Anonymous username-to-UUID lookup. Docs warn this route occasionally returns random `403` errors due to Mojang misconfiguration. |
| GET | `api.minecraftservices.com` | `/minecraft/profile/lookup/name/{playerName}` | path `playerName` | Anonymous username lookup on the newer host. |
| GET | `api.mojang.com` | `/minecraft/profile/lookup/name/{playerName}` | path `playerName` | Anonymous username lookup on the Mojang host. |
| GET | `api.minecraftservices.com` | `/minecraft/profile/lookup/{uuid}` | path `uuid` | Anonymous UUID-to-profile lookup. |
| POST | `api.mojang.com` | `/profiles/minecraft` | JSON array body of up to `10` player names | Batch UUID lookup by name. |
| POST | `api.minecraftservices.com` | `/minecraft/profile/lookup/bulk/byname` | JSON array body of up to `10` player names | Batch username lookup on the newer host. |
| POST | `api.mojang.com` | `/minecraft/profile/lookup/bulk/byname` | JSON array body of up to `10` player names | Batch username lookup on the Mojang host. |
| GET | `sessionserver.mojang.com` | `/session/minecraft/profile/{uuid}` | path `uuid`; optional query `unsigned=false` | Skin/cape property lookup. Docs say this route is rate-limited at about `400 requests per 10 seconds`. |
| POST | `user.auth.xboxlive.com` | `/user/authenticate` | JSON body with `AuthMethod`, `SiteName`, `RpsTicket`, `RelyingParty`, `TokenType` | Exchanges a Microsoft token for an Xbox Live token. |
| POST | `xsts.auth.xboxlive.com` | `/xsts/authorize` | JSON body with `SandboxId`, `UserTokens[]`, `RelyingParty`, `TokenType` | Exchanges an Xbox Live token for an XSTS token. |
| POST | `api.minecraftservices.com` | `/authentication/login_with_xbox` | JSON body `identityToken` | Exchanges XSTS credentials for a Minecraft access token. |
| GET | `api.minecraftservices.com` | `/entitlements/license` | query `requestId=<v4 UUID>` | Checks whether the account owns Minecraft. |
| GET | `api.minecraftservices.com` | `/minecraft/profile` | bearer token required | Returns the authenticated player's profile, owned skins, and owned capes. |
| GET | `api.minecraftservices.com` | `/player/attributes` | bearer token required | Returns player privileges, chat/friend preferences, and ban-scope metadata. |
| POST | `api.minecraftservices.com` | `/player/attributes` | bearer token required; JSON body with selected attribute keys | Modifies profanity-filter and friend-preference settings. |
| GET | `api.minecraftservices.com` | `/privacy/blocklist` | bearer token required | Returns the authenticated player's blocked-profile UUID list. |
| POST | `api.minecraftservices.com` | `/player/certificates` | bearer token required | Returns the player's signing keypair and certificate metadata. |
| GET | `api.minecraftservices.com` | `/minecraft/profile/namechange` | bearer token required | Returns name-change eligibility and timing information. |
| GET | `api.minecraftservices.com` | `/productvoucher/giftcode` | bearer token required | Gift-code validity check; docs only publish status behavior, not additional parameters. |
| GET | `api.minecraftservices.com` | `/minecraft/profile/name/{name}/available` | path `name`; bearer token required | Name-availability check. Docs say this route is limited to `20 requests per 5 minutes` per account. |
| PUT | `api.minecraftservices.com` | `/minecraft/profile/name/{name}` | path `name`; bearer token required | Changes the authenticated player's name. |
| POST | `api.minecraftservices.com` | `/minecraft/profile/skins` | bearer token required; either JSON `{variant,url}` or multipart form with `variant` + `file` | Changes or uploads a skin. The docs describe both payload styles on the same route. |
| DELETE | `api.minecraftservices.com` | `/minecraft/profile/skins/active` | bearer token required | Resets the active skin. |
| DELETE | `api.minecraftservices.com` | `/minecraft/profile/capes/active` | bearer token required | Hides the active cape. |
| PUT | `api.minecraftservices.com` | `/minecraft/profile/capes/active` | bearer token required; JSON body `capeId` | Shows/activates a cape. |
| GET | `sessionserver.mojang.com` | `/blockedservers` | none | Returns a text file with one SHA-1 hash per blocked server entry. |
| POST | `sessionserver.mojang.com` | `/session/minecraft/join` | JSON body `accessToken`, `selectedProfile`, `serverId` | Client login-session verification. Docs say this route is limited to `6 joins per 30 seconds` per account. |
| GET | `sessionserver.mojang.com` | `/session/minecraft/hasJoined` | query `username`, `serverId`, optional `ip` | Server-side login-session verification. |
| GET | `api.minecraftservices.com` | `/publickeys` | none | Returns public keys for profile-property, player-certificate, and authentication-token verification. |
| GET | `api.minecraftservices.com` | `/friends` | bearer token required; optional header `If-None-Match` | Returns accepted friends plus incoming/outgoing friend requests. |
| PUT | `api.minecraftservices.com` | `/friends` | bearer token required; JSON body with `name` or `profileId`, plus `updateType` | Sends/accepts/removes friend requests or friendships. |
| POST | `api.minecraftservices.com` | `/presence` | bearer token required; JSON body `status` and optional `joinInfo` | Reports presence and returns online friends' presence data. |

## Authentication and request rules
- Public lookup endpoints under `api.mojang.com`, `api.minecraftservices.com/minecraft/profile/lookup/...`, and `sessionserver.mojang.com/session/minecraft/profile/...` do not require an access token.
- The docs say most account-scoped routes under `https://api.minecraftservices.com` require `Authorization: Bearer {minecraft_access_token}` and return `401` if the token is missing or invalid.
- The documented Microsoft authentication sequence is:
  1. obtain a Microsoft token outside these Mojang endpoints using an Azure app and OAuth scope including `XboxLive.signin`
  2. `POST https://user.auth.xboxlive.com/user/authenticate`
  3. `POST https://xsts.auth.xboxlive.com/xsts/authorize`
  4. `POST https://api.minecraftservices.com/authentication/login_with_xbox`
- For requests with a payload, the docs require `Content-Type: application/json`; otherwise the server returns `415`.
- The docs also say invalid JSON payloads return `400`.

## Parameters and behavior notes
- Username-lookup routes accept case-insensitive player names.
- Batch lookup routes accept JSON arrays with no more than `10` player names.
- The session profile route accepts optional `?unsigned=false`; when present, the docs say the returned `textures` property includes a signature.
- The authenticated profile route returns owned skins and capes, with `ACTIVE`/`INACTIVE` state values and skin variants `CLASSIC`/`SLIM`.
- `POST /player/attributes` currently documents updates only for `profanityFilterPreferences` and `friendsPreferences`.
- `PUT /friends` requires at least one of `name` or `profileId`; if both are present, `profileId` is prioritized.
- The presence API is both write and read: the request reports the caller's current presence, and the response returns friends' current presence states.
- Friend-list and presence behavior are documented as new and unstable for Java Edition snapshot `26.2 Snapshot 7`.

## Rate limits and suspension notes
- The docs say most of the API is limited to `200 requests per 2 minutes` per IP, or per `/56` subnet for IPv6.
- Route-specific limits explicitly documented:
  - `GET /session/minecraft/profile/{uuid}`: about `400 requests per 10 seconds`
  - `GET /minecraft/profile/name/{name}/available`: `20 requests per 5 minutes` per account
  - `POST /session/minecraft/join`: `6 joins per 30 seconds` per account
- The docs include an account-suspension warning: high volumes of erroneous requests, such as repeated `429` responses while uploading skins, can temporarily suspend the account.

## Response-format notes
- Successful requests return either HTTP `2xx` with valid JSON or HTTP `204` with an empty payload, unless the route documents another format.
- The general documented non-2xx error payload includes:
  - `error`
  - `errorMessage`
  - `cause`
- `GET /session/minecraft/profile/{uuid}` returns profile-property data whose decoded `textures` object can contain `SKIN`, optional `metadata.model=slim`, and `CAPE` URLs.
- `GET /publickeys` returns arrays of base64-encoded DER public keys for profile properties, player certificates, and authentication tokens.
- `GET /blockedservers` is the major non-JSON route; the docs say it returns plain text with one SHA-1 hash per line.
- `GET /friends` uses `ETag` and supports conditional refresh with `If-None-Match`; unchanged friend data can return `304 Not Modified`.
- `POST /presence` returns a JSON `presence[]` array for online friends and documents status values such as `ONLINE`, `PLAYING_HOSTED_SERVER`, `PLAYING_REALMS`, and `PLAYING_SERVER`.

## Errors
- Payload-bearing requests without `Content-Type: application/json` return `415`.
- Invalid JSON payloads return `400`.
- The primary anonymous username lookup route `GET /users/profiles/minecraft/{playerName}` returns `404` when the player does not exist, and the docs warn that Mojang sometimes emits random `403` responses because of a server-side misconfiguration.
- `POST https://xsts.auth.xboxlive.com/xsts/authorize` documents `401` when obtaining the XSTS token fails.
- Missing or invalid bearer tokens on authenticated `api.minecraftservices.com` routes return `401`.
- `GET /productvoucher/giftcode` returns `200` or `204` when valid, and `404` otherwise.
- `POST /session/minecraft/join` returns `204` if authentication passes.
- The account-suspension example on `/authentication/login_with_xbox` documents a `403` response with `details.reason = ACCOUNT_SUSPENDED`.
- `POST /presence` can return `400 Bad Request` when `joinInfo.value` violates the route's documented status-specific rules.

## Pagination
- The inspected documentation page does not document offset, cursor, or page-based pagination for these routes.

## Important usage notes
- The inspected docs mix several hosts; do not collapse everything into a single base URL.
- Relative paths under the `Player config` and `Friends list` sections are explicitly rooted at `https://api.minecraftservices.com`.
- The docs' `History` section also records removed legacy endpoints such as the old status-check and sales-statistics routes; those are historical notes only and are excluded from the confirmed route count above.
- Friends and presence APIs are snapshot-era features and are explicitly described as unstable and likely to change.
- The `blockedservers` route returns SHA-1 hashes of blocked servers, not raw hostnames.

## Integration notes for fireROUTE
- Model Mojang as a multi-host provider, not a single-base-URL API.
- Keep anonymous lookup routes, auth-chain routes, bearer-token account routes, sessionserver routes, and friend/presence routes distinct.
- Reuse the general JSON error envelope, but preserve route-specific exceptions such as plain-text `blockedservers`, `204` success cases, and `304` conditional friend-list responses.
- Treat `/minecraft/profile/skins` as one `POST` route with two documented payload styles rather than as separate endpoints.
- Treat `?unsigned=false` on the session profile route as a documented query option, not a separate route.

## Sources inspected
- `https://wiki.vg/Mojang_API`
- `https://wiki.vg/`
- `https://minecraft.wiki/w/Mojang_API`
