# 7Timer!

## Provider metadata
- Category: `Weather`
- Provider slug: `7timer`
- Official docs used manually:
  - `https://www.7timer.info/doc.php?lang=en`
- Confirmed public API base patterns:
  - `http://www.7timer.info/bin/astro.php`
  - `http://www.7timer.info/bin/api.pl`
- Response formats mentioned by the provider: PNG image, XML, JSON
- Authentication model: no API key required according to the official docs
- Manually confirmed routes in this pass: `2`

## Authentication
The official 7Timer! documentation says the API can be used directly without registering an API key.

## Manually confirmed endpoints
| Method | Path | Purpose | Key parameters |
|---|---|---|---|
| GET | `/bin/astro.php` | Graphical forecast image API | `lon`, `lat`, `ac`, `lang`, `unit`, `output=internal`, `tzshift` |
| GET | `/bin/api.pl` | Machine-readable weather API | required `lon`, `lat`, `product`, `output`; optional product-specific selectors |

## Parameter notes from the official page
- `lon`, `lat`: floating-point coordinates; docs say inputs are expected at 0.001 precision.
- `product`: one of `astro`, `civil`, `civillight`, `meteo`, or `two`.
- `output`: `internal` for graphical output, or `xml` / `json` for machine-readable output.
- `ac`: altitude correction for ASTRO forecasts; docs list `0` (default), `2`, or `7`.
- `lang`: language selector.
- `unit`: metric or British units.
- `tzshift`: timezone adjustment; docs list `0`, `1`, or `-1`.

## Response, rate-limit, and usage notes
- Graphical API responses are PNG images suitable for `<img>` embedding.
- Machine-readable responses are available as XML or JSON.
- The page documents product-specific forecast families including ASTRO, CIVIL, CIVIL Light, METEO, and Two-Week-Overview.
- No public pagination scheme is documented.
- No explicit rate-limit policy is documented on the public API page.
- No formal error schema is documented on the public API page.

## Important fireROUTE notes
- 7Timer! is coordinate-first; there is no native free-text `q` location parameter.
- `product` materially changes response shape and semantics, so adapters should preserve it.
- The documentation page is old (last update shown: 2012), so production use should be treated cautiously.

## Verification notes
This file was manually rebuilt from the live 7Timer! documentation page.