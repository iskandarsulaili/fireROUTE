# SpaceTradersAPI

## Overview
- Provider: SpaceTraders API
- Category: Games & Comics
- Official docs inspected: `https://spacetraders.io/?rel=pub-apis`
- Official OpenAPI spec inspected: `https://spacetraders.io/SpaceTraders.json`
- Base URL: `https://api.spacetraders.io/v2`
- Auth: bearer JWTs via `Authorization: Bearer {token}`
  - `AccountToken`: used to register new agents
  - `AgentToken`: used for agent gameplay endpoints during the current reset
- HTTPS: yes
- Response format: JSON
- Pagination: `page` + `limit`, with `meta.total`, `meta.page`, `meta.limit`
- Rate limits: live anonymous responses exposed `X-RateLimit-Limit-Per-Second: 2`, `X-RateLimit-Limit-Burst: 30`, `X-RateLimit-Type: IP Address`, plus `Retry-After`
- Confirmed routes: `59`
- Manual status: `manually_documented`

## Auth, headers, and live error behavior
- The bundled OpenAPI spec defines two bearer-token security schemes:
  - `AgentToken`: granted when you register a new agent; scoped to gameplay during a specific reset
  - `AccountToken`: used to create agents
- A live unauthenticated request to `GET /my/agent` returned HTTP `401` with:
  - `{"error":{"code":4103,"message":"Missing Bearer token in the request. Did you confirm sending the 'Bearer {token}' as the authorization header?","data":{},"requestId":"..."}}`
