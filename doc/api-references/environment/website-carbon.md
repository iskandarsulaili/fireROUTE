# Website Carbon

## Provider metadata
- Category: `Environment`
- Provider slug: `website-carbon`
- Official docs used manually:
  - `https://api.websitecarbon.com/`
- Confirmed API base URL: `https://api.websitecarbon.com`
- Response format confirmed from docs: JSON
- Authentication model: none documented for the public endpoint
- Manually confirmed routes in this pass: `1`

## Manually confirmed endpoint
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/data` | Calculate website emissions from supplied page-bytes and hosting-greenness inputs | required `bytes`, required `green`, optional `legacy` |

## Response notes
The public docs show response fields including:
- `bytes`
- `green`
- `gco2e`
- `rating`
- `statistics`
- `cleanerThan`

The `statistics` object example includes nested energy and CO2 calculations.

## Usage, rate-limit, and compatibility notes
- The docs explicitly say `/data` is the only endpoint offered for public access.
- The page warns that endpoints and response structures can change without notice.
- The old site endpoint was removed from public access on 14 July 2025.
- No auth, pagination, or numeric rate-limit table is documented on the public page.

## Important fireROUTE notes
- This is a lightweight calculation API, not a crawler-style website analyzer in the public form documented here.
- The caller must provide page bytes and green-hosting status rather than just a URL.

## Verification notes
This file was manually rebuilt from the official Website Carbon API page.