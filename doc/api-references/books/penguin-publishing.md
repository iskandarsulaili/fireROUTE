# Penguin Publishing

Official page manually reviewed:
- https://www.penguinrandomhouse.biz/webservices/rest/

## Overview
- Public API base URL shown in examples: `https://reststop.randomhouse.com`
- Authentication: `Basic HTTP authentication` over HTTPS
- Request method policy on the reviewed docs page: `all requests use GET`
- Response formats explicitly documented: `application/xml`, `application/json`, and `image/*` for cover-image retrieval
- Purpose: book, author, work, and author-event metadata from Penguin Random House

Manual route count confirmed from the reviewed official docs page: **8**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/resources/authors` | Search authors |
| GET | `/resources/authors/{authorId}` | Get one author |
| GET | `/resources/works` | Search works |
| GET | `/resources/works/{workId}` | Get one work |
| GET | `/resources/titles` | Search titles |
| GET | `/resources/title/{isbn}` | Get one title by ISBN |
| GET | `/resources/authorevents` | Search author events |
| GET | `/resources/authorevents/{eventId}` | Get one author event |

## Confirmed parameters
- The reviewed method detail for `GET /resources/authors` documents:
  - `start` (required): zero-based first record position
  - `max` (required): last record position to return; `0` returns all found records
  - `expandLevel` (required): `0` for links only, `1` for links plus details
  - `firstName` (optional)
  - `lastName` (optional)
- The docs structure indicates the search-style collection endpoints accept provider-specific query filters in addition to paging/detail controls.

## Auth, formats, and usage notes
- All requests are secured via Basic Auth over HTTPS.
- The docs page says all requests currently use `GET`.
- `image/*` is only applicable to the title/ISBN resource because that resource can return a cover image.

## Pagination and response notes
- The collection methods use `start` and `max` rather than conventional `page`/`limit` naming.
- The reviewed author-search detail describes an `authors` root element with nested `author` items in XML-style responses.
- The docs consistently present XML and JSON as supported structured response formats.

## Rate limits
- No numeric rate limit is published on the reviewed official page.

## Important usage notes
- The service models `Title` and `Work` separately: titles are ISBN-specific editions, while works group related title variants.
- The provider publishes distinct resources for author events in addition to book/author metadata.
- Because the auth scheme is Basic Auth, fireROUTE should preserve credentials securely and avoid query-string auth.

## fireROUTE notes
- Keep the provider's collection/detail split intact.
- Preserve `start`, `max`, and `expandLevel` as passthrough query parameters.
- Treat title-by-ISBN as the most stable item lookup path.
