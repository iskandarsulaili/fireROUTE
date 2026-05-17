# Tisane

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `tisane`
- Docs used manually:
  - `https://docs.tisane.ai/`
  - `https://docs.tisane.ai/apis/tisane-api-short.md`
  - `https://docs.tisane.ai/apis/tisane-api-response-guide`
  - `https://docs.tisane.ai/apis/tisane-api-configuration`
- Confirmed base URL: `https://api.tisane.ai`
- Authentication model: API subscription key in header `Ocp-Apim-Subscription-Key`
- Primary request/response format: JSON over HTTP
- Manually confirmed routes in this pass: `8`

## Authentication
- The official overview defines one security scheme:
  - type: `apiKey`
  - in: `header`
  - header name: `Ocp-Apim-Subscription-Key`
- The quickstart snippet on the docs homepage also uses:
  - `Ocp-Apim-Subscription-Key: your_primary_or_secondary_API_key`
  - `Content-Type: application/json`

## Common request model
- The homepage quickstart shows a canonical analysis request body with:
  - `language`
  - `content`
  - `settings`
- The configuration guide says all settings are optional and that an empty object `{}` uses defaults.
- The configuration guide also documents content cues and output controls, including settings such as `format`, `disable_spellcheck`, `abuse`, `document_sentiment`, `relevant`, and many other customization toggles.

## Confirmed routes

### 1) Analyze text
- Method: `POST`
- Path: `/parse`
- Purpose: analyze text for problematic content, sentiment snippets, entities, topics, phrase structure, parts of speech, stopwords, and more
- Common request fields:
  - `language`
  - `content`
  - `settings`

### 2) List available languages
- Method: `GET`
- Path: `/languages`
- Purpose: return supported languages
- Confirmed response attributes from the overview markdown:
  - `id`
  - `name`
  - `englishName`
  - `nativeEncoding`
  - `preferredFont`
  - `latin`
  - `rightToLeft`

### 3) Extract plain text from markup
- Method: `POST`
- Path: `/helper/extract_text`
- Purpose: remove JavaScript, CSS, JSON, and other markup and return decoded text
- Important note: the docs explicitly say this method does not process binary content

### 4) Compare named entities
- Method: `POST`
- Path: `/compare/entities`
- Purpose: compare two compound named entities and identify differences
- Confirmed request fields:
  - `language1`
  - `entity1`
  - `language2`
  - `entity2`
  - `type` (`person` currently documented)
- Confirmed response fields:
  - `result`
  - `differences`

### 5) Compute semantic similarity
- Method: `POST`
- Path: `/similarity`
- Purpose: compare semantic similarity between two text fragments
- Confirmed request fields:
  - `content1`
  - `language1`
  - `content2`
  - `language2`
  - `settings`
- Confirmed response note: returns a numeric value between `0` and `1`

### 6) Detect language
- Method: `POST`
- Path: `/detectLanguage`
- Purpose: detect languages used in a text fragment and return offsets/breakdown
- Confirmed request fields:
  - `content`
  - `languages` (optional cue list)
  - `delimiter` (optional regex segmenter)

### 7) Transform / translate text
- Method: `POST`
- Path: `/transform`
- Purpose: translate text or paraphrase when source and target languages match
- Confirmed request fields:
  - `from`
  - `to`
  - `content`
  - `settings`

### 8) List inflected forms from language models
- Method: `GET`
- Path: `/lm/inflections`
- Purpose: retrieve inflected forms for a lexeme within a language family

## Response format notes
- The response guide says the `POST /parse` response is modular and sections can be included or omitted based on settings.
- Confirmed root-level response attributes include:
  - `text`
  - `language`
  - `reduced_output`
  - `sentiment`
  - `signal2noise`
- The response guide also documents detailed structures for abuse/problematic-content findings, including attributes such as:
  - `type`
  - `offset`
  - `length`
  - `sentence_index`
  - `text`

## Rate limits
- The reviewed public documentation does **not** publish a numeric public rate-limit table.
- The official docs focus on auth, request schemas, response structures, and configuration rather than quota numbers.

## Error handling
- The reviewed docs emphasize schema-driven JSON responses and detailed response sections, but they do not publish a separate public table of HTTP status codes/rate-limit headers on the pages reviewed in this pass.
- Integrators should therefore treat the documented request/response contracts as authoritative and verify runtime status handling during adapter testing.

## Important usage notes
- Tisane is optimized for social-media-style text, including misspellings, algospeak, jargon, and adversarial text manipulation.
- Many behaviors are driven by the `settings` object; leaving it empty yields defaults, while targeted flags can materially change output volume and moderation behavior.
- The docs separate endpoint reference, response structure guidance, and configuration guidance; all three are needed for a correct integration.

## Verification notes
This file was manually rebuilt from Tisane’s official developer docs, including the markdown overview page plus the official response-guide and configuration-guide pages.