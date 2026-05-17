# Words

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `words`
- Docs used manually:
  - `https://www.wordsapi.com/docs/`
- Confirmed base URL in the reviewed docs: `https://wordsapiv1.p.mashape.com`
- Primary media type: JSON
- Authentication model surfaced in docs: RapidAPI key header
- Manually confirmed routes in this pass: `5`

## Authentication
From the official documentation page:
- access is provided through RapidAPI
- the auth section explicitly documents `X-Mashape-Key: <required>`
- some route examples on the same docs page instead show `Authorization: <required>`
- because the page itself is inconsistent, fireROUTE should treat the documented RapidAPI key requirement as canonical and preserve the header-name discrepancy as an official-doc quirk

## Common request/response conventions
- Base URL: `https://wordsapiv1.p.mashape.com`
- reviewed routes use `GET`
- the docs say JSON is returned for all responses, including errors
- word-detail responses commonly include fields such as:
  - `word`
  - `results[]`
  - `results[].definition`
  - `results[].partOfSpeech`
  - lexical relation arrays like `synonyms`, `antonyms`, `typeOf`, `hasTypes`, and related fields
  - `syllables.count`
  - `syllables.list[]`
  - `pronunciation`
  - `frequency`
- search responses use a separate envelope with:
  - `query`
  - `results.total`
  - `results.data[]`

## Manually confirmed endpoint set

### 1) Get a word
- Method: `GET`
- Path: `/words/{word}`
- Full URL pattern: `https://wordsapiv1.p.mashape.com/words/{word}`
- Purpose: retrieve the full known word entry grouped by definitions
- Path parameters confirmed on the official page:
  - `word` - the target word to look up
- Authentication/header notes confirmed on the official page:
  - `X-Mashape-Key: <required>` in the auth section
- Response fields explicitly shown in the official example:
  - `results[]`
  - `results[].definition`
  - `results[].partOfSpeech`
  - `results[].synonyms`
  - `results[].typeOf`
  - `results[].derivation`
  - `syllables.count`
  - `syllables.list[]`
  - `pronunciation.all`
- Important usage notes from the official page:
  - unless you ask for specific details, the API returns everything known about a word
  - pronunciation and syllable data are included on the main word route when available

### 2) Get a specific detail set for a word
- Method: `GET`
- Path: `/words/{word}/{detailType}`
- Full URL pattern: `https://wordsapiv1.p.mashape.com/words/{word}/{detailType}`
- Purpose: return one selected lexical facet of the word
- Path parameters confirmed on the official page:
  - `word` - the target word
  - `detailType` - one of the documented detail names
- Detail types explicitly documented on the reviewed page include:
  - `definitions`
  - `synonyms`
  - `antonyms`
  - `examples`
  - `typeOf`
  - `hasTypes`
  - `partOf`
  - `hasParts`
  - `instanceOf`
  - `hasInstances`
  - `similarTo`
  - `also`
  - `entails`
  - `memberOf`
  - `hasMembers`
  - `substanceOf`
  - `hasSubstances`
  - `inCategory`
  - `hasCategories`
  - `usageOf`
  - `hasUsages`
  - `inRegion`
  - `regionOf`
  - `pertainsTo`
- Response example explicitly shown on the official page:
  - for `/synonyms`, the JSON object contains a top-level `synonyms` array
- Important usage notes from the official page:
  - this route is for one facet at a time, not the full record
  - the reviewed docs present detail types as the official searchable vocabulary of subresources

### 3) Get rhymes for a word
- Method: `GET`
- Path: `/words/{word}/rhymes`
- Full URL pattern: `https://wordsapiv1.p.mashape.com/words/{word}/rhymes`
- Purpose: retrieve rhyming words
- Path parameters confirmed on the official page:
  - `word` - the input term whose rhymes should be returned
- Response fields explicitly shown in the official example:
  - `word`
  - `rhymes`
  - `rhymes.all[]`
- Important usage notes from the official page:
  - rhymes are not returned by default on the main word route
  - the docs explain that the response may contain multiple rhyme arrays keyed by part of speech when pronunciation differs by usage

### 4) Get detailed frequency information for a word
- Method: `GET`
- Path: `/words/{word}/frequency`
- Full URL pattern: `https://wordsapiv1.p.mashape.com/words/{word}/frequency`
- Purpose: return detailed usage-frequency metrics
- Path parameters confirmed on the official page:
  - `word` - the word being analyzed
- Response fields explicitly shown in the official example:
  - `word`
  - `frequency.zipf`
  - `frequency.perMillion`
  - `frequency.diversity`
- Important usage notes from the official page:
  - the main word route exposes only a summarized frequency score
  - this dedicated route expands the score into the documented `zipf`, `perMillion`, and `diversity` metrics

### 5) Search the dictionary
- Method: `GET`
- Path: `/words`
- Full URL pattern: `https://wordsapiv1.p.mashape.com/words`
- Purpose: search for matching words using orthographic, phonetic, grammatical, and metadata filters
- Query parameters explicitly documented on the official page:
  - `letterPattern` - regular-expression match on spelling
  - `letters` - exact number of letters
  - `lettersMin` - minimum letters
  - `lettersMax` - maximum letters
  - `pronunciationPattern` - regular-expression match on pronunciation
  - `sounds` - exact number of phonemes
  - `soundsMin` - minimum phonemes
  - `soundsMax` - maximum phonemes
  - `partOfSpeech` - require at least one definition with that part of speech
  - `hasDetails` - require one or more detail types; comma-separated values allowed
  - `limit` - maximum results per request; documented range `1` to `100`, default `100`
  - `page` - page number; default `1`
  - `random=true` - return a single random word matching the current search criteria
- Response fields explicitly shown in the official search example:
  - `query.letterPattern`
  - `query.limit`
  - `query.page`
  - `results.total`
  - `results.data[]`
- Important usage notes from the official page:
  - regex inputs should be URL encoded before sending requests
  - adding `random=true` changes the behavior to return a single word entry rather than a paginated search list

## Pagination
- search pagination is documented via the `page` parameter on `GET /words`
- `limit` must be between `1` and `100` and defaults to `100`
- the search response includes `query.page`, `query.limit`, and `results.total`
- the docs do not describe cursor pagination

## Rate limits
- the reviewed official docs page did not publish numeric rate limits
- the page ties access to RapidAPI credentials but does not state a specific request-per-minute or request-per-day quota in the reviewed documentation

## Errors and status codes
From the official `Errors` section:
- `400` - bad request; request invalid
- `401` - unauthorized; API key wrong
- `404` - not found; no matching word found
- `500` - internal server error; retry later
- the docs say JSON is returned for errors as well as for successful responses

## Important usage notes
- the docs treat pronunciation as IPA and warn that the single quote mark denotes primary stress
- the word-details route family is effectively the main lexical relation surface; many semantics are encoded as distinct `detailType` values rather than extra query parameters
- the official docs inconsistently show `X-Mashape-Key` in the auth section and `Authorization` in several endpoint examples; this is a documentation inconsistency, not something fireROUTE should silently normalize away
- `random=true` is documented as a modifier on the search route, not as a separate path

## Verification notes
This file was manually rebuilt from the official Words API documentation page using browser inspection.