# ELI

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `eli`
- Docs used manually:
  - `https://nlp.insightera.co.th/docs/v1.0/`
  - `https://nlp.insightera.co.th/api/doc/doc.json`
- Confirmed API base URL: `https://nlp.insightera.co.th/api`
- Authentication model confirmed in this pass: required `token` query parameter on every documented route
- Confirmed request formats in this pass: JSON for most routes, `multipart/form-data` for OCR and classification training with file upload
- Confirmed response format in this pass: JSON
- Manually confirmed routes in this pass: `23`

## Authentication
- The official Swagger UI and the backing JSON spec both document a required `token` query parameter on every route reviewed in this pass.
- The docs catalog metadata described the provider as `apiKey` auth, but the official docs exposed the token as a query parameter rather than a header-based bearer scheme.
- The reviewed docs did not expose OAuth, session login, or a separate refresh-token flow.
- Representative example from the official docs:
  - `POST /nlp/address-extractor?token=...`
  - `GET /nlp/classification/token?token=...`

## Request and response format notes
- The confirmed API host is `https://nlp.insightera.co.th` and the confirmed API base path is `/api`.
- Most confirmed routes are `POST` routes consuming `application/json` and producing `application/json`.
- Two exceptions surfaced in the official docs:
  - `POST /nlp/classification/train-with-file` uses `formData` upload parameters.
  - `POST /nlp/ocr` consumes `multipart/form-data` with an uploaded image file.
- The reviewed Swagger page exposes JSON request/response samples for the NLP routes.

## Error handling
- The official route definitions reviewed in this pass consistently document these response codes:
  - `200` - success
  - `400` - bad request / invalid input
  - `401` - unauthorized / invalid token
  - `408` - request timeout
  - `500` - internal server error
- The reviewed docs did not expose a broader shared error-schema section beyond those route-level response declarations.

## Pagination
- None of the 23 reviewed ELI routes document pagination.
- The reviewed routes are single-operation inference, extraction, model-management, or training calls that return one result object per request.

## Rate-limit notes
- The reviewed Swagger UI and JSON spec do not publish numeric rate limits, quota buckets, or retry-after headers.
- Because the official docs reviewed in this pass do not expose throttling guidance, rate-limit policy remains undocumented.

## Important usage notes
- Every reviewed route requires the `token` query parameter.
- The docs place both general Thai NLP utilities and text-classification model-management routes under the same `/nlp` namespace.
- `POST /nlp/qa` is explicitly labeled `QA (coming soon)` in the official docs.
- The JSON spec exposes 23 current routes; all are under the `https://nlp.insightera.co.th/api` base URL.

## Confirmed routes

### Core NLP utilities

#### 1) Address extractor
- Method: `POST`
- Path: `/nlp/address-extractor`
- Full URL: `https://nlp.insightera.co.th/api/nlp/address-extractor`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `text`
- Official summary: convert a plain-text address into structured address parts.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 2) Text cleaning
- Method: `POST`
- Path: `/nlp/cleaning`
- Full URL: `https://nlp.insightera.co.th/api/nlp/cleaning`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `text`
- Official summary: normalize informal or noisy Thai text for downstream analysis.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 3) Text clustering
- Method: `POST`
- Path: `/nlp/clustering`
- Full URL: `https://nlp.insightera.co.th/api/nlp/clustering`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `engine`
  - `feature_engine`
  - `k`
  - `max_k`
  - `samples`
- Official summary: cluster submitted text samples.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 4) Common phrase
- Method: `POST`
- Path: `/nlp/common-phrase`
- Full URL: `https://nlp.insightera.co.th/api/nlp/common-phrase`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `k`
  - `samples`
- Official summary: find common phrases across submitted samples.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 5) Country detection
- Method: `POST`
- Path: `/nlp/country`
- Full URL: `https://nlp.insightera.co.th/api/nlp/country`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `extra_dict`
  - `multiple`
  - `text`
- Official summary: detect country references from submitted text.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 6) Datetime parser
- Method: `POST`
- Path: `/nlp/datetime-parser-new`
- Full URL: `https://nlp.insightera.co.th/api/nlp/datetime-parser-new`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `text`
- Official summary: parse datetime expressions from text.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 7) Email extractor
- Method: `POST`
- Path: `/nlp/extract-email`
- Full URL: `https://nlp.insightera.co.th/api/nlp/extract-email`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `texts`
- Official summary: extract email addresses from submitted text.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 8) Named Entity Recognition
- Method: `POST`
- Path: `/nlp/ner`
- Full URL: `https://nlp.insightera.co.th/api/nlp/ner`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `texts`
- Official summary: run named-entity recognition.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 9) OCR
- Method: `POST`
- Path: `/nlp/ocr`
- Full URL: `https://nlp.insightera.co.th/api/nlp/ocr`
- Required query parameter:
  - `token`
