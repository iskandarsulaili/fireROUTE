# OpenRegistry

## Provider metadata
- Category: `Government`
- Provider slug: `openregistry`
- Official docs/pages used:
  - `https://openregistry.sophymarine.com`
  - `https://openregistry.sophymarine.com/docs/jurisdictions/gb`
  - `https://openregistry.sophymarine.com/mcp`
- Current documented API host: `https://openregistry.sophymarine.com`
- Current documented API path prefix: `/mcp`
- Auth model: the legacy index row says `OAuth`, but the reviewed read-only MCP requests to `/mcp` completed anonymously and returned no `WWW-Authenticate` challenge; the official site still exposes `Sign in` and `Subscribe` flows, so paid entitlements may still affect usage tiers or higher-volume access
- Response format: MCP over HTTP using JSON-RPC 2.0; reviewed responses were JSON, and the endpoint explicitly required clients to accept both `application/json` and `text/event-stream`
- Rate limits: no provider-wide platform ceiling was published on the reviewed OpenRegistry landing page or live MCP metadata; the reviewed official GB jurisdiction page does publish an upstream warning that Companies House enforces `600 requests per 5 minutes per operator key`, surfacing `429` back to callers
- Manually confirmed route count: `1`

## Official usage notes
- The official product homepage positions OpenRegistry as an MCP server for live company-registry access across 27 national registries and links clients to `https://openregistry.sophymarine.com/mcp` for MCP installation.
- The reviewed official GB jurisdiction page documents country-specific company-id rules, status normalization, quirks, and supported tool coverage.
- A live anonymous `initialize` request to `/mcp` returned `protocolVersion: 2024-11-05`, `serverInfo.name: openregistry`, `serverInfo.title: OpenRegistry`, and `serverInfo.version: 0.2.0-workers`.
- A live anonymous `tools/list` request returned `10` currently registered tools on the MCP endpoint.
- The reviewed GB docs page advertises `12` GB tools, but the live MCP `tools/list` result omitted `get_financials`, `get_persons_with_significant_control`, `get_charges`, and `get_officer_appointments`. Live `tools/call` probes for `get_financials` and `get_officer_appointments` returned `Tool ... not found`, so fireROUTE should trust the live MCP tool inventory over the prose docs when they disagree.
- A live `tools/call` to `list_jurisdictions` with `jurisdiction: GB` returned Companies House-specific metadata including company-id examples, native-to-unified status mapping, supported tool list, and registry quirks.
- A live `tools/call` to `search_companies` with `jurisdiction: GB`, `query: Tesco`, and `limit: 2` returned active and dissolved company matches, confirming live public read access through the MCP surface.

## Canonical endpoint confirmed from the official site
1. `POST /mcp`
   - Base URL: `https://openregistry.sophymarine.com`
   - Purpose: single MCP transport endpoint for session initialization, tool discovery, prompt discovery, and tool execution
   - Required headers confirmed live:
     - `Content-Type: application/json`
     - `Accept: application/json, text/event-stream`
   - Request format: JSON-RPC 2.0 envelope with top-level `jsonrpc`, `id`, `method`, and optional `params`
   - JSON-RPC methods confirmed live on this route:
     - `initialize`
     - `tools/list`
     - `prompts/list`
     - `tools/call`
   - Live `tools/call` request shape:
     - `params.name` - tool name
     - `params.arguments` - tool-specific argument object
   - Live confirmation:
     - `initialize` succeeded anonymously and returned server metadata
     - `tools/list` returned the live tool inventory and JSON Schemas
     - `prompts/list` returned prompt metadata
     - `tools/call` succeeded for `list_jurisdictions` and `search_companies`

## Live MCP tools and parameters confirmed on `/mcp`
- `list_jurisdictions`
  - Parameters: `jurisdiction`, `supports_tool`
  - Purpose: country/tool capability matrix and per-jurisdiction metadata lookup
- `search_companies`
  - Parameters: `jurisdiction`, `jurisdictions`, `query`, `limit`, `offset`, `filters`, `fresh`
  - Purpose: company name/keyword search across one or more registries
- `search_officers`
  - Parameters: `jurisdiction`, `query`, `limit`
  - Purpose: cross-company officer/person search by name
- `get_company_profile`
  - Parameters: `jurisdiction`, `company_id`, `include`, `fresh`
  - Purpose: structured company profile lookup by registry id
- `list_filings`
  - Parameters: `jurisdiction`, `company_id`, `category`, `limit`, `offset`, `cursor`, `fresh`
  - Purpose: filing-history retrieval
- `get_shareholders`
  - Parameters: `jurisdiction`, `company_id`, `fresh`
  - Purpose: shareholders / members / quota-holders lookup
- `get_officers`
  - Parameters: `jurisdiction`, `company_id`, `include_resigned`, `group_by_person`, `fresh`
  - Purpose: company-officer roster retrieval
- `get_document_metadata`
  - Parameters: `jurisdiction`, `document_id`, `fresh`
  - Purpose: document metadata lookup by filing document id
- `fetch_document`
  - Parameters: `jurisdiction`, `document_id`, `format`, `max_bytes`, `fresh`, `company_id`, `transaction_id`, `filing_type`, `filing_description`
  - Purpose: retrieve filing/document content
- `get_document_navigation`
  - Parameters: `jurisdiction`, `document_id`, `fresh`, `company_id`, `transaction_id`
  - Purpose: navigation/index data for a cached filing document

## Pagination, filtering, and format notes
- The provider is not exposing a route-per-resource REST surface on the reviewed public docs; instead, tool-specific argument schemas are delivered by the MCP endpoint.
- `search_companies` officially supports pagination/filtering inputs `limit`, `offset`, and `filters`; the live schema caps `limit` between `1` and `250` and defaults it to `10`.
- `list_filings` officially supports `limit`, `offset`, and `cursor`, so filing-history pagination should be handled tool-side rather than by inventing separate HTTP paths.
- The `search_companies` tool description publishes multi-country plan caps per call: anonymous `3` jurisdictions, pro `10`, max `30`, and enterprise `unlimited`.
- The reviewed endpoint produced JSON responses, while the Accept contract also requires `text/event-stream`, indicating MCP streaming compatibility should be preserved in any adapter.

## Error, auth, and access notes
- A `POST /mcp` request sent with `Accept: application/json` only returned HTTP `406` and the JSON-RPC error message `Not Acceptable: Client must accept both application/json and text/event-stream`.
- Unknown tool names do not produce a separate HTTP 404 on the reviewed endpoint; instead, the server returned HTTP `200` with an MCP error payload such as `MCP error -32602: Tool get_financials not found`.
- No auth challenge was presented on the reviewed anonymous `initialize`, `tools/list`, `prompts/list`, `list_jurisdictions`, or `search_companies` calls.
- Because the homepage still exposes sign-in and subscription flows, treat anonymous access observed in this run as confirmed read access for the reviewed MCP methods, not as proof that every future operation or quota tier is completely unauthenticated.

## fireROUTE normalization notes
- Treat OpenRegistry as an MCP-native provider with one canonical transport route: `POST /mcp`.
- Do not invent REST-style path families from jurisdiction prose pages; the stable provider surface reviewed in this run is the live MCP tool inventory.
- Preserve JSON-RPC envelope handling and the dual-format Accept requirement.
- When the jurisdiction docs and the live `tools/list` inventory disagree, prefer the live `tools/list` inventory and record the mismatch as a provider caveat.