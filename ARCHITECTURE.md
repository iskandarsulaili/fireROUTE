# fireROUTE Architecture

This document defines the implementation architecture for fireROUTE as a Fastify-based unified API router organized around **functional provider categories**. The primary routing surface is the category, not the individual upstream provider.

The architecture intentionally preserves the useful resilience and normalization ideas from the earlier design, while refining the core model to match the approved direction:

- provider organization is category-first, aligned to [`fireROUTE/doc/api-references/README.md`](fireROUTE/doc/api-references/README.md)
- category slugs come from the directory structure under [`fireROUTE/doc/api-references/`](fireROUTE/doc/api-references/README.md)
- consumers select a functional category such as `weather`, `finance`, or `music`
- fallback happens across providers **within the selected category**
- circuit breaker health is tracked per provider within the category
- adapters are category-aware and normalize provider-native payloads into category-standardized outputs
- MCP alignment is structural: each category maps 1:1 to a future MCP tool
- persistence is Prisma + SQLite
- upstream dispatch uses explicit pooled HTTP clients with a hard `3000ms` default timeout unless category config overrides it

---

## 1. System Overview

### 1.1 Primary responsibilities

fireROUTE exposes a single canonical endpoint, `POST /v1/execute`, that:

1. validates a canonical request with Fastify + Ajv
2. resolves the requested `category` into a category route
3. optionally honors a `provider` override for advanced callers when the provider belongs to the selected category
4. selects eligible providers in category fallback order
5. enforces per-provider circuit-breaker and cooldown rules
6. adapts the canonical request into provider-native HTTP requests through the category adapter
7. dispatches upstream calls through pooled clients with a default `3000ms` timeout
8. transforms heterogeneous provider payloads into a single category-standardized response envelope
9. records request, attempt, category, provider, breaker, and rate-limit metadata in SQLite

### 1.2 Category inventory source of truth

Category names must align with the generated documentation folders listed in [`fireROUTE/doc/api-references/README.md`](fireROUTE/doc/api-references/README.md:9). Example category directories already present include:

- `weather` from [`fireROUTE/doc/api-references/weather/README.md`](fireROUTE/doc/api-references/weather/README.md)
- `finance` from [`fireROUTE/doc/api-references/finance/README.md`](fireROUTE/doc/api-references/finance/README.md)
- `music` from [`fireROUTE/doc/api-references/music/README.md`](fireROUTE/doc/api-references/music/README.md)
- `news` from [`fireROUTE/doc/api-references/news/README.md`](fireROUTE/doc/api-references/news/README.md)
- `geocoding` from [`fireROUTE/doc/api-references/geocoding/README.md`](fireROUTE/doc/api-references/geocoding/README.md)
- `transportation` from [`fireROUTE/doc/api-references/transportation/README.md`](fireROUTE/doc/api-references/transportation/README.md)

These folders are evidence of what category slugs exist and should drive the initial `ProviderCategory` inventory.

### 1.3 High-level component diagram

