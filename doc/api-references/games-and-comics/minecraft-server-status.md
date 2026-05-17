# Minecraft Server Status

## Overview
- Provider: Minecraft Server Status
- Category: Games & Comics
- Official docs inspected: `https://api.mcsrvstat.us`
- Official alternative page inspected: `https://api.mcsrvstat.us/about`
- Base URL: `https://api.mcsrvstat.us`
- Auth: no API key documented; a descriptive, non-empty `User-Agent` header is required
- HTTPS: yes
- Response formats: JSON status responses, HTTP status-only health responses, PNG icon responses
- Confirmed routes: `8`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/3/{address}` | path `address` = Java server address/hostname; may include port | Main Java-edition status lookup. Returns JSON. |
| GET | `/bedrock/3/{address}` | path `address` = Bedrock server address/hostname; may include port | Main Bedrock status lookup. Returns JSON. |
| GET | `/simple/{address}` | path `address` = Java server address/hostname; may include port | HTTP status-code endpoint for Java servers; intended for simple online/offline monitoring. |
| GET | `/bedrock/simple/{address}` | path `address` = Bedrock server address/hostname; may include port | HTTP status-code endpoint for Bedrock servers. |
| GET | `/icon/{address}` | path `address` = server address/hostname; may include port | Returns a direct server icon image. |
| GET | `/debug/ping/{address}` | path `address` = server address/hostname; may include port | Debug-only ping output. Docs say to use only for debugging. |
| GET | `/debug/query/{address}` | path `address` = server address/hostname; may include port | Debug-only query output. Docs say to use only for debugging. |
| GET | `/debug/bedrock/{address}` | path `address` = Bedrock server address/hostname; may include port | Debug-only Bedrock output. Docs say to use only for debugging. |

## Authentication and headers
- The official docs do not require an API key.
- The docs explicitly require a descriptive and non-empty `User-Agent` request header.
- The docs say requests without that header receive `403 Forbidden`.

## Parameters and request notes
- The only documented input placeholder is `{address}`.
- The docs say: if an address works in Minecraft, it works with this API.
- If no port is specified, the API will find it automatically.
- SRV records are supported.
- The main JSON routes combine Ping and Query protocol information into a single status response.
- Java and Bedrock are modeled as separate path families rather than a shared route with a mode flag.
- The debug routes are explicitly for troubleshooting and not for normal day-to-day use.
- No query-string filters, body parameters, pagination cursors, or auth tokens are documented.

## Response schema notes
For the main JSON status routes, the official docs show these top-level fields for online servers:
- `online`
- `ip`
- `port`
- `hostname` when a hostname is detected
- `debug`
- `version`
- `protocol` when ping is used
- `icon` when an icon is detected
- `software` when software is detected
- `map`
- `gamemode` for Bedrock servers
- `serverid` for Bedrock servers
- `eula_blocked` for Java servers
- `motd`
- `players`
- `plugins` when plugins are detected
- `mods` when mods are detected
- `info` when player samples are interpreted as information text

For offline servers, the docs still show a normal JSON payload with:
- `online: false`
- `ip` which may be empty
- `port` which may be empty
- optional `hostname`
- `debug`

## Debug object fields documented
The official debug-value table documents:
- `ping`
- `query`
- `bedrock`
- `srv`
- `querymismatch`
- `ipinsrv`
- `cnameinsrv`
- `animatedmotd`
- `cachehit`
- `cachetime`
- `cacheexpire`
- `apiversion`

## Format notes
- The main status routes return `application/json`.
- `motd`, `map`, and `info` examples expose parallel `raw`, `clean`, and `html` representations.
- `players` includes `online`, `max`, and optionally `list[]` entries containing player `name` and `uuid`.
- `protocol` includes a numeric `version` and may include a friendly `name`.
- `plugins[]` and `mods[]` are arrays of `{name, version}` objects.
- `icon` in the main JSON response is a `data:image/png;base64,...` string when present.
- `/icon/{address}` always returns a `64x64` PNG image; the docs say a default Minecraft icon is returned for servers without an icon and for offline servers.
- `/simple/...` routes are documented as HTTP-status endpoints: `200 OK` for online servers and `404 Not Found` for offline servers.

## Pagination, caching, and limits
- No pagination is documented.
- The official homepage says API data is cached for `5 minutes`.
- No numeric rate limit is documented on the inspected official pages.

## Errors
- The docs explicitly document `403 Forbidden` when the required `User-Agent` header is missing or empty.
- The simple-status routes document `404 Not Found` for offline servers.
- The main JSON routes document offline servers through a normal JSON response with `online: false`, not as a separate error object.
- The official docs do not publish a broader structured error schema or global error matrix.

## Important usage notes
- The provider separates developer usage on `api.mcsrvstat.us` from the end-user server checker on `mcsrvstat.us`.
- Consumers should preserve optional fields because many response sections only appear when the API detects the relevant server data.
- Cache windows matter: repeated requests may reflect cached status for up to five minutes.
- Debug endpoints are provider-documented but intended only for troubleshooting.

## Integration notes for fireROUTE
- Model this provider as `8` public read-only `GET` routes.
- Require callers to send an identifying `User-Agent` even though there is no API key.
- Keep Java, Bedrock, simple-status, icon, and debug operations distinct because the path families are explicitly different.
- Treat many JSON fields as optional and edition-specific.
- Do not invent undocumented query parameters or pagination controls.

## Sources inspected
- `https://api.mcsrvstat.us`
- `https://api.mcsrvstat.us/about`
