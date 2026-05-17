# Trello

## Provider metadata
- Category: `Business`
- Provider slug: `trello`
- Official docs/pages reviewed manually:
  - `https://developer.atlassian.com/cloud/trello/rest/`
  - `https://developer.atlassian.com/cloud/trello/guides/rest-api/api-introduction/`
  - `https://developer.atlassian.com/cloud/trello/guides/rest-api/authorization/`
  - `https://developer.atlassian.com/cloud/trello/guides/rest-api/rate-limits/`
  - `https://developer.atlassian.com/cloud/trello/guides/rest-api/status-codes/`
  - `https://dac-static.atlassian.com/cloud/trello/swagger.v3.json?_v=1.957.0`
- Confirmed REST base URL: `https://api.trello.com/1`
- Manually confirmed route count: `256` operations across `187` unique path templates
- Route-method breakdown confirmed from the official OpenAPI definition:
  - `125` `GET`
  - `44` `POST`
  - `51` `PUT`
  - `36` `DELETE`
- Official response media type confirmed from the OpenAPI document: `application/json`
- Official request-body media type confirmed where bodies are used: `application/json`

## What the official docs confirm
- Trello publishes its current REST reference on Atlassian’s developer site, while the live API host remains `api.trello.com` under the `/1` namespace.
- The official first-party OpenAPI definition currently exposes `256` concrete method+path operations across `18` route families: Actions, Applications, Batch, Boards, Cards, Checklists, CustomFields, Emoji, Enterprises, Labels, Lists, Members, Notifications, Organizations, Plugins, Search, Tokens, and Webhooks.
- Trello’s REST design is heavily nested: many primary object endpoints accept query parameters that inline related actions, boards, cards, checklists, labels, lists, members, memberships, organizations, and plugin data instead of forcing separate follow-up calls.
- The docs still treat query-string auth (`key` + `token`) as the standard direct request pattern.

## Authentication

### Primary REST auth model
Confirmed from the official OpenAPI definition:
- global security requirement: `APIKey` plus `APIToken`
- `APIKey` security-scheme type: `apiKey`
- `APIKey` location: query string
- `APIKey` parameter name: `key`
- `APIToken` security-scheme type: `apiKey`
- `APIToken` location: query string
- `APIToken` parameter name: `token`

### User-token authorization flow
Confirmed from the official Authorization guide:
- Trello issues user tokens after a delegated authorization flow tied to a Trello Power-Up API key.
- The official authorize endpoint is `https://trello.com/1/authorize`.
- Documented `1/authorize` query parameters include:
  - `callback_method` — `postMessage` or `fragment`
  - `return_url` — valid callback URL/origin
  - `scope` — comma-separated `read`, `write`, `account`
  - `expiration` — `1hour`, `1day`, `30days`, or `never`
  - `key` — Trello API key
  - `response_type=token`
- The docs explicitly say the API key can be publicly visible, but the user token must be kept secret because it grants account access.
- The Authorization guide also says Trello supports basic OAuth `1.0` as an alternative way to obtain a user token.

### Example officially documented request pattern
```bash
curl https://api.trello.com/1/members/me?key=***&token=***
```

## Base URL and route shape
- Base host: `https://api.trello.com`
- API version prefix: `/1`
- Full base URL: `https://api.trello.com/1`
- Route style: object-centric REST paths with extensive nested-resource traversal
- Important normalization note: even though the docs live under `developer.atlassian.com`, production requests still target `api.trello.com`

## Route-family inventory confirmed from the official OpenAPI definition
| Route family | Operations | Unique paths | Representative path templates |
|---|---:|---:|---|
| `actions` | 16 | 12 | `/actions/{id}`, `/actions/{id}/{field}`, `/actions/{id}/board`, `/actions/{idAction}/reactions` |
| `applications` | 1 | 1 | `/applications/{key}/compliance` |
| `batch` | 1 | 1 | `/batch` |
| `boards` | 36 | 29 | `/boards/{id}`, `/boards/{id}/cards`, `/boards/{id}/lists`, `/boards/{id}/members`, `/boards/{id}/labels` |
| `cards` | 42 | 30 | `/cards`, `/cards/{id}`, `/cards/{id}/attachments`, `/cards/{id}/checklists`, `/cards/{idCard}/customField/{idCustomField}/item` |
| `checklists` | 12 | 7 | `/checklists`, `/checklists/{id}`, `/checklists/{id}/checkItems` |
| `customFields` | 8 | 4 | `/customFields`, `/customFields/{id}`, `/customFields/{id}/options` |
| `emoji` | 1 | 1 | `/emoji` |
| `enterprises` | 21 | 19 | `/enterprises/{id}`, `/enterprises/{id}/auditlog`, `/enterprises/{id}/members`, `/enterprises/{id}/transferrable/organization/{idOrganization}` |
| `labels` | 5 | 3 | `/labels`, `/labels/{id}`, `/labels/{id}/{field}` |
| `lists` | 11 | 10 | `/lists`, `/lists/{id}`, `/lists/{id}/actions`, `/lists/{id}/cards` |
| `members` | 45 | 27 | `/members/{id}`, `/members/{id}/boards`, `/members/{id}/cards`, `/members/{id}/notifications` |
| `notifications` | 11 | 10 | `/notifications/{id}`, `/notifications/all/read`, `/notifications/{id}/board`, `/notifications/{id}/memberCreator` |
| `organizations` | 26 | 19 | `/organizations`, `/organizations/{id}`, `/organizations/{id}/boards`, `/organizations/{id}/members`, `/organizations/{id}/exports` |
| `plugins` | 5 | 4 | `/plugins/{id}/`, `/plugins/{idPlugin}/listing`, `/plugins/{id}/compliance/memberPrivacy` |
| `search` | 2 | 2 | `/search`, `/search/members/` |
| `tokens` | 8 | 5 | `/tokens/{token}`, `/tokens/{token}/member`, `/tokens/{token}/webhooks` |
| `webhooks` | 5 | 3 | `/webhooks/`, `/webhooks/{id}`, `/webhooks/{id}/{field}` |

