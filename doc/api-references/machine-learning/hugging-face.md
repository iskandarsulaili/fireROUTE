# Hugging Face

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `hugging-face`
- Docs used manually:
  - `https://huggingface.co/docs/inference-providers/index`
  - `https://huggingface.co/docs/inference-providers/tasks/chat-completion`
  - `https://huggingface.co/docs/inference-providers/tasks/feature-extraction`
  - `https://huggingface.co/docs/inference-providers/pricing`
- Confirmed API base URLs:
  - `https://router.huggingface.co/v1`
  - `https://router.huggingface.co/hf-inference`
- Authentication model: Bearer token in the `Authorization` header using a Hugging Face personal access token with `Inference Providers` permission
- Primary response formats: JSON; feature-extraction returns JSON arrays
- Manually confirmed routes in this pass: `2`

## Authentication
From the reviewed official Inference Providers docs:
- Requests use `Authorization: Bearer {HF_TOKEN}`.
- The token is a personal user access token created from Hugging Face settings.
- The docs explicitly say the token must have `Inference Providers` permission.
- The pricing docs also describe an alternative billing mode where you bring your own provider key through Hugging Face settings, but the confirmed HTTP examples reviewed in this pass used the Hugging Face bearer token flow.

## Billing, quotas, and rate-limit notes
From the official pricing page reviewed in this pass:
- Hugging Face positions Inference Providers as pay-as-you-go with no Hugging Face markup over provider cost.
- Free users receive monthly credits of `$0.10` subject to change.
- PRO users receive `$2.00` in monthly credits.
- Team or Enterprise organizations receive `$2.00 per seat` in monthly credits.
- The reviewed pricing page does not publish a per-endpoint requests-per-second table for the confirmed routes.
- The confirmed routes below are POST inference endpoints, so no pagination model is documented for them.

## Confirmed common request/response notes
- Chat completion uses an OpenAI-compatible request/response shape.
- Feature extraction accepts one `inputs` string or an array of strings.
- Feature-extraction output is documented as an array of arrays.
- Feature extraction supports optional normalization and truncation controls.
- Chat completion supports both text-only and multimodal message content on the reviewed task page.
- Streaming chat responses use Server-Sent Events when `stream=true`.

## Confirmed routes with exact paths
1. `POST /v1/chat/completions` - OpenAI-compatible chat completion endpoint
   - confirmed full base URL example: `https://router.huggingface.co/v1`
   - body parameters confirmed from the reviewed task page include:
     - `messages`
     - `max_tokens`
     - `temperature`
     - `top_p`
     - `stop`
     - `seed`
     - `stream`
     - `stream_options`
     - `frequency_penalty`
     - `presence_penalty`
     - `response_format`
     - `reasoning_effort`
     - `tool_choice`
     - `tool_prompt`
     - `tools`
     - `logprobs`
     - `top_logprobs`
   - response notes confirmed:
     - non-streaming responses return `choices`, `created`, `id`, `model`, `system_fingerprint`, and `usage`
     - streamed responses are SSE chunks with `choices[].delta`

2. `POST /hf-inference/models/{model}/pipeline/feature-extraction` - text embedding / feature extraction
   - confirmed full route example: `https://router.huggingface.co/hf-inference/models/ibm-granite/granite-embedding-97m-multilingual-r2/pipeline/feature-extraction`
   - path parameter confirmed: `model`
   - body parameters confirmed:
     - `inputs`
     - `normalize`
     - `prompt_name`
     - `truncate`
     - `truncation_direction`
   - response note confirmed: returns an array of arrays of numeric embedding values

## Important usage notes
- The Inference Providers overview says Hugging Face routes requests to multiple external inference partners through a single surface.
- The chat-completion docs explicitly describe the route as OpenAI SDK compatible.
- The feature-extraction docs expose provider switching in examples, but the confirmed raw HTTP route above was shown under the `HF Inference API` provider example.
- The pricing page says monthly credits apply when requests are routed by Hugging Face; credits do not apply when using a custom provider key.
- Because the reviewed public docs exposed concrete raw HTTP examples only for some task pages in this environment, this manual file records only the two routes above that were directly confirmed from official rendered docs during this pass.

## Errors and unconfirmed items
- The reviewed task pages did not expose a consolidated HTTP status-code table for these routes.
- No public pagination contract was documented for the confirmed inference POST routes.
- A separate Responses API guide existed on the official docs site, but it was rate-limited during this review and is therefore not counted as a confirmed route in this file.

## Verification notes
This file was manually rebuilt from the official Hugging Face Inference Providers overview, task pages, and pricing documentation. In this environment, two concrete HTTP routes were directly confirmable from rendered official docs: `POST /v1/chat/completions` and `POST /hf-inference/models/{model}/pipeline/feature-extraction`.