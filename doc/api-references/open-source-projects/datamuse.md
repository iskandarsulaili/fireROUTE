# Datamuse

## Provider metadata
- Category: `Open Source Projects`
- Provider slug: `datamuse`
- Docs used manually:
  - `https://www.datamuse.com/api/`
- Confirmed REST API base URL: `https://api.datamuse.com`
- Primary media type: JSON
- Authentication model surfaced in docs: none; the public API can be used without an API key up to the documented free-use threshold
- Current API version noted on the official page: `1.1`
- Manually confirmed routes in this pass: `2`

## Authentication
From the official Datamuse API page:
- no API key or OAuth flow is required for normal public use
- the service can be used without restriction and without an API key for up to `100,000 requests per day`
- the page warns that requests above that level may be rate-limited without notice
- Datamuse asks higher-volume or customer-facing users to contact the service directly

## Common request/response conventions
- Base URL: `https://api.datamuse.com`
- reviewed operations use `GET`
- both documented resources return JSON arrays of word objects
- successful responses can be empty arrays (`[]`) when nothing matches
- standard result objects include at least:
  - `word` - matched vocabulary entry
  - `score` - ranking score used for ordering
- optional metadata can be requested with the `md` parameter and is returned in extra fields such as `tags`, syllable counts, or frequency values

## Manually confirmed endpoint set

### 1) Word-finding queries
- Method: `GET`
- Path: `/words`
- Full URL: `https://api.datamuse.com/words`
- Purpose: return words or multiword expressions matching semantic, spelling, sound, relation, and context constraints
- Query parameters confirmed on the official page:
  - `ml` - means-like semantic constraint
  - `sl` - sounds-like constraint
  - `sp` - spelled-like string or wildcard pattern
  - `rel_[code]` - lexical relation constraint; documented codes include `jja`, `jjb`, `syn`, `trg`, `ant`, `spc`, `gen`, `com`, `par`, `bga`, `bgb`, `rhy`, and `nry`
  - `v` - vocabulary identifier; official page documents default English and `es` for Spanish
  - `topics` - topic hint words; at most 5 words, space- or comma-delimited
  - `lc` - left-context hint
  - `rc` - right-context hint
  - `max` - maximum number of results, default `100`, maximum `1000`
  - `md` - metadata flags requesting extra lexical knowledge in the response
  - `ipa` - when used with pronunciation metadata, returns pronunciation in IPA instead of Arpabet
  - `qe` - query echo; prepends an item describing the query from another parameter
- Response notes explicitly documented on the official page:
  - returns a JSON list of word objects
  - each object includes `word` and a numeric `score`
  - optional metadata fields are added when `md` is present
  - multiword expressions can appear as space-delimited strings
- Important usage notes from the official page:
  - the first group of constraints (`ml`, `sl`, `sp`, `rel_[code]`, `v`) act as hard constraints
  - `topics`, `lc`, and `rc` act as context hints that mostly affect ranking rather than membership
  - wildcard spelling patterns support `*` and `?`
  - metadata is available for both the default English vocabulary and the documented Spanish vocabulary

### 2) Suggest/autocomplete queries
- Method: `GET`
- Path: `/sug`
- Full URL: `https://api.datamuse.com/sug`
- Purpose: provide autocomplete-style suggestions for large-vocabulary search boxes
- Query parameters confirmed on the official page:
  - `s` - required prefix hint string entered by the user so far
  - `max` - maximum number of results, default `10`, maximum `1000`
  - `v` - vocabulary identifier; same meaning as on `/words`
- Response notes explicitly documented on the official page:
  - returns JSON output similar to `/words`
  - results are sorted by popularity
  - results may include spelling corrections or semantically similar terms when no exact prefix matches are found
- Important usage notes from the official page:
  - the input string does not necessarily remain a strict prefix of every returned suggestion
  - the endpoint is intended as a backend for autocomplete widgets

## Pagination
- no page-number or cursor pagination is documented
- both reviewed endpoints use a `max` query parameter for result-size control
- `/words` defaults to `100` results and caps at `1000`
- `/sug` defaults to `10` results and caps at `1000`

## Rate limits
From the official Datamuse API page:
- public use without an API key is allowed up to `100,000 requests per day`
- requests above that level may be rate-limited without notice
- the landing page also displays a live operational metric labelled `Current queries per second`, but it is presented as a status readout rather than a contractual limit

## Error and response notes
- the official page documents empty-array success responses when nothing matches
- the reviewed page does not publish a dedicated HTTP error table or structured error schema
- results are ordered by relatedness strength for semantic queries and otherwise by estimated popularity in written text
- the `score` field is explicitly described as useful for ranking only, not as a stable interpretable metric

## Important usage notes
- pronunciation metadata requested with `md=r` is returned in the `tags` field with a `pron:` prefix
- adding `ipa=1` changes pronunciation output from Arpabet to IPA when pronunciation metadata is requested
- the `qe` parameter can be used to retrieve metadata about a specific word by echoing the query itself into the result list
- Datamuse notes that it may add new metadata fields over time, but materially new API versions will use differentiated URLs

## Verification notes
This file was manually rebuilt from the official Datamuse API page using browser inspection.