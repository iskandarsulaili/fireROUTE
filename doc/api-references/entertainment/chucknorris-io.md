# chucknorris.io

## Manual review status
- Category: Entertainment
- Official docs reviewed: `https://api.chucknorris.io/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `3`

## API overview
- Base URL: `https://api.chucknorris.io`
- Authentication: none documented
- Response format: JSON
- HTTPS: yes

## Confirmed endpoints
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/jokes/random` | optional `category` query parameter | Returns a random joke, optionally constrained to a category. |
| GET | `/jokes/categories` | none | Returns the category list used by the random endpoint. |
| GET | `/jokes/search` | required `query` query parameter | Returns jokes matching a search term. |

## Response notes
The official homepage example shows random-joke objects including at least these fields:
- `icon_url`
- `id`
- `url`
- `value`

## Pagination, rate limits, and errors
- Pagination: not documented on the official homepage.
- Rate limits: not documented on the official homepage.
- Error schema: not described on the homepage; fireROUTE should not assume a stable documented error body beyond JSON responses.

## Important usage notes
- The provider's official page is itself the API reference and shows the three public joke endpoints directly.
- The site also documents Slack slash-command usage, but those integrations are separate from the raw REST API endpoints above.

## Sources inspected
- `https://api.chucknorris.io/`
