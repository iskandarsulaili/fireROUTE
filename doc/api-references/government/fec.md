# FEC

## Provider metadata
- Category: `Government`
- Provider slug: `fec`
- Official docs/pages used:
  - `https://api.open.fec.gov/developers/`
  - `https://api.open.fec.gov/swagger/`
  - `https://api.open.fec.gov/swagger/?format=openapi`
- Current public API base URL: `https://api.open.fec.gov/v1`
- Auth model: API key; official docs support `X-Api-Key` header and `api_key` query parameter, and the web UI can also be explored with `DEMO_KEY`
- Response format: JSON
- Default rate limit: `1,000 calls per hour`
- Elevated rate limit on request: `7,200 calls per hour` (`120 calls per minute`) via contact with `APIinfo@fec.gov`
- Per-call result limit: `100 results per page`
- Data freshness note from official docs: data are updated nightly
- Manually confirmed route count: `100`

## Authentication
The developer page says you can sign up for your own API key, and that you can also explore the API in the web interface with `DEMO_KEY`.

The published Swagger exposes these API-key auth schemes:
- `X-Api-Key` header
- `api_key` query parameter

## Rate limiting
The official developer page states:
- standard access: `1,000 calls an hour`
- higher-throughput access by request: `7,200 calls an hour` / `120 calls per minute`
- each API call is limited to `100 results per page`

## API purpose and usage notes from the official docs
- The API is a RESTful web service for exploring how candidates and committees fund campaigns.
- Full-text and field-specific search are supported on FEC data.
- Bulk downloads are separately available from FEC.
- The docs specifically suggest starting with search endpoints to find candidates or committees, then using their IDs with more detailed endpoints.
- The docs explicitly warn that contributor lists cannot be used for commercial purposes or to solicit donations.

## Canonical endpoints
All manually confirmed operations in the published Swagger are `GET` routes.

### Audit
1. `GET /v1/audit-case/`
2. `GET /v1/audit-category/`
3. `GET /v1/audit-primary-category/`

### Calendar and election dates
4. `GET /v1/calendar-dates/`
5. `GET /v1/calendar-dates/export/`
6. `GET /v1/election-dates/`
7. `GET /v1/reporting-dates/`

### Candidate detail and history
8. `GET /v1/candidate/{candidate_id}/`
9. `GET /v1/candidate/{candidate_id}/committees/`
10. `GET /v1/candidate/{candidate_id}/committees/history/`
11. `GET /v1/candidate/{candidate_id}/committees/history/{cycle}/`
12. `GET /v1/candidate/{candidate_id}/filings/`
13. `GET /v1/candidate/{candidate_id}/history/`
14. `GET /v1/candidate/{candidate_id}/history/{cycle}/`
15. `GET /v1/candidate/{candidate_id}/totals/`

### Candidate collections and search
16. `GET /v1/candidates/`
17. `GET /v1/candidates/search/`
18. `GET /v1/candidates/totals/`
19. `GET /v1/candidates/totals/aggregates/`

### Committee detail and history
20. `GET /v1/committee/{committee_id}/`
21. `GET /v1/committee/{committee_id}/candidates/`
22. `GET /v1/committee/{committee_id}/candidates/history/`
23. `GET /v1/committee/{committee_id}/candidates/history/{cycle}/`
24. `GET /v1/committee/{committee_id}/filings/`
25. `GET /v1/committee/{committee_id}/history/`
26. `GET /v1/committee/{committee_id}/history/{cycle}/`
27. `GET /v1/committee/{committee_id}/reports/`
28. `GET /v1/committee/{committee_id}/totals/`

### Committee collections
29. `GET /v1/committees/`

### Communication costs
30. `GET /v1/communication_costs/`
31. `GET /v1/communication_costs/aggregates/`
32. `GET /v1/communication_costs/by_candidate/`
33. `GET /v1/communication_costs/totals/by_candidate/`

### Electronic filing
34. `GET /v1/efile/filings/`
35. `GET /v1/efile/form1/`
36. `GET /v1/efile/form2/`
37. `GET /v1/efile/reports/house-senate/`
38. `GET /v1/efile/reports/pac-party/`
39. `GET /v1/efile/reports/presidential/`

### Electioneering and elections
40. `GET /v1/electioneering/`
41. `GET /v1/electioneering/aggregates/`
42. `GET /v1/electioneering/by_candidate/`
43. `GET /v1/electioneering/totals/by_candidate/`
44. `GET /v1/elections/`
45. `GET /v1/elections/search/`
46. `GET /v1/elections/summary/`

### Filings and reports
47. `GET /v1/filings/`
48. `GET /v1/reports/{entity_type}/`

### Legal
49. `GET /v1/legal/docs/{doc_type}/{no}`
50. `GET /v1/legal/search/`

### Name lookup helpers
51. `GET /v1/names/audit_candidates/`
52. `GET /v1/names/audit_committees/`
53. `GET /v1/names/candidates/`
54. `GET /v1/names/committees/`

### National party data
55. `GET /v1/national_party/schedule_a/`
56. `GET /v1/national_party/schedule_b/`
57. `GET /v1/national_party/totals/`

### Presidential public funding data
58. `GET /v1/presidential/contributions/by_candidate/`
59. `GET /v1/presidential/contributions/by_size/`
60. `GET /v1/presidential/contributions/by_state/`
61. `GET /v1/presidential/coverage_end_date/`
62. `GET /v1/presidential/financial_summary/`

