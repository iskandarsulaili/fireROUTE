# Synonyms

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `synonyms`
- Official pages reviewed manually:
  - `https://www.synonyms.com/synonyms_api.php`
  - `https://www.synonyms.com/`
- Confirmed API base URL: `https://www.stands4.com/services/v2`
- Authentication: query-parameter credentials (`uid` + `tokenid`)
- Primary formats: XML by default, optional JSON
- Manually confirmed routes: `1`

## What the official pages currently show
The current Synonyms API page on Synonyms.com is live and exposes a browser-readable STANDS4 Web Services reference. The page explicitly describes the service as programmatic access to synonyms, thesaurus data, and antonyms for a given word.

The reviewed docs explicitly publish:
- request URL `https://www.stands4.com/services/v2/syno.php`
- required credentials `uid` and `tokenid`
- required lookup parameter `word`
- optional `format` parameter with `xml` and `json`
- response elements `results`, `result`, `term`, `definition`, `partofspeech`, `synonyms`, and `antonyms`
- free usage limit of `100 queries per day`

The official Synonyms.com root remained a valid first-party alternative page in this review, but the useful route-level details were on the dedicated API page.

## Authentication
- Auth is required.
- The docs list these required query parameters:
  - `uid` - API user id
  - `tokenid` - valid developer token id
- The docs present both values directly in the sample request URL rather than as headers.

## Manually confirmed endpoint set

### 1) Synonyms / antonyms lookup
- Method: `GET`
- Path: `/syno.php`
- Full URL: `https://www.stands4.com/services/v2/syno.php`
- Required query parameters:
  - `uid` - API user id
  - `tokenid` - developer token id
  - `word` - the word to look up
- Optional query parameters:
  - `format` - response format; docs say `xml` or `json`, default `xml`
- Official sample request:
  - `https://www.stands4.com/services/v2/syno.php?uid=1001&tokenid=tk324324&word=consistent&format=xml`

## Response format notes
The official docs define these response elements:
- `results` - contains all query responses
- `result` - contains each individual response
- `term` - the term the result refers to
- `definition` - definition for the specific sense
- `partofspeech` - e.g. adjective or verb
- `synonyms` - comma-delimited synonym list
- `antonyms` - comma-delimited antonym list

The page includes an XML sample response. The same route can also return JSON when `format=json` is supplied.

## Pagination
- No pagination parameters are documented.
- The route appears to return all matching senses for the supplied word in a single response.

## Rate limits
- The official page says the service is free for up to `100 queries per day`.
- For commercial usage, the page says to contact STANDS4 for a premium license.

## Error handling
- The reviewed API page does not publish a structured error-code table.
- It does clearly document the required query parameters, so missing or invalid credentials should be treated as request failures even though the page does not provide a detailed error schema.

## Important usage notes
- This provider is not anonymous; it requires STANDS4 developer credentials.
- The route supports both synonym and antonym retrieval in one request.
- The docs are on Synonyms.com, but the actual request host is `www.stands4.com`.

## Verification note
This file was rebuilt manually from the current official Synonyms API page and the official Synonyms.com root using browser-based review only.