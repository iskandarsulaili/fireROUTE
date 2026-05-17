# USAspending.gov

## Provider metadata
- Category: `Government`
- Provider slug: `usaspending-gov`
- Official docs/pages used:
  - `https://api.usaspending.gov/`
  - `https://api.usaspending.gov/docs/`
  - `https://api.usaspending.gov/docs/endpoints`
  - `https://api.usaspending.gov/docs/intro-tutorial`
  - `https://api.usaspending.gov/api/v2/agency/012/`
  - `https://api.usaspending.gov/api/v2/search/spending_by_award/`
- Current documented API base URL: `https://api.usaspending.gov`
- Current documented API prefix: `/api/v2`
- Auth model: no authorization required for the reviewed endpoints
- Response formats:
  - JSON for the documented API endpoints reviewed live
  - ZIP/CSV downloads for the documented bulk-download and download job families
- Rate limits: no public rate-limit policy was published on the reviewed official docs pages
- Manually confirmed unique route count: `171`
- Official endpoint-table rows reviewed: `173`
- Exact duplicate rows in the official table excluded from the canonical count: `2`

## Official usage notes
- The official endpoint reference states that endpoints do not currently require any authorization.
- The official intro tutorial says the API supports both `GET` and `POST`; specific-record retrieval is typically `GET`, while advanced filtered searches commonly use `POST` bodies.
- The official intro tutorial uses `/api/v2/search/spending_by_award/` as the canonical example of a POST endpoint with a JSON body containing `filters`, `fields`, `sort`, and `order`.
- The official endpoint reference states common HTTP status behavior as `200` for success, `400` for malformed requests, and `500` for server-side errors.
- Live checks in this run confirmed JSON responses at `GET /api/v2/agency/012/`, and a validation failure at `POST /api/v2/search/spending_by_award/` returned HTTP `422` with `{"detail":"Missing value: 'filters|award_type_codes' is a required field"}` when a required filter was omitted.

## Endpoint family summary
- `agency`: `20` GET routes
- `autocomplete`: `19` POST routes
- `award_spending`: `1` GET route
- `awards`: `8` routes
- `budget_functions`: `2` routes
- `bulk_download`: `4` routes
- `disaster`: `20` routes
- `download`: `11` routes
- `federal_accounts`: `8` routes
- `federal_obligations`: `1` GET route
- `financial_balances`: `1` GET route
- `financial_spending`: `2` GET routes
- `idvs`: `7` routes
- `recipient`: `9` routes
- `references`: `22` routes
- `reporting`: `7` GET routes
- `search`: `26` POST routes
- `spending`: `1` POST route
- `subawards`: `1` POST route
- `transactions`: `1` POST route

## Canonical endpoint inventory confirmed from the official endpoint table

