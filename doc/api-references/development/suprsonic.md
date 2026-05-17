# Suprsonic

## Provider metadata
- Category: `Development`
- Provider slug: `suprsonic`
- Docs used manually:
  - `https://suprsonic.ai/`
  - `https://suprsonic.ai/docs/api`
- Confirmed REST API base URL: `https://suprsonic.ai`
- Primary media types: JSON request/response bodies for API calls; machine-readable JSON tool/OpenAPI documents; plain-text `llms.txt`
- Authentication model surfaced in docs: Bearer token in the `Authorization` header
- Manually confirmed routes in this pass: `27`

## Authentication
From the official API reference:
- every unified API call uses a Bearer token in the `Authorization` header
- API keys are created in the dashboard/API Keys section and work across every capability
- the docs explicitly say provider-specific OAuth flows, per-provider API keys, and token management are not required for downstream capabilities
- the reviewed docs did not document any alternate query-param auth model for the API routes
- the tool-definition discovery endpoint is explicitly documented as no-auth

## Common request/response conventions
- Base URL: `https://suprsonic.ai`
- primary action routes use `POST` with JSON bodies
- common success envelope:
  - `success`
  - `data`
  - `error`
  - `metadata.provider_used`
  - `metadata.providers_tried`
  - `metadata.mode_used`
  - `metadata.response_time_ms`
  - `metadata.request_id`
  - `credits_used`
- documented machine-readable discovery surfaces:
  - `GET /v1/tools?format=...`
  - `GET /v1/openapi.json`
  - `GET /llms.txt`
- the docs position `POST /v1/agent` as the universal single-tool entrypoint for agents

## Manually confirmed endpoint set

### Discovery and orchestration

#### 1) Universal agent entrypoint
- Method: `POST`
- Path: `/v1/agent`
- Purpose: invoke any capability through one universal tool endpoint
- JSON body confirmed in docs:
  - `capability` - required capability name such as `search`, `emails`, or `screenshot`
  - `params` - capability-specific parameter object
- Important notes:
  - docs say the response format stays consistent regardless of which capability is invoked
  - intended for agent frameworks that first fetch tool definitions from `/v1/tools`

#### 2) Tool definitions
- Method: `GET`
- Path: `/v1/tools`
- Purpose: fetch machine-readable tool definitions for agent frameworks
- Query parameter confirmed in docs:
  - `format` - supported values shown in docs: `openai`, `claude`, `mcp`, `raw`
- Important notes:
  - docs explicitly mark this route as unauthenticated
  - `raw` returns per-capability parameter schemas/types/defaults/descriptions

#### 3) OpenAPI description
- Method: `GET`
- Path: `/v1/openapi.json`
- Purpose: fetch the filtered OpenAPI 3.1 schema for Suprsonic capabilities

#### 4) LLM docs index
- Method: `GET`
- Path: `/llms.txt`
- Purpose: fetch the AI-readable documentation index for agent discovery and RAG pipelines

### Capability routes

#### 5) Search
- Method: `POST`
- Path: `/v1/search`
- Purpose: search the web and return SERP results, AI synthesis, or both
- Key parameters confirmed in docs:
  - `query` - required search query string
  - `num_results` - optional integer, default `10`
  - `country` - optional ISO country code, default `us`
  - `freshness` - optional time filter: `any`, `past 24 hours`, `past week`, `past month`
  - `mode` - documented presets: `serp`, `ai`, `deep`

#### 6) Scrape
- Method: `POST`
- Path: `/v1/scrape`
- Purpose: extract URL content with escalating fetch/rendering strategies
- Key parameters confirmed in docs:
  - `url` - required
  - `output` - optional: `markdown`, `html`, `raw html`
  - `wait_for` - optional CSS selector
  - `timeout` - optional integer seconds, default `30`
  - `mode` - documented presets: `fast`, `standard`, `thorough`

#### 7) Profiles lookup
- Method: `POST`
- Path: `/v1/profiles/find`
- Purpose: enrich professional profiles by LinkedIn URL or identity fields
- Key parameters confirmed in docs:
  - `linkedin_url`
  - `first_name`
  - `last_name`
  - `company`
  - `include_image` - optional boolean, default `true`