```text
┌─────────────────────────────────────────────────────────────────────┐
│                           Client Applications                      │
└───────────────────────────────┬─────────────────────────────────────┘
                                │ POST /v1/execute { category, ... }
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       Fastify API Server                           │
│  - Ajv validation                                                  │
│  - request context + request id                                    │
│  - error normalization                                             │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         Category Router                            │
│  - category resolution                                             │
│  - provider override validation                                    │
│  - category fallback config loading                                │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    Category Fallback Executor                      │
│  - ordered provider chain within category                          │
│  - failover continuation                                            │
│  - router metadata builder                                         │
└───────────────┬──────────────────────┬──────────────────────────────┘
                │                      │
                ▼                      ▼
┌──────────────────────────┐   ┌──────────────────────────────────────┐
│   Circuit Breaker        │   │      Category Adapter Layer         │
│  - per-provider health   │   │  - category input normalization      │
│  - cooldown gating       │   │  - provider-specific transforms      │
│  - canary leasing        │   │  - category-standardized output      │
└───────────────┬──────────┘   └──────────────────┬───────────────────┘
                │                                 │
                └──────────────┬──────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Upstream Dispatch Layer                        │
│  - undici Pool per origin                                          │
│  - timeout + abort                                                 │
│  - header capture                                                  │
│  - status and quota parsing                                        │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
      ┌─────────────────────────┼─────────────────────────┐
      ▼                         ▼                         ▼
┌───────────────┐      ┌───────────────┐         ┌───────────────┐
│ WeatherAPI    │      │ OpenWeather   │         │ AviationWx    │
│ category:     │      │ category:     │         │ category:     │
│ weather       │      │ weather       │         │ weather       │
└───────────────┘      └───────────────┘         └───────────────┘

                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Prisma + SQLite Persistence                    │
│  categories | category fallback configs | provider connections     │
│  provider health | request logs | attempt logs | rate-limit state  │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.4 End-to-end data flow

1. Client sends canonical request to `/v1/execute` with a required `category`.
2. Fastify validates the envelope and attaches `request_id`.
3. `CategoryRouter` loads the category definition and category fallback configuration.
4. If `provider` override is present, the router verifies that the provider belongs to the selected category and is enabled.
5. `CircuitBreakerService` filters category providers by health status and cooldown rules.
6. `CategoryFallbackExecutor` builds the ordered execution plan for the category.
7. For each candidate provider inside the category:
   - `CategoryAdapter` maps canonical category input into provider-native path, query, headers, and body
   - `UpstreamDispatcher` sends request with `AbortSignal.timeout(timeoutMs)`
   - `ResponseClassifier` marks the result as success, transient failure, or terminal failure
   - `CircuitBreakerService` updates the provider health state for that category member
   - `RateLimitParser` captures `retry-after` and rate-limit reset headers
8. On first valid category-standardized success, the adapter emits canonical `data` wrapped in the common `router_metadata` envelope.
9. If all providers in the category fail, the router returns a `503` error envelope with `router_metadata` indicating category-wide outage.
10. `RequestLog` and `AttemptLog` rows are committed for observability and later tuning.

---

## 2. Directory Structure

The implementation should be created with the following structure.

```text
fireROUTE/
├── ARCHITECTURE.md                     # This document
├── package.json                        # Runtime, scripts, dependency manifest
├── tsconfig.json                       # TypeScript compiler settings
├── eslint.config.mjs                   # Lint configuration
├── .env.example                        # Required environment variables
├── prisma/
│   ├── schema.prisma                   # Full SQLite data model
│   ├── migrations/                     # Prisma migrations
│   └── seed.ts                         # Seed categories, providers, canonical operations
├── src/
│   ├── app.ts                          # Fastify app factory
│   ├── server.ts                       # Process bootstrap and graceful shutdown
│   ├── config/
│   │   ├── env.ts                      # Environment parsing and typed config
│   │   ├── constants.ts                # Global constants and defaults
│   │   └── logger.ts                   # Pino logger setup
│   ├── plugins/
│   │   ├── ajv.ts                      # Ajv compiler, custom formats, serializer setup
│   │   ├── prisma.ts                   # Prisma client lifecycle plugin
│   │   ├── http-client.ts              # Undici pool registry plugin
│   │   ├── request-context.ts          # Request-scoped ids and timing metadata
│   │   └── error-handler.ts            # Fastify error normalization
│   ├── routes/
│   │   ├── execute.ts                  # POST /v1/execute
│   │   └── health.ts                   # /health/live and /health/ready
│   ├── schemas/
│   │   ├── execute.schema.ts           # Ajv request schema
│   │   ├── response.schema.ts          # Ajv response envelope schema
│   │   └── router-metadata.schema.ts   # Contract schema for router_metadata
│   ├── domain/
│   │   ├── errors.ts                   # Canonical router error codes
│   │   ├── types.ts                    # Cross-module domain types
│   │   └── value-objects.ts            # Small immutable helpers
│   ├── categories/
│   │   ├── weather/
│   │   │   ├── adapter.ts              # Weather category adapter entrypoint
│   │   │   ├── input-schema.ts         # Weather canonical input schema helpers
│   │   │   ├── output-schema.ts        # Weather canonical output schema helpers
│   │   │   └── providers/              # Weather provider-specific transforms
│   │   ├── finance/
│   │   │   ├── adapter.ts              # Finance category adapter entrypoint
│   │   │   ├── input-schema.ts         # Finance canonical input schema helpers
│   │   │   ├── output-schema.ts        # Finance canonical output schema helpers
│   │   │   └── providers/              # Finance provider-specific transforms
│   │   ├── music/
│   │   │   ├── adapter.ts              # Music category adapter entrypoint
│   │   │   ├── input-schema.ts         # Music canonical input schema helpers
│   │   │   ├── output-schema.ts        # Music canonical output schema helpers
│   │   │   └── providers/              # Music provider-specific transforms
│   │   └── shared/
│   │       ├── category-adapter.ts     # Shared category adapter base contracts
│   │       └── envelope.ts             # Shared category output envelope helpers
│   ├── modules/
│   │   ├── execute/
│   │   │   ├── execute-service.ts      # Top-level orchestration service
│   │   │   ├── category-router.ts      # Category resolution and guardrails
│   │   │   ├── router-metadata.ts      # Metadata builder
│   │   │   └── response-envelope.ts    # Final success/error envelope builder
│   │   ├── category/
│   │   │   ├── category-service.ts     # Category loading and validation
│   │   │   ├── category-route-resolver.ts # Loads category route and providers
│   │   │   └── category-fallback-config.ts # Effective fallback policy resolution
│   │   ├── breaker/
│   │   │   ├── circuit-breaker-service.ts # Per-provider state transitions
│   │   │   ├── failure-classifier.ts   # Maps upstream outcomes to failure classes
│   │   │   └── canary-policy.ts        # Cooldown expiry and canary leasing
│   │   ├── adapter/
│   │   │   ├── adapter-registry.ts     # Loads category adapters and provider mappings
│   │   │   ├── request-adapter.ts      # Canonical -> provider-native mapping
│   │   │   ├── response-adapter.ts     # Provider-native -> category-standardized mapping
│   │   │   ├── transform-engine.ts     # JSON-path extraction + transforms
│   │   │   └── stream-normalizer.ts    # SSE and chunked response normalization
│   │   ├── upstream/
│   │   │   ├── dispatcher.ts           # Pooled fetch wrapper with timeout
│   │   │   ├── rate-limit-parser.ts    # Header parsing and quota snapshots
│   │   │   └── response-classifier.ts  # Success/failover/exhaustion decisioning
│   │   ├── providers/
│   │   │   ├── provider-service.ts     # Provider loading and eligibility
│   │   │   └── credential-service.ts   # Secret resolution and auth materialization
│   │   └── persistence/
│   │       ├── category-repository.ts  # Category + fallback persistence
│   │       ├── provider-repository.ts  # Provider + health persistence
│   │       ├── request-log-repository.ts # Request and attempt logging
│   │       └── rate-limit-repository.ts # Snapshot upserts
│   └── utils/
│       ├── clock.ts                    # Time abstraction for tests
│       ├── hash.ts                     # Request hash and deterministic ids
│       └── redact.ts                   # Sensitive field redaction
├── tests/
│   ├── unit/
│   │   ├── breaker/                    # State-machine tests
│   │   ├── adapter/                    # Mapping compiler and transform tests
│   │   ├── category/                   # Category route resolution tests
│   │   └── upstream/                   # Header parsing and classifier tests
│   ├── integration/
│   │   ├── sandbox/
│   │   │   ├── fake-provider-server.ts # Real local HTTP upstream simulator
│   │   │   └── scenarios.ts            # 429, timeout, malformed payload scenarios
│   │   ├── execute-category-routing.test.ts # End-to-end category routing behavior
│   │   ├── category-fallback.test.ts   # In-category failover behavior
│   │   ├── circuit-recovery.test.ts    # Cooldown and canary recovery
│   │   └── sqlite-persistence.test.ts  # Prisma persistence with isolated SQLite database
│   └── contract/
│       ├── router-metadata.contract.test.ts # Envelope contract assertions
│       └── execute-response.contract.test.ts # Category-standardized response assertions
└── scripts/
    ├── dev.ts                          # Local dev bootstrap
    ├── test.ts                         # Unified test runner entry
    └── seed.ts                         # Seed wrapper
```

### 2.1 Module ownership rules

- `routes/` must stay thin and delegate immediately to services.
- `modules/execute/` owns orchestration only; it must not embed category-specific or provider-specific mapping logic.
- `categories/` owns category semantics and provider-specific request/response transformations for that category.
- `modules/adapter/` owns shared translation mechanics only; it must not make persistence decisions.
- `modules/breaker/` owns per-provider state transitions only; it must not know category payload semantics.
- `modules/persistence/` owns Prisma access; no other module writes directly to Prisma.

---

## 3. Type System

The following interfaces are the implementation contracts between modules.

### 3.1 Canonical request and response types

```ts
export type ResponseMode = "canonical" | "raw" | "both" | "stream";

export interface ExecuteRequest {
  category: ProviderCategory;
  provider?: string;
  operation: string;
  input: Record<string, unknown>;
  options?: ExecuteOptions;
  context?: ExecuteContext;
}

