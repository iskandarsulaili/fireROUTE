# Malaysian Meteorological Department (MET Malaysia)

## Provider metadata
- Category: `Weather`
- Provider slug: `malaysian-met-department`
- Official docs/manual source: documented directly from Malaysian Meteorological Department (MET Malaysia) API documentation
- Base URL: `https://api.met.gov.my/v2.1/`
- Note: `https://api.met.gov.my/v2/` is deprecated
- Response format: JSON
- Auth model: API key in `Authorization` header prefixed with `METToken`
- Rate limits:
  - Burst rate: maximum 10 requests per minute
  - Sustained rate: maximum 2,000 requests per day
- Caching: `ETag` and `Cache-Control` headers encouraged for subsequent requests
- Manually confirmed route count: `7`

## Authentication
Every request must include an authentication token in the `Authorization` HTTP header, prefixed by the string literal `METToken` followed by a whitespace:

```
Authorization: METToken <API_KEY>
```

Unauthenticated requests return HTTP 401 Unauthorized.

## Confirmed endpoints

### Locations
| Method | Path | Key parameters | Notes |
|--------|------|---------------|-------|
| GET | `/v2.1/locations` | `locationcategoryid` (required), `offset` (optional) | Returns list of locations by category. Categories: STATE, DISTRICT, TOWN, TOURISTDEST, WATERS. Max 50 records per response; use `offset` for pagination. |

### Data (weather forecast / warnings)
| Method | Path | Key parameters | Notes |
|--------|------|---------------|-------|
| GET | `/v2.1/data` | `datasetid`, `datacategoryid`, `locationid`, `start_date`, `end_date`, optional `lang` | Main data query endpoint. Used for general forecast, marine forecast, and warnings. |

### Data Types
| Method | Path | Key parameters | Notes |
|--------|------|---------------|-------|
| GET | `/v2.1/datatypes` | none | Returns list of available data types with `id` and `name` attributes. |

### Static Images
| Method | Path | Notes |
|--------|------|-------|
| GET | `/static/images/satelit-latest.gif` | Latest satellite image |
| GET | `/static/images/radar-latest.gif` | Latest current radar image |
| GET | `/static/images/swirl-latest.gif` | Latest forecast radar image |

## Request parameters

### General Forecast
| Parameter | Value |
|-----------|-------|
| `datasetid` | FORECAST |
| `datacategoryid` | GENERAL |
| `locationid` | Location ID from /locations endpoint. Use ALL_LOCATIONS for all. |
| `start_date` | ISO8601 (YYYY-MM-DD). Must be today or greater. |
| `end_date` | ISO8601 (YYYY-MM-DD). Must be >= start_date. |
| `lang` | Optional. `en` (English, default) or `ms` (Bahasa Melayu). |

Example:
```
GET /v2.1/data?datasetid=FORECAST&datacategoryid=GENERAL&locationid=LOCATION:237&start_date=2026-06-21&end_date=2026-06-21
```

### Marine Forecast
| Parameter | Value |
|-----------|-------|
| `datasetid` | FORECAST |
| `datacategoryid` | MARINE |
| `locationid` | Location ID for WATER category locations |
| `start_date` | ISO8601 (YYYY-MM-DD). Must be today or greater. |
| `end_date` | ISO8601 (YYYY-MM-DD). Must be >= start_date. |
| `lang` | Optional. `en` or `ms`. |

Example:
```
GET /v2.1/data?datasetid=FORECAST&datacategoryid=MARINE&locationid=LOCATION:501&start_date=2026-06-21&end_date=2026-06-21
```

### Warnings
| Parameter | Value |
|-----------|-------|
| `datasetid` | WARNING |
| `datacategoryid` | QUAKETSUNAMI, WINDSEA, THUNDERSTORM, RAIN, CYCLONE |
| `start_date` | ISO8601. Range of dates warnings may be valid. |
| `end_date` | ISO8601. Must be >= start_date. |

Warning types:
- `QUAKETSUNAMI` — earthquake/tsunami
- `WINDSEA` — strong wind & rough seas (note: use `WINDSEA2` in actual API call)
- `THUNDERSTORM` — thunderstorm
- `RAIN` — continuous heavy rain
- `CYCLONE` — tropical cyclone

## Response format

### General forecast response fields
| Field | Description |
|-------|-------------|
| `metadata.resultset.count` | Total number of records in results |
| `results[].datatype` | Type of data (see Data Types endpoint) |
| `results[].value` | Actual value (string, integer, or float) |
| `results[].attributes.unit` | Unit of measurement (e.g. "Celcius") |
| `results[].locationname` | Location name |
| `results[].date` | Date and time of forecast |

### General forecast data types (datatype)
| Code | Description |
|------|-------------|
| FMAXT | Maximum temperature (°C) |
| FMINT | Minimum temperature (°C) |
| FTEMP | Temperature (°C) |
| FWEATHER | Weather condition code/description |
| FHUMID | Humidity (%) |
| FWIND | Wind description |
| FRAIN | Rainfall probability/amount |

### Marine forecast data types
| Code | Description |
|------|-------------|
| FMWS | Wind speed (km/h) |
| FMWD | Wind direction |
| FMWV | Wave height (m) |
| FMWP | Wave period (s) |
| FMWS | Sea state description |

## Important usage notes
- Access upon registration: general forecast, marine forecast, and warnings are available by default.
- Satellite and radar static images do not require authentication.
- The deprecated `/v2/` base URL should not be used; always use `/v2.1/`.
- Malaysia-specific meteorological data — best for players/partners in Malaysia, Singapore, and surrounding region.
- Location categories of interest for general forecast: TOWN and TOURISTDEST.
- Warnings data includes bilingual content (English + Bahasa Melayu) in the response.

## Sources inspected
- Direct API documentation from Malaysian Meteorological Department (MET Malaysia)
- `https://api.met.gov.my/v2.1/`
- `https://api.met.gov.my/v2.1/locations?locationcategoryid=TOWN`
- `https://api.met.gov.my/v2.1/datatypes`
- `https://api.met.gov.my/v2.1/data?datasetid=FORECAST&datacategoryid=GENERAL&locationid=LOCATION:237&start_date=2026-06-21&end_date=2026-06-21`