#### 8) Email finder
- Method: `POST`
- Path: `/v1/emails/find`
- Purpose: find professional email addresses by person and domain
- Key parameters confirmed in docs:
  - `first_name` - required
  - `last_name` - required
  - `domain` - required
  - `company` - optional

#### 9) Image generation
- Method: `POST`
- Path: `/v1/images/generate`
- Purpose: generate images from prompts
- Key parameters confirmed in docs:
  - `prompt` - required
  - `aspect_ratio` - optional: square/landscape/portrait, default `1:1`

#### 10) Text-to-speech
- Method: `POST`
- Path: `/v1/speech/synthesize`
- Purpose: synthesize speech audio from text
- Key parameters confirmed in docs:
  - `text` - required, max `2000` characters per docs
  - `voice_model`
  - `provider` - optional: `auto`, `deepgram`, `elevenlabs`

#### 11) Speech transcription
- Method: `POST`
- Path: `/v1/speech/transcribe`
- Purpose: transcribe audio into text with word timing
- Key parameters confirmed in docs:
  - `audio_url`
  - `audio_base64`
  - `language` - optional, default `en`

#### 12) Sound generation
- Method: `POST`
- Path: `/v1/sounds/generate`
- Purpose: generate non-speech sound effects or short instrumental clips
- Key parameters confirmed in docs:
  - `prompt` - required
  - `duration_seconds` - optional, default `5`, documented range `0.5-22`
  - `prompt_influence` - optional, default `0.3`
  - `output_format` - optional: `mp3_44100_128`, `mp3_44100_192`, `pcm_44100`

#### 13) Messaging
- Method: `POST`
- Path: `/v1/messages/send`
- Purpose: send SMS or WhatsApp messages
- Key parameters confirmed in docs:
  - `to` - required E.164 number
  - `message` - required text
  - `channel` - optional: `auto`, `sms`, `whatsapp`
- Important note: docs warn WhatsApp requires recipient opt-in within the last 24 hours

#### 14) Document extraction
- Method: `POST`
- Path: `/v1/documents/extract`
- Purpose: extract structured data from a URL or supplied content
- Key parameters confirmed in docs:
  - `url`
  - `content`
  - `extraction_prompt` - required unless `schema` is provided
  - `schema`

#### 15) Company enrichment
- Method: `POST`
- Path: `/v1/companies/find`
- Purpose: enrich company data from a domain
- Key parameters confirmed in docs:
  - `domain` - required
  - `company_name` - optional hint

#### 16) Email verification
- Method: `POST`
- Path: `/v1/emails/verify`
- Purpose: check deliverability/catch-all/disposable status
- Key parameters confirmed in docs:
  - `email` - required

#### 17) Audio/video transcription with diarization
- Method: `POST`
- Path: `/v1/audio/transcribe`
- Purpose: transcribe audio/video with speaker labels and timestamps
- Key parameters confirmed in docs:
  - `audio_url` - required
  - `language` - optional, default `en_us`
  - `speaker_labels` - optional boolean, default `true`

#### 18) Invoice parsing
- Method: `POST`
- Path: `/v1/invoices/parse`
- Purpose: extract totals, dates, suppliers, and line items from invoices/receipts
- Key parameters confirmed in docs:
  - `document_url` - required

#### 19) Subtitle generation
- Method: `POST`
- Path: `/v1/subtitles/generate`
- Purpose: generate subtitle text from audio/video
- Key parameters confirmed in docs:
  - `audio_url` - required
  - `language` - optional, default `en`
  - `format` - optional: `srt` or `vtt`

#### 20) File conversion
- Method: `POST`
- Path: `/v1/files/convert`
- Purpose: convert files between formats
- Key parameters confirmed in docs:
  - `file_url` - required
  - `source_format` - required
  - `target_format` - optional, default `pdf`

#### 21) Background removal
- Method: `POST`
- Path: `/v1/images/remove-background`
- Purpose: remove image backgrounds and return transparent PNG output
- Key parameters confirmed in docs:
  - `image_url` - required
  - `size` - optional: `auto`, `small`, `hd`

#### 22) Screenshot capture
- Method: `POST`
- Path: `/v1/screenshots/capture`
- Purpose: capture rendered page screenshots
- Key parameters confirmed in docs:
  - `url` - required
  - `width` - optional, default `1280`
  - `height` - optional, default `720`
  - `format` - optional: `png`, `jpg`, `webp`
  - `full_page` - optional boolean, default `false`