export interface ExecuteOptions {
  response_mode?: ResponseMode;
  max_attempts?: number;
  timeout_ms?: number;
  allow_degraded?: boolean;
  include_attempt_headers?: boolean;
}

export interface ExecuteContext {
  request_id?: string;
  idempotency_key?: string;
  tenant_key?: string;
  traceparent?: string;
}

export interface ExecuteResponse<TData = unknown> {
  ok: boolean;
  data: TData | null;
  error: RouterError | null;
  router_metadata: RouterMetadata;
}

export interface RouterError {
  code:
    | "CANONICAL_VALIDATION_FAILED"
    | "CATEGORY_NOT_FOUND"
    | "PROVIDER_NOT_IN_CATEGORY"
    | "OPERATION_NOT_FOUND"
    | "NO_HEALTHY_PROVIDER_IN_CATEGORY"
    | "CATEGORY_OUTAGE"
    | "UPSTREAM_EXHAUSTED"
    | "UPSTREAM_TIMEOUT"
    | "UPSTREAM_RATE_LIMITED"
    | "UPSTREAM_AUTH_FAILED"
    | "UPSTREAM_CONTRACT_FAILED"
    | "INTERNAL_ROUTER_ERROR";
  message: string;
  retryable: boolean;
  details?: Record<string, unknown>;
}
```

### 3.2 Router metadata contract

```ts
export interface RouterMetadata {
  request_id: string;
  category: ProviderCategory;
  provider_override: string | null;
  operation: string;
  response_mode: ResponseMode;
  canonical_schema_version: string;
  selected_provider: string | null;
  selected_provider_operation: string | null;
  total_attempts: number;
  success: boolean;
  total_latency_ms: number;
  timeout_ms: number;
  failover_reason: FailureClass | null;
  category_outage: boolean;
  attempts: AttemptMetadata[];
}

export interface AttemptMetadata {
  attempt_index: number;
  category: ProviderCategory;
  provider: string;
  provider_operation: string;
  health_status_before: ProviderHealthStatus;
  health_status_after: ProviderHealthStatus;
  circuit_state_before: ProviderState;
  circuit_state_after: ProviderState;
  canary: boolean;
  outcome: AttemptOutcome;
  failure_class: FailureClass | null;
  upstream_status_code: number | null;
  latency_ms: number;
  cooldown_until: string | null;
  rate_limit_reset_at: string | null;
}
```

### 3.3 Category and execution planning types

```ts
export enum ProviderCategory {
  WEATHER = "weather",
  FINANCE = "finance",
  MUSIC = "music",
  NEWS = "news",
  GEOCODING = "geocoding",
  TRANSPORTATION = "transportation"
}

export interface CanonicalOperationDefinition {
  id: string;
  slug: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  canonical_schema_version: string;
  input_schema: Record<string, unknown>;
  output_schema: Record<string, unknown>;
  stream_supported: boolean;
}

export interface CategoryDefinition {
  id: string;
  slug: ProviderCategory;
  name: string;
  description?: string;
  enabled: boolean;
}

export interface CategoryRoute {
  id: string;
  category: CategoryDefinition;
  operation: CanonicalOperationDefinition;
  input_schema: Record<string, unknown>;
  output_schema: Record<string, unknown>;
  default_response_mode: ResponseMode;
  providers: CategoryProviderRouteMember[];
}

export interface CategoryProviderRouteMember {
  id: string;
  category: ProviderCategory;
  priority: number;
  weight: number;
  enabled: boolean;
  allow_canary: boolean;
  skip_when_rate_limited: boolean;
  provider: ProviderConnectionDefinition;
  provider_operation: ProviderOperationDefinition;
}

export interface FallbackChain {
  category: ProviderCategory;
  operation: string;
  providers: CategoryProviderRouteMember[];
}

export interface ComboGroup {
  id: string;
  category: ProviderCategory;
  operation: string;
  providers: string[];
}

export interface ExecutionPlan {
  request_id: string;
  category_route: CategoryRoute;
  fallback_chain: FallbackChain;
  response_mode: ResponseMode;
  candidates: PlannedCandidate[];
}

export interface PlannedCandidate {
  order: number;
  member: CategoryProviderRouteMember;
  state: ProviderState;
  health_status: ProviderHealthStatus;
  eligible: boolean;
  canary: boolean;
  skip_reason?: string;
}
```

### 3.4 Provider, breaker, adapter, and upstream types

```ts
export type ProviderState = "CLOSED" | "HALF_OPEN" | "DEGRADED" | "DEAD";

export type ProviderHealthStatus = "HEALTHY" | "DEGRADED" | "DEAD";

export type FailureClass =
  | "TIMEOUT"
  | "NETWORK"
  | "RATE_LIMIT"
  | "AUTH"
  | "CLIENT_ERROR"
  | "SERVER_ERROR"
  | "CONTRACT"
  | "EMPTY_RESPONSE"
  | "UNKNOWN";

export type AttemptOutcome =
  | "SUCCESS"
  | "FAILOVER"
  | "SKIPPED"
  | "CIRCUIT_BYPASSED"
  | "EXHAUSTED";

export interface ProviderConnectionDefinition {
  id: string;
  slug: string;
  display_name: string;
  category: ProviderCategory;
  base_url: string;
  auth_type: AuthType;
  request_timeout_ms: number;
  enabled: boolean;
  health_status: ProviderHealthStatus;
  circuit_state: ProviderState;
  consecutive_error_count: number;
  cooldown_until: string | null;
  canary_lease_until: string | null;
  last_failure_class: FailureClass | null;
  last_status_code: number | null;
  metadata?: Record<string, unknown>;
}

export type AuthType =
  | "NONE"
  | "API_KEY_HEADER"
  | "API_KEY_QUERY"
  | "BEARER"
  | "BASIC"
  | "CUSTOM";

export interface ProviderOperationDefinition {
  id: string;
  provider_id: string;
  category: ProviderCategory;
  operation_id: string;
  upstream_method: string;
  upstream_path_template: string;
  request_mapping: RequestMappingDefinition;
  response_mapping: ResponseMappingDefinition;
  stream_mapping?: StreamMappingDefinition | null;
  failure_classifier?: FailureClassifierDefinition | null;
  success_status_codes: number[];
  enabled: boolean;
}

export interface CategoryAdapter {
  category: ProviderCategory;
  input_schema: Record<string, unknown>;
  output_schema: Record<string, unknown>;
  buildRequest(input: CategoryAdapterRequest): UpstreamDispatchRequest;
  normalizeResponse(response: CategoryAdapterResponse): CategoryNormalizedResult;
}