### Agency (`20`)
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/awards/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/awards/new/count/`
- `GET /api/v2/agency/awards/count/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/budget_function/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/budget_function/count/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/budgetary_resources/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/federal_account/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/federal_account/count/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/object_class/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/object_class/count/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/obligations_by_award_category/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/program_activity/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/program_activity/count/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/sub_agency/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/sub_agency/count/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/sub_components/<BUREAU_SLUG>/`
- `GET /api/v2/agency/<TOPTIER_AGENCY_CODE>/sub_components/`
- `GET /api/v2/agency/treasury_account/<TREASURY_ACCOUNT_SYMBOL>/object_class/`
- `GET /api/v2/agency/treasury_account/<TREASURY_ACCOUNT_SYMBOL>/program_activity/`

### Autocomplete (`19`)
- `POST /api/v2/autocomplete/accounts/a/`
- `POST /api/v2/autocomplete/accounts/aid/`
- `POST /api/v2/autocomplete/accounts/ata/`
- `POST /api/v2/autocomplete/accounts/bpoa/`
- `POST /api/v2/autocomplete/accounts/epoa/`
- `POST /api/v2/autocomplete/accounts/main/`
- `POST /api/v2/autocomplete/accounts/sub/`
- `POST /api/v2/autocomplete/awarding_agency/`
- `POST /api/v2/autocomplete/awarding_agency_office/`
- `POST /api/v2/autocomplete/funding_agency_office/`
- `POST /api/v2/autocomplete/cfda/`
- `POST /api/v2/autocomplete/city/`
- `POST /api/v2/autocomplete/recipient/`
- `POST /api/v2/autocomplete/funding_agency/`
- `POST /api/v2/autocomplete/glossary/`
- `POST /api/v2/autocomplete/naics/`
- `POST /api/v2/autocomplete/psc/`
- `POST /api/v2/autocomplete/program_activity/`
- `POST /api/v2/autocomplete/location`

### Award spending (`1`)
- `GET /api/v2/award_spending/recipient/`

### Awards (`8`)
- `GET /api/v2/awards/<AWARD_ID>/`
- `POST /api/v2/awards/accounts/`
- `GET /api/v2/awards/count/federal_account/<AWARD_ID>/`
- `GET /api/v2/awards/count/subaward/<AWARD_ID>/`
- `GET /api/v2/awards/count/transaction/<AWARD_ID>/`
- `POST /api/v2/awards/funding`
- `POST /api/v2/awards/funding_rollup`
- `GET /api/v2/awards/last_updated/`

### Budget functions (`2`)
- `GET /api/v2/budget_functions/list_budget_functions/`
- `POST /api/v2/budget_functions/list_budget_subfunctions/`

### Bulk download (`4`)
- `POST /api/v2/bulk_download/awards/`
- `POST /api/v2/bulk_download/list_agencies/`
- `POST /api/v2/bulk_download/list_monthly_files/`
- `GET /api/v2/bulk_download/status/`

### Disaster (`20`)
- `POST /api/v2/disaster/agency/count/`
- `POST /api/v2/disaster/agency/loans/`
- `POST /api/v2/disaster/agency/spending/`
- `POST /api/v2/disaster/award/amount/`
- `POST /api/v2/disaster/award/count/`
- `POST /api/v2/disaster/cfda/count/`
- `POST /api/v2/disaster/cfda/loans/`
- `POST /api/v2/disaster/cfda/spending/`
- `POST /api/v2/disaster/def_code/count/`
- `POST /api/v2/disaster/federal_account/count/`
- `POST /api/v2/disaster/federal_account/loans/`
- `POST /api/v2/disaster/federal_account/spending/`
- `POST /api/v2/disaster/object_class/count/`
- `POST /api/v2/disaster/object_class/loans/`
- `POST /api/v2/disaster/object_class/spending/`
- `GET /api/v2/disaster/overview/`
- `POST /api/v2/disaster/recipient/count/`
- `POST /api/v2/disaster/recipient/loans/`
- `POST /api/v2/disaster/recipient/spending/`
- `POST /api/v2/disaster/spending_by_geography/`

### Download (`11`)
- `POST /api/v2/download/accounts/`
- `POST /api/v2/download/assistance/`
- `POST /api/v2/download/awards/`
- `POST /api/v2/download/contract/`
- `POST /api/v2/download/count/`
- `POST /api/v2/download/disaster/`
- `POST /api/v2/download/disaster/recipients/`
- `POST /api/v2/download/idv/`
- `POST /api/v2/download/search/`
- `GET /api/v2/download/status/`
- `POST /api/v2/download/transactions/`

### Federal accounts (`8`)
- `GET /api/v2/federal_accounts/<ACCOUNT_CODE>/`
- `GET /api/v2/federal_accounts/<ACCOUNT_CODE>/available_object_classes/`
- `GET /api/v2/federal_accounts/<ACCOUNT_CODE>/fiscal_year_snapshot/<YEAR>/`
- `GET /api/v2/federal_accounts/<ACCOUNT_CODE>/fiscal_year_snapshot/`
- `POST /api/v2/federal_accounts/<ACCOUNT_CODE>/object_classes/total/`
- `GET /api/v2/federal_accounts/<ACCOUNT_CODE>/program_activities/`
- `POST /api/v2/federal_accounts/<ACCOUNT_CODE>/program_activities/total`
- `POST /api/v2/federal_accounts/`

### Federal obligations (`1`)
- `GET /api/v2/federal_obligations/`

### Financial balances (`1`)
- `GET /api/v2/financial_balances/agencies/`

### Financial spending (`2`)
- `GET /api/v2/financial_spending/major_object_class/`
- `GET /api/v2/financial_spending/object_class/`

### IDVs (`7`)
- `POST /api/v2/idvs/accounts/`
- `POST /api/v2/idvs/activity/`
- `GET /api/v2/idvs/amounts/<AWARD_ID>/`
- `POST /api/v2/idvs/awards/`
- `GET /api/v2/idvs/count/federal_account/<AWARD_ID>/`
- `POST /api/v2/idvs/funding/`
- `POST /api/v2/idvs/funding_rollup/`

### Recipient (`9`)
- `POST /api/v2/recipient/`
- `GET /api/v2/recipient/children/<DUNS_OR_UEI>/`
- `POST /api/v2/recipient/count/`
- `GET /api/v2/recipient/duns/<HASH_VALUE>/`
- `POST /api/v2/recipient/duns/`
- `GET /api/v2/recipient/<HASH_VAlUE>/`
- `GET /api/v2/recipient/state/<FIPS>/`
- `GET /api/v2/recipient/state/`
- `GET /api/v2/recipient/state/awards/<FIPS>/`

### References (`22`)
- `GET /api/v2/references/agency/<AGENCY_ID>/`
- `GET /api/v2/references/assistance_listing/`
- `GET /api/v2/references/award_types/`
- `GET /api/v2/references/cfda/totals//`
- `GET /api/v2/references/cfda/totals/`
- `GET /api/v2/references/data_dictionary/`
- `GET /api/v2/references/def_codes/`
- `POST /api/v2/references/filter/`
- `GET /api/v2/references/filter_tree/psc/<GROUP>/<PSC>/<PSC>/`
- `GET /api/v2/references/filter_tree/psc/<GROUP>/<PSC>/`
- `GET /api/v2/references/filter_tree/psc/<GROUP>/`
- `GET /api/v2/references/filter_tree/psc/`
- `GET /api/v2/references/filter_tree/tas/<AGENCY>/<FEDERAL_ACCOUNT>/`
- `GET /api/v2/references/filter_tree/tas/<AGENCY>/`
- `GET /api/v2/references/filter_tree/tas/`
- `GET /api/v2/references/glossary/`
- `POST /api/v2/references/hash/`
- `GET /api/v2/references/naics/<NAICS_CODE>/`
- `GET /api/v2/references/naics/`
- `GET /api/v2/references/submission_periods/`
- `GET /api/v2/references/toptier_agencies/`
- `GET /api/v2/references/total_budgetary_resources/`

