# ITIS

## Provider metadata
- Category: `Science & Math`
- Provider slug: `itis`
- Official docs/pages used:
  - `https://www.itis.gov/ws_description.html` (web-service overview and endpoint index)
  - `https://www.itis.gov/ws_develop.html` (official client-development / protocol notes)
  - `https://www.itis.gov/ws_searchApiDescription.html` (search endpoint descriptions and examples)
  - `https://www.itis.gov/ws_tsnApiDescription.html` (TSN lookup endpoint descriptions and examples)
  - `https://www.itis.gov/ws_hierApiDescription.html` (hierarchy endpoint descriptions and examples)
  - `https://www.itis.gov/ws_lsidApiDescription.html` (LSID endpoint descriptions and examples)
  - `https://www.itis.gov/ws_metaApiDescription.html` (meta-information endpoint descriptions and examples)
  - `https://www.itis.gov/ITISWebService/services/ITISService/getDescription` (sample live endpoint response; browser-rendered as `application/xml`)
- Current public API base URL: `https://www.itis.gov/ITISWebService/services/ITISService`
- WSDL URL: `https://www.itis.gov/ITISWebService/services/ITISService?wsdl`
- Auth model: no authentication documented
- Methods confirmed from the official docs: `GET`
- Protocol note: the official client-development page says ITIS supports both SOAP and REST; fireROUTE normalization below uses the documented REST-style GET endpoints
- Response formats confirmed from the official docs/pages reviewed: XML over HTTP for the REST-style endpoints; SOAP/WSDL support is also officially documented
- Rate-limit notes: no numeric public quota or throttling guidance is published on the reviewed ITIS pages
- Manually confirmed route count: `51`

## Canonical endpoints
All routes below are relative to `https://www.itis.gov/ITISWebService/services/ITISService`.

### Search functions (`11`)
1. `GET /searchForAnyMatch?srchKey={srchKey}`
2. `GET /searchForAnyMatchPaged?srchKey={srchKey}&pageSize={pageSize}&pageNum={pageNum}&ascend={ascend}`
3. `GET /getAnyMatchCount?srchKey={srchKey}`
4. `GET /searchByCommonName?srchKey={srchKey}`
5. `GET /searchByCommonNameBeginsWith?srchKey={srchKey}`
6. `GET /searchByCommonNameEndsWith?srchKey={srchKey}`
7. `GET /searchByScientificName?srchKey={srchKey}`
8. `GET /getITISTerms?srchKey={srchKey}`
9. `GET /getITISTermsFromCommonName?srchKey={srchKey}`
10. `GET /getITISTermsFromScientificName?srchKey={srchKey}`
11. `GET /getTsnByVernacularLanguage?language={language}`

### TSN lookup functions (`24`)
12. `GET /getAcceptedNamesFromTSN?tsn={tsn}`
13. `GET /getCommentDetailFromTSN?tsn={tsn}`
14. `GET /getCommonNamesFromTSN?tsn={tsn}`
15. `GET /getCoreMetadataFromTSN?tsn={tsn}`
16. `GET /getCoverageFromTSN?tsn={tsn}`
17. `GET /getCredibilityRatingFromTSN?tsn={tsn}`
18. `GET /getCurrencyFromTSN?tsn={tsn}`
19. `GET /getDateDataFromTSN?tsn={tsn}`
20. `GET /getExpertsFromTSN?tsn={tsn}`
21. `GET /getFullRecordFromTSN?tsn={tsn}`
22. `GET /getGeographicDivisionsFromTSN?tsn={tsn}`
23. `GET /getGlobalSpeciesCompletenessFromTSN?tsn={tsn}`
24. `GET /getJurisdictionalOriginFromTSN?tsn={tsn}`
25. `GET /getKingdomNameFromTSN?tsn={tsn}`
26. `GET /getOtherSourcesFromTSN?tsn={tsn}`
27. `GET /getParentTSNFromTSN?tsn={tsn}`
28. `GET /getPublicationsFromTSN?tsn={tsn}`
29. `GET /getReviewYearFromTSN?tsn={tsn}`
30. `GET /getScientificNameFromTSN?tsn={tsn}`
31. `GET /getSynonymNamesFromTSN?tsn={tsn}`
32. `GET /getTaxonAuthorshipFromTSN?tsn={tsn}`
33. `GET /getTaxonomicRankNameFromTSN?tsn={tsn}`
34. `GET /getTaxonomicUsageFromTSN?tsn={tsn}`
35. `GET /getUnacceptabilityReasonFromTSN?tsn={tsn}`

