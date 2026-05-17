# Transport for Sao Paulo, Brazil

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-sao-paulo-brazil`
- Provider identified from the official documentation as: `SPTrans API do Olho Vivo`
- Official docs used manually:
  - `https://www.sptrans.com.br/desenvolvedores/api-do-olho-vivo-guia-de-referencia/documentacao-api/`
  - `https://www.sptrans.com.br/desenvolvedores/`
- Version documented here: `2.1`
- Base URL:
  - canonical production base should now be treated as `https://api.olhovivo.sptrans.com.br/v2.1`
  - the reference page still shows `http://api.olhovivo.sptrans.com.br/v2.1` in examples, but the same page also warns that HTTPS became mandatory after `2024-01-02`
- Authentication:
  - the official docs require a prior `POST /Login/Autenticar?token={token}` call
  - the `token` must be generated in the `Meus Aplicativos` area of the SPTrans developer portal
  - the accessible docs page says the auth call returns `true` on success and `false` on error
  - the accessible page does not publish a deeper token/session persistence explanation beyond requiring that prior authentication call
- Primary response formats:
  - JSON for line, stop, corridor, company, position, and prediction routes
  - KMZ for the traffic-speed map routes

## Important official usage notes
- The public page offers versions `0` and `2.1`; this document follows the visible `2.1` reference.
- The docs describe the API as REST-style and say JSON is the standard return format.
- The stop-search section explicitly says the currently documented stop coverage is limited to `paradas de corredores`.
- Prediction responses are explicitly based on the `hr` reference time returned in the same payload.
- Vehicle position and prediction payloads include `ta` timestamps in UTC / ISO 8601 format.
- The line model documents `sl=1` as terminal principal -> terminal secundário and `sl=2` as the reverse direction.
- For the traffic KMZ routes, the optional path value `sentido` accepts `BC` (`bairro -> centro`) or `CB` (`centro -> bairro`).

## Rate limits, pagination, errors, and format notes
- No numeric rate limit or quota table is published on the inspected official pages.
- No pagination parameters are documented for any confirmed route.
- The only explicit error behavior documented in the accessible reference is the authentication call returning `false` when authentication fails.
- The accessible page does not publish a shared HTTP-status table or structured error schema for the other routes.
- JSON responses are shown either as top-level arrays or top-level objects, depending on the route family.
- KMZ routes are described as returning a `arquivo KMZ` with city traffic-flow information rather than JSON.

## Confirmed API surface
The official `2.1` reference page exposes these `20` route patterns:
1. `POST /Login/Autenticar`
2. `GET /Linha/Buscar`
3. `GET /Linha/BuscarLinhaSentido`
4. `GET /Parada/Buscar`
5. `GET /Parada/BuscarParadasPorLinha`
6. `GET /Parada/BuscarParadasPorCorredor`
7. `GET /Corredor`
8. `GET /Empresa`
9. `GET /Posicao`
10. `GET /Posicao/Linha`
11. `GET /Posicao/Garagem`
12. `GET /Previsao`
13. `GET /Previsao/Linha`
14. `GET /Previsao/Parada`
15. `GET /KMZ`
16. `GET /KMZ/{sentido}`
17. `GET /KMZ/Corredor`
18. `GET /KMZ/Corredor/{sentido}`
19. `GET /KMZ/OutrasVias`
20. `GET /KMZ/OutrasVias/{sentido}`

## 1) Authenticate
- Method: `POST`
- Path: `/Login/Autenticar`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Login/Autenticar?token=<token>`
- Purpose: authenticate a client session before calling the other API routes

Documented parameters:
- `token` - required query string; access token generated in `Meus Aplicativos`

Documented response notes:
- Returns literal `true` when authentication succeeds
- Returns literal `false` on error

## 2) Search lines
- Method: `GET`
- Path: `/Linha/Buscar`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Linha/Buscar?termosBusca={termosBusca}`
- Purpose: search bus lines by number or denomination; docs say a phonetic search is attempted when no exact line is found

Documented parameters:
- `termosBusca` - required query string; accepts full or partial line number or denomination, for example `8000`, `Lapa`, or `Ramos`

Documented response notes:
- Returns a JSON array of line objects
- Line objects include:
  - `cl` unique line identifier by operating direction
  - `lc` circular-line flag
  - `lt` numeric line display prefix
  - `tl` line type / service mode suffix
  - `sl` direction indicator
  - `tp` main-destination text
  - `ts` reverse-destination text

