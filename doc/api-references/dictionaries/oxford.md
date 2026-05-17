# Oxford

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `oxford`
- Docs used manually:
  - `https://developer.oxforddictionaries.com/`
  - `https://developer.oxforddictionaries.com/endpoints`
  - `https://developer.oxforddictionaries.com/documentation`
  - `https://developer.oxforddictionaries.com/documentation/getting_started`
  - `https://developer.oxforddictionaries.com/documentation/getting_started/sandbox`
  - `https://developer.oxforddictionaries.com/documentation/making-requests-to-the-api`
  - `https://developer.oxforddictionaries.com/documentation/languages`
  - `https://developer.oxforddictionaries.com/documentation/response-codes`
  - `https://developer.oxforddictionaries.com/swagger/spec/od_api_dev_v2_swagger_v3.json`
- Confirmed live API base URL: `https://od-api.oxforddictionaries.com/api/v2`
- Confirmed sandbox API base URL: `https://od-api-sandbox.oxforddictionaries.com/api/v2`
- Primary media type: JSON
- Request methods confirmed in the official Swagger: `GET`
- Authentication model: `app_id` + `app_key` headers
- Manually confirmed routes in this pass: `24`

## Authentication
From the official getting-started and making-requests pages plus the first-party Swagger:
- every request requires both `app_id` and `app_key`
- the official docs say these credentials are available on the account's API Credentials page after sign-in
- the same auth headers are used for sandbox and live environments
- missing credentials are documented as `401 Unauthorized`
- invalid credentials or plan-ineligible endpoint / language access are documented as `403 Forbidden`

## Common request/response conventions
- Live base: `https://od-api.oxforddictionaries.com/api/v2`
- Sandbox base: `https://od-api-sandbox.oxforddictionaries.com/api/v2`
- the official docs position `Words` as the recommended main lookup route for new integrations
- `word_id` is documented as case-sensitive
- search-style routes use:
  - `q` for the search string
  - `prefix=true` to require prefix matching
  - `limit` with documented default/max `5000`
  - `offset` with the rule `offset + limit <= 10000`
- selection / projection params exposed by the Swagger include:
  - `fields`
  - `grammaticalFeatures`
  - `lexicalCategory`
  - `domains`
  - `registers`
  - `strictMatch`
- language support differs by route family; the official languages page and Swagger enumerate separate source/target sets for monolingual, bilingual, and pronunciation datasets

## Manually confirmed endpoint set

### Core dictionary and lexical routes
1. `GET /entries/{source_lang}/{word_id}`
   - headword-only dictionary entry lookup
   - query params: `fields`, `grammaticalFeatures`, `lexicalCategory`, `domains`, `registers`, `strictMatch`
2. `GET /lemmas/{source_lang}/{word_id}`
   - resolve an inflected form to its root / lemma
   - query params: `grammaticalFeatures`, `lexicalCategory`
3. `GET /inflections/{source_lang}/{word_id}`
   - retrieve inflected forms for a lexical entry
   - query param: `strictMatch`
4. `GET /search/{source_lang}`
   - search dictionary entries
   - query params: `q`, `prefix`, `limit`, `offset`
5. `GET /search/thesaurus/{source_lang}`
   - search thesaurus entries
   - query params: `q`, `prefix`, `limit`, `offset`
   - official Swagger restricts this route family to thesaurus datasets
6. `GET /search/translations/{source_lang}/{target_lang}`
   - search entries that have translations
   - query params: `q`, `prefix`, `limit`, `offset`
7. `GET /translations/{source_lang}/{target_lang}/{word_id}`
   - retrieve translations for a word
   - query params: `strictMatch`, `fields`, `grammaticalFeatures`, `lexicalCategory`, `domains`, `registers`
8. `GET /thesaurus/{source_lang}/{word_id}`
   - retrieve synonyms / antonyms
   - query params: `fields`, `strictMatch`
   - the official Swagger limits `fields` here to `synonyms`, `antonyms`, or both
9. `GET /sentences/{source_lang}/{word_id}`
   - retrieve example sentences from the corpus
   - query param: `strictMatch`
10. `GET /words/{source_lang}`
   - recommended dictionary lookup that accepts inflected or raw word input via query string
   - query params: `q`, `fields`, `grammaticalFeatures`, `domains`, `lexicalCategory`, `registers`

### Utility and metadata routes
11. `GET /languages`
   - list available source / target dictionary datasets
   - query params: `sourceLanguage`, `targetLanguage`
12. `GET /filters`
   - list all valid filters
13. `GET /filters/{endpoint}`
   - list valid filters for one endpoint
14. `GET /fields`
   - list available fields
15. `GET /fields/{endpoint}`
   - list fields for one endpoint
16. `GET /lexicalCategories/{source_lang}`
   - list monolingual lexical categories
17. `GET /lexicalCategories/{source_lang}/{target_lang}`
   - list bilingual lexical categories
18. `GET /registers/{source_lang}`
   - list monolingual registers
19. `GET /registers/{source_lang}/{target_lang}`
   - list bilingual registers
20. `GET /domains/{source_lang}`
   - list monolingual domains
21. `GET /domains/{source_lang}/{target_lang}`
   - list bilingual domains
22. `GET /grammaticalFeatures/{source_lang}`
   - list monolingual grammatical features
23. `GET /grammaticalFeatures/{source_lang}/{target_lang}`
   - list bilingual grammatical features
24. `GET /pronunciations/{source_lang}/{word_id}`
   - pronunciation-only retrieval route
   - query param: `lexicalCategory`
   - official Swagger restricts pronunciation datasets to `en-au`, `en-gb`, `en-in`, and `en-us`

## Pagination
- pagination is only documented on the three search-style routes:
  - `/search/{source_lang}`
  - `/search/thesaurus/{source_lang}`
  - `/search/translations/{source_lang}/{target_lang}`
- `limit` default and max are both documented as `5000`
- `offset + limit` must not exceed `10000`
- no cursor pagination is documented

## Rate limits
- the reviewed paid-plan docs did not publish a general numeric live rate-limit table
- the official sandbox page does publish a finite trial allowance of `500` calls total
- the sandbox is also restricted to words beginning with the first letter of the alphabet (or language-specific equivalent documented on the sandbox page)

## Error and response notes
The official response-codes page documents:
- `200 OK`
- `400 Bad Request`
- `401 Unauthorized`
- `403 Forbidden`
- `404 Not Found`
- `414 Request URI Too Long`
- `429 Usage Limit Exceeded`
- `500 Internal Server Error`

Important official wording to preserve:
- `400` includes unknown filters and same-source/target-language translation requests
- `404` can also occur for sandbox users when the word does not begin with the first letter allowed by the sandbox
- the official page's descriptions for `414` and `429` are counterintuitive: it describes `414` as a plan-limit issue and `429` as a too-long `word_id` / sandbox-overuse issue; this file preserves that wording instead of silently normalizing it

## Important usage notes
- the endpoint-overview page explicitly recommends `Words` instead of `Entries` for new integrations
- the making-requests page explicitly recommends using `Lemmas` when a word such as `running` must be resolved to a headword before other lookups
- the pronunciations route is marked on the official Swagger/docs as an alpha-stage endpoint
- the translations capability page recommends a workflow of `Search Translations -> Translations -> optional Words enrichment` when user input may be inflected or uncertain

## Verification notes
This file was manually rebuilt from Oxford's current first-party homepage, endpoint-overview pages, getting-started and error/language docs, and the first-party Swagger document exposed by the official documentation site.
