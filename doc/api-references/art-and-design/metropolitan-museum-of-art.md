# Metropolitan Museum of Art

## Manual review status
- Category: Art & Design
- Official docs reviewed: `https://metmuseum.github.io/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `4`

## API overview
- Base URL: `https://collectionapi.metmuseum.org`
- Base path: `/public/collection/v1`
- Authentication: none required
- Response format: JSON
- Image format notes: object records may include public-domain JPEG image URLs
- Published rate guidance: limit requests to `80 requests per second`

## Confirmed endpoints
| Method | Path | Parameters confirmed from docs | Notes |
|---|---|---|---|
| GET | `/public/collection/v1/objects` | `metadataDate`, `departmentIds` | Returns all publicly available object IDs, optionally filtered. |
| GET | `/public/collection/v1/objects/{objectID}` | `objectID` path parameter | Returns a full object record. |
| GET | `/public/collection/v1/departments` | none | Returns department IDs and display names. |
| GET | `/public/collection/v1/search` | `q` plus search filters | Returns object IDs matching a search. |

## Search filters called out in the docs
The docs page explicitly shows these search controls across the search section and updates section:
- `q` (search term)
- `isHighlight`
- `title`
- `tags`
- `departmentId`
- `isOnView`
- `artistOrCulture`
- `medium`
- `hasImages`
- `geoLocation`
- `dateBegin`
- `dateEnd`

## Response and data notes
- `/objects` returns a JSON object with at least:
  - `total`
  - `objectIDs`
- `/objects/{objectID}` returns a detailed object record with many fields including artwork metadata, image URLs, artist information, geography, tags, and gallery data.
- `/departments` returns department identifiers and names.
- `/search` returns matching object IDs rather than full records.

## Pagination, errors, and usage notes
- Traditional page-based pagination is not documented for these four endpoints.
- The docs page does not publish a structured error-schema section.
- The service is explicitly described as a RESTful JSON web service.
- The docs note that no API key or registration is required at this time.

## Sources inspected
- `https://metmuseum.github.io/`