### Hierarchy functions (`3`)
36. `GET /getFullHierarchyFromTSN?tsn={tsn}`
37. `GET /getHierarchyDownFromTSN?tsn={tsn}`
38. `GET /getHierarchyUpFromTSN?tsn={tsn}`

### LSID functions (`4`)
39. `GET /getFullRecordFromLSID?lsid={lsid}`
40. `GET /getLSIDFromTSN?tsn={tsn}`
41. `GET /getRecordFromLSID?lsid={lsid}`
42. `GET /getTSNFromLSID?lsid={lsid}`

### Meta-information functions (`9`)
43. `GET /getCredibilityRatings`
44. `GET /getDescription`
45. `GET /getGeographicValues`
46. `GET /getJurisdictionValues`
47. `GET /getJurisdictionalOriginValues`
48. `GET /getKingdomNames`
49. `GET /getLastChangeDate`
50. `GET /getRankNames`
51. `GET /getVernacularLanguages`

## Parameter families confirmed from the official docs
### Search parameters
- `srchKey`: free-text search key used for common-name, scientific-name, TSN, and ITIS-term lookups
- `pageSize`: integer page size for `searchForAnyMatchPaged`
- `pageNum`: integer page number for `searchForAnyMatchPaged`
- `ascend`: boolean sort direction for `searchForAnyMatchPaged`; `true` = ascending, `false` = descending
- `language`: vernacular-language selector for `getTsnByVernacularLanguage`

### Identifier parameters
- `tsn`: ITIS Taxonomic Serial Number used throughout the TSN and hierarchy families and for `getLSIDFromTSN`
- `lsid`: Life Science Identifier string used by the LSID lookup family

## Response and data notes
- The reviewed endpoint-description pages repeatedly say successful calls return XML result sets or XML-wrapped scalar values.
- A direct browser check of `getDescription` rendered with `document.contentType = application/xml`.
- The docs often describe “empty result set” behavior when no match exists instead of a special query-level error payload.
- Search responses return name/TSN match sets; several search endpoints also include common-name language information.
- `getCoreMetadataFromTSN` is the bundled metadata route for credibility rating, taxonomic usage, unacceptability reason, coverage, and currency.
- `getFullRecordFromTSN` and `getFullRecordFromLSID` are explicitly described as potentially time-consuming because they require multiple database lookups.
- Coverage and currency information are documented as available only for Genus and above (`rank_id > 190`).
- `getHierarchyDownFromTSN` is intentionally limited to immediate children only, even for very large trees.
- The meta-information endpoints return catalog values such as rank names, kingdom names, geographic values, languages, and the last database change date.

## Error and reliability notes
- The reviewed ITIS pages do not publish a formal HTTP error table or numeric rate-limit policy.
- The endpoint-description pages consistently describe no-match behavior as an empty result set or null/empty result.
- The official client-development page frames the service as a long-lived Axis2-based SOAP/REST service with a generated WSDL for client creation.
- The overview page’s alphabetic list also mentions “Get Names of Database Load Files”, but the reviewed meta-information description page does not provide a dedicated route description/example for it; the confirmed fireROUTE count therefore uses the fully described `51` endpoints above.

## Usage notes
- Prefer HTTPS even though many official examples still use `http://www.itis.gov/...`.
- Use the REST-style GET endpoints for simple fireROUTE passthrough/read adapters; reserve WSDL/SOAP support for generated enterprise clients that specifically need it.
- Start with search routes to resolve a `tsn`, then use TSN, hierarchy, or LSID routes for deeper taxonomy retrieval.
- Expect XML namespaces in responses and normalize them before downstream JSON conversion if fireROUTE adapters expose JSON.

## fireROUTE normalization notes
- Normalize ITIS as a read-only taxonomy provider with five route families: search, TSN detail, hierarchy, LSID, and meta-information.
- Preserve native parameter names (`srchKey`, `tsn`, `lsid`, `pageSize`, `pageNum`, `ascend`, `language`) because the official docs use them consistently.
- Treat XML as the canonical wire format for the REST surface.
- Surface the “full record” routes as potentially expensive lookups in adapter metadata.