export interface CategoryAdapterRequest {
  category: ProviderCategory;
  provider: ProviderConnectionDefinition;
  operation: CanonicalOperationDefinition;
  input: Record<string, unknown>;
  context?: ExecuteContext;
}

export interface CategoryAdapterResponse {
  category: ProviderCategory;
  provider: ProviderConnectionDefinition;
  operation: CanonicalOperationDefinition;
  upstream: UpstreamDispatchResponse;
}

export interface CategoryNormalizedResult<TData = unknown> {
  category: ProviderCategory;
  provider: string;
  data: TData;
  raw?: unknown;
}

export interface MCPToolDefinition {
  category: ProviderCategory;
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  outputSchema: Record<string, unknown>;
}

export interface UpstreamDispatchRequest {
  url: string;
  method: string;
  headers: Record<string, string>;
  query?: URLSearchParams;
  body?: string | Buffer | null;
  timeout_ms: number;
}

export interface UpstreamDispatchResponse {
  status: number;
  headers: Record<string, string>;
  body_text: string;
  duration_ms: number;
}

export interface ClassifiedUpstreamResult {
  success: boolean;
  failover: boolean;
  failure_class: FailureClass | null;
  upstream_status_code: number | null;
  retry_after_seconds: number | null;
  rate_limit_reset_at: string | null;
  message?: string;
}
```

### 3.5 Adapter contracts

```ts
export interface RequestMappingDefinition {
  path_params: FieldMapping[];
  query_params: FieldMapping[];
  headers: FieldMapping[];
  body?: BodyTemplateDefinition | null;
}

export interface ResponseMappingDefinition {
  success_path?: string | null;
  error_path?: string | null;
  fields: FieldMapping[];
  list_path?: string | null;
  object_mode: "object" | "array";
}

export interface StreamMappingDefinition {
  protocol: "sse" | "ndjson" | "chunked-json";
  events: StreamEventDefinition[];
  done_signal?: string | null;
}

export interface StreamEventDefinition {
  event_name: string;
  data_path?: string | null;
  type: "delta" | "snapshot" | "done" | "error";
}

export interface FieldMapping {
  source_path: string;
  target_path: string;
  required?: boolean;
  default_value?: unknown;
  transforms?: TransformDefinition[];
}

export interface TransformDefinition {
  type:
    | "string"
    | "number"
    | "boolean"
    | "date-iso"
    | "trim"
    | "join"
    | "split"
    | "coalesce"
    | "map-enum";
  args?: Record<string, unknown>;
}

export interface BodyTemplateDefinition {
  mode: "json" | "form" | "raw";
  template: Record<string, unknown>;
}

export interface FailureClassifierDefinition {
  failover_statuses: number[];
  dead_statuses: number[];
  transient_classes: FailureClass[];
}
```

### 3.6 Persistence-facing contracts

```ts
export interface BreakerTransitionInput {
  category: ProviderCategory;
  provider_id: string;
  previous_state: ProviderState;
  previous_health_status: ProviderHealthStatus;
  outcome: ClassifiedUpstreamResult;
  observed_at: string;
}

export interface BreakerTransitionResult {
  state_before: ProviderState;
  state_after: ProviderState;
  health_status_before: ProviderHealthStatus;
  health_status_after: ProviderHealthStatus;
  cooldown_until: string | null;
  consecutive_error_count: number;
  should_log_event: boolean;
}

