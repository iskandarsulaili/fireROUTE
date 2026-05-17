# Careerjet

## Provider metadata
- Category: `Jobs`
- Provider slug: `careerjet`
- Official docs page used: `https://www.careerjet.com/partners/api/`
- Current public API base URL: `https://search.api.careerjet.net/v4`
- Documented search endpoint: `https://search.api.careerjet.net/v4/query`
- Auth model: HTTP Basic auth
- Response format: JSON
- Manually confirmed route count: `1`

## Authentication
- The docs require Basic authentication on every request.
- Username: your Careerjet API key.
- Password: empty string.
- Header format: `Authorization: Basic {credentials}` where `{credentials}` is Base64 of `API_KEY:`.

## Canonical endpoint
### 1) Query jobs
- Method: `GET`
- Path: `/query`
- Full URL: `https://search.api.careerjet.net/v4/query`
- Purpose: search Careerjet job listings

Documented query parameters:
- `locale_code` - locale in `[language_code]_[COUNTRY_CODE]` format; defaults to `en_GB`
- `keywords` - one or more URL-encoded search terms
- `location` - search location; omitted means country-wide search
- `contract_type` - values:
  - `p` permanent
  - `c` contract
  - `t` temporary
  - `i` internship/training
  - `v` volunteering
- `work_hours` - `f` full-time or `p` part-time
- `fragment_size` - excerpt length; default `120`
- `sort` - `relevance`, `date`, or `salary`; default `relevance`
- `offset` - integer, from `1` to `999`, default `0`
- `page` - integer, from `1` to `10`
- `page_size` - integer, `1` to `100`, default `20`
- `radius` - search radius; defaults to `5` km or miles depending on location
- `user_ip` - required originating user IP
- `user_agent` - required originating user-agent string

## Response format
### Successful job-search response
The docs show a JSON envelope shaped like:

```json
{
  "type": "JOBS",
  "hits": 62,
  "message": "62 matching jobs found",
  "pages": 4,
  "response_time": 0.322,
  "jobs": []
}
```

### Job object fields shown in docs
- `title`
- `company`
- `date`
- `description`
- `locations`
- `salary`
- `salary_currency_code`
- `salary_max`
- `salary_min`
- `salary_type`
- `site`
- `url`

Documented `salary_type` values:
- `Y` yearly
- `M` monthly
- `W` weekly
- `D` daily
- `H` hourly

## Error and special-case responses
### Documented HTTP errors
- `400` unsupported locale code
- `403` missing `user_ip` or `user_agent`

### Location-mode responses
The docs also describe non-search responses with `type: "LOCATIONS"` when location matching is ambiguous or absent:
- `message: "no matching location found"` with an empty `locations` array
- `message: "multiple locations found"` with a list of candidate locations

## Pagination notes
- `page` and `page_size` are the primary pagination controls.
- `offset` is also accepted and is documented separately.
- The response reports the total hit count and total page count.

## fireROUTE normalization notes
- Careerjet combines transport auth (Basic) with user-context query parameters (`user_ip`, `user_agent`) that are mandatory for compliant use.
- Search can return either actual jobs or a location-resolution payload; adapters should branch on the `type` field.
- This is a single documented search endpoint rather than a multi-resource REST surface.
