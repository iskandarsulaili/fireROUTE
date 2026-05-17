# RainViewer

## Provider metadata
- Category: `Weather`
- Provider slug: `rainviewer`
- Docs used manually:
  - `https://www.rainviewer.com/api.html`
  - `https://www.rainviewer.com/api/weather-maps-api.html`
  - `https://www.rainviewer.com/api/single-radar-data.html`
  - live metadata file inspected in browser: `https://api.rainviewer.com/public/weather-maps.json`
- Public upstream bases confirmed from official docs:
  - `https://api.rainviewer.com`
  - `https://tilecache.rainviewer.com`
  - `https://data.rainviewer.com`
- Auth: none documented
- Usage restriction explicitly documented: personal and educational use only

## Manually confirmed endpoint patterns

### 1) Weather maps metadata file
- Method: `GET`
- Path: `/public/weather-maps.json`
- Base URL: `https://api.rainviewer.com`
- Full URL pattern: `https://api.rainviewer.com/public/weather-maps.json`
- Purpose: return the current radar metadata document used to discover frame paths and the current tile host

Fields explicitly documented and/or manually confirmed from the live file:
- `version`
- `generated` - Unix timestamp for the metadata generation time
- `host` - tile host prefix, currently returned as `https://tilecache.rainviewer.com`
- `radar.past[]` - past radar frames with `time` and `path`
- `radar.nowcast[]` - nowcast frames when available
- `satellite.infrared[]` - infrared satellite frames when available

### 2) Radar tile by XYZ tile coordinates
- Method: `GET`
- Path pattern: `{framePath}/{size}/{z}/{x}/{y}/{color}/{options}.png`
- Base URL: `{host}` from `/public/weather-maps.json`
- Full URL pattern: `{host}{framePath}/{size}/{z}/{x}/{y}/{color}/{options}.png`
- Purpose: return one radar tile for slippy-map style rendering

### 3) Radar tile by latitude/longitude center
- Method: `GET`
- Path pattern: `{framePath}/{size}/{z}/{lat}/{lon}/{color}/{options}.png`
- Base URL: `{host}` from `/public/weather-maps.json`
- Full URL pattern: `{host}{framePath}/{size}/{z}/{lat}/{lon}/{color}/{options}.png`
- Purpose: return one radar image centered on a coordinate; docs describe this as useful for widgets

### 4) Coverage mask tile by XYZ tile coordinates
- Method: `GET`
- Path: `/v2/coverage/0/{size}/{z}/{x}/{y}/0/0_0.png`
- Base URL: `https://tilecache.rainviewer.com`
- Purpose: return the radar-coverage mask that shows where radar coverage is available

### 5) Coverage mask tile by latitude/longitude center
- Method: `GET`
- Path: `/v2/coverage/0/{size}/{z}/{lat}/{lon}/0/0_0.png`
- Base URL: `https://tilecache.rainviewer.com`
- Purpose: return the same radar-coverage mask centered on a coordinate

### 6) Single radar source-image archive
- Method: `GET`
- Path pattern documented by provider: `/images/{radarIdentifier}/.../0_source.{ext}`
- Base URL: `https://data.rainviewer.com`
- Documented base directory: `https://data.rainviewer.com/images/`
- Purpose: access source radar files per radar identifier

Provider-documented notes for this archive:
- each directory name is a Rain Viewer radar identifier
- each radar directory contains radar source images sorted by time
- available files are described as the last 6 radar images per station, no more than 48 hours old
- documented file ending: `0_source.(png|gif|jpeg|jpg|nc|h5)`

## Path parameters and documented constraints

### Parameters shared by radar-tile routes
- `{framePath}` - frame-specific path taken from the metadata file, e.g. `/v2/radar/{frameId}`
- `{size}` - image size; docs say `256` or `512`
- `{z}` - zoom level; docs say maximum zoom level is `7`
- `{x}`, `{y}` - tile coordinates
- `{lat}`, `{lon}` - decimal latitude and longitude for centered-image requests
- `{color}` - color scheme ID; provider references the separate official color-schemes page
- `{options}` - two-part option list formatted as `{smooth}_{snow}`
- `{smooth}` - `1` to blur / smooth radar data, `0` otherwise
- `{snow}` - `1` to display snow in separate colors, `0` otherwise

### Coverage-mask rules
- coverage-mask requests do not use colorization; the docs say to set color and options to `0` and `0_0`
- docs warn that coverage may be hard to see against white backgrounds because the transparent areas indicate available coverage

## Formats and media types documented by provider
- Metadata document: JSON
- Radar and coverage tiles: PNG
- Single-radar archive file endings documented: `png`, `gif`, `jpeg`, `jpg`, `nc`, `h5`

## Usage notes from official docs
- The API is free for personal or educational use.
- Rain Viewer explicitly says it does not guarantee radar-data availability because upstream owners can remove, change, or stop sharing data.
- The provider says returned images can be modified freely, but asks users to credit Rain Viewer with a link to `https://www.rainviewer.com/`.
- The weather-maps API docs say the standard dataset contains the past 2 hours of radar data at 10-minute intervals.

## Auth, rate limits, pagination, and errors
- Auth: none documented on the official API pages reviewed in this pass
- Rate limits: no public numeric rate limit documented on the official pages reviewed in this pass
- Pagination: none documented; the metadata file returns arrays of available frames rather than paged resources
- Error format: no formal error schema documented on the official pages reviewed in this pass

## Canonical fireROUTE mapping notes
- RainViewer is a discovery-first API: clients should fetch `/public/weather-maps.json` before building tile URLs.
- The tile host is not hardcoded in the docs; it is supplied by the metadata response and should be honored dynamically.
- `framePath` is a response-derived path fragment, so fireROUTE should preserve it verbatim rather than trying to synthesize frame IDs.
- Coverage-mask endpoints are separate from radar-image endpoints and always use the fixed `/v2/coverage/0/...` prefix.
- The single-radar archive is a different upstream host from the public metadata and tile endpoints.

## Verification notes
This file was manually rebuilt from the live RainViewer API pages and a manually inspected live metadata response in the browser, replacing the earlier autogenerated summary.
