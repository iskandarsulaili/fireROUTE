# EmojiHub

## Manual review status
- Category: Art & Design
- Official docs reviewed: `https://raw.githubusercontent.com/cheatsnake/emojihub/master/README.md`
- Manual review outcome: `manually_documented`
- Confirmed route count: `6`

## API overview
- Base URL: `https://emojihub.yurace.pro`
- Base API prefix: `/api`
- Authentication: none documented
- Content type: JSON responses
- HTTPS: yes
- CORS: not explicitly documented in the README, but the provider is presented as a public web API

## Confirmed endpoints
| Method | Path | Key parameters / path parts | Notes |
|---|---|---|---|
| GET | `/api/random` | none | Returns one random emoji object. |
| GET | `/api/all` | none | Returns the full emoji dataset. |
| GET | `/api/categories` | none | Returns the available category list. |
| GET | `/api/groups` | none | Returns the available group list. |
| GET | `/api/search` | `q` query parameter | Searches emojis by name. |
| GET | `/api/similar/{name}` | `name` path parameter | Returns similar emojis for a supplied name. |

## Supported route modifiers documented by the provider
The README explicitly says endpoints can be supplemented with these path suffixes:
- `/category/{category-name}`
- `/group/{group-name}`

The official examples show these modifiers on:
- `/api/random/group/face-positive`
- `/api/random/category/food-and-drink`
- `/api/all/category/travel-and-places`
- `/api/all/group/animal-bird`

## Parameters and data notes
- `q` is used for `/api/search`.
- Category and group values are slug-style path segments such as `food-and-drink` and `face-positive`.
- Response objects in the README examples include:
  - `name`
  - `category`
  - `group`
  - `htmlCode`
  - `unicode`

## Pagination, rate limits, and errors
- Pagination: not documented.
- Rate limits: not documented.
- Error schema: not documented in the official README.

## Important usage notes
- The provider documents a public hosted API at `https://emojihub.yurace.pro`.
- The README also documents local self-hosting on port `4000`, but the hosted public base URL above is the canonical fireROUTE target.
- The README states the dataset contains `1791` emoji objects.

## Sources inspected
- `https://raw.githubusercontent.com/cheatsnake/emojihub/master/README.md`
