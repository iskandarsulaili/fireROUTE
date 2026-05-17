# Remote Calc

## Provider metadata
- Category: `Science & Math`
- Provider slug: `remote-calc`
- Description: `Decodes base64 encoding and parses it to return a solution to the calculation in JSON`
- Official docs/pages used:
  - `https://raw.githubusercontent.com/elizabethadegbaju/remotecalc/master/README.md` (official project README)
  - `https://remote-calc.herokuapp.com/` (historical deployed host named in the official README; manual live check now returns a `No such app` page)
- Public API base URL documented in the official README: `https://remote-calc.herokuapp.com`
- Auth model: no authentication mentioned on the reviewed official pages
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON
- Rate limits: no numeric rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `1`

## API shape and behavior
- The official README documents one endpoint: `GET /calculus?query=[input]`.
- The `query` value must be a UTF-8 string encoded with Base64 before submission.
- The service is described as parsing the decoded expression and solving it according to the order of precedence.
- The README lists supported operators as `+`, `-`, `*`, `/`, `(`, and `)`.
- The historical deployed host named in the README currently returns a `No such app` page, so the route inventory below is confirmed from the official README rather than a successful live response.

## Canonical endpoint
1. `GET /calculus`
   - Evaluate the Base64-encoded arithmetic expression sent in the `query` parameter.

## Confirmed parameters
### Query parameters
- `query` - required Base64-encoded UTF-8 expression string

### Input notes from the official README
- Example original expression: `2 * (23/(3*3))- 23 * (2*3)`
- Example encoded query: `MiAqICgyMy8oMyozKSktIDIzICogKDIqMyk`
- The README presents the endpoint as a calculator-style single-route API rather than a resource collection.

## Response and error notes
### Success response shape from the official README
```json
{
  "error": false,
  "result": 546
}
```

### Error response shape from the official README
```json
{
  "error": true,
  "message": "string"
}
```

- The README says the service returns either an HTTP error code or a solution in JSON form.
- No formal HTTP status-code table or pagination model is published on the reviewed official pages.

## Important usage notes
- Preserve the documented `query` parameter name exactly.
- Send the mathematical expression after Base64-encoding it; do not send the raw infix string.
- Model this provider as a single GET compute endpoint rather than a multi-resource API.
- Treat the historical Heroku base URL as documented-but-currently-unavailable until the provider publishes a new live host.

## fireROUTE normalization notes
- Preserve the `/calculus` path and the `query` parameter exactly as documented.
- Keep the response model lightweight around the documented `error`, `result`, and `message` fields.
- Do not invent POST routes or alternate base URLs; the reviewed official material documents only `GET /calculus` on the historical Heroku deployment.
