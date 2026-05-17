# Groq

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `groq`
- Docs used manually:
  - `https://console.groq.com/docs/quickstart`
  - `https://console.groq.com/docs/api-reference`
  - `https://console.groq.com/docs/rate-limits`
  - `https://console.groq.com/docs/errors`
- Confirmed API base URL: `https://api.groq.com/openai/v1`
- Primary media types confirmed from the official docs: JSON, multipart form-data for file/audio upload routes, and server-sent events for streaming responses
- Authentication model confirmed from the official docs: Bearer API key in `Authorization: Bearer <token>`
- Manually confirmed routes in this pass: `6`

## Authentication
From the official quickstart and API examples:
- create an API key in the Groq console
- recommended setup is the environment variable `GROQ_API_KEY`
- API calls authenticate with `Authorization: Bearer <token>`
- reviewed examples consistently use bearer auth rather than query-string credentials

## Common request/response conventions
- Base URL: `https://api.groq.com/openai/v1`
- Groq documents an OpenAI-compatible API surface under `/openai/v1`
- JSON is the primary request/response format for text and metadata routes
- multipart form-data is used for file uploads and audio transcription uploads
- streaming responses are documented as server-sent events when `stream=true`
- most responses include OpenAI-style object envelopes such as `list`, `model`, `file`, or generated response objects

## Manually confirmed endpoint set

### 1) Create chat completion
- Method: `POST`
- Path: `/chat/completions`
- Full URL: `https://api.groq.com/openai/v1/chat/completions`
- Purpose: create a chat-completions response for a conversation
- Confirmed request body fields:
  - `messages` - required conversation array
  - `model` - required model ID
  - `citation_options` - `enabled` or `disabled`
  - `compound_custom`
  - `disable_tool_validation`
  - `documents`
  - `include_reasoning`
  - `max_completion_tokens`
  - `parallel_tool_calls`
  - `reasoning_format`
  - `response_format`
  - `search_settings`
  - `service_tier`
  - `stream`
  - `temperature`
  - `tool_choice`
  - `tools`
- Important notes explicitly shown on the route page:
  - several legacy fields are marked deprecated in favor of newer tool/search fields
  - some fields are not supported by all models
  - streaming is available

### 2) Create response
- Method: `POST`
- Path: `/responses`
- Full URL: `https://api.groq.com/openai/v1/responses`
- Purpose: create a model response from general input using the newer Responses API
- Confirmed request body fields:
  - `input` - required string or array input
  - `model` - required model ID
  - `instructions`
  - `max_output_tokens`
  - `metadata` - up to `16` custom key/value pairs
  - `parallel_tool_calls`
  - `reasoning`
  - `service_tier` - `auto`, `default`, or `flex`
  - `store` - currently only `false` or `null` supported per docs
  - `stream`
  - `temperature`
  - `text`
  - `tool_choice`
  - `tools`
- Important notes from the official docs:
  - streaming uses server-sent events
  - `service_tier` controls latency-tier selection

### 3) Create transcription
- Method: `POST`
- Path: `/audio/transcriptions`
- Full URL: `https://api.groq.com/openai/v1/audio/transcriptions`
- Purpose: transcribe audio into the input language
- Confirmed request body/form-data fields:
  - `model` - required; docs specifically name `whisper-large-v3` and `whisper-large-v3-turbo`
  - `file` - optional if `url` is supplied; accepted formats include `flac`, `mp3`, `mp4`, `mpeg`, `mpga`, `m4a`, `ogg`, `wav`, `webm`
  - `language` - ISO-639-1 recommended when known
  - `prompt`
  - `response_format` - `json`, `text`, or `verbose_json`
  - `temperature`
  - `timestamp_granularities[]` - `word` and/or `segment`; requires `verbose_json`
  - `url` - optional alternative to `file`; supports Base64URL
- Important official notes:
  - either `file` or `url` must be supplied
  - `file` is not supported in Batch API requests
  - word timestamps add latency while segment timestamps do not

