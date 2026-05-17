# Wordnik

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `wordnik`
- Official docs used manually:
  - `https://developer.wordnik.com/`
  - `https://developer.wordnik.com/docs`
  - `https://developer.wordnik.com/gettingstarted`
  - `https://developer.wordnik.com/api-docs/swagger.json`
- Confirmed API host: `https://api.wordnik.com`
- Confirmed API base path: `/v4`
- Confirmed full base URL: `https://api.wordnik.com/v4`
- Primary response format: JSON
- Authentication model: API key in query parameter `api_key`
- Manually confirmed routes in this pass: `16`

## Authentication
From the reviewed official docs and Swagger definition:
- the API uses query-parameter auth
- the security definition names the credential `api_key`
- callers request a key through the Wordnik developer portal after logging into a Wordnik account
- the getting-started page says API-key approval may take up to seven days unless the expedited donation path is used

## Rate limits
From the official getting-started page:
- limits are calculated per minute and per hour
- remaining and configured limits are exposed in response headers:
  - `x-ratelimit-remaining-hour`
  - `x-ratelimit-remaining-minute`
  - `x-ratelimit-limit-minute`
  - `x-ratelimit-limit-hour`
- the page notes remaining-limit values may fluctuate slightly between calls while the service reconciles counters
- the reviewed pages do not publish one universal numeric quota table for every plan

## Common request/response conventions
- Host: `https://api.wordnik.com`
- Base path: `/v4`
- All routes visible in the reviewed Swagger definition use `GET`
- API responses are JSON objects or arrays
- many list-like endpoints use `limit` and sometimes `skip`
- the getting-started page explicitly says attribution-bearing responses include `attributionText`, and that this attribution must be displayed alongside the returned text

## Manually confirmed endpoint set

| Method | Path | Purpose | Key parameters confirmed from official docs |
|---|---|---|---|
| `GET` | `/word.json/{word}/audio` | fetch audio metadata for a word | `word`, optional `useCanonical`, `limit` |
| `GET` | `/word.json/{word}/definitions` | return dictionary definitions | `word`, optional `limit`, `partOfSpeech`, `includeRelated`, `sourceDictionaries`, `useCanonical`, `includeTags` |
| `GET` | `/word.json/{word}/etymologies` | fetch etymology data | `word`, optional `useCanonical` |
| `GET` | `/word.json/{word}/examples` | return usage examples | `word`, optional `includeDuplicates`, `useCanonical`, `skip`, `limit` |
| `GET` | `/word.json/{word}/frequency` | return usage over time | `word`, optional `useCanonical`, `startYear`, `endYear` |
| `GET` | `/word.json/{word}/hyphenation` | return syllable information | `word`, optional `useCanonical`, `sourceDictionary`, `limit` |
| `GET` | `/word.json/{word}/phrases` | fetch bi-gram phrases | `word`, optional `limit`, `wlmi`, `useCanonical` |
| `GET` | `/word.json/{word}/pronunciations` | return text pronunciations | `word`, optional `useCanonical`, `sourceDictionary`, `typeFormat`, `limit` |
| `GET` | `/word.json/{word}/relatedWords` | fetch related-word graph data | `word`, optional `useCanonical`, `relationshipTypes`, `limitPerRelationshipType` |
| `GET` | `/word.json/{word}/scrabbleScore` | return Scrabble score | `word` |
| `GET` | `/word.json/{word}/topExample` | return one top example | `word`, optional `useCanonical` |
| `GET` | `/words.json/randomWord` | return one random word | optional dictionary/part-of-speech/corpus-length filters such as `hasDictionaryDef`, `includePartOfSpeech`, `excludePartOfSpeech`, `minCorpusCount`, `maxCorpusCount`, `minDictionaryCount`, `maxDictionaryCount`, `minLength`, `maxLength` |
| `GET` | `/words.json/randomWords` | return multiple random words | same family of filters as `randomWord`, plus `sortBy`, `sortOrder`, `limit` |
| `GET` | `/words.json/reverseDictionary` | reverse-dictionary search | required `query`; optional `findSenseForWord`, source-dictionary filters, part-of-speech filters, corpus/length filters, `expandTerms`, `includeTags`, `sortBy`, `sortOrder`, `skip`, `limit` |
| `GET` | `/words.json/search/{query}` | search words | `query`, optional `allowRegex`, `caseSensitive`, part-of-speech filters, corpus/dictionary/length filters, `skip`, `limit` |
| `GET` | `/words.json/wordOfTheDay` | fetch a specific word-of-the-day entry | optional `date` in `yyyy-MM-dd` |

## Route notes

### Word-scoped endpoints
The reviewed Swagger definition exposes `11` word-scoped lookup routes under `/word.json/{word}`. Common patterns across this family:
- `word` is always a required path parameter
- many endpoints accept `useCanonical` to normalize inflected forms like `cats -> cat`
- several endpoints expose a simple `limit`
- example/history style routes use `skip` and `limit` instead of page numbers

### Collection and discovery endpoints
The reviewed Swagger definition exposes `5` broader discovery routes under `/words.json`.
- random-word endpoints support many optional filtering parameters for corpus count, dictionary count, length, and part-of-speech inclusion/exclusion
- reverse-dictionary and search routes support the broadest filter sets in the reviewed surface
- `wordOfTheDay` is date-addressable through the optional `date` query parameter

## Pagination
- the API does not expose one universal pagination envelope in the reviewed docs
- where present, traversal is parameter-driven:
  - `skip` + `limit` on routes such as examples, reverse-dictionary, and search
  - plain `limit` on many smaller lookup endpoints
- random-word routes are filter-based rather than paginated

## Error and response notes
- the reviewed getting-started and docs pages do not publish a consolidated global error-code table
- reviewed route docs focus on parameters and response models via Swagger UI
- the getting-started page emphasizes attribution requirements rather than a separate centralized error reference

## Important usage notes
- the official getting-started page shows direct browser/curl usage such as `http://api.wordnik.com/v4/words.json/randomWord?api_key=YOURKEYHERE`; the reviewed Swagger definition separately confirms the canonical host is `api.wordnik.com`, scheme `https`, and base path `/v4`
- if an API response contains `attributionText`, the docs explicitly require that attribution text to be displayed alongside the returned content
- if your site or app uses Wordnik data, the official getting-started page says you must link to Wordnik and cite Wordnik as your source

## Verification notes
This file was manually rebuilt from the live Wordnik developer portal, Swagger UI, getting-started guide, and the official Swagger JSON definition.