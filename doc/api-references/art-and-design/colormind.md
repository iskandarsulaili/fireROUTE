# Colormind

## Manual review status
- Category: Art & Design
- Official docs reviewed:
  - `http://colormind.io/api-access/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `2`

## API overview
- Base URL: `http://colormind.io`
- Authentication: none
- Response format: JSON
- Request format: `POST /api/` expects a JSON body
- Commercial usage: the official page says the API is free for personal and non-commercial use; commercial users should contact `jack@colormind.io`
- Rate limits: no numeric limit published on the reviewed official page

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/api/` | JSON body `model`, optional `input` | Returns a generated or completed 5-color palette. |
| GET | `/list/` | none | Returns currently available model names. |

## Parameters and payload details
### `POST /api/`
- `model` — required string model name
- `input` — optional palette seed array; the official example uses five slots and fills unknown slots with the string `"N"`
- Example request body for a random palette:
  - `{"model":"default"}`
- Example request body for palette completion:
  - `{"input":[[44,43,44],[90,83,82],"N","N","N"],"model":"default"}`

### `GET /list/`
- No parameters shown on the official page
- Example response shape:
  - `{"result":["default","ui","makoto_shinkai",...]}`

## Response, pagination, and errors
- `POST /api/` returns a JSON object with `result`, where `result` is an array of RGB triplets
- The official JavaScript example parses the response as `JSON.parse(http.responseText).result`
- No pagination model is documented
- No formal error schema is documented on the reviewed page

## Important usage notes
- The official page says the API exposes the same palette-generation features shown on Colormind.io
- The models `default` and `ui` are always available
- Additional themed models change daily
- The official page says models refresh every day at `+8 UTC (midnight PDT)` and the service is down for about `30 seconds` during reload
- The example notes that returned palettes may slightly adjust provided input colors instead of keeping them byte-for-byte identical

## Sources inspected
- `http://colormind.io/api-access/`
