# Google Books

Official pages manually reviewed:
- https://developers.google.com/books/docs/v1/using
- https://developers.google.com/books/docs/v1/reference/

## Overview
- API base URL: `https://www.googleapis.com/books/v1`
- Authentication: public-data requests must include either an API key or an OAuth 2.0 access token; private My Library requests require OAuth 2.0
- OAuth scope shown in the reviewed docs: `https://www.googleapis.com/auth/books`
- Response format: JSON
- Primary use cases in the reviewed docs: volume search/lookup plus public and authenticated bookshelf access

Manual route count confirmed from the reviewed official docs: **10**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/volumes` | Search volumes |
| GET | `/volumes/{volumeId}` | Retrieve one volume by Google Books volume ID |
| GET | `/users/{userId}/bookshelves` | List a user's public bookshelves |
| GET | `/users/{userId}/bookshelves/{shelf}` | Retrieve one public bookshelf |
| GET | `/users/{userId}/bookshelves/{shelf}/volumes` | List volumes on a public bookshelf |
| GET | `/mylibrary/bookshelves` | List the authenticated user's bookshelves |
| GET | `/mylibrary/bookshelves/{shelf}/volumes` | List volumes on one of the authenticated user's bookshelves |
| POST | `/mylibrary/bookshelves/{shelf}/addVolume` | Add a volume to an authenticated user's bookshelf |
| POST | `/mylibrary/bookshelves/{shelf}/removeVolume` | Remove a volume from an authenticated user's bookshelf |
| POST | `/mylibrary/bookshelves/{shelf}/clearVolumes` | Remove all volumes from an authenticated user's bookshelf |

## Confirmed parameters

### `GET /volumes`
- Required:
  - `q`: full-text query string
- Optional search and filtering parameters documented on the reviewed page:
  - `download=epub`: restrict to volumes with EPUB download availability
  - `filter`: one of `partial`, `full`, `free-ebooks`, `paid-ebooks`, `ebooks`
  - `langRestrict`: two-letter ISO 639-1 language code
  - `maxResults`: default `10`, maximum `40`
  - `orderBy`: `relevance` or `newest`
  - `printType`: `all`, `books`, or `magazines`
  - `projection`: `full` or `lite`
  - `startIndex`: zero-based offset for pagination
- Search operators explicitly documented for `q`:
  - `intitle:`
  - `inauthor:`
  - `inpublisher:`
  - `subject:`
  - `isbn:`
  - `lccn:`
  - `oclc:`

### `GET /volumes/{volumeId}`
- Path parameter: `volumeId`
- Optional: `projection=full|lite`

### Public bookshelf routes
- `userId`: Google Books user ID path parameter
- `shelf`: bookshelf ID path parameter
- `maxResults` and `startIndex`: documented as applicable to bookshelf collection/listing operations
- Standard Google system query parameters are also allowed

### Authenticated My Library routes
- `shelf`: bookshelf ID path parameter
- `volumeId`: required query parameter for `addVolume` and `removeVolume`
- Standard Google system query parameters are also allowed
- The reviewed docs state these requests must include the `Authorization` header with an OAuth 2.0 token

## Auth and quota notes
- Public data requests can use an API key or OAuth 2.0 token.
- Private My Library requests require OAuth 2.0.
- The reviewed docs say the API key identifies the project and provides API access, quota, and reports.
- No numeric per-second or daily rate limit is published on the reviewed pages.

## Pagination and response notes
- Collection endpoints use `startIndex` and `maxResults`.
- The reviewed docs explicitly state `startIndex` is zero-based.
- Successful GET examples return `200 OK` JSON payloads.
- Successful bookshelf mutation calls return `204 No Content`.

## Important usage notes
- Google Books results are affected by end-user location because preview and access rights vary by country and IP-based location.
- The reviewed docs show volume IDs, bookshelf IDs, and user IDs are reused between the Google Books site and API.
- Public bookshelf reads do not require the `Authorization` header.
- Search requests do not require auth, but authenticated search responses can include user-specific information such as purchase status.

## fireROUTE notes
- Treat `/volumes` as the primary search route and preserve raw query passthrough for advanced `q` operators.
- Keep the distinction between public bookshelf routes and authenticated My Library routes.
- Preserve Google's API-key-or-OAuth behavior for public calls and enforce OAuth for My Library writes.
