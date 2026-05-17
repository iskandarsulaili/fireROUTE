# GrünstromIndex

## Provider metadata
- Category: `Environment`
- Provider slug: `gr-nstromindex`
- Official docs inspected manually:
  - `https://gruenstromindex.de/`
  - linked developer console from `Entwickler Infos (API)`
- Confirmed API base URL: `https://api.corrently.io`
- Response format confirmed from docs: JSON
- Authentication model: query-string `token` from Corrently console
- Manually confirmed routes in this pass: `1`

## Manually confirmed endpoint
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/v2.0/gsi/prediction` | Retrieve GrünstromIndex forecast data for a German ZIP code | required `zip`, optional/required access `token` |

## Response notes
- The response schema shown in the official developer console includes top-level metadata fields such as `support`, `documentation`, `commercial`, `signee`, `forecast`, `timeframe`, `iat`, `zip`, `signature`, `location`, and `provisioning`.
- Individual forecast elements include renewable-energy indicators such as `gsi`, `energyprice`, `co2_g_standard`, `co2_g_oekostrom`, `ewind`, and `esolar`.

## Usage notes
- The docs describe the service as a forecast of renewable-energy availability for the coming hours/days.
- The ZIP code parameter is documented for locations in Germany.
- Tokens are issued through `https://console.corrently.io/`.

## Important fireROUTE notes
- This provider is a forecasted green-power availability/index service, not a generic carbon-emissions catalog.
- Route coverage in the inspected official docs was intentionally narrow: the developer console exposed one documented public prediction endpoint during this pass.

## Verification notes
This file was manually rebuilt from the GrünstromIndex official site and linked developer console.