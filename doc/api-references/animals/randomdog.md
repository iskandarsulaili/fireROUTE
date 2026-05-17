# RandomDog

## Overview
- Provider: random.dog
- Category: Animals
- Official docs/source pages inspected: `https://random.dog/` and `https://random.dog/woof.json`
- Base URL: `https://random.dog`
- Auth: none
- HTTPS: yes
- Response formats: plain text, JSON, JSON array, and direct media files
- Pagination: none documented
- Rate limits: no numeric rate limit documented on the official site
- Media note: the collection contains still images plus animated/video assets such as GIF, MP4, and WebM files

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/woof` | none | Returns a random filename as plain text. |
| GET | `/woof.json` | none | Returns JSON metadata for one random asset. |
| GET | `/doggos` | none | Returns a JSON array of available asset filenames. |
| GET | `/{filename}` | `filename` path | Returns the actual media asset referenced by `/woof` or `/woof.json`. |

## Request and response notes
- The official homepage explicitly lists `/woof`, `/woof.json`, and `/doggos` as the public API surface.
- Example observed `/woof` behavior: returns a filename like `aa1844bd-8429-4ea1-bb06-fe9b2923741c.jpg`.
- Example observed `/woof.json` response shape:
  ```json
  {
    "fileSizeBytes": 9577870,
    "url": "https://random.dog/57f9587d-d6b1-4c05-acff-030c6affac57.png"
  }
  ```
- `/doggos` returns a large JSON array of filenames that can include image and video extensions.

## Error handling
- The site does not publish a formal error schema.
- Missing filenames should be treated as normal HTTP 404-style asset failures.

## Integration notes for fireROUTE
- This provider is best modeled as a tiny unauthenticated random-media source.
- Downstream consumers should inspect file extensions or media MIME types before assuming every result is a static image.
- `/woof` is useful for lightweight filename retrieval; `/woof.json` is the better canonical route when file size metadata is needed.

## Sources inspected
- `https://random.dog/`
- `https://random.dog/woof`
- `https://random.dog/woof.json`
- `https://random.dog/doggos`
