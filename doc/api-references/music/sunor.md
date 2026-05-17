# Sunor

## Overview
- Provider: Sunor unified AI music API
- Category: Music
- Official docs: `https://docs.sunor.cc/introduction`
- Docs index: `https://docs.sunor.cc/llms.txt`
- Base URL: `https://sunor.cc/api/v1`
- Auth: `x-api-key` header on every request
- HTTPS: yes
- Response format: JSON
- Processing model: asynchronous task submission; create a task, then poll task status/output
- Pricing model: pay-as-you-go credits only; no subscription requirement is documented
- Rate limit: 120 requests per minute per API key across all endpoints

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/api/v1/task` | headers `x-api-key`, `Content-Type: application/json`; body `model`, `task_type`, `input` | Creates an async generation/upload task. Supports both Suno and Udio through one endpoint. |
| GET | `/api/v1/task/{taskId}` | path `taskId`; header `x-api-key` | Retrieves task status, input, output, credits, and any failure information. |
| GET | `/api/v1/account/balance` | header `x-api-key` | Returns available, frozen, and total credits. |
| GET | `/api/v1/account/usage` | header `x-api-key` | Returns aggregate usage stats such as tasks created and credits used. |

Confirmed route count: **4**.

## Request-body details for `POST /api/v1/task`

### Shared required fields
- `model`:
  - `suno`
  - `udio`
- `task_type`:
  - Suno: `music`, `lyrics`, `upload`, `concat`
  - Udio: `music` only
- `input`: task-specific object

### Suno task inputs
- Music, inspiration mode:
  - `input.gpt_description_prompt` required
  - `input.make_instrumental` optional boolean
- Music, custom mode:
  - `input.prompt` for user-supplied lyrics
  - `input.tags` for comma-separated genre/style tags
  - `input.negative_tags` to avoid unwanted styles
  - `input.title` optional title
- Music, continuation mode:
  - `input.continue_clip_id` required
  - `input.continue_at` required seconds offset
  - `input.prompt` optional continuation lyrics
- Lyrics generation:
  - `input.prompt` required
- Upload:
  - `input.url` required public audio URL
- Concatenation:
  - `input.clip_id` required

### Udio task inputs
- Quick generation:
  - `input.prompt` short style/mood description
- User-supplied lyrics mode:
  - `input.prompt`
  - `input.lyrics`
  - `input.lyrics_type=user`
- Instrumental mode:
  - `input.prompt`
  - `input.lyrics_type=instrumental`
- Optional Udio fields:
  - `input.tags`
  - `input.seed`
  - `input.lyrics_type` = `generate` (default), `user`, or `instrumental`

## Response notes
- All endpoints return JSON with top-level `code`.
- `POST /api/v1/task` success response documents HTTP `202` and returns:
  - `data.task_id`
  - `data.type`
  - `data.status` (initially `pending`)
  - `data.credits_charged`
  - `data.created_at`
- `GET /api/v1/task/{taskId}` returns:
  - task metadata: `task_id`, `model`, `type`, `status`, `credits_cost`, `input`, `output`, `error`, `created_at`, `completed_at`
  - output wrapper fields: `output.task_type`, `output.status`, `output.progress`, `output.fail_reason`, `output.result`
- Documented task statuses:
  - `pending`
  - `running`
  - `success`
  - `failure`
  - `timeout`
- For music tasks, `output.result` returns clip objects such as:
  - `id`
  - `audio_url`
  - `image_url`
  - `title`
  - `metadata`

## Auth, billing, rate limits, and usage notes
- Authentication is always via `x-api-key`.
- Docs say API keys are created in Dashboard > API Keys and only shown once.
- Official billing notes:
  - 1 credit = `$0.01 USD`
  - Suno `music` = 10 credits
  - Suno `lyrics` = 5 credits
  - Suno `upload` = 1 credit
  - Suno `concat` = 5 credits
  - Udio `music` = 5 credits
- Billing model is freeze-then-settle:
  - credits are frozen at submission time
  - successful tasks permanently deduct them
  - failed/time-out tasks refund them
- Credits expire 12 months after each top-up.
- Official rate limit is 120 requests/minute per API key, shared across all endpoints.
- Docs mention `Retry-After` and `X-RateLimit-Remaining` headers for rate-limit handling.

## Errors and pagination/polling notes
- Official error shape:
  - `code`
  - `message`
- Published error codes:
  - `400` malformed request / missing required fields
  - `401` missing or invalid API key
  - `402` insufficient credits
  - `404` task/resource not found
  - `429` rate limit exceeded
  - `500` internal server error
  - `502` upstream provider error
- The docs explicitly recommend exponential backoff for 5xx responses, up to 3 retries.
- Polling notes:
  - create a task first, then poll `GET /api/v1/task/{taskId}` until status becomes `success`, `failure`, or `timeout`
  - the rate-limit guide recommends slowing polling when `X-RateLimit-Remaining` gets low
- Pagination:
  - no collection/list pagination is documented for the four public API routes
  - task retrieval is single-resource polling, not page-based listing

## Important usage notes
- Sunor is documented as a third-party integration and is explicitly not affiliated with Suno Inc. or Udio Inc.
- The docs index (`llms.txt`) currently lists exactly four public API reference pages: create task, get task, get balance, and get usage.
- The linked official `openapi.json` did not match the published API-reference pages during review, so route confirmation here is based on the human-readable official endpoint pages plus the official docs index.
- Udio support is narrower than Suno support: only `music` tasks are documented for Udio.
- The Suno model docs say Sunor defaults to Suno V5.5 (`chirp-fenix`), while the Udio model docs say it uses `udio32-v1.5` automatically.

## fireROUTE integration notes
- Model Sunor as a small async task API rather than a large resource REST surface.
- The core adapter flow is:
  1. `POST /api/v1/task`
  2. poll `GET /api/v1/task/{taskId}`
  3. inspect `output.result`
- Preserve model-specific input schemas inside one unified task-creation route.
- Track both `available` and `frozen` credits because in-progress jobs reserve balance before settlement.
- Respect `Retry-After` on `429` and avoid aggressive polling because all endpoints share one per-key rate window.

## Sources inspected
- `https://docs.sunor.cc/introduction`
- `https://docs.sunor.cc/llms.txt`
- `https://docs.sunor.cc/api-reference/create-task`
- `https://docs.sunor.cc/api-reference/get-task`
- `https://docs.sunor.cc/api-reference/get-balance`
- `https://docs.sunor.cc/api-reference/get-usage`
- `https://docs.sunor.cc/authentication`
- `https://docs.sunor.cc/credits`
- `https://docs.sunor.cc/errors`
- `https://docs.sunor.cc/rate-limits`
- `https://docs.sunor.cc/models/suno`
- `https://docs.sunor.cc/models/udio`
