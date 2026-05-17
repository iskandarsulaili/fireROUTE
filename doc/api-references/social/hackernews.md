# HackerNews

## Provider metadata
- Category: `Social`
- Provider slug: `hackernews`
- Official docs pages used:
  - `https://github.com/HackerNews/API`
  - `https://raw.githubusercontent.com/HackerNews/API/master/README.md`
- Main API base URL: `https://hacker-news.firebaseio.com/v0`
- Auth model: none
- Response format: JSON
- Manually confirmed route count: `10`

## Authentication
- The official Hacker News API docs describe the API as public and do not require authentication.

## Canonical endpoints

### Core objects
#### 1) Get item by id
- Method: `GET`
- Path: `/item/{id}.json`
- Purpose: retrieve a story, comment, job, poll, or poll option

Path parameters:
- `id` - numeric item id

Documented item fields include:
- `id`
- `deleted`
- `type` (`job`, `story`, `comment`, `poll`, `pollopt`)
- `by`
- `time`
- `text`
- `dead`
- `parent`
- `poll`
- `kids[]`
- `url`
- `score`
- `title`
- `parts[]`
- `descendants`

#### 2) Get user by id
- Method: `GET`
- Path: `/user/{id}.json`
- Purpose: retrieve a public user profile

Path parameters:
- `id` - case-sensitive username

Documented user fields include:
- `id`
- `created`
- `karma`
- `about`
- `submitted[]`

### Live/global feeds
#### 3) Max item id
- Method: `GET`
- Path: `/maxitem.json`
- Purpose: return the current largest item id

#### 4) Top stories
- Method: `GET`
- Path: `/topstories.json`
- Purpose: return up to 500 top stories; the docs note this list also contains jobs

#### 5) New stories
- Method: `GET`
- Path: `/newstories.json`
- Purpose: return up to 500 newest stories

#### 6) Best stories
- Method: `GET`
- Path: `/beststories.json`
- Purpose: return best stories ranked by HN

#### 7) Ask HN stories
- Method: `GET`
- Path: `/askstories.json`
- Purpose: return up to 200 latest Ask HN stories

#### 8) Show HN stories
- Method: `GET`
- Path: `/showstories.json`
- Purpose: return up to 200 latest Show HN stories

#### 9) Job stories
- Method: `GET`
- Path: `/jobstories.json`
- Purpose: return up to 200 latest job posts

#### 10) Changed items and profiles
- Method: `GET`
- Path: `/updates.json`
- Purpose: return recently changed item ids and profile ids

Response notes:
- Returns an object with `items[]` and `profiles[]`.

## Parameters, pagination, and usage notes
- The official examples append `?print=pretty` for human-readable debugging output; that parameter is optional and example-only.
- The API is graph-shaped rather than page-based: feeds return ids, then clients hydrate records via `/item/{id}.json`.
- The docs do not publish traditional page-number pagination.

## Rate limits and transport
- The official docs explicitly state: `There is currently no rate limit.`
- Base URIs are versioned under `/v0/`.

## Error and format notes
- Responses are JSON objects, arrays, or scalar JSON values depending on route.
- The docs do not publish a formal HTTP error table or error object schema on the page reviewed.
- Clients are told to ignore unexpected additional fields for compatibility.

## fireROUTE normalization notes
- Treat this provider as an id-first graph API: collection routes mostly return ids, not full embedded documents.
- `item.type` determines downstream shape; normalization should preserve that discriminator.
- `submitted[]`, `kids[]`, and story lists are relationship edges and should not be flattened away.