### 4) List models
- Method: `GET`
- Path: `/models`
- Full URL: `https://api.groq.com/openai/v1/models`
- Purpose: list available models
- Confirmed response notes:
  - response object type is `list`
  - `data[]` entries include fields such as `id`, `object`, `created`, `owned_by`, `active`, `context_window`, `public_apps`, and sometimes `max_completion_tokens`

### 5) Create batch
- Method: `POST`
- Path: `/batches`
- Full URL: `https://api.groq.com/openai/v1/batches`
- Purpose: create and execute a batch from an uploaded JSONL request file
- Confirmed request body fields:
  - `completion_window` - required, supported durations `24h` through `7d`
  - `endpoint` - required; the reviewed page says `/v1/chat/completions` is currently supported
  - `input_file_id` - required uploaded file ID
  - `metadata`
- Important official notes:
  - input file must be JSONL
  - batch input file size can be up to `100 MB`
  - input file must be uploaded with purpose `batch`
- Confirmed response fields include:
  - `id`
  - `endpoint`
  - `completion_window`
  - `created_at`
  - `expires_at`
  - `status`
  - `request_counts`
  - `output_file_id`
  - `error_file_id`

### 6) Upload file
- Method: `POST`
- Path: `/files`
- Full URL: `https://api.groq.com/openai/v1/files`
- Purpose: upload files for cross-endpoint use, especially batch input files
- Confirmed request body/form-data fields:
  - `file` - required file object
  - `purpose` - required; docs show `batch` for Batch API uploads
- Important official notes:
  - Batch API only supports `.jsonl` files up to `100 MB`
  - Groq tells users to contact support if storage limits need to be raised
- Confirmed response fields:
  - `bytes`
  - `created_at`
  - `filename`
  - `id`
  - `object` - `file`
  - `purpose` - `batch` or `batch_output`

## Pagination
- The reviewed Groq routes are primarily RPC- or single-resource-style and the official pages reviewed in this pass did not document cursor pagination for these sampled endpoints.
- `GET /models` and the sampled creation routes return a single response envelope rather than a paginated cursor structure in the reviewed docs.

## Rate limits
From the official rate-limits page:
- limits apply at the organization level, not per individual user
- Groq documents these rate dimensions:
  - `RPM` requests per minute
  - `RPD` requests per day
  - `TPM` tokens per minute
  - `TPD` tokens per day
  - `ASH` audio seconds per hour
  - `ASD` audio seconds per day
  - `ITPM` input tokens per minute
  - `OTPM` output tokens per minute
- cached tokens do not count toward limits
- the docs publish model-specific tables; examples visible during review included:
  - `llama-3.3-70b-versatile`: `30 RPM`, `1K RPD`, `12K TPM`, `100K TPD`
  - `whisper-large-v3`: `20 RPM`, `2K RPD`, `7.2K ASH`, `28.8K ASD`
- Groq notes that the published table is a high-level summary and exceptions may apply

## Error handling
From the official error-codes page:
- success code explicitly documented: `200`
- documented client errors include:
  - `400` invalid syntax / malformed request
  - `401` missing or invalid authentication
  - `403` permission restriction
  - `404` resource not found
  - `413` request body too large
  - `422` semantic error / invalid data / model hallucination issue
  - `424` dependent request failed
  - `429` too many requests
  - custom `498` flex-tier capacity exceeded
  - custom `499` request cancelled
- documented server errors include:
  - `500`
  - `502`
  - `503`
- Groq documents a standard error body shape:
  - `error.message`
  - `error.type`

## Response format notes
- many routes return OpenAI-style JSON envelopes and object types
- file responses use object type `file`
- model-list responses use object type `list`
- streaming-capable routes use server-sent events when enabled

## Important usage notes
- Groq recommends storing the API key in `GROQ_API_KEY` rather than hard-coding it
- batch jobs require a pre-uploaded JSONL file and currently support a limited endpoint set
- transcription can accept either direct file upload or URL input, but not both as a requirement pair; at least one is needed
- some request fields are present for compatibility but explicitly marked deprecated in the docs

## Verification notes
This file was manually rebuilt from Groq's current official quickstart, API reference, rate-limit, and error-code pages.