### Reporting (`7`)
- `GET /api/v2/reporting/agencies/<TOPTIER_CODE>/differences/`
- `GET /api/v2/reporting/agencies/<TOPTIER_CODE>/discrepancies/`
- `GET /api/v2/reporting/agencies/<TOPTIER_CODE>/overview/`
- `GET /api/v2/reporting/agencies/overview/`
- `GET /api/v2/reporting/agencies/publish_dates/`
- `GET /api/v2/reporting/agencies/<TOPTIER_CODE>/<FISCAL_YEAR>/<FISCAL_PERIOD>/submission_history/`
- `GET /api/v2/reporting/agencies/<TOPTIER_CODE>/<FISCAL_YEAR>/<FISCAL_PERIOD>/unlinked_awards/<TYPE>/`

### Search (`26`)
- `POST /api/v2/search/new_awards_over_time/`
- `POST /api/v2/search/spending_by_award/`
- `POST /api/v2/search/spending_by_award_count/`
- `POST /api/v2/search/spending_by_category/`
- `POST /api/v2/search/spending_by_category/awarding_agency/`
- `POST /api/v2/search/spending_by_category/awarding_subagency/`
- `POST /api/v2/search/spending_by_category/cfda/`
- `POST /api/v2/search/spending_by_category/country/`
- `POST /api/v2/search/spending_by_category/county/`
- `POST /api/v2/search/spending_by_category/district/`
- `POST /api/v2/search/spending_by_category/federal_account/`
- `POST /api/v2/search/spending_by_category/funding_agency/`
- `POST /api/v2/search/spending_by_category/funding_subagency/`
- `POST /api/v2/search/spending_by_category/naics/`
- `POST /api/v2/search/spending_by_category/psc/`
- `POST /api/v2/search/spending_by_category/recipient`
- `POST /api/v2/search/spending_by_category/recipient_duns/`
- `POST /api/v2/search/spending_by_category/state_territory/`
- `POST /api/v2/search/spending_by_category/defc/`
- `POST /api/v2/search/spending_by_geography/`
- `POST /api/v2/search/spending_by_subaward_grouped/`
- `POST /api/v2/search/spending_by_transaction/`
- `POST /api/v2/search/spending_by_transaction_count/`
- `POST /api/v2/search/spending_by_transaction_grouped/`
- `POST /api/v2/search/spending_over_time/`
- `POST /api/v2/search/transaction_spending_summary/`