## 3) Search lines constrained to one direction
- Method: `GET`
- Path: `/Linha/BuscarLinhaSentido`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Linha/BuscarLinhaSentido?termosBusca={termosBusca}&sentido={sentido}`
- Purpose: search lines but only return the operating direction requested

Documented parameters:
- `termosBusca` - required query string; same search term behavior as `/Linha/Buscar`
- `sentido` - required byte / integer query string; `1` for terminal principal -> terminal secundário, `2` for the reverse

Documented response notes:
- Returns the same line-object schema described for `/Linha/Buscar`
- The docs note that only the requested direction is returned

## 4) Search stops
- Method: `GET`
- Path: `/Parada/Buscar`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Parada/Buscar?termosBusca={termosBusca}`
- Purpose: phonetic stop search by stop name or stop address

Documented parameters:
- `termosBusca` - required query string; accepts full or partial stop name or address text

Documented response notes:
- Returns a JSON array of stop objects
- Stop objects include:
  - `cp` stop identifier
  - `np` stop name
  - `ed` stop address / location text
  - `py` latitude
  - `px` longitude

## 5) List stops served by a line
- Method: `GET`
- Path: `/Parada/BuscarParadasPorLinha`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Parada/BuscarParadasPorLinha?codigoLinha={codigoLinha}`
- Purpose: list all stops served by one line

Documented parameters:
- `codigoLinha` - required query string; line identifier obtained from the line-search methods

Documented response notes:
- Returns the same stop-object schema used by `/Parada/Buscar`

## 6) List stops in a corridor
- Method: `GET`
- Path: `/Parada/BuscarParadasPorCorredor`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Parada/BuscarParadasPorCorredor?codigoCorredor={codigoCorredor}`
- Purpose: return all detailed stops that compose one corridor

Documented parameters:
- `codigoCorredor` - required query string; corridor identifier obtained from `/Corredor`

Documented response notes:
- Returns the same stop-object schema used by `/Parada/Buscar`

## 7) List corridors
- Method: `GET`
- Path: `/Corredor`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Corredor`
- Purpose: list all intelligent corridors in São Paulo

Documented parameters:
- None

Documented response notes:
- Returns a JSON array of corridor objects
- Corridor objects include:
  - `cc` corridor identifier
  - `nc` corridor name

## 8) List operating companies
- Method: `GET`
- Path: `/Empresa`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Empresa`
- Purpose: list operating companies grouped by operating area

Documented parameters:
- None

Documented response notes:
- Returns a JSON structure with:
  - `hr` reference time
  - `e` grouped company lists by operating area
- Nested company entries include area code `a`, company code `c`, and company name `n`

## 9) Get the latest positions for all mapped vehicles
- Method: `GET`
- Path: `/Posicao`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Posicao`
- Purpose: return the latest known location of all mapped vehicles

Documented parameters:
- None

Documented response notes:
- Returns an object with:
  - `hr` reference time
  - `l` list of lines currently located
- Per-line entries include `c`, `cl`, `sl`, `lt0`, `lt1`, `qv`, and vehicle list `vs`
- Per-vehicle entries include:
  - `p` vehicle prefix
  - `a` accessibility flag
  - `ta` captured timestamp in UTC / ISO 8601
  - `py` latitude
  - `px` longitude

## 10) Get positions for one line
- Method: `GET`
- Path: `/Posicao/Linha`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Posicao/Linha?codigoLinha={codigoLinha}`
- Purpose: return all currently located vehicles for one line

Documented parameters:
- `codigoLinha` - required query string; line identifier from the line-search routes

Documented response notes:
- Returns an object with `hr` and vehicle list `vs`
- Vehicle entries include `p`, `a`, `ta`, `py`, and `px`

## 11) Get vehicles currently transmitting inside a garage
- Method: `GET`
- Path: `/Posicao/Garagem`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Posicao/Garagem?codigoEmpresa={codigoEmpresa}[&codigoLinha={codigoLinha}]`
- Purpose: return mapped vehicles transmitting from a specified company garage, optionally filtered to one line

Documented parameters:
- `codigoEmpresa` - required query string; company identifier from `/Empresa`
- `codigoLinha` - optional query string; line identifier from the line-search routes

Documented response notes:
- Returns the same `hr` + `l[]` line-grouped position structure shown for `/Posicao`

## 12) Get predictions for one stop/line pair
- Method: `GET`
- Path: `/Previsao`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Previsao?codigoParada={codigoParada}&codigoLinha={codigoLinha}`
- Purpose: return vehicle arrival predictions for one line at one stop, including vehicle positions

