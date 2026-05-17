# Harvard Art Museums

## Manual review status
- Category: Art & Design
- Official docs reviewed: `https://raw.githubusercontent.com/harvardartmuseums/api-docs/master/README.md`
- Manual review outcome: `manually_documented`
- Confirmed route count: `23`

## API overview
- Base URL: `https://api.harvardartmuseums.org`
- Authentication: required `apikey` query parameter on every request
- Response format: JSON
- HTTPS: supported and shown in the official docs

## Global request behavior
- Generic resource pattern: `GET /RESOURCE_TYPE?apikey=YOUR_API_KEY`
- Required auth parameter: `apikey`
- Global pagination parameters:
  - `page` — page number greater than `1` for later pages
  - `size` — records per page, default `10`, maximum `100`
- Pagination metadata is returned in an `info` block with fields including:
  - `totalrecordsperquery`
  - `totalrecords`
  - `pages`
  - `page`
  - `next`
  - `prev`
  - `responsetime`

## Confirmed resource endpoints
All of the following are listed as available resources in the official documentation and follow the same base pattern `GET /{resource}?apikey=...`.

| Method | Path |
|---|---|
| GET | `/object` |
| GET | `/person` |
| GET | `/exhibition` |
| GET | `/publication` |
| GET | `/gallery` |
| GET | `/spectrum` |
| GET | `/classification` |
| GET | `/century` |
| GET | `/color` |
| GET | `/culture` |
| GET | `/group` |
| GET | `/medium` |
| GET | `/support` |
| GET | `/period` |
| GET | `/place` |
| GET | `/technique` |
| GET | `/worktype` |
| GET | `/activity` |
| GET | `/site` |
| GET | `/video` |
| GET | `/image` |
| GET | `/audio` |
| GET | `/annotation` |

## Errors and format notes
- Missing, bad, or invalid API keys return `401 Unauthorized`.
- Unknown resources return `404 Not Found`.
- Large result sets are paginated.
- The `next` and `prev` fields in the response `info` block are fully formed URLs for page navigation.

## Image and media notes
- Some records include image information.
- The docs explicitly describe Harvard's IIIF image support via image URLs found in record fields such as `baseimageurl` and `primaryimageurl`.
- A separate IIIF presentation service is also mentioned in the official README.

## Important usage notes
- The official docs position the API as a REST-style service over museum resources.
- API keys are requested through the provider's official request form.
- The README reviewed here confirms the common resource pattern and shared pagination/auth rules; resource-specific fields and filters live in per-resource docs linked from the README.

## Sources inspected
- `https://raw.githubusercontent.com/harvardartmuseums/api-docs/master/README.md`
- `https://api.harvardartmuseums.org/object`
