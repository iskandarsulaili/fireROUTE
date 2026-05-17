# Numverify

## Provider metadata
- Category: `APILayer Featured`
- Provider slug: `numverify`
- Official docs inspected manually:
  - `https://numverify.com/`
  - `https://docs.apilayer.com/numverify/docs/quickstart-guide`
- Confirmed API base URL: `http://apilayer.net/api`
- Response format confirmed from docs: JSON
- Authentication model: query-string `access_key`
- Manually confirmed routes in this pass: `2`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/validate` | Validate one phone number and return lookup metadata | required `access_key`, required `number`; optional `country_code`, `format`, `callback` |
| GET | `/countries` | List supported countries and dialing codes | required `access_key` |

## Usage notes
- The quickstart example is `http://apilayer.net/api/validate?access_key=YOUR_ACCESS_KEY&number=14158586273`.
- The docs describe the service as a single main validation endpoint plus a countries helper endpoint.
- The API supports national-format validation when `country_code` is supplied and international-format validation directly from the number.

## Verification notes
This file was manually rebuilt from Numverify's official site and APILayer-hosted quickstart/docs.