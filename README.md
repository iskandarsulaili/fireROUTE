<div align="center">
  <h1>🔥 fireROUTE</h1>
  <p><strong>Unified API Gateway with Intelligent Circuit Breaking &amp; Automatic Failover</strong></p>
  <p>Route once. Never worry about downtime again.</p>

  <p>
    <img src="https://img.shields.io/badge/status-alpha-yellow" alt="Status: Alpha">
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="License: MIT">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen" alt="PRs Welcome">
  </p>

  <blockquote>
    ⚠️ <strong>Development Status:</strong> Initial development phase. Development will resume after reaching <strong>100 GitHub stars</strong>. Star us to accelerate!
  </blockquote>
</div>

---

## The Problem

Every modern application depends on third-party APIs. Weather data, financial feeds, AI models, mapping services, SMS gateways — the list is endless. But relying on external APIs introduces critical vulnerabilities:

- ❌ **Single points of failure** — One provider goes down, your app goes down.
- ❌ **Rate limits halt everything** — A 429 response cascades into user-facing errors.
- ❌ **Vendor lock-in** — Switching providers requires rewriting integration code.
- ❌ **No health intelligence** — Blindly hammering a failing server makes everything worse.
- ❌ **Scattered API management** — Different auth schemes, different response formats, different failure modes.

The result? Fragile applications, angry users, and late-night firefights.

---

## The Solution: fireROUTE

**fireROUTE** is a category-aware API routing gateway that wraps multiple third-party providers into a single, resilient endpoint. It automatically detects failures, routes around them, and keeps your application running — no matter what happens upstream.

### How It Works

Instead of calling API providers directly, you call fireROUTE:

```
Your App → POST /v1/execute { category: "weather", path: "/current.json" }
                ↓
         fireROUTE routes to the healthiest provider
                ↓
         If provider fails → automatic failover → next provider
                ↓
         Standardized response with full routing metadata
```

### Key Capabilities

| Capability | What It Solves |
|------------|---------------|
| **Category-Centric Routing** | Group providers by function (weather, finance, AI, etc.) — consumers just pick a category |
| **Intelligent Circuit Breaker** | Tracks provider health per-provider within categories. Automatically stops traffic to failing providers before they degrade your system |
| **Automatic Fallback** | When a provider returns 429 (rate limited) or 5xx, fireROUTE silently tries the next provider in the category |
| **Canary Probing** | Periodically probes degraded providers to detect recovery — no manual intervention needed |
| **Unified Response Envelope** | Every response carries `router_metadata` with requestId, provider info, latency, and circuit breaker status for full observability |
| **Adapter Pattern** | Each category has a pluggable adapter that normalizes provider-specific formats into a consistent output |

### The Result

✅ **Resilience by default** — Your app survives provider outages  
✅ **No more vendor lock-in** — Add, remove, or swap providers without code changes  
✅ **Self-healing infrastructure** — Circuit breakers and canary probes manage health automatically  
✅ **Full observability** — Every request logs its routing path, provider decisions, and latency  
✅ **MCP-Ready** — Each category maps to an MCP tool definition for AI/agent integration  

---

## Quick Start

```bash
# Prerequisites: Node.js 22+, npm
git clone https://github.com/your-org/fireROUTE.git
cd fireROUTE
npm install
npx prisma db push
npm run dev
```

```bash
# Try it
curl -X POST http://localhost:3000/v1/execute \
  -H "Content-Type: application/json" \
  -d '{"category": "weather", "path": "/current.json", "params": {"q": "London"}}'
```

```json
{
  "success": true,
  "data": { "temperature": 22.5, "condition": "Sunny", ... },
  "router_metadata": {
    "requestId": "abc-123",
    "category": "weather",
    "primaryProvider": "WeatherAPI",
    "fallbackProvider": null,
    "totalLatencyMs": 145,
    "circuitBreakerStatus": "HEALTHY",
    ...
  }
}
```

---

## Architecture at a Glance

```
┌─────────────┐     POST /v1/execute
│   Client    │─────────────────────────►┌──────────────────────┐
│  (App/CLI)  │                          │     fireROUTE        │
└─────────────┘◄─────────────────────────│  Fastify HTTP Server  │
         │          Response              │                      │
         │                               ├──────────────────────┤
         │                               │  Category Router     │
         │                               ├──────────────────────┤
         │                               │  Circuit Breaker     │
         │                               ├──────────────────────┤
         │                               │  Fallback Executor   │
         │                               ├──────────────────────┤
         │                               │  Category Adapters   │
         │                               │  (Weather, Finance…) │
         │                               └──────────────────────┘
         │                                        │
         │                 ┌──────────────────────┼──────────────────────┐
         │                 ▼                      ▼                      ▼
         │         ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
         │         │  Provider A  │      │  Provider B  │      │  Provider C  │
         │         │  (Primary)   │      │  (Fallback)  │      │  (Fallback)  │
         │         └──────────────┘      └──────────────┘      └──────────────┘
```

---

## Inspired By

fireROUTE stands on the shoulders of great open-source projects:

- **[9router](https://github.com/decolua/9router)** — For the foundational routing concepts and multi-provider awareness that shaped our category-centric design.
- **[OmniRoute](https://github.com/diegosouzapw/OmniRoute)** — For the comprehensive provider ecosystem and SSE execution patterns that informed our adapter architecture.
- **[public-apis](https://github.com/public-apis/public-apis)** — Our API category taxonomy is based on this definitive community-maintained directory of public APIs. We follow the same organizational structure to make provider discovery intuitive.

---

## Test Suite

```bash
npm test          # Run all tests
npm run test:watch  # Watch mode
```

✅ **32 passing tests** across 5 integration test suites covering:

| Suite | Tests | What It Validates |
|-------|-------|-------------------|
| v1-execute | 8 | Valid requests, invalid inputs, 429 fallback, all-providers-fail |
| health | 4 | Health endpoint, DB connectivity, version info |
| categories | 4 | Category listing, MCP tool definitions, single category |
| circuit-breaker | 11 | State machine, transitions, canary probes, events, resets |
| schema-contracts | 5 | Response shape enforcement per PRD §4 |

---

## Project Status

| Aspect | Status |
|--------|--------|
| Core Routing | ✅ Complete |
| Circuit Breaker | ✅ Complete |
| Weather Adapter | ✅ Complete |
| Integration Tests | ✅ Complete (32 tests) |
| Additional Adapters | 🔄 After 100 stars |
| Production Hardening | 🔄 After 100 stars |
| Documentation Expansion | 🔄 After 100 stars |

> **⭐ Star this repository to accelerate development!**  
> Every star brings us closer to resuming active development. At **100 stars**, we'll kick off the next phase: additional category adapters, production hardening, and expanded documentation.

---

## License

MIT © fireROUTE Contributors
