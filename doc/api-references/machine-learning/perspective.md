# Perspective

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `perspective`
- Docs used manually:
  - `https://perspectiveapi.com/`
  - `https://developers.perspectiveapi.com/s/docs-enable-the-api?language=en_US`
  - `https://developers.perspectiveapi.com/s/docs-sample-requests?language=en_US`
  - `https://developers.perspectiveapi.com/s/about-the-api-methods?language=en_US`
  - `https://developers.perspectiveapi.com/s/about-the-api-limits-and-errors?language=en_US`
  - `https://commentanalyzer.googleapis.com/$discovery/rest?version=v1alpha1`
- Confirmed base URL: `https://commentanalyzer.googleapis.com`
- Primary response/content types confirmed from the docs: JSON
- Authentication model confirmed from the docs used in this pass:
  - public getting-started flow uses Google Cloud API keys passed as `?key=...`
  - the official discovery document also advertises an OAuth2 scope
- Manually confirmed routes in this pass: `2`

## Authentication
- The official `Enable the API` page instructs developers to:
  - enable `commentanalyzer.googleapis.com` in Google Cloud
  - create Google Cloud credentials
  - choose `API Key`
- The official `Sample Requests` page shows the API key passed as query parameter `key` on the request URL.
- The same page warns that browser-exposed client-side API keys should be proxied and restricted.
- The official discovery document also declares OAuth2 scope:
  - `https://www.googleapis.com/auth/userinfo.email`
- In practice, the reviewed public onboarding flow is API-key-driven, while the discovery document still exposes OAuth metadata.

## Common request/response conventions
- Base URL: `https://commentanalyzer.googleapis.com`
- Version prefix confirmed in the discovery document: `/v1alpha1`
- Primary request/response format: JSON
- The official site repeatedly notes that Perspective API is sunsetting after `2026`.
- Request bodies revolve around:
  - `comment`
  - `requestedAttributes` or `attributeScores`
  - optional `languages`, `context`, `doNotStore`, `clientToken`, `sessionId`, `communityId`
- Response bodies for analysis revolve around:
  - `attributeScores`
  - `languages`
  - optional `clientToken`

## Manually confirmed endpoint set

### 1) Analyze a comment
- Method: `POST`
- Path: `/v1alpha1/comments:analyze`
- Full URL: `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze`
- Typical auth shown in docs:
  - query parameter `key=YOUR_KEY_HERE`
- Purpose: analyze text and return scores for requested moderation attributes
- Confirmed request body fields from the official Methods page and discovery document:
  - `comment.text` - required text to score
  - `comment.type` - optional text type; docs say currently only `PLAIN_TEXT` is supported
  - `context.entries[]` - optional contextual text list
  - `requestedAttributes` - required map of attribute names to config objects
  - `requestedAttributes[name].scoreType` - optional; docs say currently only `PROBABILITY` is supported
  - `requestedAttributes[name].scoreThreshold` - optional threshold
  - `spanAnnotations` - optional boolean
  - `languages` - optional list of ISO or BCP-47 language codes; auto-detected when omitted
  - `doNotStore` - optional boolean
  - `clientToken` - optional opaque token echoed in response
  - `sessionId` - optional session grouping token
  - `communityId` - optional community identifier
- Confirmed response fields:
  - `attributeScores`
  - `attributeScores[name].summaryScore.value`
  - `attributeScores[name].summaryScore.type`
  - `attributeScores[name].spanScores[]`
  - `languages`
  - `detectedLanguages` (discovery schema)
  - `clientToken`
- Confirmed sample request from the official docs:
  - `POST https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=YOUR_KEY_HERE`
- Confirmed sample use case:
  - request `TOXICITY` and other supported attributes in one call

### 2) Suggest a better score for a comment
- Method: `POST`
- Path: `/v1alpha1/comments:suggestscore`
- Full URL: `https://commentanalyzer.googleapis.com/v1alpha1/comments:suggestscore`
- Purpose: submit feedback/training data suggesting what the score should have been
- Auth model:
  - same API surface/base as analyze; public docs focus on Google Cloud API enablement and key-based onboarding
- Confirmed request body fields from the official Methods page and discovery document:
  - `comment` - required, same shape as analyze request
  - `context` - optional
  - `attributeScores` - required map describing the score(s) the client believes are correct
  - `languages` - optional
  - `communityId` - optional
  - `clientToken` - optional
  - `sessionId` - optional (present in discovery doc)
- Confirmed response fields:
  - `clientToken`
  - `detectedLanguages` (discovery schema)
  - `requestedLanguages` (discovery schema)
- Important official warning:
  - all submissions to `SuggestCommentScore` are stored and used to improve the API; the docs explicitly say not to use it for private data or for content from children below the applicable age threshold

## Pagination
- None. The two confirmed Perspective API methods are RPC-style POST endpoints returning a single analysis or feedback result.

## Rate limits
From the official `Limits & Errors` page:
- default quota is an average of `1 query per second (QPS)` for all Perspective projects
- this default quota is intended for testing and developer environments
- production sites may need to request a quota increase
- the docs point developers to Google Cloud quota pages for usage and quota management

## Error handling
The official `Limits & Errors` page publishes specific error scenarios and messages, including:
- invalid API key
  - message: `API key not valid. Please pass a valid API key.`
- quota exceeded
  - caused by exceeding QPS limit
- empty comment
  - message: `Comment must be non-empty.`
- comment too long
  - message: `Comment text too long.`
  - maximum text size per request: `20 KB`
- missing or unknown attributes
  - messages like `Missing requested_attributes` or `Unknown requested attribute: <attr_name>`
- unsupported languages
  - message pattern: `Attribute <attr_name> does not support request languages: ...`
- unknown language
  - message: `Unable to detect language`
- invalid context
  - message indicates both `entries` and `article_and_parent_comment` were populated
- unsupported comment formats
  - messages such as `Currently, only 'PLAIN_TEXT' comments are supported` or `Unknown text type`
- unsupported score type for an attribute
  - message pattern: `Requested score type <score_type> is not supported by attribute <attr_name>`

## Response format notes
- Analysis responses return nested `attributeScores` keyed by requested attribute name.
- Probability scores are in the range `[0,1]` according to the discovery document and method docs.
- Span-level scores use `begin` and `end` string indices.
- `clientToken` is echoed back when supplied.

## Important usage notes
- Perspective API is officially scheduled to sunset after `2026`.
- the docs say response time targets are around `100ms`, but the service is `best effort` and callers should remain resilient if responses fail
- use `doNotStore=true` when submitting sensitive/private text to the analyze route
- `SuggestCommentScore` should not be used for private data because those submissions are stored for model improvement
- if you call from browser-side JavaScript, the docs strongly recommend proxying requests through a server and restricting the API key

## Verification notes
This file was manually rebuilt from Perspective's current official developers pages plus the official Google discovery document, replacing the earlier placeholder that failed to extract routes from the site.