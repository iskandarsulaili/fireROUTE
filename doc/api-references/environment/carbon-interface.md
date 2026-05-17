# Carbon Interface

## Provider metadata
- Category: `Environment`
- Provider slug: `carbon-interface`
- Official docs inspected manually:
  - `https://docs.carboninterface.com/`
- Confirmed API base URL: `https://www.carboninterface.com/api/v1`
- Response format confirmed from docs: JSON
- Authentication model: bearer token in `Authorization: Bearer API_KEY`
- Manually confirmed routes in this pass: `12`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/auth` | Validate API key/authentication | bearer token required |
| POST | `/estimates` | Create emissions estimates for supported activity types | required JSON body with `type`; activity-specific fields for electricity, flight, shipping, vehicle, or fuel combustion |
| GET | `/estimates/{id}` | Retrieve one estimate by UUID | required estimate `id` |
| GET | `/vehicle_makes` | List supported vehicle makes | bearer token required |
| GET | `/vehicle_makes/{vehicle_make_id}/vehicle_models` | List models for one make | required `vehicle_make_id` |
| POST | `/carbon_ledger/programs/{program_id}/card_profiles` | Create a carbon-ledger card profile | required `program_id`; JSON body such as `external_id`, `diet_habit`, `transportation_method` |
| POST | `/carbon_ledger/programs/{program_id}/card_profiles/{card_profile_id}` | Update a card profile | required `program_id`, `card_profile_id`; JSON body |
| GET | `/carbon_ledger/programs/{program_id}/card_profiles/{card_profile_id}` | Retrieve one card profile | required path IDs |
| GET | `/carbon_ledger/programs/{program_id}/card_profiles` | List card profiles | required `program_id` |
| DELETE | `/carbon_ledger/programs/{program_id}/card_profiles/{card_profile_id}` | Delete a card profile | required path IDs |
| POST | `/carbon_ledger/programs/{program_id}/card_profiles/{card_profile_id}/transactions` | Create a transaction estimate | required path IDs; transaction JSON payload |
| GET | `/carbon_ledger/programs/{program_id}/card_profiles/{card_profile_id}/transactions/{transaction_id}` | Retrieve one transaction | required path IDs |
| GET | `/carbon_ledger/programs/{program_id}/card_profiles/{card_profile_id}/transactions` | List transactions for a card profile | required path IDs |

## Error and usage notes
- The docs explicitly say the API is REST-based and uses JSON request/response bodies.
- The published status-code table includes `200`, `201`, `400`, `401`, `403`, `404`, `422`, `429`, `500`, and `503`.
- Error bodies are documented as JSON objects with a top-level `message` field.
- The Carbon Ledger API is explicitly marked beta in the official docs.

## Important fireROUTE notes
- Carbon Interface combines two distinct surfaces: the public estimates API and the beta carbon-ledger API.
- Vehicle estimates often require a lookup flow through `vehicle_makes` and `vehicle_models` before creating an estimate.

## Verification notes
This file was manually rebuilt from the official Carbon Interface documentation site.