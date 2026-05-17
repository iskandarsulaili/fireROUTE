# IUCN

## Overview
- Provider: IUCN Red List of Threatened Species API v4
- Category: Animals
- Official docs: `https://api.iucnredlist.org/api-docs`
- Base URL: `https://api.iucnredlist.org`
- Auth: bearer token in header `Authorization`; the published OpenAPI security scheme names this `Bearer`
- HTTPS: yes
- Response format: JSON; official machine-readable spec is published as OpenAPI 3.0.1 YAML
- Pagination: collection endpoints generally use `page`; the spec repeatedly notes `100` assessments per page and response metadata includes `per_page` with maximum `100`
- Rate limits: no public numeric quota is published, but the official usage page says tokens may be rate-limited or revoked for misuse and asks callers to include delays between frequent requests

## Confirmed endpoints

| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/api/v4/assessment/{assessment_id}` | path: `assessment_id` | Full assessment record for a specific latest or historic assessment ID. |
| GET | `/api/v4/assessment_search` | query: required `filter_on[]`, optional `page` | Beta endpoint returning paginated latest assessment IDs for supported filters such as `eu_27_post_2020_endemic`, `amazing`, `cr_pe`, `cr_pew`, `endemic`, `gss`, `needs_updating`. |
| GET | `/api/v4/biogeographical_realms/` | none | List available biogeographical realm codes. |
| GET | `/api/v4/biogeographical_realms/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Latest assessments for one biogeographical realm code. |
| GET | `/api/v4/comprehensive_groups/` | none | List available comprehensive groups. |
| GET | `/api/v4/comprehensive_groups/{name}` | path: `name`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Latest assessments for one comprehensive group name. |
| GET | `/api/v4/conservation_actions/` | none | List conservation action codes. |
| GET | `/api/v4/conservation_actions/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one conservation action code. |
| GET | `/api/v4/countries/` | none | List countries by ISO alpha-2 code. |
| GET | `/api/v4/countries/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Latest assessments for one country code. |
| GET | `/api/v4/faos/` | none | List FAO codes. |
| GET | `/api/v4/faos/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one FAO code. |
| GET | `/api/v4/green_status/all` | none | All latest Green Status assessments. |
| GET | `/api/v4/growth_forms/` | none | List growth form codes. |
| GET | `/api/v4/growth_forms/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one growth form code. |
| GET | `/api/v4/habitats/` | none | List habitat codes. |
| GET | `/api/v4/habitats/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one habitat code from the IUCN Habitats Classification Scheme v3.1. |
| GET | `/api/v4/information/api_version` | none | Current API version number. |
| GET | `/api/v4/information/red_list_version` | none | Current Red List release version. |
| GET | `/api/v4/population_trends/` | none | List population trend codes. |
| GET | `/api/v4/population_trends/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one population-trend code. |
| GET | `/api/v4/red_list_categories/` | none | List Red List category codes. |
| GET | `/api/v4/red_list_categories/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one Red List category code. |
| GET | `/api/v4/research/` | none | List research codes. |
| GET | `/api/v4/research/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one research code. |
| GET | `/api/v4/scopes/` | none | List scope codes. |
| GET | `/api/v4/scopes/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one geographical assessment scope. |
| GET | `/api/v4/statistics/count` | none | Aggregate count of species with assessments. |
| GET | `/api/v4/stresses/` | none | List stressor codes. |
| GET | `/api/v4/stresses/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one stress code. |
| GET | `/api/v4/systems/` | none | List broad system codes such as terrestrial, freshwater, or marine. |
| GET | `/api/v4/systems/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one system code. |
| GET | `/api/v4/taxa/sis/{sis_id}` | path: `sis_id` | Summary latest and historic assessment data for one SIS identifier. |
| GET | `/api/v4/taxa/scientific_name` | query: required `genus_name`, required `species_name`, optional `infra_name`, optional `subpopulation_name` | Summary latest and historic assessment data for a Latin binomial or trinomial. |
| GET | `/api/v4/taxa/kingdom/` | none | List kingdom names. |
| GET | `/api/v4/taxa/kingdom/{kingdom_name}` | path: `kingdom_name`; query: `page`, `year_published`, `latest`, `scope_code` | Latest assessments for one kingdom. |
| GET | `/api/v4/taxa/phylum/` | none | List phylum names. |
| GET | `/api/v4/taxa/phylum/{phylum_name}` | path: `phylum_name`; query: `page`, `year_published`, `latest`, `scope_code` | Latest assessments for one phylum. |
| GET | `/api/v4/taxa/class/` | none | List class names. |
| GET | `/api/v4/taxa/class/{class_name}` | path: `class_name`; query: `page`, `year_published`, `latest`, `scope_code` | Latest assessments for one class. |
| GET | `/api/v4/taxa/order/` | none | List order names. |
| GET | `/api/v4/taxa/order/{order_name}` | path: `order_name`; query: `page`, `year_published`, `latest`, `scope_code` | Latest assessments for one order. |
| GET | `/api/v4/taxa/family/` | none | List family names. |
| GET | `/api/v4/taxa/family/{family_name}` | path: `family_name`; query: `page`, `year_published`, `latest`, `scope_code` | Latest assessments for one family. |
| GET | `/api/v4/taxa/possibly_extinct` | none | Latest global assessments for taxa marked possibly extinct. |
| GET | `/api/v4/taxa/possibly_extinct_in_the_wild` | none | Latest global assessments for taxa marked possibly extinct in the wild. |
| GET | `/api/v4/threats/` | none | List threat codes. |
| GET | `/api/v4/threats/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one threat code; the docs explicitly say parent threat codes do not automatically include sub-threats. |
| GET | `/api/v4/use_and_trade/` | none | List use-and-trade codes. |
| GET | `/api/v4/use_and_trade/{code}` | path: `code`; query: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, `scope_code` | Assessments for one use-and-trade code. |

