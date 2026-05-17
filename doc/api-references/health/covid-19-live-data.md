# Covid-19 Live Data

## Provider metadata
- Category: `Health`
- Provider slug: `covid-19-live-data`
- Official docs/pages used:
  - `https://github.com/mathdroid/covid-19-api`
  - `https://raw.githubusercontent.com/mathdroid/covid-19-api/master/README.md`
- Current public API base URL: `https://covid19.mathdro.id`
- Auth model: no authentication documented in the official README
- Response formats: JSON for data routes, generated images for the Open Graph routes, and badge-oriented output behind `GET /api/statusbadge`
- Public rate-limit note: no numeric limit was published in the reviewed README; the repo instead states that the official deployment is no longer maintained
- Manually confirmed route count: `15`

## Authentication and access
- The official README presents the service as a free public JSON API.
- No API key, OAuth flow, or signed-request scheme is documented.
- The README now warns: `No longer maintaining the official deployment. Please fork this repo and use it for your own purpose.`

## Canonical endpoints
1. `GET /` - root Open Graph image used for sharing
2. `GET /api` - global summary
3. `GET /api/og` - generated global summary Open Graph image
4. `GET /api/confirmed` - global cases per region sorted by confirmed cases
5. `GET /api/recovered` - global cases per region sorted by recovered cases
6. `GET /api/deaths` - global cases per region sorted by death toll
7. `GET /api/daily` - global cases per day
8. `GET /api/daily/{date}` - detailed daily update for one published date such as `2-14-2020`
9. `GET /api/countries` - country directory with ISO codes
10. `GET /api/countries/{country}` - country summary by country name or code
11. `GET /api/countries/{country}/confirmed` - country regional breakdown sorted by confirmed cases
12. `GET /api/countries/{country}/recovered` - country regional breakdown sorted by recovered cases
13. `GET /api/countries/{country}/deaths` - country regional breakdown sorted by death toll
14. `GET /api/countries/{country}/og` - generated country-specific Open Graph image
15. `GET /api/statusbadge` - badge/status route referenced by the published Shields badge examples

## Parameters and path notes
### Path parameters
- `date` - daily snapshot key in the published `M-D-YYYY` style example such as `2-14-2020`
- `country` - country name or code; the README examples explicitly show `Indonesia`, `USA`, and `CN`

### Query parameters
The reviewed README does not publish general-purpose query parameters for the JSON summary routes.

For the badge route, the published badge image examples show:
- `status` - badge field selector; reviewed values were `last_cron_date`, `og_cron_status`, and `daily_cron_status`
- `style` - badge style selector passed through the Shields example URLs

## Response, pagination, and error notes
- The README positions the service as a JSON API.
- The Open Graph routes return generated images instead of JSON.
- The badge route is used through image badge URLs and therefore should not be normalized as a normal summary-data endpoint.
- I did not find pagination parameters, cursor fields, or page-number controls in the reviewed README.
- I did not find a documented error schema or published numeric rate-limit header behavior.

## Usage notes from the official docs
- The service is described as serving John Hopkins University CSSE data.
- The README documents the project as built for the old ZEIT/Now deployment flow.
- The current README explicitly says the official deployment is no longer maintained and recommends forking the repo for continued use.

## fireROUTE normalization notes
- Normalize the maintained public root as `https://covid19.mathdro.id`.
- Keep the image-generating Open Graph endpoints separate from JSON data endpoints.
- Treat `GET /api/statusbadge` as a special-purpose status/badge route rather than ordinary epidemiology data.
- Flag this provider as archival/unmaintained in downstream metadata so consumers do not assume active support.