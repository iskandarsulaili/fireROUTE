# lyrics.ovh

## Overview
- Provider: lyrics.ovh
- Category: Music
- Official docs: `https://lyricsovh.docs.apiary.io/`
- Base URL: `https://api.lyrics.ovh/v1`
- Auth: none
- HTTPS: yes
- Response format: JSON
- Pagination: none
- Rate limits: none documented on the official Apiary docs page

## Confirmed endpoint

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/{artist}/{title}` | `artist` path, `title` path | Returns lyrics for a song. |

## Parameters
- `artist` — artist name, example shown in the docs: `Coldplay`
- `title` — song title, example shown in the docs: `Adventure of a Lifetime`

## Response format
- Success response (`200`):
  ```json
  {
    "lyrics": "Here the lyrics of the song"
  }
  ```
- Not found response (`404`):
  ```json
  {
    "error": "No lyrics found"
  }
  ```

## Integration notes for fireROUTE
- This is a minimal, single-route lyrics lookup provider.
- Inputs are path-based rather than query-based, so adapters should handle URL encoding carefully.
- A canonical fireROUTE wrapper can map directly from `artist` + `title` lookups.

## Sources inspected
- `https://lyricsovh.docs.apiary.io/`
- `https://lyricsovh.docs.apiary.io/reference/0/lyrics-of-a-song/search`
