# ScrapingAnt

## Provider metadata
- Category: `Development`
- Provider slug: `scrapingant`
- Docs used manually:
  - `https://scrapingant.com/ai-data-scraper`
  - `https://docs.scrapingant.com/api-basics`
  - `https://docs.scrapingant.com/llm-markdown`
  - `https://docs.scrapingant.com/ai-data-extraction/ai-extractor`
  - `https://docs.scrapingant.com/api-credits-usage`
- Confirmed API base URL: `https://api.scrapingant.com/v2`
- Primary media types: raw HTML for the general endpoint, JSON for AI extraction and usage, JSON containing Markdown text for the markdown endpoint
- Authentication model: API key via query parameter `x-api-key`
- Manually confirmed routes in this pass: `4`

## Authentication
From the reviewed official ScrapingAnt docs:
- the minimum required auth parameter is `x-api-key`
- reviewed docs place `x-api-key` in the query string
- the marketing AI-extractor page also shows a header form `x-api-key: YOUR_API_KEY` in an example curl snippet, but the official docs pages reviewed here consistently document query-parameter usage

## Common request/response conventions
- Base URL: `https://api.scrapingant.com/v2`
- the general scraping endpoint explicitly supports `GET`, `POST`, `PUT`, and `DELETE`
- the markdown endpoint says it accepts the same request structure as the general endpoint and also supports `GET`, `POST`, `PUT`, and `DELETE`
- the AI extraction docs describe the same request structure as the general endpoint with an additional `extract_properties` query parameter
- the docs identify `url` and `x-api-key` as the two core parameters for basic scraping requests

## Manually confirmed endpoint set

### 1) General rendered-page scraping
- Methods explicitly documented: `GET`, `POST`, `PUT`, `DELETE`
- Path: `/general`
- Full URL: `https://api.scrapingant.com/v2/general`
- Purpose: fetch a rendered web page through ScrapingAnt's scraping infrastructure
- Required query parameters explicitly documented:
  - `url` - URL to scrape
  - `x-api-key` - ScrapingAnt API key
- Response behavior explicitly shown on the official page:
  - the example response is raw HTML for the requested page
- Important usage note from the official page:
  - request execution time can be tuned with `timeout`, documented as `5` to `60` seconds

### 2) Markdown transformation / LLM-ready extraction
- Methods explicitly documented: `GET`, `POST`, `PUT`, `DELETE`
- Path: `/markdown`
- Full URL: `https://api.scrapingant.com/v2/markdown`
- Purpose: scrape a page and convert the extracted HTML into Markdown
- Required query parameters explicitly documented:
  - `url` - URL to scrape and transform
  - `x-api-key` - ScrapingAnt API key
- Request-structure note from the official page:
  - uses the same request structure as the general endpoint
- Response fields explicitly documented:
  - `url`
  - `markdown`
- Important usage notes from the official page:
  - intended for LLM and RAG workflows
  - pricing/credit usage depends on API credit consumption per request

### 3) AI-enabled structured extraction
- Method explicitly shown in reviewed examples: `GET`
- Path: `/extract`
- Full URL: `https://api.scrapingant.com/v2/extract`
- Purpose: extract structured JSON from a page using free-form schema instructions
- Required query parameters explicitly documented:
  - `url` - page URL
  - `x-api-key` - ScrapingAnt API key
  - `extract_properties` - free-form text describing the data to extract
- Request/body notes from the official page:
  - `extract_properties` should be URL-encoded and sent as a query parameter
  - property names are converted to `camelCase` in the JSON output
  - the docs show type hints such as `price(number)` and nested structures such as `reviews(list: review title, review content)`
- Response behavior explicitly documented:
  - returns a structured JSON object following the described schema
- Important usage notes from the official page:
  - endpoint builds on Markdown transformation plus AI processing
  - works best when input parameters are described in English for consistent JSON property naming
  - temporary limitation: works from Markdown extracted from page HTML, not from styles, JS, or raw HTML tags directly

### 4) Read subscription status / API credit usage
- Method: `GET`
- Path: `/usage`
- Full URL: `https://api.scrapingant.com/v2/usage`
- Purpose: retrieve current subscription plan and remaining API credits
- Query parameters confirmed on the official page:
  - `x-api-key` - ScrapingAnt API key
- Response fields explicitly documented:
  - `plan_name`
  - `start_date`
  - `end_date`
  - `plan_total_credits`
  - `remained_credits`

## Pagination
- none documented for the reviewed endpoints

## Rate limits / usage limits
- the reviewed pages do not publish a requests-per-second throttle or rate-limit header contract
- usage is tracked in API credits rather than on the reviewed pages as a per-request-rate table
- the `/usage` endpoint is the official reviewed mechanism for checking remaining credits
- the AI extractor page says its cost depends on the number of characters in the Markdown version of the page plus the number of output characters

## Error and response notes
- the reviewed pages do not provide a central HTTP error-code table in the inspected sections
- response media types differ by endpoint:
  - `/general` returns page content such as raw HTML
  - `/markdown` returns JSON with a `markdown` field
  - `/extract` returns structured JSON
  - `/usage` returns JSON with plan/credit metadata

## Important usage notes
- ScrapingAnt positions `/extract` as an AI-enhanced layer built on top of the same scraping foundation as `/general`
- the markdown endpoint is explicitly intended to make scraped content easier to feed into LLM and RAG systems
- the general endpoint docs highlight timeout tuning for latency/success-rate tradeoffs
- the reviewed documentation is query-parameter-centric even where a marketing example also shows header-based API-key usage

## Verification notes
This file was manually rebuilt from ScrapingAnt's official docs and official product page using browser inspection.