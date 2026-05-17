# PHP-Noise

## Manual review status
- Category: Art & Design
- Official pages reviewed:
  - `https://php-noise.com/`
  - `https://php-noise.com/noise.php?help`
- Manual review outcome: `manually_documented`
- Confirmed route count: `4`

## API overview
- Base URL: `https://php-noise.com`
- Primary generator endpoint: `https://php-noise.com/noise.php`
- Authentication:
  - no auth is documented on the reviewed official pages
- Request model:
  - browser-facing `GET` query-string API
  - all parameters are optional
  - blank or invalid color inputs fall back to random generation
- Response formats:
  - image output by default
  - JSON output when `json` is present
  - JSON output with embedded base64 image string when both `json` and `base64` are present
  - plain-text help when `help` is present
- Pagination:
  - none
- Rate limits:
  - none published on the reviewed pages

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/noise.php` | optional `hex`, `r`, `g`, `b`, `tiles`, `tileSize`, `borderWidth`, `mode`, `multi`, `steps` | Generates a noise background image. |
| GET | `/noise.php?json` | same generator parameters plus `json` | Returns a JSON-form response instead of the default image response. |
| GET | `/noise.php?json&base64` | same generator parameters plus `json`, `base64` | Returns JSON with the image exported as a base64 string. |
| GET | `/noise.php?help` | `help` | Returns the official usage/help text listing supported options and defaults. |

## Confirmed parameters and defaults
### Color inputs
- `hex`: hex color without `#`; if supplied, the `r`, `g`, and `b` parameters are ignored
- `r`, `g`, `b`: integer color channels from `0` to `255`
- If `hex` is invalid, the help page says a random color is generated.
- If one of `r`, `g`, or `b` is invalid or missing, that channel is generated randomly.

### Layout controls
- `tiles`: number of tiles per row and column; default `50`; capped at `50` outside CLI usage
- `tileSize`: tile width/height in pixels; default `7`; capped at `20` outside CLI usage
- `borderWidth`: grid width in pixels; default `0`; capped at `15` outside CLI usage

### Color calculation controls
- `mode`: `brightness` or `around`; default `brightness`
- `multi`: only for `brightness` mode; positive floating-point number with one decimal place; default `1.5`
- `steps`: only for `brightness` mode; default `5`; capped at `50` outside CLI usage

## Response, errors, and format notes
- The reviewed home page documents example JSON variants but does not enumerate the full JSON field schema.
- The help page documents behavior and defaults but does not publish a dedicated HTTP error table.
- The documentation repeatedly notes a distinction between CLI usage and browser usage: browser-side values are capped while CLI values are not capped.

## Important usage notes
- The home page describes PHP-Noise as free and open source.
- The official UI is a form wrapper around the same `noise.php` generator endpoint.
- The `help` output is the authoritative source for parameter defaults and caps on the reviewed pages.

## Sources inspected
- `https://php-noise.com/`
- `https://php-noise.com/noise.php?help`
