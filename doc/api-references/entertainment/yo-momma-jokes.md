# Yo Momma Jokes

## Manual review status
- Category: Entertainment
- Official docs reviewed:
  - `https://beanboi7.github.io/yomomma-apiv2/`
  - `https://raw.githubusercontent.com/beanboi7/yomomma-apiv2/master/README.md`
- Manual review outcome: `manually_documented`
- Confirmed route count: `4`

## API overview
- Documented base URL: `https://yomomma-api.herokuapp.com`
- Authentication: none documented
- Response format: JSON
- Rate limit: the README says `5 calls/minute`

## Confirmed endpoints
| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/` | none | Returns a trivial health/home response with `{"joke": "Yo momma"}`. |
| GET | `/jokes` | optional `count` query parameter | Returns one random joke by default, or an array of jokes when `count` is provided. |
| GET | `/jokes/{index}` | required `index` path parameter | Returns the joke at a specific dataset index. |
| GET | `/search` | required `query` query parameter | Returns jokes matching the supplied search string. |

## Parameters and response notes
### `GET /jokes`
- `count` is optional
- Default value is `1`
- The docs show `/jokes?count={count}`
- Without `count`, the response is a single object with a `joke` field
- With `count`, the response is an array of joke objects

### `GET /jokes/{index}`
- `index` is required
- The docs show the example `/jokes/20`
- Successful responses return a single object with a `joke` field

### `GET /search`
- `query` is required
- The docs show the example `/search?query=money`
- Successful responses return a `results` array

## Errors and validation notes
- `GET /jokes` documents `404 NOT FOUND` for an invalid `count` value with:
  - `{"detail": "Invalid count paramter"}`
- `GET /jokes/{index}` documents `404 NOT FOUND` for an invalid `index` value with:
  - `{"detail": "Invalid index paramter"}`
- `GET /search` documents `422 UNPROCESSABLE ENTITY` when the required `query` parameter is missing, using FastAPI-style validation details

## Important usage notes
- The README says the project is based on FastAPI and hosted on Heroku
- The docs page links to the backing `jokes.json` dataset in the repository for indexed joke lookup
- The project README points to the GitHub Pages docs as the complete documentation source

## Sources inspected
- `https://beanboi7.github.io/yomomma-apiv2/`
- `https://raw.githubusercontent.com/beanboi7/yomomma-apiv2/master/README.md`
