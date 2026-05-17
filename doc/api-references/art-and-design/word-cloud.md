# Word Cloud

## Manual review status
- Category: `Art & Design`
- Official pages reviewed:
  - `https://wordcloudapi.com/`
  - `https://wordcloudapi.com/getting-started`
  - `https://rapidapi.com/Textvis/api/word-cloud`
- Manual review outcome: `manually_documented`
- Confirmed route count: `1`

## API overview
- Provider site: `https://wordcloudapi.com/`
- Confirmed API base URL from the official getting-started example: `https://textvis-word-cloud-v1.p.rapidapi.com`
- Confirmed API prefix: `/v1`
- Authentication surfaced in the reviewed docs:
  - `X-RapidAPI-Key` header is required
  - `X-RapidAPI-Host: textvis-word-cloud-v1.p.rapidapi.com` is shown in the official example
- Content negotiation shown in the example:
  - request `Content-Type: application/json`
  - request `Accept: application/json`
- Confirmed route count from reviewed official material: `1`

## Confirmed endpoint
| Method | Path | Notes |
|---|---|---|
| POST | `/v1/textToCloud` | Generate a word-cloud image from submitted text and rendering options. |

## Confirmed request parameters
The official getting-started page includes a Node.js example body with these fields:
- `text` — source text used to build the cloud
- `scale` — numeric scaling factor
- `width` — output width
- `height` — output height
- `colors` — array of color strings such as hex values
- `font` — font family name
- `use_stopwords` — boolean stop-word toggle
- `language` — stop-word language code, example `en`
- `uppercase` — boolean uppercase toggle

## Response, pagination, and error notes
- the official getting-started page says the response is a base64-encoded image string
- the reviewed pages do not document any pagination model
- the reviewed first-party pages do not publish a formal error schema or status-code table

## Rate-limit and plan notes
- the provider site says the API is available through RapidAPI
- the reviewed RapidAPI product page shows the API as `Freemium` with `BASIC`, `PRO`, and `ULTRA` plans
- the reviewed pages do not publish a numeric request quota on the public pages inspected in this pass

## Important usage notes
- the official site positions RapidAPI as the required onboarding path and instructs users to create a RapidAPI account before testing the endpoint
- the official site presents the API as a single-purpose generator for customizable word-cloud images
- the reviewed homepage highlights word-cloud configuration controls for size, colors, and stop-word handling
- the reviewed example page at `https://wordcloudapi.com/examples/html/` returned an `AccessDenied` XML error in this session, so this manual doc relies on the homepage, getting-started page, and linked RapidAPI product page rather than the blocked example asset page

## Sources inspected
- `https://wordcloudapi.com/`
- `https://wordcloudapi.com/getting-started`
- `https://rapidapi.com/Textvis/api/word-cloud`