- Confirmed request content type: `multipart/form-data`
- Confirmed form-data parameter:
  - `image` - required uploaded file
- Official summary: perform OCR on an uploaded image.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 10) POS
- Method: `POST`
- Path: `/nlp/pos`
- Full URL: `https://nlp.insightera.co.th/api/nlp/pos`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `texts`
- Official summary: part-of-speech analysis.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 11) QA (coming soon)
- Method: `POST`
- Path: `/nlp/qa`
- Full URL: `https://nlp.insightera.co.th/api/nlp/qa`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `context`
  - `questions`
- Official docs note: this route is marked `coming soon`.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 12) Sentiment analysis
- Method: `POST`
- Path: `/nlp/sentiment-new`
- Full URL: `https://nlp.insightera.co.th/api/nlp/sentiment-new`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `engine`
  - `texts`
- Official summary: run sentiment analysis on submitted text.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 13) Similar words
- Method: `POST`
- Path: `/nlp/similar`
- Full URL: `https://nlp.insightera.co.th/api/nlp/similar`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `engine`
  - `top`
  - `word`
- Official summary: find similar words.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 14) Spell correction
- Method: `POST`
- Path: `/nlp/spell-correction`
- Full URL: `https://nlp.insightera.co.th/api/nlp/spell-correction`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `text`
- Official summary: correct spelling in submitted text.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 15) Thai text tokenization
- Method: `POST`
- Path: `/nlp/tokenize`
- Full URL: `https://nlp.insightera.co.th/api/nlp/tokenize`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `engine`
  - `text`
- Official summary: tokenize Thai text.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

### Classification model management

#### 16) Change model name
- Method: `POST`
- Path: `/nlp/classification/change-model-name`
- Full URL: `https://nlp.insightera.co.th/api/nlp/classification/change-model-name`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `model_id`
  - `model_name`
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 17) Delete model
- Method: `POST`
- Path: `/nlp/classification/delete`
- Full URL: `https://nlp.insightera.co.th/api/nlp/classification/delete`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `model_id`
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 18) Model detail
- Method: `POST`
- Path: `/nlp/classification/model`
- Full URL: `https://nlp.insightera.co.th/api/nlp/classification/model`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `model_id`
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 19) Predict
- Method: `POST`
- Path: `/nlp/classification/predict`
- Full URL: `https://nlp.insightera.co.th/api/nlp/classification/predict`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `model_id`
  - `samples`
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 20) Retrain
- Method: `POST`
- Path: `/nlp/classification/retrain`
- Full URL: `https://nlp.insightera.co.th/api/nlp/classification/retrain`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `data`
  - `is_sync`
  - `modelId`
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 21) Model details by token
- Method: `GET`
- Path: `/nlp/classification/token`
- Full URL: `https://nlp.insightera.co.th/api/nlp/classification/token`
- Required query parameter:
  - `token`
- Official summary: return model details associated with the token.
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 22) Train
- Method: `POST`
- Path: `/nlp/classification/train`
- Full URL: `https://nlp.insightera.co.th/api/nlp/classification/train`
- Required query parameter:
  - `token`
- JSON body fields confirmed in the official spec:
  - `data`
  - `is_sync`
  - `model_name`
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

#### 23) Train with file
- Method: `POST`
- Path: `/nlp/classification/train-with-file`
- Full URL: `https://nlp.insightera.co.th/api/nlp/classification/train-with-file`
- Required query parameter:
  - `token`
- Confirmed form-data parameters:
  - `file` - required uploaded training file
  - `model_name` - optional string
- Confirmed responses: `200`, `400`, `401`, `408`, `500`

## Verification notes
- The interactive Swagger page at `https://nlp.insightera.co.th/docs/v1.0/` rendered correctly in this environment.
- The backing official Swagger JSON at `https://nlp.insightera.co.th/api/doc/doc.json` confirmed the host, base path, methods, query parameters, request-content types, and body schema references used in this file.
- This file replaces the autogenerated placeholder with a manual route inventory grounded in the current official docs.