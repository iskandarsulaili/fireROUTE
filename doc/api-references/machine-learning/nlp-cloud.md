# NLP Cloud

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `nlp-cloud`
- Docs used manually:
  - `https://nlpcloud.com/`
  - `https://docs.nlpcloud.com/`
  - `https://docs.nlpcloud.com/#endpoints`
  - `https://docs.nlpcloud.com/#rate-limiting`
  - `https://docs.nlpcloud.com/#errors`
- Confirmed API base URL family: `https://api.nlpcloud.io/v1`
- Confirmed documented variants reviewed in this pass:
  - standard inference route family under `/v1/{model}/{task}`
  - GPU inference route family under `/v1/gpu/{model}/{task}`
- Authentication model: token auth in the `Authorization` header with the form `Authorization: Token <api_key>`
- Primary request/response format: JSON over HTTPS
- Manually confirmed routes in this pass: `2`

## Authentication
- The official intro examples send credentials in the `Authorization` header.
- The exact header form shown by the docs is `Authorization: Token <token>`.
- The same examples also send `Content-Type: application/json`.
- The docs sidebar includes a `Get an API key` entry, confirming token-based self-service onboarding from the official dashboard.

## Base URL and route-shape notes
- The official introduction page shows the standard route shape `https://api.nlpcloud.io/v1/{model}/{task}`.
- The same page also shows a GPU route variant at `https://api.nlpcloud.io/v1/gpu/{model}/{task}`.
- Model selection is path-based rather than query-based in the reviewed docs.

## Confirmed routes with exact paths
1. `POST /v1/bart-large-cnn/summarization`
   - Full URL shown by the docs: `https://api.nlpcloud.io/v1/bart-large-cnn/summarization`
   - Confirmed request headers:
     - `Authorization: Token <token>`
     - `Content-Type: application/json`
   - Confirmed request field from the official example:
     - `text`
   - Confirmed response attribute from the official example:
     - `summary_text`
2. `POST /v1/gpu/bart-large-cnn/summarization`
   - Full URL shown by the docs: `https://api.nlpcloud.io/v1/gpu/bart-large-cnn/summarization`
   - Confirmed request headers:
     - `Authorization: Token <token>`
     - `Content-Type: application/json`
   - Confirmed request field from the official example:
     - `text`
   - Notes:
     - this is the GPU variant of the same summarization task family

## Additional documented task families visible in the official endpoints index
The official `Endpoints` index page visibly lists these task families, confirming that NLP Cloud documents a much broader inference surface than the two exact example paths counted above:
- Automatic Speech Recognition
- Chatbot and Conversational AI
- Classification
- Code Generation
- Dependencies
- Embeddings
- Entities
- Generation
- Grammar and Spelling Correction
- Intent Classification
- Keywords and Keyphrases Extraction
- Language Detection
- Noun Chunks
- Paraphrasing and Rewriting
- Question Answering
- Sentence Dependencies
- Sentiment Analysis
- Semantic Search
- Semantic Similarity
- Speech Synthesis
- Summarization
- Tokens
- Translation

## Request / response format notes
- The reviewed official examples use `POST` requests with JSON bodies.
- The visible summarization example returns JSON containing `summary_text`.
- The docs frame the API around task-specific inference calls, with the task name embedded in the path.
- The endpoint index also ties use cases to specific model families, so model choice is a core part of request routing.

## Rate limits
- The official docs expose a dedicated page titled `Rate Limiting – API Reference`.
- In the captured browser-visible excerpts for this pass, the page title and sidebar entry were confirmable, but no numeric public limit table was visible in the returned snapshot excerpt.
- Integrators should therefore treat rate limiting as officially documented but verify the live numeric limits directly in the current docs/dashboard before adapter rollout.

## Errors
- The official docs expose a dedicated page titled `Errors – API Reference`.
- In the browser-visible excerpts captured during this pass, the existence of the page was confirmable, but no detailed HTTP-code table was visible in the returned snapshot excerpt.
- Expect structured error handling to be documented by NLP Cloud, but verify the exact current error payloads / status mappings during adapter testing.

## Pagination
- No pagination controls or list-style collection endpoints were visible in the reviewed inference examples.
- The reviewed routes are single-request inference calls rather than pageable resource listings.

## Important usage notes
- NLP Cloud's API is model-centric: the selected model slug is part of the path.
- The docs explicitly distinguish standard and GPU route families.
- The public documentation presents many NLP task families from one common API pattern rather than a small fixed endpoint set.
- Because the visible browser excerpts in this pass exposed only the summarization example with an exact path string, the confirmed route count above intentionally stays conservative.

## Verification notes
This file was manually rebuilt from NLP Cloud's official site and official API-reference pages after re-checking a provider that had previously been marked unreachable.