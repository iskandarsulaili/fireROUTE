# Free Dictionary

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `free-dictionary`
- Docs used manually:
  - `https://dictionaryapi.dev/`
  - `https://github.com/meetDeveloper/freeDictionaryAPI`
- Confirmed REST API base URL: `https://api.dictionaryapi.dev`
- Primary media type: JSON
- Authentication: none
- Manually confirmed routes in this pass: `1`

## Authentication
From the official homepage and linked official GitHub repository:
- no authentication is required for the reviewed public endpoint
- no API key, OAuth flow, or session setup is described on the reviewed official pages

## Common request/response conventions
- Base URL: `https://api.dictionaryapi.dev`
- reviewed route uses `GET`
- the homepage documents an English-entry lookup route under `/api/v2/entries/en/{word}`
- successful responses are JSON arrays of entry objects
- entry objects on the homepage example include `word`, `phonetic`, `phonetics[]`, `origin`, and `meanings[]`

## Manually confirmed endpoint set

### 1) Get English word definitions
- Method: `GET`
- Path: `/api/v2/entries/en/{word}`
- Full URL: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
- Purpose: return dictionary entries for an English word
- Path parameters:
  - `word` - the English word to define
- Query parameters: none documented on the reviewed official pages
- Response shape explicitly shown on the homepage example:
  - top-level JSON array
  - per-entry fields visible in the example:
    - `word`
    - `phonetic`
    - `phonetics[]`
      - `text`
      - `audio`
    - `origin`
    - `meanings[]`
      - `partOfSpeech`
      - `definitions[]`
        - `definition`
        - `example`
        - `synonyms[]`
        - `antonyms[]`
- Important usage notes from the official pages:
  - the homepage example is specifically for English and hard-codes the `/en/` segment
  - the linked GitHub README says the service previously used a v1 response format and that `v1` remains supported for backward compatibility, but the current homepage explicitly documents the `v2` route and response shape

## Pagination
- none published; the reviewed route returns a single array of dictionary entries for the requested word

## Rate limits
- the reviewed homepage and linked GitHub repository did not publish a numeric public rate limit

## Error and response notes
- the reviewed official pages focus on the success response structure
- no formal error schema or status-code table was published on the reviewed homepage text
- response format for successful lookups is JSON

## Important usage notes
- the homepage positions the API as free and donation-supported
- the official repository indicates the API response format changed between `v1` and `v2`; new integrations should follow the `v2` shape documented on the homepage
- because the public homepage only documents the `/en/{word}` route, this file only claims the English route that was explicitly visible in the reviewed materials

## Verification notes
This file was manually rebuilt from the official Free Dictionary homepage plus its linked official GitHub repository using browser inspection.