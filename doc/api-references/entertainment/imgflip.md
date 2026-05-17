# Imgflip

## Manual review status
- Category: Entertainment
- Official docs reviewed: `https://imgflip.com/api`
- Manual review outcome: `manually_documented`
- Confirmed route count: `7`

## API overview
- Base URL: `https://api.imgflip.com`
- Interface style: REST-like JSON API with standard form-urlencoded request parameters
- Authentication:
  - `GET /get_memes` does not require account credentials
  - meme-generation and premium endpoints use Imgflip account `username` and `password`
  - premium-only routes require an Imgflip Premium subscription
- Response format: JSON

## Confirmed endpoints
| Method | Path | Key parameters confirmed from docs | Access notes |
|---|---|---|---|
| GET | `/get_memes` | optional `type` (`gif`, `image`, or comma-separated values) | Free and Premium |
| POST | `/caption_image` | `template_id`, `username`, `password`, optional `text0`, `text1`, `font`, `max_font_size`, `no_watermark`, `boxes` | Free and Premium |
| POST | `/caption_gif` | `template_id`, `username`, `password`, optional `font`, `max_font_size`, `no_watermark`, `boxes` | Premium only |
| POST | `/search_memes` | `username`, `password`, `query`, optional `type`, `include_nsfw` | Premium only |
| POST | `/get_meme` | `username`, `password`, `template_id` | Premium only |
| POST | `/automeme` | `username`, `password`, `text`, optional `no_watermark` | Premium only |
| POST | `/ai_meme` | `username`, `password`, optional `model`, `template_id`, `prefix_text`, `no_watermark` | Premium only |

## Rate limits and billing notes
- Free API usage has no published hard limit, but the docs explicitly say requests may be throttled or blocked for abusive use.
- Premium API access starts at a paid monthly plan.
- Premium routes include published monthly included-usage amounts and then per-request charges, including:
  - `/caption_gif`: first `50` per month included, then `$0.02` each
  - `/search_memes`: first `200` per month included, then `$0.005` each
  - `/automeme`: first `50` per month included, then `$0.02` each
  - `/ai_meme`: first `50` per month included, then `$0.02` each
- `no_watermark` is explicitly marked as premium-only where noted by the docs.

## Request and response notes
- Request parameters are standard HTTP form-urlencoded parameters.
- `GET /get_memes` returns a `success` flag and a `data.memes` array.
- Meme creation endpoints return URLs such as `data.url` and `data.page_url` on success.
- The official failure example is:
  - `success: false`
  - `error_message: "Some hopefully-useful statement about why it failed"`

## Pagination and format notes
- Pagination is not documented for the reviewed API routes.
- The docs warn that additional properties may be added to meme objects over time; clients should not assume the response schema is frozen.

## Important usage notes
- The docs specifically warn against relying on the shared `imgflip_hubot` account for non-trivial production use.
- The docs note that generated memes are publicly accessible by URL.
- `boxes` supports advanced multi-text positioning and is the required text-input style for GIF captioning.

## Sources inspected
- `https://imgflip.com/api`
