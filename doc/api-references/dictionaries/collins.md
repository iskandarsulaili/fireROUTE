# Collins

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `collins`
- Docs used manually:
  - `https://api.collinsdictionary.com/api/v1/documentation/html/`
  - `https://api.collinsdictionary.com/api/v1/documentation/wadl`
  - `https://api.collinsdictionary.com/`
- Confirmed API base URL: `https://api.collinsdictionary.com/api/v1`
- Primary media types confirmed in the official docs: JSON preferred, XML also documented
- Request methods confirmed in the official docs: `GET`
- Authentication model confirmed in this pass: `accessKey` header
- Manually confirmed routes in this pass: `17`

## Authentication
The official HTML and WADL docs do not explicitly name the auth header, but live first-party endpoint checks do:
- requesting `GET https://api.collinsdictionary.com/api/v1/dictionaries` without credentials returned `403` with `{"errorCode":"NoAccessKey","errorMessage":"No access key!"}`
- repeating the same request with a dummy `accessKey` header changed the response to `{"errorCode":"InvalidAccessKey","errorMessage":"Invalid access key!"}`
- based on that live first-party behavior, the current service expects an `accessKey` header
- no OAuth or session-based auth flow is described on the reviewed official pages

## Common request/response conventions
- Base URL: `https://api.collinsdictionary.com/api/v1`
- reviewed routes use `GET`
- the official docs expose JSON as the preferred representation (`application/json; qs=1`) and XML as an alternate representation (`application/xml; qs=.5`)
- route families are organized around dictionary codes under `/dictionaries/{dictCode}`
- the root host `https://api.collinsdictionary.com/` currently shows dictionary labels such as Spanish, French, German, Italian, Cobuild British, and Cobuild American, but the reviewed docs do not publish a formal `dictCode` enumeration table
- the official WADL contains a stale placeholder base of `http://www.example.com/api`; the real production base must be taken from the first-party HTML documentation and live service URLs instead

## Manually confirmed endpoint set

### Dictionary catalog and dictionary-scoped routes
1. `GET /dictionaries`
   - list available dictionaries
2. `GET /dictionaries/{dictCode}`
   - get metadata for one dictionary
   - path param: `dictCode`
3. `GET /dictionaries/{dictCode}/wordoftheday`
   - dictionary-specific word of the day
   - path param: `dictCode`
   - query params: `day`, `format`
4. `GET /dictionaries/{dictCode}/wordoftheday/preview`
   - preview dictionary-specific word of the day
   - path param: `dictCode`
   - query param: `day`
5. `GET /dictionaries/{dictCode}/search`
   - search within a dictionary
   - path param: `dictCode`
   - query params: `q`, `pagesize`, `pageindex`
6. `GET /dictionaries/{dictCode}/search/first`
   - return the first matching search hit
   - path param: `dictCode`
   - query params: `q`, `format`
7. `GET /dictionaries/{dictCode}/search/didyoumean`
   - spelling / suggestion lookup
   - path param: `dictCode`
   - query params: `q`, `entrynumber`

### Topic routes
8. `GET /dictionaries/{dictCode}/topics`
   - list topics for a dictionary
   - path param: `dictCode`
9. `GET /dictionaries/{dictCode}/topics/{thesaurusName}`
   - list or scope into one thesaurus topic family
   - path params: `dictCode`, `thesaurusName`
10. `GET /dictionaries/{dictCode}/topics/{thesaurusName}/{topicId}`
   - get one topic
   - path params: `dictCode`, `thesaurusName`, `topicId`

### Entry routes
11. `GET /dictionaries/{dictCode}/entries`
   - list entries for a dictionary
   - path param: `dictCode`
12. `GET /dictionaries/{dictCode}/entries/{entryId}`
   - fetch one entry
   - path params: `dictCode`, `entryId`
   - query param: `format`
13. `GET /dictionaries/{dictCode}/entries/{entryId}/nearbyentries`
   - fetch entries near the given entry
   - path params: `dictCode`, `entryId`
   - query param: `entrynumber`
14. `GET /dictionaries/{dictCode}/entries/{entryId}/pronunciations`
   - fetch pronunciations for one entry
   - path params: `dictCode`, `entryId`
   - query params: `lang`, `format`
15. `GET /dictionaries/{dictCode}/entries/{entryId}/relatedentries`
   - fetch related entries
   - path params: `dictCode`, `entryId`

### Global word-of-the-day routes
16. `GET /wordoftheday`
   - global word of the day
   - query params: `day`, `format`
17. `GET /wordoftheday/preview`
   - global word-of-the-day preview
   - query param: `day`

## Pagination
- the official docs expose page-style pagination on dictionary search via `pagesize` and `pageindex`
- the nearby-entry route uses `entrynumber` rather than page / cursor terminology
- no cursor-based pagination is documented on the reviewed pages

## Rate limits
- the reviewed official HTML docs, WADL, and root host did not publish numeric rate limits or quota headers

## Error and response notes
- the reviewed official route docs mostly document only the `200` success representations
- live official probes in this pass confirmed these auth-related errors:
  - `403` + `{"errorCode":"NoAccessKey","errorMessage":"No access key!"}` when the header is omitted
  - `403` + `{"errorCode":"InvalidAccessKey","errorMessage":"Invalid access key!"}` when a bad `accessKey` header is sent
- JSON is the preferred documented representation; XML is also documented for nearly every route

## Important usage notes
- the documentation endpoints `/documentation/html` and `/documentation/wadl` are first-party and useful for discovery, but they are not counted in the `17` API-route total above
- the WADL's placeholder `http://www.example.com/api` base should not be treated as canonical
- several routes expose a `format` query parameter even though the docs also distinguish JSON-vs-XML representations directly; preserve that redundancy as an official-doc quirk rather than normalizing it away

## Verification notes
This file was manually rebuilt from Collins' first-party HTML documentation, first-party WADL, first-party root host, and live browser probes against the published API host.
