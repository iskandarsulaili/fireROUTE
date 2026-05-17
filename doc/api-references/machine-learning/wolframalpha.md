# WolframAlpha

## Provider metadata
- Category: `Machine Learning`
- Provider slug: `wolframalpha`
- Docs used manually:
  - `https://products.wolframalpha.com/api/documentation`
  - `https://products.wolframalpha.com/api/`
  - `https://products.wolframalpha.com/api/explorer`
- Confirmed base URL for the reviewed API product: `http://api.wolframalpha.com/v2`
- Authentication model: AppID passed as query parameter `appid`
- Primary response formats confirmed from the official docs: XML by default, with JSON also documented as an available structured output format
- Manually confirmed routes in this pass: `1`

## Authentication
- The official getting-started flow requires registering a Wolfram ID in the Developer Portal and creating an AppID.
- Each application gets its own AppID.
- Requests are authenticated with the query parameter `appid`.
- The sample docs use URLs like:
  - `http://api.wolframalpha.com/v2/query?appid=DEMO`

## Confirmed route

### 1) Submit a WolframAlpha full-results query
- Method: `GET`
- Path: `/query`
- Full base URL: `http://api.wolframalpha.com/v2/query`
- Required parameters:
  - `appid` - developer AppID
  - `input` - URL-encoded natural-language query
- Confirmed optional parameter families from the reviewed official docs:
  - pod/result selection: `includepodid`, `excludepodid`, `podstate`
  - assumptions and interpretation: `assumption`, `reinterpret`, `translation`, `ignorecase`
  - location/units: `ip`, `latlong`, `location`, `units`
  - formatting and sizing: `format`, `mag`, `width`, `maxwidth`, `plotwidth`
  - timing controls: `scantimeout`, `podtimeout`
  - abuse protection / signed requests: `sig`
- Example from the official docs:
  - `http://api.wolframalpha.com/v2/query?appid=DEMO&input=population%20of%20france`
- Response notes:
  - successful responses return a `<queryresult ...>` envelope in XML unless another output format is requested
  - the docs explicitly describe pods, subpods, assumptions, warnings, and timeout metadata within the result envelope

## Response format notes
- The official overview says results can be returned in a variety of formats and that each result is wrapped in an XML or JSON structure.
- The default walkthrough and examples are XML-centric.
- The `<queryresult>` envelope includes metadata such as:
  - `success`
  - `error`
  - `numpods`
  - `datatypes`
  - `timing`
  - `timedout`
  - `parsetiming`
  - `version`
- Timeout-related metadata can indicate missing pods even when a query still returns a partial result.

## Error handling
- The docs distinguish between:
  - serious processing errors, where `error="true"` and an `<error>` subelement is returned
  - interpretation failures, where `success="false"` but not necessarily `error="true"`
- The official example for a missing AppID shows:
  - `<code>2</code>`
  - `<msg>Appid missing</msg>`
- Warning-style outcomes may surface through result elements such as `didyoumeans`, `reinterpret`, and translation-related notices instead of HTTP-style JSON error envelopes.

## Rate limits and execution limits
- The reviewed documentation does **not** publish a simple public requests-per-minute table.
- Instead, it documents execution controls such as:
  - `scantimeout` - defaults to `3.0` seconds for the scan stage
  - `podtimeout` - defaults to `4.0` seconds for individual pod formatting
- These settings influence breadth/depth of returned results and how partial responses are produced.

## Important usage notes
- The reviewed documentation page is specifically for the **Full Results API** product, not every Wolfram API product on the site.
- The API is built around natural-language input rather than resource-specific REST nouns.
- Pod selection parameters (`includepodid`, `excludepodid`, `podstate`) are central for efficient integrations that only need specific result sections.
- Location and unit handling can materially change answers, especially for weather, geography, and measurement queries.
- The docs note that some subjects may be restricted by default and require contacting Wolfram for broader topic access.

## Verification notes
This file was manually rebuilt from WolframAlpha’s official Full Results API documentation and explorer pages. The single confirmed route here reflects the route explicitly documented for the reviewed Full Results API surface.