## Auth, pagination, and parameter notes
- The official landing page says you request a token by registering for the API and then use that token under the Red List terms of use.
- The OpenAPI spec defines auth as an API-key-style bearer token sent in header `Authorization`.
- Most collection endpoints are read-only GET routes and many of the code-scoped collection endpoints share the same filter set: `page`, `year_published`, `latest`, `possibly_extinct`, `possibly_extinct_in_the_wild`, and `scope_code`.
- The taxonomy hierarchy endpoints for kingdom, phylum, class, order, and family use a smaller shared filter set: `page`, `year_published`, `latest`, and `scope_code`.
- `assessment_search` is paginated and requires one or more `filter_on[]` values.
- The spec repeatedly documents `100` assessments per page, and response objects expose `per_page` metadata with maximum `100`.

## Errors, format, and usage notes
- The official machine-readable spec is `https://api.iucnredlist.org/api-docs/v4/openapi.yaml` and is labeled OpenAPI `3.0.1`.
- Common documented errors are `401 unauthorised` and `404 not found`; `assessment_search` also documents `400` for empty search options.
- The help page says v4 replaces v3, that v3 is end-of-life, and that the last Red List update applied to v3 was `2024-2`.
- The help page also says v4 is still in beta and that some JSON response structure, especially `assessment_search`, may still change.
- The landing page states that commercial use is forbidden via the v4 API and directs commercial users to IBAT instead.
- The official usage page warns against information-extraction abuse, says misuse can lead to rate limiting or token revocation, and asks high-volume users to add delays between calls.
- The docs position the API primarily for conservation, education, and research use cases; they explicitly warn that access may be restricted for unrelated mobile apps, computing-course use, or unrelated visualization projects.
- The help page says some data visible on the Red List website may not yet be fully exposed in the API while the v4 rollout continues.

## Integration notes for fireROUTE
- Treat IUCN as a read-only, token-gated taxonomy and assessment API with one base host and many filterable GET collections.
- Preserve the distinction between lookup lists (`/.../`) and filtered collection endpoints (`/.../{code}` or taxonomy-name endpoints), because the route semantics differ even when parameter patterns repeat.
- Keep `assessment_search` separate from the taxonomy and coded-classification families because it is beta and returns filtered latest assessment IDs rather than the same shape as the classification collections.
- Do not flatten away Red List-specific identifiers such as `assessment_id`, `sis_id`, taxonomic rank names, or classification codes; those are the native join keys across the API.

## Route-count note
- The current official Swagger UI and OpenAPI YAML expose `50` confirmed GET operations under `https://api.iucnredlist.org`.

## Sources inspected
- `https://api.iucnredlist.org/`
- `https://api.iucnredlist.org/api-docs`
- `https://api.iucnredlist.org/api-docs/v4/openapi.yaml`
- `https://api.iucnredlist.org/help`
