# AmiiboAPI

## Overview
- Provider: `AmiiboAPI`
- Category: `Games & Comics`
- Official indexed docs URL: `https://amiiboapi.com/`
- Official repository inspected as the surviving first-party contract source: `https://github.com/N3evin/AmiiboAPI`
- Historical public API host documented by the official README/templates: `https://amiiboapi.com`
- Preferred base path from the official repository: `/api`
- Auth: none documented
- HTTPS: yes in the official published examples, although the live host did not serve a usable API contract in this pass
- Response format: JSON for API routes; HTML for `/`, `/docs/`, and `/faq/`
- Pagination: none documented
- Rate limits: no numeric limit is documented in the official README, docs template, or route files
- Confirmed routes: `7`
- Manual status: `manually_documented`

## Base URL status at inspection time
- A fresh browser check to `https://amiiboapi.com/` failed with `net::ERR_CONNECTION_REFUSED`.
- Earlier first-party host checks in this shard also showed the HTTP root and sample API URL redirecting to unrelated third-party pages, so the live site is not a trustworthy contract source right now.
- The official GitHub repository still contains the published README, the rendered docs template, the Flask app registration, and the route files. Those repository sources are the authoritative surviving first-party contract for this provider.

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/amiibo/` | optional `id`, `head`, `tail`, `name`, `gameseries`, `switch_titleid`, `wiiu_titleid`, `3ds_titleid`, `character`, `variant`, `type`, `amiibo_model`, `amiiboSeries`, `showgames`, `showusage`, `sort` | Main amiibo lookup/list route. Official docs examples cover `name`, `id`, `type`, `gameseries`, `amiiboSeries`, `character`, `showgames`, and `showusage`; the route code confirms the broader filter set. |
| GET | `/api/amiibofull/` | optional `id`, `head`, `tail`, `name`, `gameseries`, `switch_titleid`, `wiiu_titleid`, `3ds_titleid`, `character`, `variant`, `type`, `amiibo_model`, `amiiboSeries`, `sort` | Repository route file exposes a full-data variant that returns directly from the `amiibosfull` collection. This path is registered in `app.py` even though the HTML docs template does not give it its own section. |
| GET | `/api/type/` | optional `key`, optional `name`, optional `sort` | Lists amiibo types or filters by key/name. |
| GET | `/api/gameseries/` | optional `key`, optional `name`, optional `sort` | Lists game series or filters by key/name. |
| GET | `/api/amiiboseries/` | optional `key`, optional `name`, optional `sort` | Lists amiibo series or filters by key/name. |
| GET | `/api/character/` | optional `key`, optional `name`, optional `sort` | Lists characters or filters by key/name. |
| GET | `/api/lastupdated/` | none | Returns the last database update timestamp. |

Route count note:
- The repository also registers HTML support pages at `/`, `/docs/`, and `/faq/`, but they are site pages rather than data/API routes and are excluded from the confirmed route count.
- `showgames` and `showusage` are documented query modes on `/api/amiibo/`, not separate path routes, so they are also excluded from the route count.

## Parameter notes

### `/api/amiibo/` and `/api/amiibofull/`
- `id`: full amiibo identifier. The docs example shows `head + tail` represented as a single combined id such as `01010000000e0002`.
- `head`: first 8 hexadecimal characters of the amiibo identifier.
- `tail`: next 8 hexadecimal characters of the amiibo identifier.
- `name`: amiibo name filter.
- `gameseries`: accepts either a hexadecimal key such as `0x22c` or a text name such as `Chibi Robo`.
- `character`: accepts either a hexadecimal key such as `0x1996` or a text name such as `Mewtwo`.
- `type`: accepts either a hexadecimal key such as `0x02` or a text value such as `yarn`.
- `amiiboSeries`: accepts either a hexadecimal key such as `0x10` or a text value such as `BoxBoy!`.
- `switch_titleid`, `wiiu_titleid`, `3ds_titleid`: route code confirms filters by Nintendo platform title ids.
- `variant`: route code confirms filtering by variant id.
- `amiibo_model`: route code confirms filtering by amiibo model id.
- `showgames`: docs template says this can be combined with other filters and adds game-compatibility arrays.
- `showusage`: docs template says this can be combined with other filters and adds per-game usage details.
- `sort`: route code confirms comma-separated sort keys. Supported keys include `id`, `head`, `tail`, `name`, `gameseries`, `gameseries_id`, `gameseries_name`, `character`, `character_id`, `character_name`, `variant`, `variant_id`, `type`, `type_id`, `type_name`, `amiibo_model`, `amiibo_model_id`, `series`, `series_id`, `series_name`, `release_na`, `release_jp`, `release_eu`, and `release_au`. `amiibofull` additionally maps `switch_titleid`, `3ds_titleid`, and `wiiu_titleid` into the embedded game arrays.

### `/api/type/`, `/api/gameseries/`, `/api/amiiboseries/`, `/api/character/`
- `key`: exact hexadecimal identifier lookup.
- `name`: case-insensitive text-style lookup/list filter as shown in the official docs examples.
- `sort`: route code confirms sort handling for `key` and `name` on these lookup collections.

## Response and schema notes
- Most API routes return a top-level JSON object with an `amiibo` key.
- `/api/lastupdated/` returns a top-level `lastUpdated` ISO-like timestamp field.
- The main `/api/amiibo/` docs template shows these baseline amiibo fields:
  - `amiiboSeries`
  - `character`
  - `gameSeries`
  - `head`
  - `image`
  - `name`
  - `release` with `au`, `eu`, `jp`, `na`
  - `tail`
  - `type`
- The docs say release dates use `yyyy-mm-dd` format and may be `null` when unavailable.
- `showgames` adds `games3DS`, `gamesSwitch`, and `gamesWiiU` arrays containing `gameID` lists and `gameName`.
- `showusage` adds `amiiboUsage` arrays within those game entries; each usage object includes `Usage` text and a boolean `write` flag.
- `/api/type/`, `/api/gameseries/`, `/api/amiiboseries/`, and `/api/character/` return objects shaped around `key` and `name`.

## Auth, errors, and live behavior notes
- The official README explicitly says no authentication is required.
- The Flask app enables CORS globally with `flask_cors.CORS(app)`.
- The app defines JSON error handlers for:
  - `400` -> `{"error": <description>, "code": 400}`
  - `404` -> `{"error": <description>, "code": 404}`
- The app also defines a `429` JSON handler (`rate limit exceeded ...`), but the inspected official sources do not publish a numeric rate-limit policy or show where a public limiter is configured, so fireROUTE should treat rate limiting as undocumented.
- The route files abort with `400` on invalid hexadecimal identifiers and with `404` when a filtered collection or exact lookup has no result.
- Because the historical host was not serving a trustworthy API during this pass, live success payloads could not be revalidated against the repository examples.

## Important usage notes
- The official repository was archived by its owner on `2025-12-31`, but it still preserves the published first-party contract.
- The repository README links to `https://www.amiiboapi.com/docs/`, while the Flask app serves `/docs/`; treat the repository contents rather than the current live host as canonical for now.
- `showgames` and `showusage` are enrichment modes on the main amiibo route, not separate resources.
- `amiibofull` is a real registered route from the official source tree even though the HTML docs page does not describe it directly.
- Treat the provider as repository-documented / live-host-unreliable until an official maintained deployment is restored.

## Integration notes for fireROUTE
- Model this provider as a small unauthenticated JSON API centered on `/api/amiibo/` plus four metadata lookup collections, one full-data route, and one timestamp route.
- Preserve the documented `amiibo` response envelope and the `lastUpdated` singleton response shape.
- Do not invent pagination or a numeric rate limit; neither is published in the surviving official sources.
- Treat `id`, `head`, `tail`, `key`, and the various `0x...` filters as hexadecimal identifiers that return `400` when malformed.

## Sources inspected
- `https://amiiboapi.com/`
- `https://github.com/N3evin/AmiiboAPI`
- `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/README.md`
- `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/app.py`
- `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/routes/amiibo.py`
- `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/routes/amiibofull.py`
- `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/routes/type.py`
- `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/routes/game_series.py`
- `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/routes/amiibo_series.py`
- `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/routes/character.py`
- `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/templates/docs.html`
- `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/templates/home.html`
- `https://raw.githubusercontent.com/N3evin/AmiiboAPI/master/templates/faq.html`
