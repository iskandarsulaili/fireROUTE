# Cloudmersive Natural Language Processing

## Provider metadata
- Category: `Text Analysis`
- Provider slug: `cloudmersive-natural-language-processing`
- Docs used manually:
  - `https://api.cloudmersive.com/docs/nlp.asp`
- Confirmed API base URL: `https://api.cloudmersive.com`
- Authentication model: API key in the `Apikey` request header
- Confirmed request content types from the reviewed route pages: `application/json`, `text/json`, `application/xml`, `text/xml`, `application/x-www-form-urlencoded`
- Confirmed response content type from the reviewed route pages: `application/json`
- Manually confirmed routes in this pass: `26`

## Authentication
- The official docs page lists one auth scheme: `Apikey`.
- The auth section explicitly says:
  - type: `apiKey`
  - name: `Apikey`
  - in: `header`
- No OAuth flow or bearer-token flow was shown on the reviewed NLP reference page.

## Rate-limit and billing notes
- The reviewed docs page does not publish a numeric requests-per-minute or requests-per-second limit.
- Several NLP routes do publish usage-consumption notes instead:
  - sentiment, profanity, hate-speech, subjectivity, similarity, and translation routes say they consume `1-2 API calls per sentence`.
  - the English rephrase route says it consumes `1-2 API calls per output rephrasing option generated, per sentence`.
- The official page therefore exposes billable usage hints, but not a public throttle table.

## Request and response format notes
- All confirmed routes are `POST` operations.
- All reviewed routes accept one structured request object in the body.
- The reference page consistently shows JSON response examples.
- The same route pages also list XML and form-urlencoded request content types, so the service is not JSON-input-only.

## Pagination
- None of the reviewed NLP routes are paginated.
- Each route accepts one request body and returns a single result object.

## Error handling
- The reviewed Cloudmersive NLP page shows `200 OK` examples for the confirmed routes.
- The reviewed page does not publish a route-by-route non-200 error table.
- Because the docs omit a dedicated error-schema section for these endpoints, error payload shape and retry guidance are not publicly specified on the reviewed page.

## Confirmed routes

### Analytics

#### 1) Sentiment analysis
- Method: `POST`
- Path: `/nlp-v2/analytics/sentiment`
- Full URL: `https://api.cloudmersive.com/nlp-v2/analytics/sentiment`
- Purpose: determine whether text is positive, negative, or neutral.
- Confirmed request field:
  - `TextToAnalyze`
- Confirmed response fields:
  - `Successful`
  - `SentimentClassificationResult`
  - `SentimentScoreResult`
  - `SentenceCount`

#### 2) Profanity analysis
- Method: `POST`
- Path: `/nlp-v2/analytics/profanity`
- Full URL: `https://api.cloudmersive.com/nlp-v2/analytics/profanity`
- Purpose: detect profane or obscene language.
- Confirmed request field:
  - `TextToAnalyze`
- Confirmed response fields:
  - `Successful`
  - `ProfanityScoreResult`
  - `SentenceCount`

#### 3) Hate-speech analysis
- Method: `POST`
- Path: `/nlp-v2/analytics/hate-speech`
- Full URL: `https://api.cloudmersive.com/nlp-v2/analytics/hate-speech`
- Purpose: detect hate-speech language.
- Confirmed request field:
  - `TextToAnalyze`
- Confirmed response fields:
  - `Successful`
  - `HateSpeechScoreResult`
  - `SentenceCount`

#### 4) Subjectivity analysis
- Method: `POST`
- Path: `/nlp-v2/analytics/subjectivity`
- Full URL: `https://api.cloudmersive.com/nlp-v2/analytics/subjectivity`
- Purpose: measure whether text is objective or subjective.
- Confirmed request field:
  - `TextToAnalyze`
- Confirmed response fields:
  - `Successful`
  - `SubjectivityScoreResult`
  - `SentenceCount`

#### 5) Semantic similarity
- Method: `POST`
- Path: `/nlp-v2/analytics/similarity`
- Full URL: `https://api.cloudmersive.com/nlp-v2/analytics/similarity`
- Purpose: compare the semantic similarity of two strings.
- Confirmed request fields:
  - `TextToAnalyze1`
  - `TextToAnalyze2`
- Confirmed response fields:
  - `Successful`
  - `SimilarityScoreResult`
  - `SentenceCount`

### Entity extraction

#### 6) Extract entities
- Method: `POST`
- Path: `/nlp-v2/extract-entities`
- Full URL: `https://api.cloudmersive.com/nlp-v2/extract-entities`
- Purpose: extract named entities from a string.
- Confirmed request field:
  - `InputString`
- Confirmed response fields:
  - `Successful`
  - `Entities[]`
  - `Entities[].EntityType`
  - `Entities[].EntityText`

### Language detection and translation

