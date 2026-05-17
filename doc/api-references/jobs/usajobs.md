# USAJOBS

## Provider metadata
- Category: `Jobs`
- Provider slug: `usajobs`
- Official docs pages used:
  - `https://developer.usajobs.gov/`
  - `https://developer.usajobs.gov/API-Reference`
  - `https://developer.usajobs.gov/Guides/Authentication`
  - `https://developer.usajobs.gov/Guides/Rate-Limiting`
- Current public API host: `https://data.usajobs.gov`
- Auth model:
  - `Search`, `HistoricJoa`, `HistoricJoa/AnnouncementText`, and text-messaging APIs require headers
  - code list endpoints do not require authentication
- Required authenticated headers:
  - `Host: data.usajobs.gov`
  - `User-Agent: <email used for API-key request>`
  - `Authorization-Key: <USAJOBS API key>`
- Response format: JSON
- Manually confirmed route count: `46`

## Rate limits and paging
- Search defaults to public jobs only.
- Search may require extra request criteria to include status jobs.
- Search maximum rows per query: `10,000`.
- Search maximum rows per page: `500`.
- Search defaults to `250` results per page.
- Search pagination parameters documented: `Page` and `ResultsPerPage`.
- Code list API: `No limits` per the official rate-limiting guide.
- Dynamic search: `No limits` per the official rate-limiting guide.

## API families
The overview page says USAJOBS currently offers three REST APIs plus a large set of code-list endpoints:
- Search
- Historic JOAs
- Announcement Text
- Code lists
- Text messaging helper endpoints

## Canonical endpoints
### Core jobs endpoints
1. `GET /api/Search`
2. `GET /api/HistoricJoa`
3. `GET /api/HistoricJoa/AnnouncementText`

### Code list endpoints
4. `GET /codelist/academichonors`
5. `GET /codelist/academiclevels`
6. `GET /codelist/actioncodes`
7. `GET /codelist/agencysubelements`
8. `GET /codelist/announcementclosingtypes`
9. `GET /codelist/applicantsuppliers`
10. `GET /codelist/applicationstatuses`
11. `GET /codelist/countries`
12. `GET /codelist/countrysubdivisions`
13. `GET /codelist/cyberworkgroupings`
14. `GET /codelist/cyberworkroles`
15. `GET /codelist/degreetypecodes`
16. `GET /codelist/disabilities`
17. `GET /codelist/documentations`
18. `GET /codelist/documentformats`
19. `GET /codelist/ethnicities`
20. `GET /codelist/federalemploymentstatuses`
21. `GET /codelist/geoloccodes`
22. `GET /codelist/gsageoloccodes`
23. `GET /codelist/hiringpaths`
24. `GET /codelist/keystandardrequirements`
25. `GET /codelist/languagecodes`
26. `GET /codelist/languageproficiencies`
27. `GET /codelist/locationexpansions`
28. `GET /codelist/militarystatuscodes`
29. `GET /codelist/missioncriticalcodes`
30. `GET /codelist/occupationalseries`
31. `GET /codelist/payplans`
32. `GET /codelist/positionofferingtypes`
33. `GET /codelist/positionopeningstatuses`
34. `GET /codelist/positionscheduletypes`
35. `GET /codelist/postalcodes`
36. `GET /codelist/racecodes`
37. `GET /codelist/refereetypecodes`
38. `GET /codelist/remunerationrateintervalcodes`
39. `GET /codelist/requiredstandarddocuments`
40. `GET /codelist/securityclearances`
41. `GET /codelist/servicetypes`
42. `GET /codelist/specialhirings`
43. `GET /codelist/travelpercentages`
44. `GET /codelist/whomayapply`

### Text messaging endpoints
45. `POST /textmessaging/sendmessage`
46. `POST /textmessaging/status`

## Important note on route counting
The live API-reference navigation exposed `46` manually countable route entries during this review:
- `3` core job/history endpoints
- `41` code-list endpoints
- `2` text-messaging endpoints

That manually verified count is used here and in the category README.

## Search endpoint notes
### `GET /api/Search`
- Used to retrieve live job-search results.
- Example pagination call from docs: `https://data.usajobs.gov/api/Search?Page=3&ResultsPerPage=50`
- Auth required via `Host`, `User-Agent`, and `Authorization-Key` headers.

### `GET /api/HistoricJoa`
- Used for past/historic job announcements.
- Auth required.

### `GET /api/HistoricJoa/AnnouncementText`
- Used to retrieve announcement text for historic JOAs.
- Auth required.

## Code-list usage notes
- The docs explicitly state code-list endpoints do not require authentication.
- These endpoints expose reference data such as hiring paths, occupational series, countries, pay plans, schedules, document codes, and security clearances.

## Error and format notes
- The official pages reviewed focus on auth, route inventory, and rate limits rather than a unified error schema.
- All documented REST endpoints are presented as JSON APIs.

## fireROUTE normalization notes
- USAJOBS is a mixed surface: one search API, historic-announcement APIs, many unauthenticated reference-data endpoints, and a small text-messaging helper area.
- Consumers should separate high-volume code-list synchronization from job-search traffic because rate-limit rules differ.
- Search adapters should respect the documented `10,000`-row query ceiling and `500`-row page ceiling.