export interface RateLimitSnapshotInput {
  category: ProviderCategory;
  provider_id: string;
  scope: string;
  limit: number | null;
  remaining: number | null;
  reset_at: string | null;
  retry_after_seconds: number | null;
  header_snapshot: Record<string, string>;
}
```

### 3.7 Non-negotiable response envelope rule

Regardless of provider shape or category semantics, the final response must always be:

```json
{
  "ok": true,
  "data": {},
  "error": null,
  "router_metadata": {}
}
```

or

```json
{
  "ok": false,
  "data": null,
  "error": {},
  "router_metadata": {}
}
```

`router_metadata` is mandatory in both success and failure cases and wraps every category-standardized payload uniformly.

---

## 4. Prisma Schema

The database schema below is the authoritative persistence design.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model ProviderCategory {
  id          String                   @id @default(uuid())
  slug        String                   @unique
  name        String
  description String?
  createdAt   DateTime                 @default(now())
  updatedAt   DateTime                 @updatedAt

  providers   ProviderConnection[]
  routes      CategoryRouteRecord[]
  fallbackConfigs CategoryFallbackConfig[]
}

model ProviderConnection {
  id                    String                 @id @default(uuid())
  categoryId            String
  slug                  String                 @unique
  displayName           String
  baseUrl               String
  authType              String
  authConfig            Json?
  enabled               Boolean                @default(true)
  requestTimeoutMs      Int                    @default(3000)
  circuitState          String                 @default("CLOSED")
  healthStatus          String                 @default("HEALTHY")
  consecutiveErrorCount Int                    @default(0)
  consecutiveSuccessCount Int                  @default(0)
  failureThreshold      Int                    @default(3)
  cooldownUntil         DateTime?
  canaryLeaseUntil      DateTime?
  lastFailureClass      String?
  lastStatusCode        Int?
  lastErrorMessage      String?
  lastErrorAt           DateTime?
  lastSuccessAt         DateTime?
  lastCanaryAt          DateTime?
  lastStateChangedAt    DateTime               @default(now())
  stateVersion          Int                    @default(0)
  metadata              Json?
  createdAt             DateTime               @default(now())
  updatedAt             DateTime               @updatedAt

  category              ProviderCategory       @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  credentials           ProviderCredential[]
  operations            ProviderOperation[]
  rateLimitSnapshots    RateLimitSnapshot[]
  circuitEvents         CircuitEvent[]
  attempts              AttemptLog[]
  successfulRequests    RequestLog[]           @relation("SuccessfulProvider")

  @@index([categoryId, enabled, healthStatus])
  @@index([enabled, circuitState, cooldownUntil])
}

model ProviderCredential {
  id               String             @id @default(uuid())
  providerId       String
  label            String
  secretCiphertext String
  secretVersion    Int                @default(1)
  headerName       String?
  queryParamName   String?
  active           Boolean            @default(true)
  metadata         Json?
  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt

  provider         ProviderConnection @relation(fields: [providerId], references: [id], onDelete: Cascade)

  @@unique([providerId, label])
  @@index([providerId, active])
}

model CanonicalOperation {
  id                     String                 @id @default(uuid())
  slug                   String                 @unique
  name                   String
  method                 String
  canonicalSchemaVersion String
  inputSchema            Json
  outputSchema           Json
  streamSupported        Boolean                @default(false)
  enabled                Boolean                @default(true)
  metadata               Json?
  createdAt              DateTime               @default(now())
  updatedAt              DateTime               @updatedAt

  categoryRoutes         CategoryRouteRecord[]
  providerOperations     ProviderOperation[]
  requests               RequestLog[]
}

model CategoryRouteRecord {
  id                  String                 @id @default(uuid())
  categoryId          String
  operationId         String
  enabled             Boolean                @default(true)
  defaultResponseMode ResponseModeRecord     @default(canonical)
  inputSchema         Json
  outputSchema        Json
  metadata            Json?
  createdAt           DateTime               @default(now())
  updatedAt           DateTime               @updatedAt

  category            ProviderCategory       @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  operation           CanonicalOperation     @relation(fields: [operationId], references: [id], onDelete: Cascade)
  members             CategoryRouteMember[]
  requests            RequestLog[]

  @@unique([categoryId, operationId])
  @@index([categoryId, enabled])
}

model CategoryFallbackConfig {
  id           String             @id @default(uuid())
  categoryId   String
  strategy     String
  maxRetries   Int                @default(2)
  retryDelayMs Int                @default(250)
  timeoutMs    Int                @default(3000)
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt

  category     ProviderCategory   @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([categoryId])
}

model ProviderOperation {
  id                   String               @id @default(uuid())
  providerId           String
  operationId          String
  upstreamMethod       String
  upstreamPathTemplate String
  requestMapping       Json
  responseMapping      Json
  streamMapping        Json?
  failureClassifier    Json?
  successStatusCodes   Json
  enabled              Boolean              @default(true)
  metadata             Json?
  createdAt            DateTime             @default(now())
  updatedAt            DateTime             @updatedAt

  provider             ProviderConnection   @relation(fields: [providerId], references: [id], onDelete: Cascade)
  operation            CanonicalOperation   @relation(fields: [operationId], references: [id], onDelete: Cascade)
  routeMembers         CategoryRouteMember[]
  attempts             AttemptLog[]

  @@unique([providerId, operationId])
  @@index([providerId, enabled])
}

model CategoryRouteMember {
  id                  String               @id @default(uuid())
  categoryRouteId     String
  providerOperationId String
  priority            Int
  weight              Int                  @default(100)
  enabled             Boolean              @default(true)
  allowCanary         Boolean              @default(true)
  skipWhenRateLimited Boolean              @default(true)
  metadata            Json?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt

  categoryRoute       CategoryRouteRecord  @relation(fields: [categoryRouteId], references: [id], onDelete: Cascade)
  providerOperation   ProviderOperation    @relation(fields: [providerOperationId], references: [id], onDelete: Cascade)

  @@unique([categoryRouteId, providerOperationId])
  @@index([categoryRouteId, enabled, priority])
}

model RateLimitSnapshot {
  id                String             @id @default(uuid())
  providerId        String
  scope             String             @default("default")
  limit             Int?
  remaining         Int?
  resetAt           DateTime?
  retryAfterSeconds Int?
  headerSnapshot    Json
  observedAt        DateTime           @default(now())

  provider          ProviderConnection @relation(fields: [providerId], references: [id], onDelete: Cascade)

  @@index([providerId, observedAt])
  @@index([providerId, scope])
}

model CircuitEvent {
  id               String             @id @default(uuid())
  providerId       String
  categoryId       String
  fromState        String
  toState          String
  fromHealthStatus String
  toHealthStatus   String
  failureClass     String?
  statusCode       Int?
  reason           String
  canary           Boolean            @default(false)
  cooldownUntil    DateTime?
  observedAt       DateTime           @default(now())

  provider         ProviderConnection @relation(fields: [providerId], references: [id], onDelete: Cascade)
  category         ProviderCategory   @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([providerId, observedAt])
  @@index([categoryId, observedAt])
}

model RequestLog {
  id                   String               @id @default(uuid())
  requestId            String               @unique
  categoryId           String?
  categoryRouteId      String?
  operationId          String?
  providerOverride     String?
  responseMode         ResponseModeRecord
  requestHash          String?
  clientIp             String?
  success              Boolean
  httpStatus           Int
  totalLatencyMs       Int
  successfulProviderId String?
  failureCode          String?
  errorMessage         String?
  inputPayload         Json
  outputEnvelope       Json?
  routerMetadata       Json
  createdAt            DateTime             @default(now())

  category             ProviderCategory?    @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  categoryRoute        CategoryRouteRecord? @relation(fields: [categoryRouteId], references: [id], onDelete: SetNull)
  operation            CanonicalOperation?  @relation(fields: [operationId], references: [id], onDelete: SetNull)
  successfulProvider   ProviderConnection?  @relation("SuccessfulProvider", fields: [successfulProviderId], references: [id], onDelete: SetNull)
  attempts             AttemptLog[]

  @@index([createdAt])
  @@index([categoryRouteId, createdAt])
}

model AttemptLog {
  id                  String              @id @default(uuid())
  requestLogId        String
  providerId          String
  providerOperationId String
  categoryId          String
  attemptIndex        Int
  stateBefore         String
  stateAfter          String
  healthStatusBefore  String
  healthStatusAfter   String
  outcome             String
  failureClass        String?
  upstreamStatusCode  Int?
  canary              Boolean             @default(false)
  durationMs          Int
  errorMessage        String?
  quotaResetAt        DateTime?
  requestSummary      Json?
  responseSummary     Json?
  headerSnapshot      Json?
  createdAt           DateTime            @default(now())

  requestLog          RequestLog          @relation(fields: [requestLogId], references: [id], onDelete: Cascade)
  provider            ProviderConnection  @relation(fields: [providerId], references: [id], onDelete: Cascade)
  providerOperation   ProviderOperation   @relation(fields: [providerOperationId], references: [id], onDelete: Cascade)
  category            ProviderCategory    @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@index([requestLogId, attemptIndex])
  @@index([providerId, createdAt])
  @@index([categoryId, createdAt])
}

enum ResponseModeRecord {
  canonical
  raw
  both
  stream
}
```

### 4.1 SQLite-specific persistence notes

- Use `DATABASE_URL="file:./fireROUTE.db"` for local development and a dedicated file path per test run.
- Prisma scalar lists are not available on SQLite, so list-shaped persisted fields such as success status sets must be stored as `Json`.
- Enum-like runtime values such as provider state, health status, auth type, failure class, and attempt outcome should be validated in the application layer against the TypeScript unions in this document, while SQLite persists them as `String`.
- Breaker mutations should use short write transactions because SQLite serializes writers.
- Request and attempt logging should avoid oversized transactions; insert request row, attempt rows, and breaker updates in small deterministic units.

