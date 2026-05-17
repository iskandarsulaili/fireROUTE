# Newton

## Provider metadata
- Category: `Science & Math`
- Provider slug: `newton`
- Description: `Symbolic and Arithmetic Math Calculator`
- Official docs/pages used:
  - `https://newton.vercel.app/` (official landing page)
  - `https://raw.githubusercontent.com/aunyks/newton-api/master/README.md` (official project README linked from the landing page)
  - `https://newton.vercel.app/api/v2/derive/x%5E2` (live example endpoint check; opens as a JSON response in-browser)
- Current public API base URL: `https://newton.vercel.app/api/v2`
- Auth model: no authentication mentioned on the reviewed official pages
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON objects containing `operation`, `expression`, and `result` fields in the official examples
- Rate limits: no numeric rate-limit policy was published on the reviewed official pages
- Manually confirmed route count: `15`

## API shape and behavior
- The official README defines one route pattern: `https://newton.now.sh/api/v2/:operation/:expression`.
- The official landing page and live endpoint checks show the service is currently reachable under `https://newton.vercel.app/api/v2/...`.
- All operations are performed by sending a URL-encoded math expression in the path.
- The official examples show JSON responses rather than HTML or form responses.

## Canonical endpoints
All documented operations are exposed under the `/api/v2` prefix.

1. `GET /simplify/{expression}`
   - Simplify an expression.
2. `GET /factor/{expression}`
   - Factor an expression.
3. `GET /derive/{expression}`
   - Differentiate an expression.
4. `GET /integrate/{expression}`
   - Integrate an expression.
5. `GET /zeroes/{expression}`
   - Find the zeroes of an expression.
6. `GET /tangent/{value_and_expression}`
   - Find a tangent line at a given x value.
7. `GET /area/{range_and_expression}`
   - Find the area under a curve for a range.
8. `GET /cos/{expression}`
   - Compute cosine.
9. `GET /sin/{expression}`
   - Compute sine.
10. `GET /tan/{expression}`
    - Compute tangent.
11. `GET /arccos/{expression}`
    - Compute inverse cosine.
12. `GET /arcsin/{expression}`
    - Compute inverse sine.
13. `GET /arctan/{expression}`
    - Compute inverse tangent.
14. `GET /abs/{expression}`
    - Compute absolute value.
15. `GET /log/{expression}`
    - Compute logarithms.

## Core parameters and path conventions
### Shared path parameters
- `expression` - required URL-encoded math expression for most operations.
- `value_and_expression` - required on `/tangent/{value_and_expression}`; the README says to send this as `c|f(x)` where `c` is the x value and `f(x)` is the function expression.
- `range_and_expression` - required on `/area/{range_and_expression}`; the README says to send this as `c:d|f(x)` where `c` is the starting x value and `d` is the ending x value.

### Input encoding notes from the official README
- URL-encode characters such as `^` before sending expressions.
- Fractions must be submitted as `numerator(over)denominator`; the official README gives `2(over)4` as the wire form for `2/4`.
- The path segment after `/api/v2/` selects the operation directly; there are no documented query-string controls on the reviewed official pages.

## Response notes
- The official examples show a JSON object with:
  - `operation`
  - `expression`
  - `result`
- The landing page example for `factor/x^2-1` and the README example for `derive/x^2` both follow that same 3-field response pattern.

## Error notes
- No formal error-code table or error schema was published on the reviewed official pages.
- The reviewed documentation focuses on successful calculations only.

## Usage notes
- Prefer the current `newton.vercel.app` origin even though the README still shows the historical `newton.now.sh` hostname.
- Treat every operation as a distinct route family even though they all follow the same generic path template.
- Keep expressions URL-encoded all the way through fireROUTE passthrough behavior.
- Preserve the README's special input conventions for tangent, area, and fraction expressions.

## fireROUTE normalization notes
- Preserve the `/api/v2` prefix.
- Preserve operation names exactly as documented: `simplify`, `factor`, `derive`, `integrate`, `zeroes`, `tangent`, `area`, `cos`, `sin`, `tan`, `arccos`, `arcsin`, `arctan`, `abs`, `log`.
- Do not collapse the tangent and area routes into a generic expression endpoint without carrying their special path-value syntax notes.
- Treat the response as a lightweight calculator payload rather than a rich typed schema; the official docs only guarantee `operation`, `expression`, and `result` in examples.
