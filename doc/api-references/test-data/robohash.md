# RoboHash

## Provider metadata
- Category: `Test Data`
- Provider slug: `robohash`
- Official docs used manually:
  - `https://robohash.org/`
- Confirmed API base URL: `https://robohash.org`
- Primary response format surfaced on the official site: generated image content
- Authentication model surfaced in docs: none
- Manually confirmed routes in this pass: `1`

## Authentication
From the reviewed official RoboHash homepage:
- no API key, OAuth flow, or account requirement is documented
- the service is presented as a simple public image-generation endpoint driven by text input in the URL

## Common request/response conventions
- the reviewed site describes RoboHash as a web service that generates unique robot/alien/monster images from any text
- the official page says you can use IP addresses, email addresses, filenames, user IDs, or other arbitrary text
- output is image content rather than a JSON API response
- customization on the reviewed page is shown through query parameters appended to the generated image URL

## Manually confirmed endpoint set

### 1) Generate an image from arbitrary text
- Method: `GET`
- Path: `/{text}`
- Full URL pattern inferred directly from the official example: `https://robohash.org/{text}`
- Purpose: generate a unique image derived from the supplied text string
- Path parameter:
  - `text` - arbitrary source text such as an email address, IP address, filename, or user ID
- Query parameters manually confirmed on the reviewed page:
  - `gravatar=yes` - official example: `https://robohash.org/robo@robohash.org?gravatar=yes`
  - `set=set2` - generate monsters instead of the default robot set
  - `set=set3` - generate a robot-head variant
  - `set=set4` - generate kittens
- Important usage notes from the official site:
  - the homepage positions the service as having hundreds of millions of image variations
  - the set examples are demonstrated on the main homepage rather than on separate route-reference pages

## Pagination
- none documented

## Rate limits
- no published rate limits or quota windows were shown on the reviewed official page

## Errors and format notes
- the official page does not publish a formal error schema
- the reviewed public examples focus on image-generation URLs, not JSON response envelopes
- the reviewed page did not document response content types explicitly, but the service is clearly presented as image generation rather than structured data output

## Important usage notes
- the service is route-light: one text-driven image path with optional query modifiers is the public surface visible on the official homepage
- the official examples make `set` the main customization parameter surfaced on the homepage
- the `gravatar=yes` example suggests RoboHash can incorporate Gravatar-related behavior for email-based inputs, but the reviewed page does not publish deeper parameter semantics beyond the example URL

## Verification notes
This file was manually rebuilt from the official RoboHash homepage using browser-based review only.