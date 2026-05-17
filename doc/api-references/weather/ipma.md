# IPMA

## Provider metadata
- Category: `Weather`
- Provider slug: `ipma`
- Official docs/site used manually:
  - `https://api.ipma.pt/open-data/`
- Confirmed public API/data base path: `https://api.ipma.pt/open-data/`
- Response/file formats confirmed from the index listing: JSON plus GPKG download
- Authentication model: no auth requirement shown on the public directory index
- Manually confirmed routes in this pass: `9`

## Manually confirmed public resources
| Method | Path | Purpose / type |
|---|---|---|
| GET | `/open-data/forecast/` | Forecast directory |
| GET | `/open-data/observation/` | Observation directory |
| GET | `/open-data/06.json` | JSON resource |
| GET | `/open-data/distrits-islands.json` | Districts/islands JSON resource |
| GET | `/open-data/precipitation-classe.json` | Precipitation classes JSON resource |
| GET | `/open-data/sea-locations.json` | Sea locations JSON resource |
| GET | `/open-data/weather-type-classe.json` | Weather-type classes JSON resource |
| GET | `/open-data/wind-speed-daily-classe.json` | Wind-speed daily classes JSON resource |
| GET | `/open-data/zonas.gpkg` | GeoPackage resource |

## Documentation notes
- The official `open-data/` page is a directory-style index rather than a Swagger-style API explorer.
- The inspected page exposes forecast and observation subdirectories alongside several top-level JSON reference files.
- The listing labels the JSON resources explicitly as `JavaScript Object Notation`.

## Rate limits, pagination, and errors
- No authentication, pagination, or numeric rate-limit policy was shown on the public directory index.
- No formal error schema was exposed on the inspected page.

## Important fireROUTE notes
- IPMA's public interface in this pass is a file/directory style open-data distribution point.
- Several resources are static reference files rather than parameterized REST endpoints.
- Adapters should treat this provider as open-data file retrieval first, API second.

## Verification notes
This file was manually rebuilt from IPMA's live public open-data directory index.