### 4.2 Persistence rules

- `ProviderConnection.healthStatus` is the source of truth for category routing eligibility.
- `ProviderConnection.circuitState` tracks the full breaker state machine that drives canary and cooldown behavior.
- `ProviderConnection.stateVersion` is used for optimistic concurrency when multiple requests update breaker state.
- `ProviderConnection.canaryLeaseUntil` prevents multiple concurrent half-open probes for the same provider.
- `CategoryFallbackConfig` is the source of truth for category retry and timeout policy.
- `RateLimitSnapshot` stores parsed header evidence rather than inferred guesses only.
- `RequestLog.routerMetadata` stores the exact envelope emitted to the client for auditability.

---

## 5. Circuit Breaker State Machine

fireROUTE must implement a real circuit breaker that operates on **individual providers within a category**.

### 5.1 State definitions

- `CLOSED`: provider is healthy and fully eligible for normal routing inside its category
- `HALF_OPEN`: cooldown expired and exactly one canary probe is allowed
- `DEGRADED`: provider is temporarily bypassed after three consecutive classified errors
- `DEAD`: provider is considered unavailable after failed recovery or repeated terminal outcomes

### 5.2 Failure classification

Failure classification determines whether the provider remains healthy, becomes degraded, or becomes dead.

#### Transient classes

- network failure
- DNS or socket reset
- timeout
- `429`
- `500`, `502`, `503`, `504`
- empty or truncated response
- temporary contract failure caused by unstable upstream payloads

Transient failures increment streaks toward `DEGRADED`.

#### Terminal classes

- `401`, `403`
- repeated `404` for a configured provider route
- repeated `400` or `422` caused by provider-specific incompatibility
- deterministic auth or subscription rejection

Terminal failures can drive direct transition to `DEAD` after the configured threshold or after failed canary recovery.

### 5.3 Transition table

| Current state | Trigger | Next state | Health status | Notes |
|---|---|---|---|---|
| `CLOSED` | success | `CLOSED` | `HEALTHY` | reset consecutive error streak |
| `CLOSED` | failure 1 or 2 | `CLOSED` | `HEALTHY` | increment streak only |
| `CLOSED` | 3rd consecutive error | `DEGRADED` | `DEGRADED` | set `cooldown_until = now + 5 minutes` |
| `DEGRADED` | cooldown not expired | `DEGRADED` | `DEGRADED` | provider bypassed for normal traffic |
| `DEGRADED` | cooldown expired and canary lease acquired | `HALF_OPEN` | `DEGRADED` | exactly one canary attempt allowed |
| `HALF_OPEN` | canary success and valid canonical transform | `CLOSED` | `HEALTHY` | reset streaks and release lease |
| `HALF_OPEN` | canary failure | `DEAD` | `DEAD` | failed recovery escalates provider to dead |
| `DEAD` | cooldown not expired | `DEAD` | `DEAD` | provider bypassed |
| `DEAD` | cooldown expired and canary lease acquired | `HALF_OPEN` | `DEAD` | exactly one canary attempt allowed |
| `HALF_OPEN` from `DEAD` | canary success | `CLOSED` | `HEALTHY` | provider re-enters category |
| `HALF_OPEN` from `DEAD` | canary failure | `DEAD` | `DEAD` | new cooldown window |

### 5.4 State diagram

```text
                    success
             ┌──────────────────┐
             │                  ▼
        ┌─────────┐        ┌───────────┐
        │ CLOSED  │        │ HALF_OPEN │
        └────┬────┘        └─────┬─────┘
             │                   │
    3 errors │                   │canary success
             ▼                   ▼
        ┌───────────┐       ┌───────────┐
        │ DEGRADED  │──────►│  CLOSED   │
        └────┬──────┘       └───────────┘
             │
             │ cooldown expiry
             ▼
        ┌───────────┐
        │ HALF_OPEN │
        └────┬──────┘
             │
             │ canary failure
             ▼
        ┌───────────┐
        │   DEAD    │
        └────┬──────┘
             │
             │ cooldown expiry + canary
             ▼
        ┌───────────┐
        │ HALF_OPEN │
        └───────────┘
```

### 5.5 Cooldown and canary rules

1. Cooldown length is fixed at `5 minutes` by default.
2. After `3` consecutive classified errors, the provider is marked `DEGRADED` and excluded from normal category routing.
3. A provider in `DEGRADED` or `DEAD` is skipped unless cooldown has expired.
4. When cooldown expires, only one request may acquire the canary lease.
5. The lease is obtained with an optimistic update on `stateVersion` and `canaryLeaseUntil`.
6. If the canary fails while recovering from `DEGRADED`, the provider is promoted to `DEAD`.
7. If the canary succeeds, the provider returns to `HEALTHY` and `CLOSED`.
8. Canary requests must:
   - use the same category adapter path as normal traffic
   - count as a real upstream request
   - update logs and breaker history exactly like a normal attempt
9. Success means both upstream success and successful category-standardized transformation.

### 5.6 Breaker persistence algorithm

```text
read provider row scoped to category membership
classify current outcome
compute next circuit state and health status deterministically
update provider where id = ? and state_version = previous_version
increment state_version
insert circuit_event if state or health status changed
```

This prevents state corruption when many requests fail concurrently against the same provider.

---

## 6. Fallback Chain Executor

### 6.1 Category model

A category is the functional grouping that the consumer chooses, such as `weather`, `finance`, or `music`.

A category route is the combination of:

- one category
- one canonical operation
- one ordered provider membership list within that category

Example:

```text
category: weather
operation: current-conditions

priority 10 -> weatherapi
priority 20 -> openweathermap
priority 30 -> aviationweather
```

### 6.2 Candidate resolution rules

The executor resolves candidates in this order:

1. validate the requested `category`
2. load all providers assigned to that category for the requested operation
3. if `provider` override is present, reduce to that single provider only after validating category membership
4. sort by ascending `priority`
5. filter by route member `enabled = true`
6. filter by provider `enabled = true`
7. filter by provider `healthStatus = HEALTHY`, except canary-eligible providers whose cooldown has expired
8. filter by circuit state:
   - `CLOSED` = eligible
   - `HALF_OPEN` = eligible only if current request owns canary lease
   - `DEGRADED` and `DEAD` = bypass unless cooldown has expired and canary lease is acquired
9. optionally filter by recent rate-limit evidence if `skip_when_rate_limited = true` and reset time is still in the future

### 6.3 Attempt execution algorithm