- Live responses exposed these rate-limit headers:
  - `Retry-After`
  - `X-RateLimit-Type`
  - `X-RateLimit-Limit-Burst`
  - `X-RateLimit-Limit-Per-Second`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`
- The response-errors page publicly exposes error-code category headings for:
  - General
  - Account
  - Ship
  - Contract
  - Market
  - Faction
  - Construction
- That same page says the published list is non-exhaustive.

## Pagination and format notes
- The OpenAPI `Meta` schema documents:
  - `page` default `1`
  - `limit` default `10`
  - `limit` maximum `20`
  - `total` total item count
- Collection endpoints return JSON objects with a top-level `data` payload and a `meta` object.
- JSON responses are CORS-enabled at least for the public root endpoint; a live request exposed `Access-Control-Allow-Origin: *`.

## Confirmed endpoints

### Global (2)
| Method | Path | Auth | Parameters | Body | Notes |
|---|---|---|---|---|---|
| GET | `/` | anonymous or `AgentToken` | none | none | Server status, version, reset date, stats, health, leaderboards, announcements, links. |
| POST | `/register` | `AccountToken` | none | `application/json` | Register a new agent. |

### Systems (9)
| Method | Path | Auth | Parameters | Body | Notes |
|---|---|---|---|---|---|
| GET | `/systems` | anonymous or `AgentToken` | optional `page`, `limit` | none | List systems. |
| GET | `/systems/{systemSymbol}` | anonymous or `AgentToken` | `systemSymbol` path | none | Get one system. |
| GET | `/systems/{systemSymbol}/waypoints` | anonymous or `AgentToken` | optional `page`, `limit`, `type`, `traits`; `systemSymbol` path | none | List system waypoints. |
| GET | `/systems/{systemSymbol}/waypoints/{waypointSymbol}` | anonymous or `AgentToken` | `systemSymbol`, `waypointSymbol` path | none | Get one waypoint. |
| GET | `/systems/{systemSymbol}/waypoints/{waypointSymbol}/market` | anonymous or `AgentToken` | `systemSymbol`, `waypointSymbol` path | none | Get market data. |
| GET | `/systems/{systemSymbol}/waypoints/{waypointSymbol}/shipyard` | anonymous or `AgentToken` | `systemSymbol`, `waypointSymbol` path | none | Get shipyard data. |
| GET | `/systems/{systemSymbol}/waypoints/{waypointSymbol}/jump-gate` | anonymous or `AgentToken` | `systemSymbol`, `waypointSymbol` path | none | Get jump-gate data. |
| GET | `/systems/{systemSymbol}/waypoints/{waypointSymbol}/construction` | anonymous or `AgentToken` | `systemSymbol`, `waypointSymbol` path | none | Get construction-site state. |
| POST | `/systems/{systemSymbol}/waypoints/{waypointSymbol}/construction/supply` | `AgentToken` | `systemSymbol`, `waypointSymbol` path | `application/json` | Supply a construction site. |

### Factions (2)
| Method | Path | Auth | Parameters | Body | Notes |
|---|---|---|---|---|---|
| GET | `/factions` | anonymous or `AgentToken` | optional `page`, `limit` | none | List factions. |
| GET | `/factions/{factionSymbol}` | inherits top-level auth model in the bundled spec; publicly documented as a readable faction lookup | `factionSymbol` path | none | Get one faction. |

### Agents (3)
| Method | Path | Auth | Parameters | Body | Notes |
|---|---|---|---|---|---|
| GET | `/my/agent` | `AgentToken` | none | none | Get the caller's agent record. |
| GET | `/agents` | anonymous or `AgentToken` | optional `page`, `limit` | none | List agents. |
| GET | `/agents/{agentSymbol}` | anonymous or `AgentToken` | `agentSymbol` path | none | Get public agent details. |

### Contracts (5)
| Method | Path | Auth | Parameters | Body | Notes |
|---|---|---|---|---|---|
| GET | `/my/contracts` | `AgentToken` | optional `page`, `limit` | none | List contracts. |
| GET | `/my/contracts/{contractId}` | `AgentToken` | `contractId` path | none | Get a contract. |
| POST | `/my/contracts/{contractId}/accept` | `AgentToken` | `contractId` path | none | Accept a contract. |
| POST | `/my/contracts/{contractId}/deliver` | `AgentToken` | `contractId` path | `application/json` | Deliver cargo toward a contract. |
| POST | `/my/contracts/{contractId}/fulfill` | `AgentToken` | `contractId` path | none | Fulfill a contract. |

### Fleet (37)
| Method | Path | Auth | Parameters | Body | Notes |
|---|---|---|---|---|---|
| GET | `/my/ships` | `AgentToken` | optional `page`, `limit` | none | List owned ships. |
| POST | `/my/ships` | `AgentToken` | none | `application/json` | Purchase ship. |
| GET | `/my/ships/{shipSymbol}` | `AgentToken` | `shipSymbol` path | none | Get ship. |
| GET | `/my/ships/{shipSymbol}/cargo` | `AgentToken` | `shipSymbol` path | none | Get ship cargo. |
| POST | `/my/ships/{shipSymbol}/orbit` | `AgentToken` | `shipSymbol` path | none | Orbit ship. |
| POST | `/my/ships/{shipSymbol}/refine` | `AgentToken` | `shipSymbol` path | `application/json` | Refine cargo. |
| POST | `/my/ships/{shipSymbol}/chart` | `AgentToken` | `shipSymbol` path | none | Create chart. |
| GET | `/my/ships/{shipSymbol}/cooldown` | `AgentToken` | `shipSymbol` path | none | Get ship cooldown. |
| POST | `/my/ships/{shipSymbol}/dock` | `AgentToken` | `shipSymbol` path | none | Dock ship. |
| POST | `/my/ships/{shipSymbol}/survey` | `AgentToken` | `shipSymbol` path | none | Create survey. |
| POST | `/my/ships/{shipSymbol}/extract` | `AgentToken` | `shipSymbol` path | `application/json` | Extract resources. |
| POST | `/my/ships/{shipSymbol}/siphon` | `AgentToken` | `shipSymbol` path | none | Siphon resources. |
| POST | `/my/ships/{shipSymbol}/extract/survey` | `AgentToken` | `shipSymbol` path | `application/json` | Extract with survey. |
| POST | `/my/ships/{shipSymbol}/jettison` | `AgentToken` | `shipSymbol` path | `application/json` | Jettison cargo. |
| POST | `/my/ships/{shipSymbol}/jump` | `AgentToken` | `shipSymbol` path | `application/json` | Jump ship. |
| POST | `/my/ships/{shipSymbol}/navigate` | `AgentToken` | `shipSymbol` path | `application/json` | Navigate ship. |
| PATCH | `/my/ships/{shipSymbol}/nav` | `AgentToken` | `shipSymbol` path | `application/json` | Patch ship navigation state. |
| GET | `/my/ships/{shipSymbol}/nav` | `AgentToken` | `shipSymbol` path | none | Get ship navigation state. |
| POST | `/my/ships/{shipSymbol}/warp` | `AgentToken` | `shipSymbol` path | `application/json` | Warp ship. |
| POST | `/my/ships/{shipSymbol}/sell` | `AgentToken` | `shipSymbol` path | `application/json` | Sell cargo. |
| POST | `/my/ships/{shipSymbol}/scan/systems` | `AgentToken` | `shipSymbol` path | none | Scan systems. |
| POST | `/my/ships/{shipSymbol}/scan/waypoints` | `AgentToken` | `shipSymbol` path | none | Scan waypoints. |
| POST | `/my/ships/{shipSymbol}/scan/ships` | `AgentToken` | `shipSymbol` path | none | Scan ships. |
| POST | `/my/ships/{shipSymbol}/refuel` | `AgentToken` | `shipSymbol` path | `application/json` | Refuel ship. |
| POST | `/my/ships/{shipSymbol}/purchase` | `AgentToken` | `shipSymbol` path | `application/json` | Purchase cargo. |
| POST | `/my/ships/{shipSymbol}/transfer` | `AgentToken` | `shipSymbol` path | `application/json` | Transfer cargo. |
| POST | `/my/ships/{shipSymbol}/negotiate/contract` | `AgentToken` | `shipSymbol` path | none | Negotiate contract. |
| GET | `/my/ships/{shipSymbol}/mounts` | `AgentToken` | `shipSymbol` path | none | Get mounts. |
| POST | `/my/ships/{shipSymbol}/mounts/install` | `AgentToken` | `shipSymbol` path | `application/json` | Install mount. |
| POST | `/my/ships/{shipSymbol}/mounts/remove` | `AgentToken` | `shipSymbol` path | `application/json` | Remove mount. |
| GET | `/my/ships/{shipSymbol}/scrap` | `AgentToken` | `shipSymbol` path | none | Get scrap quote/state. |
| POST | `/my/ships/{shipSymbol}/scrap` | `AgentToken` | `shipSymbol` path | none | Scrap ship. |
| GET | `/my/ships/{shipSymbol}/repair` | `AgentToken` | `shipSymbol` path | none | Get repair quote/state. |
| POST | `/my/ships/{shipSymbol}/repair` | `AgentToken` | `shipSymbol` path | none | Repair ship. |
| GET | `/my/ships/{shipSymbol}/modules` | authenticated ship-owner route | `shipSymbol` path | none | Get ship modules. |
| POST | `/my/ships/{shipSymbol}/modules/install` | authenticated ship-owner route | `shipSymbol` path | `application/json` | Install ship module. |
| POST | `/my/ships/{shipSymbol}/modules/remove` | authenticated ship-owner route | `shipSymbol` path | `application/json` | Remove ship module. |

### Data (1)
| Method | Path | Auth | Parameters | Body | Notes |
|---|---|---|---|---|---|
| GET | `/market/supply-chain` | `AgentToken` | none | none | Returns supply-chain data. |

## Important parameter patterns
- Repeated collection parameters:
  - `page`: page number, minimum `1`
  - `limit`: page size, minimum `1`, maximum `20`
- Common path selectors:
  - `systemSymbol`
  - `waypointSymbol`
  - `agentSymbol`
  - `contractId`
  - `shipSymbol`
  - `factionSymbol`
- Waypoint listing supports additional filters:
  - `type`
  - `traits` (one trait or an array of traits)
- Many write actions accept JSON request bodies; the spec marks these as `application/json` even when the public docs page does not render the detailed schema inline.

## Errors and live observations
- Live `GET /` returned a JSON status document including `status`, `version`, `resetDate`, `stats`, `health`, `leaderboards`, `serverResets`, `announcements`, and `links`.
- Live `GET /my/agent` without a bearer token returned HTTP `401` with JSON error code `4103` and a `requestId`.
- The public response-errors page states the published error-code list is non-exhaustive and groups codes by General / Account / Ship / Contract / Market / Faction / Construction categories.
- At inspection time, the bundled OpenAPI JSON did not expose a separate `/error-codes` route even though the response-errors page text references one in the OpenAPI UI.

## Important usage notes
- SpaceTraders is a persistent HTTP game platform rather than a simple static dataset API; most of the route surface is authenticated gameplay state.
- Tokens are reset-sensitive. The `AgentToken` description explicitly says it is valid during a specific reset.
- Anonymous access exists for some discovery/status endpoints, but real gameplay actions overwhelmingly require `AgentToken`.
- Respect rate-limit headers on every response; the platform explicitly exposes reset timing and remaining budget.

## Integration notes for fireROUTE
- Use `https://api.spacetraders.io/v2` as the canonical base URL.
- Model auth at two levels: account-registration token vs. agent gameplay token.
- Preserve `page`/`limit` pagination and `meta` fields exactly.
- Expect consistent JSON error envelopes under a top-level `error` object with at least `code`, `message`, `data`, and often `requestId`.
- Group the API by tag/family rather than treating the 59 routes as one flat list.

## Sources inspected
- `https://spacetraders.io/?rel=pub-apis`
- `https://spacetraders.io/api-guide/open-api-spec`
- `https://spacetraders.io/api-guide/authorization`
- `https://spacetraders.io/api-guide/response-errors`
- `https://spacetraders.io/api-guide/rate-limits`
- `https://spacetraders.io/SpaceTraders.json`
- `https://api.spacetraders.io/v2`
- `https://api.spacetraders.io/v2/my/agent`
