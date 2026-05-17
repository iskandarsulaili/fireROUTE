# Arbeitnow

## Provider metadata
- Category: `Jobs`
- Provider slug: `arbeitnow`
- Official docs page used: `https://documenter.getpostman.com/view/18545278/UVJbJdKh`
- Current public API base URL: `https://www.arbeitnow.com/api`
- Public endpoint confirmed from docs: `https://www.arbeitnow.com/api/job-board-api`
- Auth model: no auth documented for the public job board endpoint
- Response format: JSON
- Manually confirmed route count: `1`

## Rate limits and usage notes
- The docs describe this as a free public API.
- The response metadata contains a terms note asking consumers not to abuse the API and to link back to Arbeitnow.
- Jobs are updated every hour.

## Pagination and response format
The single public endpoint returns JSON shaped like:

```json
{
  "data": [ ...jobs... ],
  "links": {
    "first": "...page=1",
    "last": null,
    "prev": null,
    "next": "...page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "path": "https://arbeitnow.com/api/job-board-api",
    "per_page": 100,
    "to": 100,
    "terms": "...",
    "info": "Jobs are updated every hour and order by the created_at timestamp..."
  }
}
```

## Canonical endpoint
### 1) Free job board API
- Method: `GET`
- Path: `/job-board-api`
- Full URL: `https://www.arbeitnow.com/api/job-board-api`
- Purpose: fetch paginated public job listings

Query parameters manually confirmed:
- `page` - used for pagination; explicitly referenced in the response `links` and `meta.info`

## Job object fields confirmed from the live example
- `slug`
- `company_name`
- `title`
- `description`
- `remote`
- `url`
- `tags` (array)
- `job_types` (array)
- `location`
- `created_at`

## Error and status notes
- The Postman documentation shows a `200 OK` response example.
- No separate error schema or rate-limit headers were exposed on the public docs page.

## fireROUTE normalization notes
- This is a read-only public endpoint from the currently published docs.
- Pagination is link-based with `page` rather than `offset`/`limit`.
- `description` is HTML-rich text and should be normalized/cleaned downstream if plain text is needed.