## Important endpoint and parameter notes confirmed from sampled official operations

### `GET /boards/{id}`
The official schema exposes a board-fetch route with rich nested-resource query shaping.

Confirmed query parameters include:
- `actions`
- `boardStars`
- `cards`
- `card_pluginData`
- `checklists`
- `customFields`
- `fields`
- `labels`
- `lists`
- `members`
- `memberships`
- `pluginData`
- `organization`
- `organization_pluginData`
- `myPrefs`
- `tags`

Important board-response shaping notes:
- `fields` supports `all` or a comma-separated subset of board fields.
- Multiple nested-resource parameters explicitly point to Trello’s `Nested Resources` guide.
- This is one of the clearest examples of Trello’s preference for expandable nested reads over separate fan-out requests.

### `POST /cards`
Confirmed query parameters on the create-card operation include:
- `idList` — required target list ID
- `name`
- `desc`
- `pos`
- `due`
- `start`
- `dueComplete`
- `idMembers`
- `idLabels`
- `urlSource`
- `fileSource`
- `mimeType`
- `idCardSource`
- `keepFromSource`
- `address`
- `locationName`
- `coordinates`
- `cardRole`

Important creation notes:
- `pos` accepts `top`, `bottom`, or a positive float.
- `keepFromSource` controls which properties are copied from `idCardSource`.
- Map-view-specific fields (`address`, `locationName`, `coordinates`) are first-party documented inputs.

### `GET /members/{id}`
Confirmed path/query parameters include:
- path parameter `id` — member ID or username
- `actions`
- `boards`
- `boardBackgrounds`
- `boardsInvited`
- `boardsInvited_fields`
- `boardStars`
- `cards`
- `customBoardBackgrounds`
- `customEmoji`
- `customStickers`
- `fields`
- `notifications`
- `organizations`
- `organization_fields`
- `organization_paid_account`
- `organizationsInvited`
- `organizationsInvited_fields`
- `paid_account`
- `savedSearches`
- `tokens`

This route is another strong example of Trello’s nested-resource style and object-expansion query contract.

### `GET /search`
Confirmed query parameters include:
- `query` — required free-text search query
- `idBoards`
- `idOrganizations`
- `idCards`
- `modelTypes`
- `board_fields`
- `boards_limit`
- `board_organization`
- `card_fields`
- `cards_limit`
- `cards_page`
- `card_board`
- `card_list`
- `card_members`
- `card_stickers`
- `card_attachments`
- `organization_fields`
- `organizations_limit`
- `member_fields`
- `members_limit`
- `partial`

Search-specific notes confirmed from the schema:
- the search query length may be `1` to `16384` characters
- multiple search result families have documented maximums of `1000`
- card search also exposes a page-style parameter `cards_page` with maximum `100`

### `POST /webhooks/`
Confirmed query parameters include:
- `callbackURL` — required; must be reachable by both `HEAD` and `POST`
- `idModel` — required monitored model ID
- `description`
- `active`

Webhook usage notes confirmed from the docs:
- Trello recommends webhooks as the main alternative to polling.
- The API Introduction says there is no limit to the number of webhooks you can set up.

### `GET /batch`
Confirmed query parameter:
- `urls` — required list of API routes

Batch-specific note:
- the docs limit a batch request to a maximum of `10` routes
- batched route strings should start with `/` and should not include the API version number

