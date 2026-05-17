# UK Carbon Intensity

## Provider metadata
- Category: `Environment`
- Provider slug: `uk-carbon-intensity`
- Official docs inspected manually:
  - `https://carbon-intensity.github.io/api-definitions/#carbon-intensity-api-v1-0-0`
- Confirmed API base URL: `https://api.carbonintensity.org.uk`
- Response format confirmed from docs: JSON
- Authentication model: none documented
- Manually confirmed routes in this pass: `37`

## Manually confirmed route families
The official Carbon Intensity API reference exposes three main route families:

### 1. National intensity endpoints
- `GET /intensity`
- `GET /intensity/date`
- `GET /intensity/date/{date}`
- `GET /intensity/date/{date}/{period}`
- `GET /intensity/factors`
- `GET /intensity/stats/{from}/{to}`
- `GET /intensity/stats/{from}/{to}/{block}`
- `GET /intensity/{from}`
- `GET /intensity/{from}/fw24h`
- `GET /intensity/{from}/fw48h`
- `GET /intensity/{from}/pt24h`
- `GET /intensity/{from}/{to}`

### 2. Generation mix endpoints
- `GET /generation`
- `GET /generation/{from}/pt24h`
- `GET /generation/{from}/{to}`

### 3. Regional endpoints
- `GET /regional`
- `GET /regional/england`
- `GET /regional/scotland`
- `GET /regional/wales`
- `GET /regional/postcode/{postcode}`
- `GET /regional/regionid/{regionid}`
- `GET /regional/intensity/{from}/fw24h`
- `GET /regional/intensity/{from}/fw24h/postcode/{postcode}`
- `GET /regional/intensity/{from}/fw24h/regionid/{regionid}`
- `GET /regional/intensity/{from}/fw48h`
- `GET /regional/intensity/{from}/fw48h/postcode/{postcode}`
- `GET /regional/intensity/{from}/fw48h/regionid/{regionid}`
- `GET /regional/intensity/{from}/pt24h`
- `GET /regional/intensity/{from}/pt24h/postcode/{postcode}`
- `GET /regional/intensity/{from}/pt24h/regionid/{regionid}`
- `GET /regional/intensity/{from}/{to}`
- `GET /regional/intensity/{from}/{to}/postcode/{postcode}`
- `GET /regional/intensity/{from}/{to}/regionid/{regionid}`

The official reference also includes slash-variant aliases for some base collection paths, which brings the manually confirmed total to `37` routes.

## Usage notes
- The API is read-only and public in the inspected official docs.
- Path parameters such as `from`, `to`, `date`, `period`, `block`, `postcode`, and `regionid` drive most filtering.
- The service separates national intensity, generation mix, and regional/postcode/region forecasts/history.

## Important fireROUTE notes
- This provider offers one of the richer open electricity-carbon APIs in the catalog and is suitable for both point-in-time lookups and short forecast/historical windows.
- Regional routes are materially distinct from national routes and should not be collapsed into one schema without mapping care.

## Verification notes
This file was manually rebuilt from the official UK Carbon Intensity API reference.