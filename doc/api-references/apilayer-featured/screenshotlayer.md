# Screenshotlayer

## Provider metadata
- Category: `APILayer Featured`
- Provider slug: `screenshotlayer`
- Official docs inspected manually:
  - `https://screenshotlayer.com/`
  - `https://docs.apilayer.com/screenshotlayer/docs/quickstart-guide`
- Confirmed API base URL: `http://api.screenshotlayer.com/api`
- Response format confirmed from docs: image capture delivered via API response/URL workflow
- Authentication model: query-string `access_key`
- Manually confirmed routes in this pass: `1`

## Manually confirmed endpoint
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/capture` | Capture a screenshot of a target website | required `access_key`, required `url`; optional `fullpage`, `width`, `viewport`, `format`, `secret_key`, `css_url`, `delay`, `ttl`, `force`, `placeholder`, `user_agent` |

## Usage notes
- The official quickstart explicitly publishes `http://api.screenshotlayer.com/api/capture` as the request URL.
- Supported output/customization features visible in the docs include PNG/JPEG/GIF/WebP formats, full-page capture, viewport control, caching, URL encryption, CSS injection, and delayed capture.
- The docs warn to URL-encode the target `url` value when it contains reserved characters like `&`.

## Verification notes
This file was manually rebuilt from Screenshotlayer's official site and APILayer-hosted quickstart documentation.