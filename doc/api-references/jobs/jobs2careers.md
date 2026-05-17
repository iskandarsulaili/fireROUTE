# Jobs2Careers

## Provider metadata
- Category: `Jobs`
- Provider slug: `jobs2careers`
- Official pages checked:
  - `https://api.jobs2careers.com/api/spec.pdf`
  - `https://api.jobs2careers.com/` (redirected to the public Jobs2Careers site)
- Manually confirmed route count: `0`

## Manual review result
The official entry point is a PDF specification, but the browser session could only load it as an embedded PDF viewer without extractable text from the official site. The API subdomain otherwise redirects to the general Jobs2Careers website, which does not expose the API contract.

## Explicit blocker note
- I manually opened the official PDF specification URL.
- The site served the PDF in an embedded viewer, but no usable text or route list could be extracted through the available browser/file-only workflow.
- I then checked the API root, which redirected to the public jobs site rather than publishing alternative API documentation.
- Because I could not reliably inspect the official PDF contents with the allowed tools, I cannot confidently claim any live endpoints.

## fireROUTE note
- Revisit if the provider publishes an HTML API reference or a raw text/OpenAPI document linked from the official site.
