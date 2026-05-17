# Dialogflow

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `dialogflow`
- Docs used manually:
  - `https://cloud.google.com/dialogflow/docs/`
  - `https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.sessions/detectIntent`
  - `https://cloud.google.com/dialogflow/es/docs/reference/rest/v2/projects.agent.sessions/deleteContexts`
  - `https://cloud.google.com/dialogflow/quotas`
- Confirmed base URL template in this pass: `https://{endpoint}/v2`
- Base-URL note: the reviewed method pages use the placeholder `{endpoint}` and explicitly say it must be one of Dialogflow's supported service endpoints
- Primary media types confirmed in this pass: JSON request/response bodies, plus base64-encoded bytes inside `inputAudio` when sending audio to `detectIntent`
- Authentication confirmed in this pass: OAuth 2 with either `https://www.googleapis.com/auth/cloud-platform` or `https://www.googleapis.com/auth/dialogflow`
- Manually confirmed routes in this pass: `2`

## Authentication
From the reviewed official method pages:
- the reviewed REST methods require OAuth authentication, not simple API-key-only requests
- both reviewed routes require one of these scopes:
  - `https://www.googleapis.com/auth/cloud-platform`
  - `https://www.googleapis.com/auth/dialogflow`
- the reviewed method pages also surface route-level IAM permissions:
  - `dialogflow.sessions.detectIntent` for `detectIntent`
  - `dialogflow.contexts.deleteAll` for `deleteContexts`

## Common request/response conventions
- Dialogflow ES REST routes use Google-style gRPC transcoding syntax
- the reviewed method pages document the base template as `https://{endpoint}/v2/...`
- session identifiers use resource names such as `projects/<Project ID>/agent/sessions/<Session ID>`
- environment/user-qualified session forms are also supported on the reviewed routes:
  - `projects/<Project ID>/agent/environments/<Environment ID>/users/<User ID>/sessions/<Session ID>`
- JSON is the reviewed wire format for request and response bodies

## Manually confirmed endpoint set

### 1) Detect intent for a session
- Method: `POST`
- Path: `/v2/{session=projects/*/agent/sessions/*}:detectIntent`
- Full URL template: `https://{endpoint}/v2/{session=projects/*/agent/sessions/*}:detectIntent`
- Purpose: process a natural-language query and return structured Dialogflow results
- Path parameters:
  - `session` - required session resource name; supports both the standard `projects/<Project ID>/agent/sessions/<Session ID>` form and the environment/user-qualified form documented on the official page
- Confirmed request body fields:
  - `queryParams` - optional `QueryParameters` object
  - `queryInput` - required `QueryInput` object
  - `outputAudioConfig` - optional `OutputAudioConfig` object
  - `outputAudioConfigMask` - optional field-mask string
  - `inputAudio` - optional base64-encoded bytes; used when `queryInput` is configured for audio input
- Confirmed request-body notes from the official page:
  - `queryInput` may specify text, event, or audio-config-driven speech input
  - `inputAudio` supports up to 1 minute of speech audio data in a single request
- Response notes:
  - success returns `DetectIntentResponse`
- Important route notes from the official page:
  - the method is explicitly documented as not idempotent
  - it may update contexts and session entity types, which can affect future results
  - the page advises using agent versions for production traffic
  - the page recommends considering `AnalyzeContent` instead of `sessions.detectIntent` when Agent Assist or other CCAI products are in scope

### 2) Delete all active contexts in a session
- Method: `DELETE`
- Path: `/v2/{parent=projects/*/agent/sessions/*}/contexts`
- Full URL template: `https://{endpoint}/v2/{parent=projects/*/agent/sessions/*}/contexts`
- Purpose: remove all active contexts from a session
- Path parameters:
  - `parent` - required session resource name; supports both the standard session form and the environment/user-qualified form documented on the official page
- Request body:
  - must be empty
- Response notes:
  - success returns an empty JSON object

## Additional official route surface observed during review
The reviewed official REST navigation and links on the Dialogflow ES pages also exposed additional session routes, including:
- `projects.agent.sessions.contexts.create`
- `projects.agent.sessions.contexts.delete`
- `projects.agent.sessions.contexts.get`
- `projects.agent.sessions.contexts.list`
- `projects.agent.sessions.contexts.patch`
- `projects.agent.sessions.entityTypes.create`
- `projects.agent.sessions.entityTypes.delete`
- `projects.agent.sessions.entityTypes.get`
- `projects.agent.sessions.entityTypes.list`
- `projects.agent.sessions.entityTypes.patch`

This file only expands the two routes that were manually opened and verified in detail during this pass.

## Pagination
- No pagination behavior was documented on the two reviewed method pages
- the reviewed quota page discusses project-level quotas, not cursor or page-token pagination for these routes

## Rate limits
From the reviewed official quotas page:
- Dialogflow quotas are applied per project and shared across all applications and IP addresses using that project
- per-month quotas replenish on the 1st of each month at `12:00 AM Pacific Time`
- per-day quotas replenish daily at `12:00 AM Pacific Time`
- per-minute quotas refresh every 60 seconds on the minute
- the reviewed quota page explains how quota windows work, but the specific reviewed excerpts did not provide a route-level numeric cap for the two ES session routes documented here

## Error handling
- the reviewed route pages clearly document success payload shapes, required permissions, and OAuth scopes
- the reviewed pages used in this pass did not expose a consolidated per-route HTTP error table beyond the normal Google-auth/permission requirements
- because Dialogflow enforces project quotas, quota exhaustion should be treated as a potential operational failure condition even though the reviewed excerpts did not surface a route-specific numeric limit for these two methods

## Response format notes
- `detectIntent` returns a typed JSON `DetectIntentResponse`
- `deleteContexts` returns an empty JSON object on success
- audio requests to `detectIntent` still use JSON transport in the reviewed REST method, with the binary audio supplied as base64 in `inputAudio`

## Important usage notes
- session naming strategy is left to the caller, but the reviewed page says Session ID and User ID should each stay within 36 characters
- `detectIntent` is stateful from a session perspective because it can modify contexts and session entity types
- the official quota page says quotas vary by Dialogflow edition and are shared at the project level
- the reviewed method pages use service-endpoint placeholders rather than a single hard-coded hostname, so route templates should preserve the `{endpoint}` abstraction unless a deployment-specific endpoint is selected elsewhere

## Verification notes
This file was manually rebuilt from the official Dialogflow ES REST method pages for `projects.agent.sessions.detectIntent` and `projects.agent.sessions.deleteContexts`, plus the official Dialogflow quotas page.