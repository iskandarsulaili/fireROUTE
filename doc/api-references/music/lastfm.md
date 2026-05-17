# Last.fm

## Overview
- Provider: Last.fm API
- Category: Music
- Official docs: `https://www.last.fm/api`
- Base URL: `http://ws.audioscrobbler.com/2.0/` (the inspected REST guide publishes the root over HTTP)
- Auth: required `api_key` for all calls; authenticated write flows also require the account secret plus user authorization/session handling described in the Auth Spec
- HTTPS: the docs site is HTTPS, but the REST guide text inspected names the API root as `http://ws.audioscrobbler.com/2.0/`
- Response formats: XML by default; JSON with `format=json`; JSONP with optional `callback`
- Pagination: method-specific; many collection methods use `page` and/or `limit`, but pagination is not universal
- Rate limits: no numeric limit was stated on the inspected pages

## Transport model
Last.fm's REST API is a single HTTP endpoint plus a required `method` parameter. In practice, fireROUTE should treat this provider as one transport path with many named API methods.

| HTTP method | Path | Required parameters | Notes |
|---|---|---|---|
| GET | `/2.0/` | `method`, `api_key` | Standard pattern for read operations. |
| POST | `/2.0/` | `method`, `api_key` plus method-specific auth/session fields for write operations | The REST guide explicitly says write services should be submitted as HTTP POST requests. |

## Confirmed API method families
All of the following method names were visible in the official API navigation on the inspected docs pages.

| Family | Count | Confirmed methods |
|---|---:|---|
| `album` | 6 | `album.addTags`, `album.getInfo`, `album.getTags`, `album.getTopTags`, `album.removeTag`, `album.search` |
| `artist` | 10 | `artist.addTags`, `artist.getCorrection`, `artist.getInfo`, `artist.getSimilar`, `artist.getTags`, `artist.getTopAlbums`, `artist.getTopTags`, `artist.getTopTracks`, `artist.removeTag`, `artist.search` |
| `auth` | 3 | `auth.getMobileSession`, `auth.getSession`, `auth.getToken` |
| `chart` | 3 | `chart.getTopArtists`, `chart.getTopTags`, `chart.getTopTracks` |
| `geo` | 2 | `geo.getTopArtists`, `geo.getTopTracks` |
| `library` | 1 | `library.getArtists` |
| `tag` | 7 | `tag.getInfo`, `tag.getSimilar`, `tag.getTopAlbums`, `tag.getTopArtists`, `tag.getTopTags`, `tag.getTopTracks`, `tag.getWeeklyChartList` |
| `track` | 12 | `track.addTags`, `track.getCorrection`, `track.getInfo`, `track.getSimilar`, `track.getTags`, `track.getTopTags`, `track.love`, `track.removeTag`, `track.scrobble`, `track.search`, `track.unlove`, `track.updateNowPlaying` |
| `user` | 13 | `user.getFriends`, `user.getInfo`, `user.getLovedTracks`, `user.getPersonalTags`, `user.getRecentTracks`, `user.getTopAlbums`, `user.getTopArtists`, `user.getTopTags`, `user.getTopTracks`, `user.getWeeklyAlbumChart`, `user.getWeeklyArtistChart`, `user.getWeeklyChartList`, `user.getWeeklyTrackChart` |

Confirmed method count from the docs navigation: **57**.

## Common parameters and auth notes
- `method` — required on every request; value must be one of the documented method names such as `artist.getSimilar`.
- `api_key` — required on every request.
- `format=json` — requests JSON instead of the XML default.
- `callback` — optional JSONP wrapper for JSON responses.
- Method-specific arguments vary by method family (`artist`, `track`, `user`, etc.).
- The Auth Spec says you must obtain a Last.fm API account and secret for authenticated workflows.
- The web auth flow sends the user to `https://www.last.fm/api/auth/` with an API key (and optionally a callback URL configured in the API account).
- The REST guide and auth docs distinguish read operations from write operations; write operations must be sent with HTTP POST and the auth docs describe signed/session-based authenticated calls.

## Response and error notes
- XML is the default response format.
- JSON is available with `format=json`; JSONP is available when `callback` is supplied.
- The inspected REST guide shows XML error payloads shaped like `<lfm status="failed"><error code="10">Invalid API Key</error></lfm>`.
- The JSON section says that omitting `callback` returns pure JSON with MIME type `application/json`; adding `callback` returns `text/javascript`.

## fireROUTE integration notes
- Model Last.fm as a single endpoint provider whose effective route selection is controlled by the `method` parameter.
- Preserve the distinction between read calls (typically GET) and write calls (POST plus authenticated session/signature flow).
- Expose `format=json` by default if fireROUTE expects JSON downstream, but keep the XML-default behavior documented because that is the official default.
- Treat pagination as method-specific rather than global.

## Sources inspected
- `https://www.last.fm/api`
- `https://www.last.fm/api/rest`
- `https://www.last.fm/api/authspec`