#### 23) Code execution
- Method: `POST`
- Path: `/v1/code/execute`
- Purpose: execute code in an isolated sandbox
- Key parameters confirmed in docs:
  - `code` - required
  - `language` - optional: `python`, `javascript`, `shell`
  - `timeout` - optional, default `30`, documented range `1-300`
  - `template` - optional: `default`, `data science`, `web dev`, `video`

#### 24) Site intelligence
- Method: `POST`
- Path: `/v1/sites/intel`
- Purpose: return WHOIS, DNS, SSL, hosting, and security insights for a domain
- Key parameters confirmed in docs:
  - `domain` - required
  - `mode` - optional: `overview`, `whois`, `dns`, `tech stack`, `security`, `subdomains`

#### 25) Research
- Method: `POST`
- Path: `/v1/research`
- Purpose: run multi-step deep research and synthesis
- Key parameters confirmed in docs:
  - `query` - required
  - `depth` - optional: `standard`, `deep`, `comprehensive`
  - `enrich_entities` - optional boolean, default `true`
  - `include_analysis` - optional boolean, default `false`
  - `synthesis` - optional boolean, default `true`
  - `source_types` - optional comma-separated source families such as `web`, `news`, `academic`
  - `max_sources` - optional integer, default `15`
  - `freshness` - optional time filter

#### 26) Video metadata
- Method: `POST`
- Path: `/v1/video/info`
- Purpose: fetch video metadata and available formats from supported platforms
- Key parameters confirmed in docs:
  - `url` - required

#### 27) Video download
- Method: `POST`
- Path: `/v1/video/download`
- Purpose: return a temporary pre-signed download URL for a video/audio extraction job
- Key parameters confirmed in docs:
  - `url` - required
  - `quality` - optional: `360p`, `480p`, `720p`, `1080p`, `best available`
  - `format` - optional: `mp4`, `mp3`, `m4a`
  - `mode` - documented presets: `video`, `audio`

## Pagination
- none documented for the API as a whole
- some capability routes expose their own sizing or collection controls instead of generic cursor/page envelopes:
  - `/v1/search` has `num_results`
  - `/v1/research` has `max_sources`
- discovery endpoints do not document pagination

## Rate limits and credit usage
From the official API reference:
- default rate limit: `60 requests per minute per key`
- every response includes:
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Limit`
  - `X-RateLimit-Reset`
  - `X-Credits-Used`
- credit costs are capability-specific; examples confirmed in docs include:
  - `/v1/search`: `1` (`serp`), `2` (`ai`), `3` (`deep`)
  - `/v1/scrape`: `1` (`fast`), `2` (`standard`), `5` (`thorough`)
  - `/v1/research`: `10` (`standard`), `20` (`deep`), `35` (`comprehensive`)
  - `/v1/video/download`: `3` (`video`), `2` (`audio`)
- docs explicitly state failed requests are free

## Error and response notes
From the official `Errors` and `Response format` sections:
- documented success/failure envelope includes `success`, `data`, `error`, `metadata`, and `credits_used`
- sample error object fields:
  - `type`
  - `title`
  - `status`
  - `detail`
  - `is_retriable`
  - `retry_after_seconds`
  - `alternative_action`
  - `error_category`
- documented HTTP statuses visible in the reviewed docs:
  - `200`
  - `400`
  - `401`
  - `402`
  - `422`
  - `429`
  - `502`
- docs categorize errors as transient, permanent, authentication, billing, and content-access related
- sample `429` response uses `https://api.o-mega.ai/errors/rate-limited` as the problem-type URL

## Important usage notes
- Suprsonic is a route-rich orchestration API, but it standardizes response shape and auth across all capabilities
- `POST /v1/agent` plus `GET /v1/tools?format=...` is the official agent-first integration path
- the docs repeatedly describe `mode` parameters as provider-routing presets rather than distinct endpoint families
- `/v1/video/download` returns a temporary download URL rather than streaming media directly from the API response
- the tool-definition route is the only reviewed endpoint explicitly documented as unauthenticated
- several capability responses include base64 payloads (`audio_base64`, `image_base64`, `b64_json`) rather than CDN URLs

## Verification notes
This file was manually rebuilt from Suprsonic's official homepage and official API reference using browser inspection.