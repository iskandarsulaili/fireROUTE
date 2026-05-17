# Readme Typing SVG

## Overview
- Provider: Readme Typing SVG
- Category: Photography
- Official docs: `https://readme-typing-svg.demolab.com/demo/`
- Project source: `https://github.com/DenverCoder1/readme-typing-svg`
- Base URL: `https://readme-typing-svg.demolab.com`
- Auth: none
- HTTPS: yes
- Response format: SVG image
- Pagination: none
- Rate limits: no numeric rate limit documented on the inspected pages

## Confirmed endpoint

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/` | required `lines`; optional presentation/query controls such as `font`, `weight`, `size`, `pause`, `duration`, `width`, `height`, `color`, `background`, `center`, `vCenter`, `multiline`, `repeat`, `random`, `letterSpacing` | Returns a generated typing-animation SVG. The demo page's generated HTML example uses `https://readme-typing-svg.demolab.com?...` directly as the image URL. |

Confirmed route count: **1**.

## Confirmed parameter notes
The official demo UI exposed these configurable request options on the inspected page:
- `lines` — text content to render (the generated example uses this directly in the query string)
- `font`
- `weight`
- `size`
- `letterSpacing`
- `duration` (milliseconds per line)
- `pause` (milliseconds after each line)
- `color`
- `background`
- `center`
- `vCenter`
- `multiline`
- `repeat`
- `random`
- `width`
- `height`

## Usage notes
- The demo page renders both Markdown and HTML snippets that use the query-string API directly.
- The generated example on the inspected page was:
  - `https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&width=435&lines=The+five+boxing+wizards+jump+quickly`
- Because the service is SVG-based, it works naturally as an image URL in Markdown/README contexts.

## fireROUTE integration notes
- This provider is effectively a single SVG-rendering GET endpoint with many formatting query parameters.
- fireROUTE should treat it like a deterministic media-generation URL rather than a JSON API.
- Preserve arbitrary query passthrough because the public demo exposes many visual controls and future options may be added without path changes.

## Sources inspected
- `https://readme-typing-svg.demolab.com/demo/`
- `https://github.com/DenverCoder1/readme-typing-svg`
