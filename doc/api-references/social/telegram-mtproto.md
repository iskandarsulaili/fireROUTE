# Telegram MTProto

## Manual review status
- Category: `Social`
- Provider slug: `telegram-mtproto`
- Official docs URL from index: `https://core.telegram.org/api#getting-started`
- Official pages manually inspected in this pass:
  - `https://core.telegram.org/api`
  - `https://core.telegram.org/methods`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## Blocker summary
- The official Telegram API landing page explicitly separates the HTTPS `Bot API` from the `Telegram API and TDLib` surface used to build full Telegram clients.
- The reviewed official MTProto documentation is protocol-oriented and method-oriented, not a fireROUTE-style HTTPS REST surface with one base URL plus path templates.
- The official methods index lists RPC names such as `help.getTermsOfServiceUpdate`, `help.getConfig`, `help.getNearestDc`, `account.reportPeer`, and `auth.logOut`; these are MTProto method identifiers, not HTTP endpoints.
- Because the reviewed official pages do not publish a conventional HTTP route catalog with path, verb, request schema, and JSON response envelopes, I could not confirm any fireROUTE-usable HTTP routes from official sources in this pass.

## Evidence from manual inspection
- `https://core.telegram.org/api` loaded with title `Telegram APIs` and visible text explaining that `Bot API` is the simple HTTPS interface, while `Telegram API and TDLib` are for building customized Telegram clients.
- The same landing page exposes Telegram API sections such as `Getting Started`, `Security`, `Optimization`, and `API methods`, which reinforces that the surface is documented as a client protocol rather than a REST endpoint set.
- `https://core.telegram.org/methods` loaded with title `Methods` and a large table of RPC names grouped by function, for example `help.getAppConfig`, `help.getConfig`, `help.getNearestDc`, `account.reportPeer`, `channels.reportSpam`, `messages.report`, and many more.
- The methods page presents names and descriptions of Telegram RPC methods, not HTTP method/path combinations.

## Authentication and authorization
- The reviewed official pages frame access around Telegram client development rather than OAuth-style bearer-token API usage.
- The landing page points developers toward the Telegram API/TDLib stack for custom clients and separately points bot developers toward the Bot API.
- No OAuth authorization endpoint, REST bearer-token contract, or fireROUTE-style header scheme was published on the reviewed MTProto pages in this pass.

## Endpoint inventory
- No fireROUTE-style HTTP endpoint inventory was manually confirmable from the reviewed official MTProto pages.
- The official documentation exposes MTProto method names and protocol documentation instead of a stable HTTPS base URL with path templates.
- Example officially listed RPC names observed in this pass include `help.getTermsOfServiceUpdate`, `help.getConfig`, `help.getNearestDc`, `account.reportPeer`, `channels.reportSpam`, `messages.report`, and `auth.logOut`, but these are protocol methods, not REST routes.

## Pagination
- No single global HTTP pagination contract was documented on the reviewed pages.
- Any pagination behavior for Telegram API clients is method-specific and protocol-specific rather than described as REST query parameters on an HTTP route list.

## Rate limits
- The reviewed MTProto pages in this pass did not expose a concise public numeric per-route rate-limit table suitable for fireROUTE route documentation.
- The official docs focus on client behavior, protocol methods, and platform rules rather than a simple REST quota sheet.

## Errors and format notes
- The reviewed official pages indicate a method/protocol-driven API surface rather than JSON REST endpoints.
- Request/response structure is documented through Telegram's API method and schema material, not as HTTP status-code tables tied to URL paths.

## fireROUTE note
- Treat Telegram MTProto as blocked for this HTTP-route documentation workflow.
- For ordinary HTTPS route documentation, use the separately documented `telegram-bot.md` provider instead of MTProto.
- Revisit this provider only if fireROUTE later gains a transport model for non-REST Telegram client protocols.
