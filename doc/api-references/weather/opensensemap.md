# openSenseMap

## Provider metadata
- Category: `Weather`
- Provider slug: `opensensemap`
- Official docs used manually:
  - `https://api.opensensemap.org/`
  - `https://docs.opensensemap.org`
- Confirmed API base URL: `https://api.opensensemap.org`
- Authentication model: mixed; many routes are public, authenticated routes require JWT
- Response format confirmed from the live root listing: JSON-oriented REST API
- Manually confirmed routes in this pass: `10`

## Authentication
The live API root explicitly separates:
- routes requiring no authentication
- routes requiring valid authentication through JWT

## Manually confirmed public routes
| Method | Path | Purpose |
|---|---|---|
| GET | `/` | Print/list routes |
| GET | `/stats` | API statistics |
| GET | `/tags` | All tags |
| GET | `/boxes` | List boxes |
| GET | `/boxes/data` | Multi-box data retrieval |
| GET | `/boxes/data/bytag` | Data grouped by tag |
| GET | `/boxes/:boxId` | Get one box |
| GET | `/boxes/:boxId/sensors` | Latest measurements for sensors in a box |
| GET | `/boxes/:boxId/sensors/:sensorId` | Latest measurement for one sensor |
| GET | `/boxes/:boxId/data/:sensorId` | Measurement data for one sensor |

## Additional routes explicitly advertised at the API root
- Public writes and account flows: `POST /boxes/data`, `POST /boxes/:boxId/data`, `POST /boxes/:boxId/:sensorId`, `POST /users/register`, `POST /users/sign-in`, `POST /users/refresh-auth`, and related account-reset routes.
- JWT-protected routes include `/users/me`, `/users/me/boxes`, box-management routes, transfer routes, and sign-out/delete-account operations.

## Usage notes
- The live root currently reports API version `v11.3.0`.
- The API root itself serves as a practical machine-readable route inventory.
- The official docs reference is `https://docs.opensensemap.org`.
- No simple numeric rate-limit table or pagination scheme was visible at the root listing inspected in this pass.

## Important fireROUTE notes
- openSenseMap is broader than weather-only; it includes user, box, sensor, and measurement management.
- JWT auth is required for ownership-changing routes, while many read routes remain public.

## Verification notes
This file was manually rebuilt from the live openSenseMap API root and official docs reference.