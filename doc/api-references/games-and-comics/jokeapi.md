# JokeAPI

## Overview
- Provider: JokeAPI
- Category: Games & Comics
- Official docs: `https://sv443.net/jokeapi/v2/`
- Base URL: `https://v2.jokeapi.dev`
- Auth: no auth required for normal use; optional whitelist token support exists for special clients
- HTTPS: yes
- Response formats: JSON by default; also XML, YAML, and plain text via `?format=`
- Confirmed routes: `11`

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/joke/{CATEGORY}` | path `CATEGORY`; query `safe-mode`, `format`, `blacklistFlags`, `type`, `contains`, `idRange`, `lang`, `amount` | Primary joke-fetching route. Category path supports a single category or multiple categories combined with separators; docs list `Any`, `Misc`, `Programming`, `Dark`, `Pun`, `Spooky`, `Christmas`. |
| GET | `/info` | query `format`, `lang` | Returns API version info, joke counts, categories, flags, formats, supported languages, ID ranges, safe-joke counts, and other metadata. |
| GET | `/categories` | query `format`, `lang` | Returns categories and category aliases. |
| GET | `/langcode/{LANGUAGE}` | path `LANGUAGE`; query `format`, `lang` | Fuzzy language-name lookup to ISO 639-1 code. |
| GET | `/languages` | query `format`, `lang` | Returns supported joke languages and supported system-message languages. |
| GET | `/flags` | query `format`, `lang` | Returns available blacklist flags. |
| GET | `/formats` | query `format`, `lang` | Returns supported response formats. |
| GET | `/ping` | query `format`, `lang` | Lightweight uptime/health probe returning `Pong!`. |
| GET | `/endpoints` | query `format` | Returns the documented endpoint list with supported params. Docs explicitly note `lang` does not work here. |
| POST | `/submit` | query `dry-run`; JSON body joke payload | Programmatic joke submission endpoint. Live dry-run returned `201`. |
| PUT | `/submit` | query `dry-run`; JSON body joke payload | Official docs say PUT remains accepted for backwards compatibility, though it is discouraged and may be deprecated later. Live dry-run returned `201`. |

## Authentication and token behavior
- The official docs say JokeAPI can be used without API tokens, registration, membership, or payment.
- Official rate-limited/whitelist note:
  - temporary API tokens may be issued if something breaks or if a business needs more than the public limit
  - if such a token is issued, it is sent via the `Authorization` header
  - the API can reply with a `Token-Valid` response header set to `1` or `0`
- For standard public use, no auth is required.

## Joke endpoint parameters
- `safe-mode`: excludes unsafe content
- `format`: `json`, `xml`, `yaml`, or `txt`; invalid or missing values fall back to JSON per docs
- `blacklistFlags`: comma- or plus-separated flags; documented flags are `nsfw`, `religious`, `political`, `racist`, `sexist`, `explicit`
- `type`: filter to `single` and/or `twopart`
- `contains`: substring match; special characters must be percent-encoded
- `idRange`: single ID or range delimited with `-`, `,`, or `+`
- `lang`: ISO 639-1 joke/system language code
- `amount`: number of jokes to return; docs say max `10`, invalid values default to `1`

## Submission request notes
- `/submit` only accepts JSON payloads.
- Docs require `formatVersion: 3` in the request body.
- Submission payload must follow the joke object structure.
- Required structural differences by joke type:
  - `single`: use `joke`; omit `setup` and `delivery`
  - `twopart`: use `setup` and `delivery`; omit `joke`
- `category` must be a valid category other than `Any`.
- `flags` must be an object with boolean fields:
  - `nsfw`
  - `religious`
  - `political`
  - `racist`
  - `sexist`
  - `explicit`
- `?dry-run` validates without saving the joke.
- Official docs say accepted submissions return HTTP `201`.

## Rate limits, errors, and format notes
- Official public limit: `120 requests per minute`.
- The docs say the limit exists because the API has been targeted by DoS attacks.
- The public docs emphasize manually curated joke submissions.
- Response-format support across the API:
  - JSON default
  - XML
  - YAML
  - plain text (`txt`)
- The docs distinguish joke languages from system-message languages; if a suitable system language does not exist, system messages fall back to English.

## Live verification notes
- `GET /info` returned `200` and included `version`, total joke counts, categories, and language metadata.
- `GET /categories` returned `200` and category data including aliases.
- `GET /langcode/German` returned `200` with `code: "de"`.
- `GET /languages` returned `200` with `defaultLanguage`, `jokeLanguages`, and `systemLanguages`.
- `GET /flags` returned `200` with all six blacklist flags.
- `GET /formats` returned `200` with `json`, `xml`, `yaml`, and `txt`.
- `GET /ping` returned `200` with `ping: "Pong!"`.
- `GET /endpoints` returned `200` and matched the docs' route list and supported params.
- `GET /joke/Programming?amount=2&type=single&lang=en` returned `200` with a multi-joke payload using the `amount` wrapper.
- `POST /submit?dry-run` returned `201` with `"Dry Run complete! No errors were found."`.
- `PUT /submit?dry-run` also returned `201`, confirming the documented backwards-compatible method.

## Important usage notes
- The API has moved to its own domain. The docs say the old base `https://sv443.net/jokeapi/v2` still works for backwards compatibility, but clients should use `https://v2.jokeapi.dev/`.
- The `/joke/{CATEGORY}` route is the main consumer endpoint; most filtering happens through query parameters rather than additional paths.
- When `amount >= 2`, the joke response shape changes from a single-joke object to a wrapper containing `amount` and `jokes[]`.
- If a project cannot contain explicit jokes, the official docs recommend enabling safe mode.

## Integration notes for fireROUTE
- Treat JokeAPI as one core content route (`/joke/{CATEGORY}`) plus several metadata/helper routes.
- Preserve category combinations and filter params as raw passthrough fields instead of over-normalizing them.
- Support format negotiation explicitly if fireROUTE wants non-JSON passthroughs, but prefer JSON for canonical adapters.
- Handle the multi-joke response shape separately when `amount` is greater than 1.
- Expose `/submit` only behind explicit opt-in because it has side-effect semantics outside `dry-run`.

## Sources inspected
- `https://sv443.net/jokeapi/v2/`
- `https://v2.jokeapi.dev/endpoints`
- live checks:
  - `https://v2.jokeapi.dev/info`
  - `https://v2.jokeapi.dev/categories`
  - `https://v2.jokeapi.dev/langcode/German`
  - `https://v2.jokeapi.dev/languages`
  - `https://v2.jokeapi.dev/flags`
  - `https://v2.jokeapi.dev/formats`
  - `https://v2.jokeapi.dev/ping`
  - `https://v2.jokeapi.dev/endpoints`
  - `https://v2.jokeapi.dev/joke/Programming?amount=2&type=single&lang=en`
  - `POST https://v2.jokeapi.dev/submit?dry-run`
  - `PUT https://v2.jokeapi.dev/submit?dry-run`