#### 7) Detect language
- Method: `POST`
- Path: `/nlp-v2/language/detect`
- Full URL: `https://api.cloudmersive.com/nlp-v2/language/detect`
- Purpose: detect the language of the submitted text.
- Confirmed request field:
  - `textToDetect`
- Confirmed response fields:
  - `Successful`
  - `DetectedLanguage_ThreeLetterCode`
  - `DetectedLanguage_FullName`
- Official note:
  - the route page explicitly lists support for `DAN`, `DEU`, `ENG`, `FRA`, `ITA`, `JPN`, `KOR`, `NLD`, `NOR`, `POR`, `RUS`, `SPA`, `SWE`, and `ZHO`

#### 8) Translate German to English
- Method: `POST`
- Path: `/nlp-v2/translate/language/deu/to/eng`
- Full URL: `https://api.cloudmersive.com/nlp-v2/translate/language/deu/to/eng`
- Confirmed request field:
  - `TextToTranslate`
- Confirmed response fields:
  - `Successful`
  - `TranslatedTextResult`
  - `SentenceCount`

#### 9) Translate English to German
- Method: `POST`
- Path: `/nlp-v2/translate/language/eng/to/deu`
- Full URL: `https://api.cloudmersive.com/nlp-v2/translate/language/eng/to/deu`
- Confirmed request field:
  - `TextToTranslate`
- Confirmed response fields:
  - `Successful`
  - `TranslatedTextResult`
  - `SentenceCount`

#### 10) Translate French to English
- Method: `POST`
- Path: `/nlp-v2/translate/language/fra/to/eng`
- Full URL: `https://api.cloudmersive.com/nlp-v2/translate/language/fra/to/eng`
- Confirmed request field:
  - `TextToTranslate`
- Confirmed response fields:
  - `Successful`
  - `TranslatedTextResult`
  - `SentenceCount`

#### 11) Translate English to French
- Method: `POST`
- Path: `/nlp-v2/translate/language/eng/to/fra`
- Full URL: `https://api.cloudmersive.com/nlp-v2/translate/language/eng/to/fra`
- Confirmed request field:
  - `TextToTranslate`
- Confirmed response fields:
  - `Successful`
  - `TranslatedTextResult`
  - `SentenceCount`

#### 12) Translate Russian to English
- Method: `POST`
- Path: `/nlp-v2/translate/language/rus/to/eng`
- Full URL: `https://api.cloudmersive.com/nlp-v2/translate/language/rus/to/eng`
- Confirmed request field:
  - `TextToTranslate`
- Confirmed response fields:
  - `Successful`
  - `TranslatedTextResult`
  - `SentenceCount`

#### 13) Translate English to Russian
- Method: `POST`
- Path: `/nlp-v2/translate/language/eng/to/rus`
- Full URL: `https://api.cloudmersive.com/nlp-v2/translate/language/eng/to/rus`
- Confirmed request field:
  - `TextToTranslate`
- Confirmed response fields:
  - `Successful`
  - `TranslatedTextResult`
  - `SentenceCount`

#### 14) Translate HTML
- Method: `POST`
- Path: `/nlp-v2/translate/language/html`
- Full URL: `https://api.cloudmersive.com/nlp-v2/translate/language/html`
- Purpose: translate HTML content between specified languages.
- Confirmed request fields:
  - `HtmlStringToTranslate`
  - `HtmlUrlToTranslate`
  - `InputLanguageCode`
  - `OutputLanguageCode`
- Confirmed response fields:
  - `Successful`
  - `TranslatedHtmlResult`
  - `SentenceCount`

### Parse and part-of-speech tagging

#### 15) Parse syntax tree
- Method: `POST`
- Path: `/nlp-v2/parse/tree`
- Full URL: `https://api.cloudmersive.com/nlp-v2/parse/tree`
- Purpose: parse text into a Penn Treebank syntax tree.
- Confirmed request field:
  - `InputString`
- Confirmed response field:
  - `ParseTree`

#### 16) POS tag sentence
- Method: `POST`
- Path: `/nlp-v2/pos/tag/sentence`
- Full URL: `https://api.cloudmersive.com/nlp-v2/pos/tag/sentence`
- Purpose: return general part-of-speech tagging for a string.
- Confirmed request field:
  - `InputText`
- Confirmed response fields:
  - `TaggedSentences[]`
  - `TaggedSentences[].Words[]`
  - `TaggedSentences[].Words[].Word`
  - `TaggedSentences[].Words[].Tag`

#### 17) POS tag verbs
- Method: `POST`
- Path: `/nlp-v2/pos/tag/verbs`
- Full URL: `https://api.cloudmersive.com/nlp-v2/pos/tag/verbs`
- Purpose: return only verbs found by POS tagging.
- Confirmed request field:
  - `InputText`
- Confirmed response fields:
  - `TaggedSentences[]`
  - `TaggedSentences[].Words[]`

