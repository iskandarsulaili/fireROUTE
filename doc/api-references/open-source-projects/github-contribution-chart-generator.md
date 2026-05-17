# GitHub Contribution Chart Generator

## Provider metadata
- Category: `Open Source Projects`
- Provider slug: `github-contribution-chart-generator`
- Docs used manually:
  - `https://github-contributions.vercel.app/`
  - `https://github.com/sallar/github-contributions-chart#readme`
  - `https://github.com/sallar/github-contributions-chart/tree/master/src/pages/api/v1`
  - `https://github.com/sallar/github-contributions-chart/blob/master/src/pages/api/v1/%5Busername%5D.js`
- Confirmed public service base URL: `https://github-contributions.vercel.app`
- Confirmed self-hosted route family from the official repository: deployment-relative `GET /api/v1/{username}`
- Primary response formats confirmed in this pass: JSON from the API route, rendered image/chart output from the public site UI
- Authentication model: none documented for the reviewed public API route
- Manually confirmed routes in this pass: `1`

## Authentication
- The reviewed official homepage and official repository do not document any API key, OAuth flow, or session-token requirement for the public API route.
- The repository README describes the service as a public project and says the API lives under the app's `src/pages/api` directory.

## Common request/response conventions
- Hosted public site: `https://github-contributions.vercel.app`
- The official repository confirms a Next.js API route under `src/pages/api/v1/[username].js`, which maps to `GET /api/v1/{username}` on the deployed host.
- The route handler reads `username` and `format` from `req.query`.
- The official code sets:
  - `Cache-Control: s-maxage=3600, stale-while-revalidate`
- The reviewed route handler returns JSON with `res.json(data)`.
- The repository README explicitly notes that this project exposes its own API because GitHub does not provide an official statistics API for this use case.

## Manually confirmed endpoint set

### 1) Fetch contribution data for a GitHub username
- Method: `GET`
- Path: `/api/v1/{username}`
- Confirmed from the official repository path:
  - `src/pages/api/v1/[username].js`
- Confirmed path parameter:
  - `username` - required GitHub username derived from the dynamic route segment
- Confirmed query parameters from the reviewed route handler:
  - `format` - optional query parameter read by the handler and forwarded into the contribution-data fetcher
- Confirmed request body: none
- Confirmed response behavior from the reviewed handler:
  - returns JSON via `res.json(data)`
  - sets cache header `s-maxage=3600, stale-while-revalidate`
- Important usage note:
  - the public homepage is a chart generator UI, but the official repository makes clear that the programmatic API surface is the JSON route under `/api/v1/{username}`

## Pagination
- None documented for the reviewed API route.

## Rate limits
- No numeric rate-limit policy is published on the reviewed homepage or repository pages.
- The only directly confirmed operational control is the response cache header set by the official route handler.

## Error handling
- The reviewed official code snippet does not publish a formal HTTP error table or error-envelope schema.
- Because the reviewed source snippet only showed the success path, this file does not invent undocumented error payloads.

## Response format notes
- The API route returns JSON.
- The public homepage renders chart output visually and also exposes a “Download data as JSON” interaction in the UI.
- The official project is better understood as a chart-generating web app with a small JSON API route than as a broad REST platform.

## Important usage notes
- This provider is route-light: one publicly confirmed API route plus the browser UI.
- The project is open source and self-hostable; the documented API path is deployment-relative for self-hosted instances.
- The repository README states that the API exists because GitHub itself does not expose the needed contribution-statistics API directly.

## Verification notes
This file was manually rebuilt from the current public service homepage and the official GitHub repository, including the exact API route file under `src/pages/api/v1/[username].js`.
