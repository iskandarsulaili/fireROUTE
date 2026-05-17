# Queimadas INPE

## Provider metadata
- Category: `Geocoding`
- Provider slug: `queimadas-inpe`
- Official docs used manually:
  - `https://queimadas.dgi.inpe.br/queimadas/dados-abertos/` (now redirected to a 404 page on the TerraBrasilis host)
  - `https://terrabrasilis.dpi.inpe.br/queimadas/portal/`
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/web/?0`
- Public base URLs confirmed from the official GeoServer page:
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows`
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/gwc/service/tms/1.0.0`
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/gwc/service/wms`
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/gwc/service/wmts`
- Transport: HTTPS
- Auth model: no auth/login required for the public capability endpoints visible to anonymous users
- Response formats confirmed from the browsed pages: GeoServer/OGC capability documents (XML); service outputs depend on the chosen OGC operation after capability discovery

## Portal observations
- The old indexed `dados-abertos` URL is stale and now lands on a 404 page.
- The current official portal is live and exposes download/data sections plus an anonymous GeoServer instance.
- The GeoServer welcome page states: `anonymous access to 11 workspaces, with 218 layers`.

## Confirmed API surface
The official GeoServer welcome page exposes these distinct public service entry points:
- `GET /ows?service=WMS&version=1.3.0&request=GetCapabilities`
- `GET /ows?service=WMS&version=1.1.1&request=GetCapabilities`
- `GET /gwc/service/tms/1.0.0`
- `GET /gwc/service/wms?service=WMS&version=1.1.1&request=GetCapabilities&tiled=true`
- `GET /gwc/service/wmts?service=WMTS&version=1.1.1&request=GetCapabilities`
- `GET /ows?service=WFS&version|acceptversions=<version>&request=GetCapabilities`
- `GET /ows?service=WCS&version|acceptversions=<version>&request=GetCapabilities`
- `GET /ows?service=WPS&version=1.0.0&request=GetCapabilities`
- `GET /ows?service=CSW&version=2.0.2&request=GetCapabilities`

For fireROUTE route counting, these collapse into `8` distinct public route patterns because WMS is shown with two versioned capability URLs on the same `/ows` path.

## 1) WMS capabilities
- Method: `GET`
- Path: `/ows`
- Full URL examples:
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WMS&version=1.3.0&request=GetCapabilities`
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WMS&version=1.1.1&request=GetCapabilities`
- Purpose: discover public Web Map Service layers and operations

Required query parameters in the shown links:
- `service=WMS`
- `request=GetCapabilities`
- `version=1.3.0` or `1.1.1`

## 2) TMS entry point
- Method: `GET`
- Path: `/gwc/service/tms/1.0.0`
- Full URL: `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/gwc/service/tms/1.0.0`
- Purpose: GeoWebCache TMS service root for tiled map access

## 3) WMS-C capabilities
- Method: `GET`
- Path: `/gwc/service/wms`
- Full URL example: `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/gwc/service/wms?service=WMS&version=1.1.1&request=GetCapabilities&tiled=true`
- Purpose: tiled WMS capabilities via GeoWebCache

Shown query parameters:
- `service=WMS`
- `version=1.1.1`
- `request=GetCapabilities`
- `tiled=true`

## 4) WMTS capabilities
- Method: `GET`
- Path: `/gwc/service/wmts`
- Full URL example: `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/gwc/service/wmts?service=WMTS&version=1.1.1&request=GetCapabilities`
- Purpose: discover WMTS tile layers and matrix sets

Shown query parameters:
- `service=WMTS`
- `version=1.1.1`
- `request=GetCapabilities`

## 5) WFS capabilities
- Method: `GET`
- Path: `/ows`
- Full URL examples:
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WFS&acceptversions=2.0.0&request=GetCapabilities`
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WFS&version=1.1.0&request=GetCapabilities`
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WFS&version=1.0.0&request=GetCapabilities`
- Purpose: discover public Web Feature Service layers and operations

## 6) WCS capabilities
- Method: `GET`
- Path: `/ows`
- Full URL examples:
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WCS&acceptversions=2.0.1&request=GetCapabilities`
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WCS&version=1.1.1&request=GetCapabilities`
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WCS&version=1.1.0&request=GetCapabilities`
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WCS&version=1.1&request=GetCapabilities`
  - `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WCS&version=1.0.0&request=GetCapabilities`
- Purpose: discover public coverage service capabilities

## 7) WPS capabilities
- Method: `GET`
- Path: `/ows`
- Full URL example: `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=WPS&version=1.0.0&request=GetCapabilities`
- Purpose: discover public Web Processing Service operations

## 8) CSW capabilities
- Method: `GET`
- Path: `/ows`
- Full URL example: `https://terrabrasilis.dpi.inpe.br/queimadas/geoserver/ows?service=CSW&version=2.0.2&request=GetCapabilities`
- Purpose: discover catalogue service capabilities

## Pagination, errors, and rate limits
- No provider-specific rate-limit statement was visible on the inspected portal or GeoServer welcome pages.
- No pagination rules were documented on the inspected landing pages; pagination, filtering, and output formats are service-specific and are normally described inside each returned OGC capability document.
- The official pages inspected here expose discovery entry points; they do not enumerate every downstream OGC operation on the welcome screen.

## Canonical fireROUTE notes
- The stale indexed URL should not be used as the canonical docs URL anymore; the live portal and GeoServer host are the authoritative entry points seen in this run.
- This provider is a public GeoServer deployment, so many downstream OGC operations likely exist, but only the capability-entry routes shown on the official welcome page are confirmed here.
- Treat `/ows` as a multiplexed endpoint where the `service`, `request`, and version parameters define behavior.

## Verification notes
- This file was manually rebuilt from the live official TerraBrasilis/INPE portal and public GeoServer welcome page using browser tools.