```text
receive category request
load category route and category fallback config
query all HEALTHY providers for that category ordered by priority
append canary-eligible providers when cooldown rules allow
for provider in ordered list:
  if provider is not eligible:
    append skipped attempt metadata
    continue

  adapt category request to provider-native request
  dispatch upstream call with category timeout
  classify upstream result
  update provider circuit breaker and health status
  persist attempt log

  if classified success:
    normalize provider payload into category-standardized output
    return success envelope

  if this provider reached 3 consecutive failures:
    mark provider as DEGRADED

  if classified failover:
    continue

return 503 category outage envelope
```

### 6.4 Failover decision table

| Outcome | Fail over to next provider | Breaker update |
|---|---|---|
| timeout | yes | transient |
| network error | yes | transient |
| `429` | yes | transient + capture reset headers |
| `5xx` | yes | transient |
| `401` or `403` | yes | terminal |
| adapter transform failure after upstream response | yes | contract failure |
| router-side canonical validation failure before any dispatch | no | none |
| no provider candidates left in category | no | category outage |

### 6.5 Category outage behavior

When all providers in the selected category fail, fireROUTE returns:

- HTTP `503`
- `ok: false`
- `error.code: "CATEGORY_OUTAGE"`
- full `router_metadata.attempts`
- `router_metadata.category_outage: true`
- `selected_provider: null`

This failure is still considered a valid router response and must satisfy the response schema.

### 6.6 Important difference from earlier combo-centric design

Earlier designs treated the logical grouping as a combo. The approved design makes the **category** the user-facing routing primitive. The executor therefore owns:

- category route resolution
- provider membership validation within a category
- failover continuation inside the category only
- breaker updates between attempts
- final metadata aggregation for category health and outage reporting

---

## 7. Adapter Pattern

### 7.1 Category-aware request normalization pipeline

Each category has its own adapter that converts canonical category input into a provider-native request.

Pipeline steps:

1. validate canonical input against the category input schema
2. load `CategoryAdapter` for the selected category
3. load provider-specific mapping for the chosen provider within that category
4. extract canonical values using `source_path`
5. apply transform chain in declaration order
6. materialize path parameters
7. materialize query parameters
8. materialize headers, including credentials
9. build body from the body template
10. emit `UpstreamDispatchRequest`

### 7.2 Category-aware response transformation pipeline

Each category adapter converts provider-native output into category-standardized `data`.

Pipeline steps:

1. parse upstream payload as JSON when possible
2. select `success_path` or `error_path`
3. map provider fields into canonical category targets
4. apply transforms and defaults
5. validate mapped output against the category output schema
6. wrap the standardized category payload with uniform `router_metadata`
7. return canonical category data or raise a `CONTRACT` failure

### 7.3 Mapping engine requirements

The transform engine must support:

- nested path extraction
- array item mapping
- string to number and number to string coercion
- enum normalization
- date to ISO conversion
- coalesce and default fallbacks
- trimming and splitting

The mapping engine must be deterministic. It must not run arbitrary dynamic code.

### 7.4 Stream normalization

Some upstream APIs may return SSE or chunked content. fireROUTE should normalize streams with explicit event state rather than ad hoc string replacement.

Required stream behaviors:

- incremental parsing by chunk boundary, not line-assumption only
- event buffering until a full SSE frame is available
- event classification into `delta`, `snapshot`, `done`, or `error`
- canonical emission format when `response_mode = stream`
- final aggregate metadata emitted when stream completes

Canonical stream event shape:

```json
{
  "type": "delta",
  "request_id": "...",
  "category": "weather",
  "provider": "weatherapi",
  "operation": "forecast",
  "data": {}
}
```

### 7.5 Adapter registry design

Adapter logic is split deliberately:

- category contracts live in `src/categories/<category>/`
- provider-specific transforms for that category live under `src/categories/<category>/providers/`
- shared mapping definitions may still be persisted in SQLite through `ProviderOperation.requestMapping`, `responseMapping`, and `streamMapping`

This allows:

- adding a new provider to an existing category without changing the fallback executor
- evolving category-standardized schemas independently from provider-native formats
- reordering provider priority within a category independently from adapters
- patching broken field mappings without touching the breaker or executor

### 7.6 Raw passthrough mode

If `response_mode = raw` or `both`, fireROUTE should preserve the original upstream payload alongside category-standardized data.

- `canonical`: only category-standardized `data`
- `raw`: `data` contains raw payload and metadata still exists
- `both`: `data.canonical` and `data.raw`

This is required for incremental provider rollout when category normalization is incomplete.

---

## 8. MCP Server Alignment

### 8.1 Structural mapping rule

Each fireROUTE category maps `1:1` to a future MCP tool. This is not implemented yet, but it is a guiding structural rule for the category system.

### 8.2 Mapping contract

For every `ProviderCategory`:

- tool name = category slug
- tool description = category description
- `inputSchema` = category standard input schema
- `outputSchema` = `router_metadata` envelope containing category-standardized response

Example:

```text
category slug: weather
tool name: weather
tool description: standardized weather data lookup across multiple weather providers
inputSchema: weather category input schema
outputSchema: fireROUTE response envelope with weather-standardized data
```

### 8.3 Why this matters for adapter design

This MCP alignment means:

- category adapters must define a stable provider-agnostic input schema
- category adapters must define a stable provider-agnostic output schema
- provider-specific fields belong either in raw passthrough payloads or optional metadata extensions
- fallback semantics remain invisible to MCP consumers unless surfaced through `router_metadata`

### 8.4 Future implementation implication

When MCP tooling is added later, the server should be able to derive `MCPToolDefinition` records directly from `ProviderCategory`, `CategoryRoute`, and `CategoryAdapter` definitions instead of inventing a parallel model.

---

## 9. Fastify Server Setup

### 9.1 Bootstrap order

The Fastify bootstrap must register plugins in this order:

1. logger configuration
2. environment loader and typed config
3. Ajv compiler and serializer compiler
4. request-context and request id plugin
5. Prisma plugin
6. pooled HTTP client plugin
7. repositories and service factories
8. category adapter registry
9. route registration
10. global error handler
11. readiness hooks and shutdown hooks

### 9.2 App factory shape

The app factory should wire these top-level dependencies:

- `CategoryRepository`
- `ProviderRepository`
- `CategoryFallbackExecutor`
- `CircuitBreakerService`
- `AdapterRegistry`
- `UpstreamDispatcher`
- `ResponseEnvelopeBuilder`

### 9.3 Ajv configuration

Ajv must validate both:

- the public `POST /v1/execute` request envelope
- the final response envelope emitted to callers

Category-specific input and output schemas should be compiled lazily or at startup from the category adapter registry.

### 9.4 Route contract

`POST /v1/execute` request body must accept:

```json
{
  "category": "weather",
  "provider": "weatherapi",
  "operation": "current-conditions",
  "input": {},
  "options": {}
}
```

