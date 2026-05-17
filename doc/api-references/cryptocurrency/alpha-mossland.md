# Alpha (Mossland)

Official pages manually reviewed:
- https://alpha.moss.land/developers
- https://alpha.moss.land/mcp
- https://github.com/MosslandOpenDevs/alpha-mcp (linked from the official developer page)

## Overview
Alpha by Mossland publishes a compact, public, no-auth developer page with an explicit endpoint summary. The provider exposes a mix of REST-style JSON endpoints, an MCP JSON-RPC server, and ancillary discovery feeds for LLM/search workflows.

Confirmed from the reviewed official docs:
- Base origin: `https://alpha.moss.land`
- Auth model: no auth required
- Transport/security notes shown on the developer page: free, HTTPS-only, `CORS *`, cite-friendly
- Manual route count confirmed in this pass: **10**

## Confirmed endpoints
| Method | Path | Notes |
|---|---|---|
| GET | `/api/health` | service health JSON |
| POST | `/api/ask` | RAG Q&A returning an answer plus citations |
| POST | `/api/mcp` | MCP JSON-RPC 2.0 server; developer page says 12 tools |
| GET | `/api/canonical/entities.json` | canonical entity catalog |
| GET | `/api/canonical/topics.json` | canonical topic catalog |
| GET | `/api/canonical/events.json` | canonical event catalog |
| GET | `/api/pulse` | active price/event pulse feed |
| GET | `/sitemap.xml` | full URL sitemap |
| GET | `/rss.xml` | recent update feed |
| GET | `/llms.txt` | LLM-oriented site map |

## Parameters and request notes
Confirmed from the developer page examples:
- `POST /api/ask` accepts JSON with at least a `query` field
- `POST /api/mcp` is documented as JSON-RPC 2.0 over streamable HTTP
- The canonical JSON endpoints return versioning and generation metadata such as `version`, `count`, and `generated_at`
- The `/api/pulse` endpoint is described as active pulses over the last 72 hours

## Authentication
- The official developer page explicitly says the public surfaces are free and no-auth
- No API key, bearer token, or session cookie is required on the reviewed public surfaces

## Rate limits and errors
- The developer page has a “Rate limits & fair use” section, but no concrete numeric quota was visible in the reviewed browser text
- A support contact (`contact@moss.land`) is linked for integration/fair-use questions

## Response format notes
- JSON is used for the API endpoints reviewed on the developer page
- `/api/mcp` uses JSON-RPC 2.0 semantics
- `/sitemap.xml` and `/rss.xml` are XML feeds rather than JSON APIs

## Important usage notes
- This is one of the clearest small-provider docs in the assigned set: the official page itself publishes the endpoint summary, auth status, and usage examples in one place
- The `/api/ask` output includes citations and may emit a `permanent_url` for SEO-visible answers when cached/accepted by the provider pipeline
- The provider is focused on Korean crypto/news/macro synthesis rather than exchange execution
