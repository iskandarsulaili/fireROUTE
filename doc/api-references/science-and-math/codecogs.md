# CodeCogs

## Provider metadata
- Category: `Science & Math`
- Provider slug: `codecogs`
- Description: `Render LaTeX equations in PNG, GIF, SVG, EMF, PDF, JSON, or download formats with styling options`
- Official docs/pages used:
  - `https://editor.codecogs.com/docs/4-LaTeX_rendering.php` (official LaTeX rendering reference manually reviewed in-browser)
- Current public API base URL confirmed from the reviewed official docs: `https://latex.codecogs.com`
- Auth model: no authentication mentioned on the reviewed official page
- Methods confirmed from the reviewed official docs: `GET`
- Response formats confirmed from the reviewed official docs/pages: raster/vector image responses, JSON, JavaScript callback output, and browser-download responses
- Rate-limit notes: no numeric public quota or throttling policy was published on the reviewed official page
- Manually confirmed route count: `17`

## API shape and behavior
- The official page defines one URL template for equation rendering: `https://latex.codecogs.com/{type}.{format}?{LaTeX}`.
- The `type` segment selects the output graphic type.
- The `format` segment selects how that rendered result is returned.
- The LaTeX expression is sent after the `?` as the request payload rather than as a named query parameter.
- The docs explicitly note that `pdf` output can only be used with the `download` receiver.

## Canonical endpoints
All documented routes are under the `https://latex.codecogs.com` host.

### PNG output
1. `GET /png.image?{latex}`
   - Return a PNG image for the supplied LaTeX.
2. `GET /png.json?{latex}`
   - Return JSON metadata/details for the rendered PNG request.
3. `GET /png.javascript?{latex}`
   - Return the JSON-style payload wrapped in `ParseEqn()`.
4. `GET /png.download?{latex}`
   - Trigger browser download of the rendered PNG.

### GIF output
5. `GET /gif.image?{latex}`
   - Return a GIF image for the supplied LaTeX.
6. `GET /gif.json?{latex}`
   - Return JSON metadata/details for the rendered GIF request.
7. `GET /gif.javascript?{latex}`
   - Return the JSON-style payload wrapped in `ParseEqn()`.
8. `GET /gif.download?{latex}`
   - Trigger browser download of the rendered GIF.

### SVG output
9. `GET /svg.image?{latex}`
   - Return an SVG image for the supplied LaTeX.
10. `GET /svg.json?{latex}`
    - Return JSON metadata/details for the rendered SVG request.
11. `GET /svg.javascript?{latex}`
    - Return the JSON-style payload wrapped in `ParseEqn()`.
12. `GET /svg.download?{latex}`
    - Trigger browser download of the rendered SVG.

### EMF output
13. `GET /emf.image?{latex}`
    - Return an EMF image for the supplied LaTeX.
14. `GET /emf.json?{latex}`
    - Return JSON metadata/details for the rendered EMF request.
15. `GET /emf.javascript?{latex}`
    - Return the JSON-style payload wrapped in `ParseEqn()`.
16. `GET /emf.download?{latex}`
    - Trigger browser download of the rendered EMF.

### PDF output
17. `GET /pdf.download?{latex}`
    - Download a PDF rendering of the supplied LaTeX.

## Parameters and request conventions confirmed from the reviewed official docs
### Shared path variables
- `type` - required output type. The reviewed official page lists `png`, `gif`, `svg`, `emf`, and `pdf`.
- `format` - required delivery mode. The reviewed official page lists `image`, `json`, `javascript`, and `download`, with the explicit note that `pdf` can only be used with `download`.

### Shared expression input
- `{latex}` - required LaTeX markup placed after the `?` in the request URL.

### Documented rendering/style directives embedded in the LaTeX payload
The reviewed official page documents these inline directives as part of the equation definition:
- `\tiny` - 5pt font size
- `\small` - 9pt font size
- `\large` - 12pt font size
- `\LARGE` - 18pt font size
- `\huge` - 20pt font size
- `\dpi{#}` - dots per inch for PNG and GIF images; documented range `50` to `300`
- `\bg{#}` - background color using a preset name or a 6-digit hexadecimal RGB value
- `\fg{#}` - foreground color using a preset name or a 6-digit hexadecimal RGB value

## Response notes
- `image` returns a rendered image in the requested type.
- `json` returns a JavaScript JSON array with rendered-equation details.
- `javascript` returns the same JSON-style payload wrapped in a function named `ParseEqn()`.
- `download` behaves like `image` but instructs the browser to download the file instead of display it inline.
- The official page notes a GIF-specific behavior: baseline offset is embedded within the GIF header.

## Error, pagination, and format notes
- No pagination is documented because the API is render-per-request rather than list/query based.
- No formal error-code table or error-body schema is published on the reviewed official page.
- No numeric rate-limit header or retry guidance is published on the reviewed official page.

## Usage notes
- Keep the LaTeX expression URL-safe because it is transmitted directly after `?` rather than inside a named parameter.
- Preserve the provider's unusual wire format exactly: `{type}.{format}?{LaTeX}`.
- Treat `pdf` as a download-only surface; the reviewed official docs do not document `pdf.image`, `pdf.json`, or `pdf.javascript`.
- Preserve inline styling directives like `\dpi{#}`, `\bg{#}`, and `\fg{#}` as part of the expression payload instead of trying to normalize them into separate fireROUTE query parameters.

## fireROUTE normalization notes
- Normalize CodeCogs against the `https://latex.codecogs.com` host, not the docs-site host.
- Keep the return-mode dimension (`image`, `json`, `javascript`, `download`) visible because it changes the transport format materially.
- Keep the output-type dimension (`png`, `gif`, `svg`, `emf`, `pdf`) visible because it changes the artifact type materially.
- Do not rewrite the unnamed expression payload into a guessed `latex=` query parameter; the reviewed official docs do not document one.
