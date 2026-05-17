# Numbers

## Provider metadata
- Category: `Science & Math`
- Provider slug: `numbers`
- Official docs/pages used:
  - `https://math.tools/api/numbers/`
  - `https://math.tools/yaml/math.tools.numbers.openapi.yaml`
- Current public API base URL: `https://api.math.tools`
- Auth model:
  - public/free calls do not require an API key
  - paid plans use header `X-Mathtools-Api-Secret`
  - the docs also allow `api_key` as a request parameter but explicitly discourage that approach
- Response format notes:
  - the OpenAPI file documents JSON responses
  - the official description also says the API supports `json`, `xml`, and `jsonp`
- Rate limits from the official docs:
  - public calls: `60` API calls per day
  - public distribution cap: `5` calls per hour
  - paid plans: higher limits by plan
- Manually confirmed route count: `26`

## Common parameters
- `number` - target number for fact, spelling, conversion, prime, and number-check routes
- `min` / `max` - random-number generation range controls
- `total` - count of generated random numbers
- `language` - language selector on text/spelling-style routes
- `from` / `to` - base-conversion source and target bases

## Canonical endpoints
All confirmed routes in the reviewed OpenAPI spec are `GET` routes.

1. `GET /numbers/nod`
2. `GET /numbers/fact`
3. `GET /numbers/random`
4. `GET /numbers/ordinal`
5. `GET /numbers/cardinal`
6. `GET /numbers/currency`
7. `GET /numbers/numeral/egyptian`
8. `GET /numbers/numeral/chinese`
9. `GET /numbers/numeral/roman`
10. `GET /numbers/base/binary`
11. `GET /numbers/base/octal`
12. `GET /numbers/base/hex`
13. `GET /numbers/base`
14. `GET /numbers/pi`
15. `GET /numbers/prime/is-prime`
16. `GET /numbers/prime/is-mersenne-prime`
17. `GET /numbers/prime/is-fermat-prime`
18. `GET /numbers/prime/is-pell-prime`
19. `GET /numbers/prime/is-partition-prime`
20. `GET /numbers/prime/is-fibonacci-prime`
21. `GET /numbers/prime/factors`
22. `GET /numbers/is-palindrome`
23. `GET /numbers/is-triangle`
24. `GET /numbers/is-cube`
25. `GET /numbers/is-square`
26. `GET /numbers/prime/is-perfect`

## Route-family notes
### Free/rate-limited utilities
- `GET /numbers/nod` returns the number of the day.
- `GET /numbers/ordinal`, `GET /numbers/cardinal`, and `GET /numbers/currency` spell numbers in different formats.
- `GET /numbers/base` and the fixed-base helpers (`/binary`, `/octal`, `/hex`) expose number-system conversion.
- `GET /numbers/pi` returns digits/details for pi.

### Facts and generation
- `GET /numbers/fact` returns a fact for the supplied `number`.
- `GET /numbers/random` generates one or more random numbers and uses `min`, `max`, and `total`.

### Numeral systems
- `/numbers/numeral/egyptian`
- `/numbers/numeral/chinese`
- `/numbers/numeral/roman`

### Prime and property checks
- Prime-family checks include prime, Mersenne prime, Fermat prime, Pell prime, partition prime, Fibonacci prime, perfect number, and factorization.
- Non-prime property checks include palindrome, triangle, cube, and square tests.

## Error and response notes
- The OpenAPI examples include `401 Unauthorized` as the standard auth failure shape:
```json
{
  "error": {
    "code": 401,
    "message": "Unauthorized"
  }
}
```
- Success examples use a wrapper containing objects such as `success`, `copyright`, and `contents`.
- The `fact` example returns a compact `contents` object with `number` and `fact`.

## Pagination and limits
- No pagination model is documented in the reviewed Numbers API pages or OpenAPI file.
- The service is organized as one-shot utility endpoints rather than list endpoints.

## Important usage notes
- The official docs explicitly distinguish free public calls from paid-plan calls.
- Header auth is the preferred paid-plan mechanism.
- The route inventory exposed by the OpenAPI document is substantially larger than the earlier thin route scrape; the provider includes prime-family and property-check routes in addition to spelling and base-conversion utilities.

## fireROUTE normalization notes
- Use `https://api.math.tools` as the canonical base URL.
- Preserve the provider's native query parameter names exactly.
- Treat this provider as a read-only utility API with `GET`-only documented operations.