### Operations / RAD / rulemaking / state offices
63. `GET /v1/operations-log/`
64. `GET /v1/rad-analyst/`
65. `GET /v1/rulemaking/search/`
66. `GET /v1/state-election-office/`

### Schedules - receipts (`schedule_a` family)
67. `GET /v1/schedules/schedule_a/`
68. `GET /v1/schedules/schedule_a/by_employer/`
69. `GET /v1/schedules/schedule_a/by_occupation/`
70. `GET /v1/schedules/schedule_a/by_size/`
71. `GET /v1/schedules/schedule_a/by_size/by_candidate/`
72. `GET /v1/schedules/schedule_a/by_state/`
73. `GET /v1/schedules/schedule_a/by_state/by_candidate/`
74. `GET /v1/schedules/schedule_a/by_state/by_candidate/totals/`
75. `GET /v1/schedules/schedule_a/by_state/totals/`
76. `GET /v1/schedules/schedule_a/by_zip/`
77. `GET /v1/schedules/schedule_a/efile/`
78. `GET /v1/schedules/schedule_a/{sub_id}/`
79. `GET /v1/schedules/schedule_a_form5/`

### Schedules - disbursements and other schedules
80. `GET /v1/schedules/schedule_b/`
81. `GET /v1/schedules/schedule_b/by_purpose/`
82. `GET /v1/schedules/schedule_b/by_recipient/`
83. `GET /v1/schedules/schedule_b/by_recipient_id/`
84. `GET /v1/schedules/schedule_b/efile/`
85. `GET /v1/schedules/schedule_b/{sub_id}/`
86. `GET /v1/schedules/schedule_c/`
87. `GET /v1/schedules/schedule_c/{sub_id}/`
88. `GET /v1/schedules/schedule_d/`
89. `GET /v1/schedules/schedule_d/{sub_id}/`
90. `GET /v1/schedules/schedule_e/`
91. `GET /v1/schedules/schedule_e/by_candidate/`
92. `GET /v1/schedules/schedule_e/efile/`
93. `GET /v1/schedules/schedule_e/totals/by_candidate/`
94. `GET /v1/schedules/schedule_f/`
95. `GET /v1/schedules/schedule_f/{sub_id}/`
96. `GET /v1/schedules/schedule_h4/`
97. `GET /v1/schedules/schedule_h4/efile/`

### Totals
98. `GET /v1/totals/by_entity/`
99. `GET /v1/totals/inaugural_committees/by_contributor/`
100. `GET /v1/totals/{entity_type}/`

## Parameter notes
### Common pagination and sorting parameters
The official Swagger repeatedly uses:
- `page` - page number starting at `1`
- `per_page` - results per page; the docs say each call is limited to `100` results per page
- `sort` - sort field, using `-` for descending order on many endpoints

### Common identifier path parameters
- `candidate_id` - FEC candidate identifier
- `committee_id` - FEC committee identifier
- `cycle` - two-year election cycle on history subroutes
- `entity_type` - report/totals entity selector
- `doc_type` and `no` - legal document type and number
- `sub_id` - schedule item identifier on schedule detail routes

### Common search/filter patterns visible in the Swagger
Depending on the resource family, the spec uses many field-specific filters such as:
- `q` / `name` for text search
- `candidate_id`, `committee_id`
- `cycle`, `election_year`, `year`
- `office`, `state`, `party`, `district`
- various filing/report form and date filters
- aggregation filters for state, employer, occupation, recipient, purpose, size, and candidate

For example, `GET /v1/candidates/` explicitly exposes parameters including:
- `page`
- `per_page`
- `q`
- `candidate_id`
- `min_first_file_date`
- `max_first_file_date`
- `is_active_candidate`
- `cycle`
- `election_year`
- `office`
- `state`
- `party`
- `year`
- `district`
- `candidate_status`
- `incumbent_challenge`
- `federal_funds_flag`
- `has_raised_funds`
- `name`
- `sort`

## Response and pagination notes
The Swagger definitions show a common envelope shape for many list endpoints:
- `results[]` - returned records
- `pagination` - paging metadata

The published `OffsetInfo` pagination schema includes:
- `count`
- `is_count_exact`
- `page`
- `pages`
- `per_page`

Some schedule endpoints use a seek-style pagination schema instead. The published `SeekInfo` schema includes:
- `count`
- `is_count_exact`
- `last_indexes`
- `pages`
- `per_page`

Examples confirmed directly from the Swagger:
- `GET /v1/candidates/` -> `CandidatePage`
- `GET /v1/committees/` -> `CommitteePage`
- `GET /v1/schedules/schedule_a/` -> `ScheduleAPage`

## Error notes
- The docs are explicit about hourly rate limits and per-page result limits.
- The pages reviewed do not publish a compact centralized error-code table on the main developer page comparable to `api.data.gov`, but the Swagger defines typed response schemas for endpoint results.

## fireROUTE normalization notes
- Normalize the FEC API as a very large read-only REST surface rooted at `/v1`.
- Preserve the distinction between entity-detail routes (`/candidate/{candidate_id}/...`, `/committee/{committee_id}/...`) and cross-entity collection/search routes (`/candidates/`, `/committees/`, `/filings/`, `/schedules/...`).
- The `schedule_a`/`schedule_b`/`schedule_e` families are especially important for receipts, disbursements, and independent-expenditure analysis; downstream adapters should keep these route families explicit.
- Preserve both header-based and query-based API-key auth because the official docs publish both.
