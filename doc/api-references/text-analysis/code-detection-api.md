# Code Detection API

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `code-detection-api`
- Docs used manually:
  - `https://codedetectionapi.runtime.dev/`
  - `https://platform.runtime.dev/`
- Confirmed API base URL: `https://api.runtime.dev`
- Authentication model: API key passed as the `apikey` query parameter
- Primary response format: JSON
- Manually confirmed routes in this pass: `1`

## Authentication
From the official Runtime platform documentation and product site:
- Access requires an approved API key.
- The official sample request authenticates with `apikey=YOUR_API_KEY` in the query string.
- The public docs reviewed in this pass do not document an OAuth flow for this specific Code Detection API surface.

## Confirmed route with exact path
1. `POST /tlp` - submit text for technical-language processing / code detection
   - confirmed full sample URL: `https://api.runtime.dev/tlp?apikey=YOUR_API_KEY`
   - confirmed request body root: `iterable`
   - confirmed per-item field: `value`

## Request body and response notes
From the official sample request/response:
- The request uses `Content-Type: application/json`.
- The sample body is an object containing `iterable`, where each item includes a `value` string to analyze.
- The sample response contains, for each item:
  - `naturalLanguage`
  - `codeClassification`
  - `tags`
- The sample response also includes top-level `models` metadata.
- `naturalLanguage` includes at least `result`, `likelihood`, `tokens`, and `normalized` in the reviewed example.
- `codeClassification` includes a `result`, `rankings`, and `distribution` structure in the reviewed example.
- Language outputs in the reviewed example include normalized language identifiers plus metadata like `family`, `readable`, `alternatives`, and `name`.

## Rate limits, quotas, pagination, and errors
What the official pages reviewed in this pass show:
- The public marketing page exposes plan/credit tiers rather than a per-endpoint rate-limit table.
- The reviewed public docs do not publish a pagination model; the confirmed route is a POST analysis endpoint rather than a list endpoint.
- The reviewed public docs do not publish a formal HTTP error-code table.
- Because no public error-reference page was exposed on the reviewed official docs surfaces, error handling details could not be confirmed beyond standard JSON request usage.

## Important usage notes
- The provider describes this as a Technical Language Processing API rather than a generic NLP API.
- The official positioning says the API answers at least two core questions: whether a string is code or text, and, if code, what language it is.
- The public pricing page reviewed during this pass advertises a 14-day free trial and monthly API-credit tiers, but it does not expose a route-specific quota contract.
- The public docs focus on batch-style processing through the `iterable` request envelope, even when only one snippet is submitted.

## Verification notes
This file was manually rebuilt from the official Code Detection API product site and the current Runtime platform documentation page. In this environment, those official pages exposed one concrete routable HTTP endpoint: `POST https://api.runtime.dev/tlp` with API-key query authentication.