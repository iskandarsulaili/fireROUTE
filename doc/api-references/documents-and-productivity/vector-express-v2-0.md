# Vector Express v2.0

## Provider metadata
- Category: `Documents & Productivity`
- Provider slug: `vector-express-v2-0`
- Docs/pages reviewed manually:
  - `https://vector.express/`
  - `https://vector.express/pricing`
  - `https://github.com/vector-express/vectorexpress-api`
- Confirmed API base URL: `https://vector.express/api/v2/public`
- Primary exchange format: raw file upload bodies for processing calls, JSON metadata/results for conversion-analysis-processing responses, and binary file download via the files route
- Manually confirmed routes in this pass: `5`
- Route-method breakdown confirmed from the current official docs:
  - `2` `GET`
  - `3` `POST`

## What the official docs confirm
- Vector Express presents itself as a free vector conversion, analysis, and processing API with a separate pricing page for higher limits.
- The official GitHub docs describe a three-step happy path:
  - request a compatible conversion path
  - upload a file to a conversion/analyze/process route
  - fetch the generated output from the returned `resultUrl`
- The reviewed docs describe one public `v2` API surface rooted at `https://vector.express/api/v2/public`.
- The docs explicitly say the service does not support CORS, so integrations should call it from a backend rather than directly from a browser.

## Authentication
From the reviewed official landing page, pricing page, and GitHub documentation:
- The category landing page says the API is free to use.
- The reviewed official route examples do not include API-key, bearer-token, or OAuth headers.
- The reviewed docs therefore currently indicate unauthenticated public access for the documented `public` route surface.

## Rate limits and size limits
From the reviewed official pricing page and GitHub README:
- Public API limit: `5 requests per hour`
- Public API maximum output file size: `1 MiB`
- The docs also mention additional CPU and memory limitations on the free public API.
- Paid `DIY` plan notes:
  - removes rate limits
  - increases maximum file size to `40 MiB`

## Request, parameter, and format conventions
From the reviewed official docs:
- Conversion path discovery uses URL path variables for input and output extensions.
- Conversion, analyze, and process operations are configured primarily through query-string options.
- Representative documented query parameters include:
  - conversion options such as `cad2pdf-paper-size`, `cad2pdf-scale`, `cad2svg-layers`, `pdf2svg-page`, `svg2cad-version`, `svgo-precision`
  - analyzer options such as `linearmovement-jerk`, `linearmovement-mm-per-s`, `linearmovement-drawing-unit`, `linearmovement-path-info`
  - processor options such as `boolean-operation-operation`, `boolean-operation-tool-paths`, `boolean-operation-target-paths`
- The docs explicitly say conversion paths can chain up to three programs.
- The docs also document `use-file=filename.ext` for reusing an already uploaded or already generated file instead of posting a new request body.

## Output and workflow notes
- `GET /convert/{inputExt}/auto/{outputExt}` returns a compatible conversion path suggestion.
- `POST` conversion, analysis, and processing routes are documented as file-body uploads.
- Generated files are retrieved from the files route after reading the returned `resultUrl`.
- Analysis output is documented as JSON.
- Processing and conversion outputs depend on the selected route and format chain.

## Error notes
- The reviewed official docs do not publish a centralized HTTP status table or shared JSON error schema.
- The docs only explicitly publish quota and size/compute limits, so adapter implementations should treat exact non-success error bodies as provider-specific until verified live.

## Important usage notes
- Vector Express is intentionally backend-oriented because the service does not support CORS.
- The public conversion path route should be used first when the best program chain is not already known.
- The docs list `12` converter backends, `3` analyzers, and `10` processors in the current published documentation.
- Representative converter backends: `cad2pdf`, `cad2svg`, `cadlib`, `gs`, `hp2xx`, `libcdr`, `librsvg`, `pdf2svg`, `pstoedit`, `svg2cad`, `svgo`, `uniconvertor`.
- Representative analyzers: `get-svg-unit`, `groups`, `linearmovement`.
- Representative processors: `boolean-operation`, `change-attribute`, `convert-to-path`, `exclude-groups`, `flatten-beziers`, `fix-illustrator-svg-font-names`, `include-only-groups`, `ungroup`, `xpath`, `xslt`.

## Exact route inventory confirmed from the current official docs
- `GET /api/v2/public/convert/{inputExt}/auto/{outputExt}`
- `POST /api/v2/public/convert/{inputExt}/{programChain...}/{outputExt}`
- `POST /api/v2/public/analyze/{inputExt}/{analyzer}`
- `POST /api/v2/public/process/{inputExt}/{processor}`
- `GET /api/v2/public/files/{filename.ext}`

## Integration notes for fireROUTE
- Treat Vector Express as a small route surface with heavy query-parameter specialization rather than many unique endpoints.
- Preserve raw passthrough for converter/analyzer/processor-specific option names because they are tool-specific and numerous.
- Handle file retrieval as a second step after reading the provider's `resultUrl`.
- Keep the no-CORS limitation explicit in any browser-facing adapter documentation.