Rules:

- `category` is required
- `provider` is optional and acts only as an advanced explicit override
- if `provider` is present but does not belong to the category, return `400`
- if `category` is unknown, return `400`
- if the category exists but no provider is healthy, the router may return `503`

### 9.5 Upstream timeout and pooling

- use one `undici` pool per upstream origin
- use category-level default timeout from `CategoryFallbackConfig.timeoutMs`
- allow request-level `options.timeout_ms` only if it does not exceed safe service limits
- always abort upstream requests explicitly rather than waiting for socket expiration

### 9.6 Health endpoints

The server should expose:

- `/health/live`: process is running
- `/health/ready`: Prisma, adapter registry, and HTTP client registry are ready

Future readiness may also report category coverage counts, but that is not part of the public response contract yet.

### 9.7 Error handling strategy

Fastify error handling must normalize all failures into the canonical envelope. Validation failures and category lookup failures must never leak internal stack traces.

---

## 10. Test Strategy

### 10.1 Test runner philosophy

Use real HTTP behavior, real Fastify injection, real Prisma against isolated SQLite files, and deterministic fake upstream servers. Do not rely on mock-only routing tests for the fallback chain.

### 10.2 Test layers

#### Unit tests

- category route resolution
- provider membership validation
- breaker transition logic
- category adapter field mapping
- rate-limit parsing
- response classification

#### Integration tests

- `POST /v1/execute` with valid category routes to the correct primary provider
- `POST /v1/execute` with invalid category returns `400`
- category fallback when primary provider returns `429`
- category-wide outage when all providers are `DEGRADED`
- canary recovery after cooldown restores a provider to healthy service

#### Contract tests

- `router_metadata` shape is always present
- each category response matches its standardized output schema
- raw and both modes preserve the common envelope rule

### 10.3 Integration sandbox architecture

The local sandbox should run several fake upstream servers that simulate providers within the same category. Example weather sandbox:

- provider A returns `429`
- provider B returns `200` valid payload
- provider C times out

This allows end-to-end verification that category fallback stays inside the category boundary.

### 10.4 `429` failover test design

Test sequence:

1. seed category `weather`
2. seed three weather providers with ascending priority
3. configure provider A to emit `429` with reset headers
4. configure provider B to emit valid success payload
5. call `/v1/execute` with `category = weather`
6. assert provider A attempt is marked failover
7. assert provider B succeeds
8. assert `router_metadata.attempts.length = 2`
9. assert parsed rate-limit metadata was persisted for provider A

### 10.5 Category outage test design

Test sequence:

1. seed category `finance`
2. seed multiple finance providers
3. mark all providers `DEGRADED` with future cooldowns
4. call `/v1/execute` with `category = finance`
5. assert HTTP `503`
6. assert `error.code = CATEGORY_OUTAGE`
7. assert `router_metadata.category_outage = true`

### 10.6 Database test strategy

- create one SQLite file per test suite or test case
- run Prisma migrations before each suite
- seed categories from the folder inventory represented by [`fireROUTE/doc/api-references/README.md`](fireROUTE/doc/api-references/README.md:9)
- use deterministic timestamps through `utils/clock.ts`
- clean up database files after test completion

### 10.7 Logging and assertions

Every integration test should assert both the HTTP response and the stored persistence side effects:

- `RequestLog`
- `AttemptLog`
- `CircuitEvent`
- `RateLimitSnapshot`

This ensures routing behavior and auditability remain aligned.

---

## 11. Implementation Sequencing

### 11.1 Build order

#### Phase 1: Project init + Prisma schema with categories

- initialize runtime project structure
- create Prisma schema centered on `ProviderCategory`, `ProviderConnection`, and `CategoryFallbackConfig`
- create migrations and seed scaffolding

#### Phase 2: Core types including categories

- define `ProviderCategory`
- define `CategoryRoute`, `CategoryAdapter`, `MCPToolDefinition`, and updated request and metadata contracts
- define per-provider breaker and health types

#### Phase 3: Database layer with category CRUD

- implement category repository
- implement provider-category membership queries
- implement fallback config persistence and lookup
- implement request and attempt logging repositories

#### Phase 4: Circuit breaker per-provider health within categories

- implement transition classifier
- implement per-provider consecutive error handling
- mark provider `DEGRADED` after `3` consecutive failures
- add cooldown and canary recovery logic

#### Phase 5: Category adapters one per category

- implement shared category adapter base contracts
- implement first adapters such as `weather`, `finance`, and `music`
- normalize provider-native responses into category-standardized output envelopes

#### Phase 6: Fallback executor category-aware

- receive `category` from request
- query healthy providers for that category ordered by priority
- execute failover within the category only
- emit category outage response when all category providers fail

#### Phase 7: Fastify server + `POST /v1/execute` endpoint

- register plugins
- add request and response schemas
- wire category router, executor, and response envelope builder
- expose health endpoints

#### Phase 8: Integration sandbox + contract tests

- build local fake upstream sandbox
- add category routing and outage scenarios
- add response envelope and category schema contract tests

### 11.2 Dependency graph

```text
Prisma schema
    ↓
Domain types
    ↓
Repositories
    ↓
Circuit breaker
    ↓
Category adapters
    ↓
Fallback executor
    ↓
Fastify route layer
    ↓
Integration sandbox and contract tests
```

### 11.3 Parallelizable workstreams

These workstreams may run in parallel after Phases 1 and 2 are complete:

- repository implementation
- breaker implementation
- category adapter implementation
- Fastify schema scaffolding

The fallback executor must wait until repositories, breaker, and at least one category adapter are available.

### 11.4 Definition of done for each phase

- Phase 1 is done when Prisma migrates and seed data inserts valid categories and providers.
- Phase 2 is done when all category-first contracts compile without placeholder types.
- Phase 3 is done when category CRUD and membership lookups are covered by tests.
- Phase 4 is done when repeated failures transition provider health correctly and canary recovery is deterministic.
- Phase 5 is done when at least one category produces stable provider-agnostic outputs from multiple providers.
- Phase 6 is done when failover stays inside category boundaries and emits `503` on category-wide outage.
- Phase 7 is done when `/v1/execute` validates category-first requests and emits the canonical envelope.
- Phase 8 is done when integration and contract suites cover success, fallback, outage, and recovery paths.

---

## 12. Final Architectural Rule

The non-negotiable organizing principle of fireROUTE is:

> consumers choose a **functional category**, fireROUTE chooses a **provider within that category**, and resilience logic preserves category availability as long as at least one provider in the category remains healthy.

All routing, persistence, adapter, and future MCP design must remain subordinate to that rule.
