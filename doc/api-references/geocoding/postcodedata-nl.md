# PostcodeData.nl

## Provider metadata
- Category: `Geocoding`
- Provider slug: `postcodedata-nl`
- Official pages checked manually:
  - `http://api.postcodedata.nl/v1/postcode/?postcode=1211EP&streetnumber=60&ref=domeinnaam.nl&type=json`
  - `https://postcodedata.nl/`
  - `https://api.postcodedata.nl/v1/postcode/?postcode=1211EP&streetnumber=60&ref=domeinnaam.nl&type=json`
- Confirmed live API host from the official sample URL: `http://api.postcodedata.nl`
- Transport observed: live API sample works over `HTTP`; the `HTTPS` API-host variant returned connection refused
- Auth model observed: none
- Response formats observed: `JSON` and `XML`

## Product and access notes
- The indexed official sample URL is a live machine-readable endpoint and is currently the only provider-controlled surface reviewed in this run that exposed a concrete request contract.
- The official homepage `https://postcodedata.nl/` did not expose current documentation; in-browser it failed through a `free.bedrijfsdata.nl` `404` error page.
- The provider appears to behave like a compact Dutch postcode/address lookup service centered on one query endpoint rather than a broad multi-route API suite.

## Confirmed API surface
The reviewed official sample confirms `1` current route family:
1. `GET /v1/postcode/`

## 1) Dutch postcode + street-number lookup
- Method: `GET`
- Path: `/v1/postcode/`
- Full URL pattern: `http://api.postcodedata.nl/v1/postcode/?postcode={postcode}&streetnumber={streetnumber}&ref={ref}&type={json|xml}`
- Purpose: return Dutch address/location details for a postcode + street number combination
- Authentication: none observed

Observed query parameters from the official sample and live checks:
- `postcode` - postcode string; shown in the official sample as `1211EP`
- `streetnumber` - street number; live validation confirmed it is required because omitting it returned `{"status":"error","errormessage":"no streetnumber"}`
- `ref` - caller/domain reference value shown in the official sample as `domeinnaam.nl`
- `type` - response format selector; observed values `json` and `xml`

Observed success response fields:
- `status`
- `details[].street`
- `details[].city`
- `details[].municipality`
- `details[].province`
- `details[].postcode`
- `details[].pnum`
- `details[].pchar`
- `details[].rd_x`
- `details[].rd_y`
- `details[].lat`
- `details[].lon`

Observed JSON success example:
```json
{"status":"ok","details":[{"street":"Stationsstraat","city":"Hilversum","municipality":"Hilversum","province":"Noord-Holland","postcode":"1211 EP","pnum":"1211","pchar":"EP","rd_x":"140707.47566666666666666667","rd_y":"471005.06166666666666666667","lat":"52.2269378842251","lon":"5.1780191356884"}]}
```

Observed XML success example structure:
```xml
<response>
  <status>ok</status>
  <details>
    <detail>
      <street>Stationsstraat</street>
      <city>Hilversum</city>
      <municipality>Hilversum</municipality>
      <province>Noord-Holland</province>
      <postcode>1211 EP</postcode>
      <pnum>1211</pnum>
      <pchar>EP</pchar>
      <rd_x>140707.47566666666666666667</rd_x>
      <rd_y>471005.06166666666666666667</rd_y>
      <lat>52.2269378842251</lat>
      <lon>5.1780191356884</lon>
    </detail>
  </details>
</response>
```

## Pagination
- None documented or observed.
- The confirmed route is a single lookup request, not a list/search collection endpoint.

## Errors
- Observed validation error for missing `streetnumber`:
  - body: `{"status":"error","errormessage":"no streetnumber"}`
- No official rate-limit or broader error-code catalog was visible on the reviewed official surfaces.

## Rate limits
- No rate-limit policy was documented on the reviewed official surfaces.

## Response-format notes
- Default observed format without `type` specified was `application/json`.
- `type=xml` returned `application/xml` with the same payload fields represented as XML elements.
- Coordinate values are returned both as Dutch Rijksdriehoek (`rd_x`, `rd_y`) and WGS84-style latitude/longitude (`lat`, `lon`) strings.

## Important usage notes
- The working API surface currently appears to be legacy/HTTP-only; do not silently upgrade requests to `HTTPS` because the reviewed `https://api.postcodedata.nl/...` variant was not reachable in this run.
- The public homepage/docs surface is currently broken, so this entry should be treated as a thin legacy integration with a verified live sample route rather than a richly documented product.
- Preserve postcode values as strings; the payload splits them into `pnum` and `pchar` in addition to the formatted `postcode`.

## Canonical fireROUTE notes
- Canonical base URL: `http://api.postcodedata.nl`
- Canonical route: `GET /v1/postcode/`
- Minimum confirmed required input from live validation: `streetnumber`
- Core lookup inputs shown by the official sample: `postcode`, `streetnumber`, `ref`, optional/format selector `type`

## Verification notes
- This file was manually rebuilt from the live official PostcodeData.nl sample endpoint and a live browser check of the official homepage using browser tools only.
