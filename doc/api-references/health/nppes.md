# NPPES

## Provider metadata
- Category: `Health`
- Provider slug: `nppes`
- Official docs/pages used:
  - `https://npiregistry.cms.hhs.gov/registry/help-api`
  - `https://npiregistry.cms.hhs.gov/api/?version=2.1`
- Current public API base URL: `https://npiregistry.cms.hhs.gov/api/`
- Current documented API version: `2.1`
- Auth model: none documented for the read API
- Response format: JSON
- Data freshness note from official docs: the API retrieves NPPES public data daily
- Per-request cap from official docs: maximum `200` results per request
- Offset cap from official docs: `skip` can bypass up to `1000` records, allowing retrieval of up to `1,200` records over six requests when combined with `limit`
- Manually confirmed route count: `1`

## Authentication
The reviewed CMS help page documents the NPPES Read API as a public read-only API and does not document an API key, OAuth flow, or other credential requirement.

## Canonical endpoint
1. `GET /api/?version=2.1`

The help page explicitly says older `1.0`, `2.0`, and versionless URLs are retired and that clients should switch to version `2.1`.

## Query parameters documented by CMS
### Core parameters
- `version` - identifies the API version; docs specify `2.1`
- `number` - 10-digit National Provider Identifier
- `limit` - integer `1..200`; default `10`
- `skip` - bypass the first N matching results
- `pretty` - pretty-print the JSON response

### Provider/entity filters
- `enumeration_type` - `NPI-1` for individuals or `NPI-2` for organizations; docs say it cannot be used as the only criterion
- `taxonomy_description` - search by taxonomy description
- `name_purpose` - whether name fields apply to authorized official (`AO`) or provider (`PROVIDER`)
- `first_name` - individual-provider first name; trailing wildcard allowed with at least two characters
- `use_first_name_alias` - `True`/`False`; defaults to `True`
- `last_name` - individual-provider last name; trailing wildcard allowed
- `organization_name` - organization name; trailing wildcard allowed

### Address filters
- `address_purpose` - one of `LOCATION`, `MAILING`, `PRIMARY`, `SECONDARY`
- `city`
- `state` - state abbreviation; docs say it cannot be used as the only input criterion
- `postal_code` - 5-digit ZIP matches matching ZIP+4 values; trailing wildcard allowed
- `country_code` - may be used alone if the value is not `US`

## Response notes
The official help page says:
- output is a JSON document
- the `Addresses` array has two standard occurrences where the first is the primary practice location and the second is the mailing address
- `Other Identifiers` may contain up to `50` occurrences
- `Taxonomies` may contain up to `15` occurrences
- `Other Names` may contain multiple occurrences
- `Endpoints` appear in an array
- `Practice Locations` contains all practice locations except the primary practice location

## Pagination and limits
The CMS help page publishes these operational limits:
- maximum `200` results per query
- `skip` can skip up to `1000` records
- combined use of `limit` and `skip` allows retrieval of up to `1,200` records across six requests

## Important usage notes from official docs
- The API is described as a faster alternative to downloadable NPPES data files.
- It provides real-time access to public NPPES data instead of batch file processing.
- CMS explicitly warns that issuance of an NPI does not ensure or validate that a provider is licensed or credentialed.
- The API is read-only.

## fireROUTE normalization notes
- Normalize this provider as a single public search endpoint with a large query-parameter surface rather than as multiple routes.
- Keep `enumeration_type`, person-name filters, organization-name filters, and address filters separate in adapters because CMS documents different applicability rules for them.
- Preserve the explicit `version=2.1` requirement in all generated requests.
- Treat the API as offset-based pagination with hard caps rather than open-ended scrolling.