#### 18) POS tag nouns
- Method: `POST`
- Path: `/nlp-v2/pos/tag/nouns`
- Full URL: `https://api.cloudmersive.com/nlp-v2/pos/tag/nouns`
- Purpose: return only nouns found by POS tagging.
- Confirmed request field:
  - `InputText`
- Confirmed response fields:
  - `TaggedSentences[]`
  - `TaggedSentences[].Words[]`

#### 19) POS tag adjectives
- Method: `POST`
- Path: `/nlp-v2/pos/tag/adjectives`
- Full URL: `https://api.cloudmersive.com/nlp-v2/pos/tag/adjectives`
- Purpose: return only adjectives found by POS tagging.
- Confirmed request field:
  - `InputText`
- Confirmed response fields:
  - `TaggedSentences[]`
  - `TaggedSentences[].Words[]`

#### 20) POS tag adverbs
- Method: `POST`
- Path: `/nlp-v2/pos/tag/adverbs`
- Full URL: `https://api.cloudmersive.com/nlp-v2/pos/tag/adverbs`
- Purpose: return only adverbs found by POS tagging.
- Confirmed request field:
  - `InputText`
- Confirmed response fields:
  - `TaggedSentences[]`
  - `TaggedSentences[].Words[]`

#### 21) POS tag pronouns
- Method: `POST`
- Path: `/nlp-v2/pos/tag/pronouns`
- Full URL: `https://api.cloudmersive.com/nlp-v2/pos/tag/pronouns`
- Purpose: return only pronouns found by POS tagging.
- Confirmed request field:
  - `InputText`
- Confirmed response fields:
  - `TaggedSentences[]`
  - `TaggedSentences[].Words[]`

### Rephrasing and segmentation

#### 22) Rephrase English text by sentence
- Method: `POST`
- Path: `/nlp-v2/rephrase/rephrase/eng/by-sentence`
- Full URL: `https://api.cloudmersive.com/nlp-v2/rephrase/rephrase/eng/by-sentence`
- Purpose: create multiple English paraphrase candidates sentence-by-sentence.
- Confirmed request fields:
  - `TextToTranslate`
  - `TargetRephrasingCount`
- Confirmed response fields:
  - `Successful`
  - `RephrasedResults[]`
  - `RephrasedResults[].SentenceIndex`
  - `RephrasedResults[].OriginalSentenceText`
  - `RephrasedResults[].Rephrasings[]`
  - `SentenceCount`

#### 23) Segment sentences
- Method: `POST`
- Path: `/nlp-v2/segmentation/sentences`
- Full URL: `https://api.cloudmersive.com/nlp-v2/segmentation/sentences`
- Purpose: split an input string into individual sentences.
- Confirmed request field:
  - `InputString`
- Confirmed response fields:
  - `Successful`
  - `Sentences[]`
  - `SentenceCount`

#### 24) Segment words
- Method: `POST`
- Path: `/nlp-v2/segmentation/words`
- Full URL: `https://api.cloudmersive.com/nlp-v2/segmentation/words`
- Purpose: break an input string into words with positions.
- Confirmed request field:
  - `InputText`
- Confirmed response fields:
  - `Words[]`
  - `Words[].Word`
  - `Words[].WordIndex`
  - `Words[].StartPosition`
  - `Words[].EndPosition`

### Spellcheck

#### 25) Spellcheck word
- Method: `POST`
- Path: `/nlp-v2/spellcheck/check/word`
- Full URL: `https://api.cloudmersive.com/nlp-v2/spellcheck/check/word`
- Purpose: return spelling-correction suggestions for a word.
- Confirmed request field:
  - `Word`
- Confirmed response fields:
  - `Correct`
  - `Suggestions[]`

#### 26) Spellcheck sentence
- Method: `POST`
- Path: `/nlp-v2/spellcheck/check/sentence`
- Full URL: `https://api.cloudmersive.com/nlp-v2/spellcheck/check/sentence`
- Purpose: check whether a sentence is spelled correctly.
- Confirmed request field:
  - `Sentence`
- Confirmed response fields:
  - `IncorrectCount`
  - `Words[]`
  - `Words[].Word`
  - `Words[].Correct`
  - `Words[].Suggestions[]`

## Important usage notes
- The Cloudmersive NLP docs page exposes a classic Swagger-style reference page rather than a narrative guide.
- Every confirmed NLP route is synchronous `POST` over HTTPS.
- The docs page repeatedly notes per-sentence API-call consumption for several operations, so sentence length and sentence count directly affect usage.
- Translation coverage shown on the reviewed page is route-specific; the page exposes explicit language-pair endpoints rather than one generic path for all plain-text translations.
- HTML translation is the only reviewed translation route that accepts source and target language codes inside the request body.

## Verification notes
This file was manually rebuilt from Cloudmersive's official NLP API reference page and its route-by-route request and response examples.