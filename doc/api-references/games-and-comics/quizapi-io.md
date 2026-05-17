# quizapi.io

## Overview
- Provider: quizapi.io
- Category: Games & Comics
- Official docs: `https://quizapi.io/docs`
- Base URL: `https://quizapi.io/api/v1`
- Auth: Bearer API key in `Authorization: Bearer YOUR_API_KEY`; OpenAPI also documents `api_key` query auth
- HTTPS: yes
- Response format: JSON
- Confirmed routes: `7`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/v1/metadata` | none documented | Public metadata endpoint. Live check returned `200` without auth and a JSON object containing `difficulties`, `questionTypes`, `categories`, `tags`, and `stats`. |
| GET | `/api/v1/categories` | none documented | Public categories/topic tree. Live check returned `200` without auth and a JSON array of top-level groups with nested category records. |
| GET | `/api/v1/quizzes` | query: `category`, `difficulty`, `tags`, `topic`, `sort`, `limit`, `offset` | Lists quizzes. Official docs describe paginated responses with `data` and `meta`. Live unauthenticated check returned `401 Missing API key`. |
| POST | `/api/v1/quizzes` | JSON body with required `title`, `difficulty`; optional `description`, `category`, `categoryId`, `tags[]`, `published`, `featured` | Creates a quiz. `featured` is documented as admin-only and ignored for non-admin users. |
| GET | `/api/v1/quizzes/{id}` | path `id` | Returns a single quiz by quiz ID. |
| GET | `/api/v1/questions` | query: `quiz_id`, `include_answers`, `category`, `difficulty`, `type`, `tags`, `limit`, `offset`, `random` | Supports two modes: quiz-question lookup when `quiz_id` is supplied, or browse mode across published quizzes when omitted. |
| POST | `/api/v1/quizzes/{id}/questions/batch` | path `id`; JSON body `questions[]` with required `text`, `type`, `difficulty`, `answers[]` and optional `explanation` | Batch-imports questions into an existing quiz. Each answer object requires `text` and `isCorrect`. |

## Authentication
- The official authentication page says QuizAPI uses API keys.
- Recommended auth method: `Authorization: Bearer YOUR_API_KEY`.
- Alternative auth documented in the OpenAPI spec: `api_key` query parameter.
- Official key prefixes:
  - `qza_live_` for production
  - `qza_test_` for testing/staging
- Live check:
  - `GET /api/v1/quizzes?limit=1` without auth returned `401` with `{"error":"Missing API key. Provide via Authorization header or api_key query param."}`
  - `GET /api/v1/metadata` and `GET /api/v1/categories` were publicly reachable without auth

## Parameters and request-body notes
- `GET /api/v1/quizzes`
  - `category`: filter by category
  - `difficulty`: filter by difficulty level
  - `tags`: comma-separated tags
  - `topic`: free-text search across title/description/tags
  - `sort`: `popular`, `newest`, or `title`
  - `limit`: docs say 1-50 in OpenAPI
  - `offset`: skip count for pagination
- `GET /api/v1/questions`
  - `quiz_id`: if present, returns ordered questions for one quiz
  - `include_answers=true`: include answers in quiz-specific mode
  - browse-mode filters: `category`, `difficulty`, `type`, `tags`, `limit`, `offset`, `random`
- `POST /api/v1/quizzes`
  - required: `title`, `difficulty`
  - optional: `description`, `category`, `categoryId`, `tags`, `published`, `featured`
  - documented difficulty enum: `EASY`, `MEDIUM`, `HARD`, `EXPERT`
- `POST /api/v1/quizzes/{id}/questions/batch`
  - required top-level field: `questions`
  - question `type` enum: `MULTIPLE_CHOICE`, `TRUE_FALSE`, `OPEN_ENDED`
  - question `difficulty` enum: `EASY`, `MEDIUM`, `HARD`, `EXPERT`

## Pagination, rate limits, and errors
- Quiz list and browse-question list responses use a `meta` object for pagination.
- The quick-start docs show `meta.total`, `meta.limit`, and `meta.offset`.
- Official rate limit: `60 requests per minute per IP address`.
- Official throttling behavior:
  - HTTP `429 Too Many Requests`
  - `Retry-After` header documented, currently `60`
  - response body example: `{"success":false,"error":"Rate limit exceeded. Please try again later."}`
- Documented auth failure example:
  - HTTP `401 Unauthorized`
  - body: `{"success":false,"error":"Invalid API key."}`
- OpenAPI response codes include `400`, `401`, `403`, `404`, `422`, `429`, and `500` depending on operation.

## Response-format notes
- JSON only in the official docs reviewed here.
- `GET /api/v1/metadata` returns enumerations and catalog stats, including total quiz/question counts.
- `GET /api/v1/categories` returns grouped categories with nested category records, including `id`, `name`, `slug`, `quizCount`, and `tags`.
- `GET /api/v1/quizzes` returns a list response with `data[]` and pagination `meta`.
- `GET /api/v1/questions` returns question objects with fields such as `id`, `quizId`, `text`, `type`, `difficulty`, `category`, optional `explanation`, and `answers[]`.

## Important usage notes
- The marketing homepage currently shows an `/api/v2/quizzes` example, but the official documentation set, docs navigation, and OpenAPI file are all for `v1`. Use the documented `v1` routes unless the provider publishes a stable v2 reference.
- Metadata and categories appear intentionally public, but quiz and question content routes are protected by API key auth.
- The official docs have a Webhooks page, but it is explicitly marked "Coming Soon" and does not publish a provider callback-registration API route, so webhook setup is not counted as a confirmed fireROUTE route.

## Integration notes for fireROUTE
- Treat this provider as primarily quiz-content CRUD plus browse/read endpoints, not a generic trivia feed.
- Require API-key configuration for quiz and question retrieval adapters, while allowing unauthenticated metadata/category probes.
- Preserve `difficulty`, `type`, and tag/category filters as raw passthrough fields because the provider uses quiz-specific enums and free-text tags.
- Handle rate-limit backoff using `Retry-After` on `429` responses.

## Sources inspected
- `https://quizapi.io/docs`
- `https://quizapi.io/docs/authentication`
- `https://quizapi.io/docs/quizzes`
- `https://quizapi.io/docs/questions`
- `https://quizapi.io/docs/rate-limits`
- `https://quizapi.io/api/v1/openapi.json`
- live checks: `https://quizapi.io/api/v1/metadata`, `https://quizapi.io/api/v1/categories`, `https://quizapi.io/api/v1/quizzes?limit=1`