Documented parameters:
- `codigoParada` - required query string; stop identifier from the stop-search routes
- `codigoLinha` - required query string; line identifier from the line-search routes

Documented response notes:
- Returns an object with `hr` and stop object `p`
- Stop object `p` includes `cp`, `np`, `py`, `px`, and line list `l`
- Line entries include `c`, `cl`, `sl`, `lt0`, `lt1`, `qv`, and vehicle list `vs`
- Vehicle entries include `p`, predicted arrival time `t`, accessibility flag `a`, capture time `ta`, and coordinates `py` / `px`

## 13) Get predictions for all stops on one line
- Method: `GET`
- Path: `/Previsao/Linha`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Previsao/Linha?codigoLinha={codigoLinha}`
- Purpose: return predictions for the vehicles of one line across all stops served by that line

Documented parameters:
- `codigoLinha` - required query string; line identifier from the line-search routes

Documented response notes:
- Returns an object with `hr` and stop list `ps`
- Each stop entry includes `cp`, `np`, `py`, `px`, and vehicle list `vs`
- Vehicle entries include `p`, predicted arrival `t`, accessibility flag `a`, capture time `ta`, and coordinates `py` / `px`

## 14) Get predictions for all lines at one stop
- Method: `GET`
- Path: `/Previsao/Parada`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/Previsao/Parada?codigoParada={codigoParada}`
- Purpose: return predictions for every line serving one stop

Documented parameters:
- `codigoParada` - required query string; stop identifier from the stop-search routes

Documented response notes:
- Returns the same `hr` + stop object `p` structure used by `/Previsao`
- Nested line and vehicle objects reuse the same fields as the stop/line prediction route

## 15) Download the full city traffic KMZ map
- Method: `GET`
- Path: `/KMZ`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/KMZ`
- Purpose: return the complete city traffic-flow map as a KMZ file

Documented parameters:
- None

Documented response notes:
- The docs say this returns a KMZ map with average speed and travel time per segment

## 16) Download the full city traffic KMZ map for one direction
- Method: `GET`
- Path: `/KMZ/{sentido}`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/KMZ/{sentido}`
- Purpose: return the complete city traffic-flow map filtered to one direction

Documented parameters:
- `sentido` - required path value when this variant is used; `BC` or `CB`

Documented response notes:
- Same KMZ output family as `/KMZ`

## 17) Download the corridor-only KMZ map
- Method: `GET`
- Path: `/KMZ/Corredor`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/KMZ/Corredor`
- Purpose: return the complete KMZ map for all corridors in the city

Documented parameters:
- None

Documented response notes:
- KMZ output; no JSON schema is documented

## 18) Download the corridor-only KMZ map for one direction
- Method: `GET`
- Path: `/KMZ/Corredor/{sentido}`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/KMZ/Corredor/{sentido}`
- Purpose: return the corridor KMZ map filtered to one direction

Documented parameters:
- `sentido` - required path value when this variant is used; `BC` or `CB`

Documented response notes:
- Same corridor KMZ output family as `/KMZ/Corredor`

## 19) Download the important-non-corridor-road KMZ map
- Method: `GET`
- Path: `/KMZ/OutrasVias`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/KMZ/OutrasVias`
- Purpose: return the KMZ map for important roads excluding corridors

Documented parameters:
- None

Documented response notes:
- KMZ output; the page describes this as important city roads except corridors

## 20) Download the important-non-corridor-road KMZ map for one direction
- Method: `GET`
- Path: `/KMZ/OutrasVias/{sentido}`
- Full URL: `https://api.olhovivo.sptrans.com.br/v2.1/KMZ/OutrasVias/{sentido}`
- Purpose: return the important-road KMZ map filtered to one direction

Documented parameters:
- `sentido` - required path value when this variant is used; `BC` or `CB`

Documented response notes:
- Same KMZ output family as `/KMZ/OutrasVias`

## Sources inspected
- `https://www.sptrans.com.br/desenvolvedores/api-do-olho-vivo-guia-de-referencia/documentacao-api/`
- `https://www.sptrans.com.br/desenvolvedores/`