### Miscellaneous (`3`)
- `POST /api/v2/spending/`
- `POST /api/v2/subawards/`
- `POST /api/v2/transactions/`

## Path variables and common parameters confirmed from the official docs
- Path placeholders used in the official endpoint table:
  - `<TOPTIER_AGENCY_CODE>`
  - `<BUREAU_SLUG>`
  - `<TREASURY_ACCOUNT_SYMBOL>`
  - `<AWARD_ID>`
  - `<ACCOUNT_CODE>`
  - `<YEAR>`
  - `<DUNS_OR_UEI>`
  - `<HASH_VALUE>` and `<HASH_VAlUE>` as published in the docs table
  - `<FIPS>`
  - `<TOPTIER_CODE>`
  - `<AGENCY_ID>`
  - `<GROUP>`
  - `<PSC>`
  - `<AGENCY>`
  - `<FEDERAL_ACCOUNT>`
  - `<NAICS_CODE>`
  - `<FISCAL_YEAR>`
  - `<FISCAL_PERIOD>`
  - `<TYPE>`
- Query parameters shown in official examples and live links include:
  - `fiscal_year`
  - `funding_agency_id`
  - `awarding_agency_id`
  - `limit`
  - `page`
  - `major_object_class_code`
- POST body fields confirmed from the official tutorial example and live validation checks include:
  - `filters`
  - `fields`
  - `sort`
  - `order`
  - `limit`
  - `page`
  - nested filter members such as `award_type_codes`, `time_period`, `agencies`, `legal_entities`, `recipient_scope`, `recipient_locations`, `recipient_type_names`, `place_of_performance_scope`, `place_of_performance_locations`, `award_amounts`, and `award_ids`

## Pagination, filtering, and format notes
- The API is primarily JSON-based.
- Download-oriented routes return generated download jobs or ZIP/CSV artifacts rather than ordinary JSON lists.
- The official tutorial shows advanced search endpoints using POST bodies with nested `filters` objects and selectable `fields` arrays.
- A live request to `POST /api/v2/search/spending_by_award/` with valid `award_type_codes`, `time_period`, `fields`, `limit`, and `page` returned a JSON response containing `results`, `limit`, `messages`, and `page_metadata`.
- The live `page_metadata` object included `page`, `hasNext`, `last_record_unique_id`, and `last_record_sort_value`, confirming cursor-like continuation information alongside page numbering.
- The live `GET /api/v2/agency/012/` response returned JSON keys including `fiscal_year`, `toptier_code`, `name`, `abbreviation`, `agency_id`, `mission`, `website`, and `messages`.

## Error, auth, and access notes
- Official docs: no authorization currently required.
- Official docs: general status codes are `200`, `400`, and `500`.
- Live validation check: omitting required search filters on `POST /api/v2/search/spending_by_award/` produced HTTP `422` with a detailed validation message.
- No official rate-limit or quota statement was published on the reviewed docs pages.

## Important integration notes for fireROUTE
- Preserve the `/api/v2` prefix exactly.
- Treat the API as mixed-mode: many read/reference endpoints are `GET`, but most search, autocomplete, download job creation, recipient, disaster, and spending-analysis routes are `POST`.
- Preserve provider-specific POST body structures for advanced search and category aggregation endpoints instead of trying to flatten them too early.
- Keep download-job routes separate from ordinary data-query routes because they produce asynchronous export workflows and ZIP/CSV output patterns.
- The official endpoint table currently contains two exact duplicate rows; fireROUTE should normalize against the deduplicated `171`-route inventory above rather than the raw row count of `173`.
