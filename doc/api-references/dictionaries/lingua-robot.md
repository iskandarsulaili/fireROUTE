# Lingua Robot

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `lingua-robot`
- Docs used manually:
  - `https://www.linguarobot.io/`
  - `https://linguarobot.docs.apiary.io/`
  - `https://linguarobot.docs.apiary.io/api-description-document`
- Confirmed API base URL: `https://lingua-robot.p.rapidapi.com`
- Primary media type: JSON
- Authentication model: RapidAPI key header
- Manually confirmed routes in this pass: `1`

## Authentication
From the official homepage and Apiary reference:
- access requires a RapidAPI subscription
- every request must include `X-RapidAPI-Key`
- the official example is:

  `curl --header 'X-Rapidapi-key: YOUR_API_KEY' https://lingua-robot.p.rapidapi.com/language/v1/entries/en/example`

- the reviewed official docs do not describe an OAuth flow or any session-based auth
- a live unauthenticated probe to the official example route returned `401` with `{"message":"Invalid API key..."}`

## Common request/response conventions
- Base URL: `https://lingua-robot.p.rapidapi.com`
- reviewed route uses `GET`
- the Apiary introduction describes the service as RESTful
- successful responses are documented as JSON
- official docs say error responses use `application/problem+json` and follow RFC7807-style structure
- the homepage sample response shows a top-level `entries[]` array with fields such as:
  - `entry`
  - `pronunciations[]`
  - `interpretations[]`
  - `lexemes[]`
  - `license`
  - `sourceUrls[]`

## Manually confirmed endpoint set

### 1) Retrieve an entry
- Method: `GET`
- Path: `/language/v1/entries/en/{entry}`
- Full URL pattern: `https://lingua-robot.p.rapidapi.com/language/v1/entries/en/{entry}`
- Purpose: return dictionary data for one English lexical entry
- Path parameters confirmed on the official Apiary page:
  - `entry` - the word, phrasal verb, or multiword expression to retrieve
- Query parameters: none documented on the reviewed official pages
- Request headers explicitly documented:
  - `X-RapidAPI-Key: <required>`
  - `Accept: application/json`
- Officially described data returned by this route:
  - word definitions / meanings
  - synonyms and antonyms
  - audio and phonetic pronunciations
  - grammar inferred from inflectional endings
  - lemmas and base-word relationships
- Response fields explicitly visible in the official homepage / Apiary examples include:
  - `entries[]`
  - `entries[].entry`
  - `entries[].pronunciations[]`
  - `entries[].interpretations[]`
  - `entries[].lexemes[]`
  - `entries[].license`
  - `entries[].sourceUrls[]`

## Pagination
- no pagination parameters are documented on the reviewed official pages

## Rate limits
The official homepage publishes plan-level daily request allowances:
- Basic: `2500` requests / day
- Pro: `25000` requests / day
- Ultra: `250000` requests / day
- Mega: `2500000` requests / day

The homepage also shows paid overage pricing for those plans, but the reviewed docs do not publish a per-second or per-minute throttle table.

## Error and response notes
- the Apiary docs say error responses use `application/problem+json`
- a live unauthenticated probe to the official example route returned `401` and an API-key error message in JSON
- the reviewed official materials do not publish a full endpoint-by-endpoint status code table

## Important usage notes
- the official homepage currently markets additional languages as "coming soon", but the reviewed route documentation only confirmed the English path segment `/en/`
- the service data is compiled from Wiktionary
- the official docs say returned `sourceUrls` should be used for source attribution when republishing meanings or usage examples
- the official docs also note the underlying content is governed by `CC BY-SA 3.0`, and audio files may carry separate license requirements

## Verification notes
This file was manually rebuilt from Lingua Robot's official homepage, official Apiary reference, official downloadable API Blueprint, and a live unauthenticated probe of the published route.