## Request-body notes
The OpenAPI definition confirms only `10` mutation operations with an explicit JSON request body. Those are:
- `POST /actions/{idAction}/reactions`
- `PUT /boards/{id}/members`
- `PUT /cards/{idCard}/customField/{idCustomField}/item`
- `PUT /cards/{idCard}/customFields`
- `POST /customFields`
- `PUT /customFields/{id}`
- `PUT /members/{id}/notificationsChannelSettings`
- `PUT /members/{id}/notificationsChannelSettings/{channel}`
- `POST /plugins/{idPlugin}/listing`
- `PUT /plugins/{idPlugin}/listings/{idListing}`

Sample body-field confirmations from the official schemas:
- `POST /actions/{idAction}/reactions` body fields: `shortName`, `skinVariation`, `native`, `unified`
- `PUT /boards/{id}/members` body field: `fullName`
- `PUT /members/{id}/notificationsChannelSettings` body fields: `channel`, `blockedKeys`
- `PUT /cards/{idCard}/customField/{idCustomField}/item` accepts either:
  - a `value` object with typed keys such as `checked`, `date`, `number`, `text`, or
  - an `idValue` field for list-type custom fields

Important implementation note:
- most Trello write routes still use query parameters rather than JSON bodies; from the official OpenAPI inventory, `75` `POST`/`PUT` operations are query-parameter-driven mutations without a declared request body.

## Pagination, expansion, and traversal notes
Confirmed from the official API Introduction and operation schemas:
- Trello does **not** publish one universal cursor envelope for every endpoint.
- For long lists, the API Introduction says Trello limits list-style queries such as cards/actions to at most `1000` results per request.
- The official paging guidance says clients should page large action/card collections with `before` and `since` rather than assuming offset pagination.
- The paging guide notes the API accepts ISO 8601 timestamps for `before` / `since`, and that Trello can also derive dates from card or action IDs because the IDs are Mongo-style identifiers.
- Search routes also expose route-specific page/limit controls such as `cards_page`, `boards_limit`, `cards_limit`, `organizations_limit`, and `members_limit`.
- Nested-resource helpers are an official Trello pattern; examples in the docs include:
  - `GET /1/member/me/boards/?actions=all`
  - `GET /1/lists/{idList}/cards/{filter}`

## Rate limits
Confirmed from the official Rate Limits page:
- `300` requests per `10` seconds per API key
- `100` requests per `10` seconds per token
- `100` requests per `900` seconds for requests to `/1/members/`
- if an API key accumulates more than `200` `429` responses, Trello returns `429` for the remainder of that key’s requests in the current `10`-second window

Confirmed `429` error bodies:
```json
{
  "error": "API_TOKEN_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded"
}
```

```json
{
  "error": "API_KEY_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded"
}
```

Additional limit notes confirmed from the official docs:
- expensive database-heavy requests can trigger `API_TOKEN_DB_LIMIT_EXCEEDED`
- oversized responses can trigger `API_TOO_MANY_CARDS_REQUESTED`
- Trello calls out special limits for `/1/members`, `/1/membersSearch`, and `/1/search`
- nested routes such as `/1/members/me/boards/` do not count against the route-specific `/1/members/` limit

### Rate-limit response headers
The official Rate Limits page shows these response headers:
- `x-rate-limit-api-token-interval-ms`
- `x-rate-limit-api-token-max`
- `x-rate-limit-api-token-remaining`
- `x-rate-limit-api-key-interval-ms`
- `x-rate-limit-api-key-max`
- `x-rate-limit-api-key-remaining`

The published example values confirm:
- token interval: `10000` ms
- token max: `100`
- key interval: `10000` ms
- key max: `300`

## Status codes and error behavior
Confirmed from the official Status Codes guide:
- `200` — success
- `400` — bad request / missing or invalid fields
- `401` — unauthorized / invalid or missing credentials or insufficient permissions
- `403` — forbidden in the current case
- `404` — unknown route or missing model/nested resource
- `409` — conflict with current state
- `429` — too many requests
- `449` — sub-request failed
- `500` — internal server error
- `503` — service unavailable
- `504` — gateway timeout; the docs explicitly say Trello could not handle the `GET` request within `30s`

## Important usage notes
- Preserve Trello’s query-string auth model (`key` + `token`) when normalizing this provider; that is the first-party documented direct-call pattern.
- Treat Trello as a deeply nested API rather than a flat CRUD surface. Many core reads are designed to inline related resources through query parameters.
- Do not assume every write route uses JSON bodies. Trello still documents many `POST` and `PUT` calls as query-parameter mutations.
- For large board/card/action traversals, prefer `before` / `since` paging and nested resources over giant one-shot expansions.
- Prefer webhooks over polling when possible; the official docs explicitly position webhooks as the best way to avoid rate-limit pressure.
- Route-specific limits and response-size guards matter in practice, especially on `/search`, `/members`, and large board/card action expansions.
- Although Atlassian’s docs mention Forge and OAuth2 restrictions on some individual reference pages, the core public REST reference and OpenAPI definition reviewed here are still centered on classic Trello key/token access against `api.trello.com/1`.