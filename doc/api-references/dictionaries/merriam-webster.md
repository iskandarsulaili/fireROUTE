# Merriam-Webster

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `merriam-webster`
- Official docs used manually:
  - `https://dictionaryapi.com/products/index`
  - `https://dictionaryapi.com/products/api-collegiate-dictionary`
  - `https://dictionaryapi.com/products/api-collegiate-thesaurus`
  - `https://dictionaryapi.com/products/api-medical-dictionary`
  - `https://dictionaryapi.com/products/api-spanish-dictionary`
  - `https://dictionaryapi.com/info/frequently-asked-questions`
- Confirmed API base URL: `https://www.dictionaryapi.com`
- Primary response format: JSON
- Authentication: API key in the `key` query parameter
- Manually confirmed routes in this pass: `4`

## Authentication, quotas, and usage terms
From the reviewed official site and FAQ:
- you must register for an account to obtain API keys
- after registration and email verification, the FAQ says you receive two API keys
- the FAQ says non-commercial use is free
- the FAQ states the standard quota is `1,000` queries per API key per day
- commercial use or usage above `1,000` queries per day requires a licensing arrangement
- the FAQ also states that applications using Merriam-Webster APIs must feature the Merriam-Webster logo

## Confirmed API surface
The reviewed product pages consistently show the same versioned pattern:
- base prefix: `https://www.dictionaryapi.com/api/v3/references/{reference}/json/{headword}?key=<api-key>`
- required request input on reviewed examples:
  - `{headword}` path segment for the lookup term
  - `key` query parameter for the API key
- reviewed product pages also list these query options conceptually:
  - headword lookup
  - stems / inflections / variants lookup behavior

### 1) Collegiate Dictionary lookup
- Method: `GET`
- Path: `/api/v3/references/collegiate/json/{headword}`
- Example shown on the official page:
  - `https://www.dictionaryapi.com/api/v3/references/collegiate/json/voluminous?key=<api-key>`
- Purpose: retrieve Merriam-Webster Collegiate Dictionary entries
- Officially highlighted response/data features:
  - definitions
  - examples
  - etymologies
  - synonym and usage paragraphs
  - pronunciation symbols
  - audio pronunciations
  - illustrations
  - spelling suggestions

### 2) Collegiate Thesaurus lookup
- Method: `GET`
- Path: `/api/v3/references/thesaurus/json/{headword}`
- Example shown on the official page:
  - `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/umpire?key=<api-key>`
- Purpose: retrieve thesaurus entries tied to Collegiate Dictionary headwords
- Officially highlighted response/data features:
  - synonyms
  - related words
  - near antonyms
  - antonyms
  - idiomatic phrases
  - concise definitions
  - examples
  - spelling suggestions

### 3) Medical Dictionary lookup
- Method: `GET`
- Path: `/api/v3/references/medical/json/{headword}`
- Example shown on the official page:
  - `https://www.dictionaryapi.com/api/v3/references/medical/json/doctor?key=<api-key>`
- Purpose: retrieve medical dictionary entries
- Officially highlighted response/data features:
  - definitions
  - pronunciation symbols
  - audio pronunciations
  - illustrations
  - spelling suggestions

### 4) Spanish-English Dictionary lookup
- Method: `GET`
- Path: `/api/v3/references/spanish/json/{headword}`
- Example shown on the official page:
  - `https://www.dictionaryapi.com/api/v3/references/spanish/json/language?key=<api-key>`
- Purpose: retrieve bilingual Spanish-English dictionary entries
- Officially highlighted response/data features:
  - English-to-Spanish and Spanish-to-English translations
  - examples
  - pronunciation symbols
  - audio pronunciations
  - spelling suggestions

## Parameters and response notes
From the reviewed product pages:
- `headword` is supplied as the final path segment in each example request URL
- `key` is always supplied as a query parameter
- the reviewed pages describe JSON field documentation separately under `https://dictionaryapi.com/products/json`
- example response objects on the reviewed product pages consistently include:
  - `meta`
  - `hwi`
  - `fl`
  - `def`
- route-specific metadata differs by reference type, for example:
  - thesaurus entries include synonym/antonym-oriented arrays
  - Spanish entries include bilingual translation structures
  - medical entries emphasize medical headwords and pronunciation/audio metadata

## Pagination, rate limits, and error notes
- no pagination model is documented on the reviewed product pages or FAQ
- the reviewed official FAQ documents a quota of `1,000` queries per API key per day
- the reviewed product pages do not publish a formal HTTP error/status-code reference
- instead of a dedicated error guide, the reviewed product pages emphasize spelling-suggestion support when exact dictionary content is not available

## fireROUTE notes
- Merriam-Webster's current public developer surface is a family of reference-specific lookup endpoints under one shared `/api/v3/references/.../json/...` pattern.
- The reviewed official pages are strong on response-shape examples and product-level differences, but weak on explicit error-schema documentation.
- fireROUTE should preserve the reference family (`collegiate`, `thesaurus`, `medical`, `spanish`) as a first-class provider option rather than flattening them into one undifferentiated lookup.

## Verification notes
This file was manually rebuilt after reviewing the live official Merriam-Webster developer site and FAQ in the browser.