# 4chan

## Provider metadata
- Category: `Social`
- Provider slug: `4chan`
- Official docs pages used:
  - `https://github.com/4chan/4chan-API`
  - `https://raw.githubusercontent.com/4chan/4chan-API/master/pages/Boards.md`
  - `https://raw.githubusercontent.com/4chan/4chan-API/master/pages/Archive.md`
  - `https://raw.githubusercontent.com/4chan/4chan-API/master/pages/Catalog.md`
  - `https://raw.githubusercontent.com/4chan/4chan-API/master/pages/Indexes.md`
  - `https://raw.githubusercontent.com/4chan/4chan-API/master/pages/Threads.md`
  - `https://raw.githubusercontent.com/4chan/4chan-API/master/pages/Threadlist.md`
- Main API base URL: `https://a.4cdn.org`
- Auth model: none
- Supported request methods documented: `GET`, `HEAD`, `OPTIONS`
- Response format: JSON
- Manually confirmed route count: `6`

## Authentication
- The official 4chan API documentation describes the API as read-only and does not require authentication.

## Canonical endpoints

### 1) List boards
- Method: `GET`
- Path: `/boards.json`
- Purpose: return the full board directory plus board-level settings

Response notes:
- Returns a top-level `boards` array.
- Documented fields include `board`, `title`, `ws_board`, `per_page`, `pages`, `max_filesize`, `max_webm_filesize`, `max_comment_chars`, `bump_limit`, `image_limit`, `cooldowns`, and optional capability flags such as `is_archived`, `board_flags`, `country_flags`, and `forced_anon`.

### 2) Archived thread ids for a board
- Method: `GET`
- Path: `/{board}/archive.json`
- Purpose: return archived OP ids for a board that has archives enabled

Path parameters:
- `board` - board code such as `po`

Response notes:
- Returns a JSON array of integers.
- The docs explicitly note that not all boards have archives enabled.

### 3) Board catalog
- Method: `GET`
- Path: `/{board}/catalog.json`
- Purpose: return the board catalog grouped by page with thread summaries and recent replies

Path parameters:
- `board` - board code

Response notes:
- Returns an array of page objects.
- Each page contains `threads[]`.
- Thread/post fields documented here include `no`, `resto`, `sticky`, `closed`, `now`, `time`, `name`, `trip`, `id`, `capcode`, `country`, `sub`, `com`, attachment metadata, `replies`, `images`, `last_modified`, `semantic_url`, `unique_ips`, and `last_replies[]`.

### 4) Single index page
- Method: `GET`
- Path: `/{board}/{page}.json`
- Purpose: return one board index page with OPs and preview replies

Path parameters:
- `board` - board code
- `page` - index page number; the docs title this endpoint as `/[board]/[1-15].json`

Response notes:
- Returns a JSON object with `threads[]`, each containing `posts[]`.
- This is the page-specific counterpart to the catalog view.

### 5) Thread list by board page
- Method: `GET`
- Path: `/{board}/threads.json`
- Purpose: return a compact listing of thread ids, page placement, modification time, and reply counts for an entire board

Path parameters:
- `board` - board code

Response notes:
- Returns an array of page objects with `page` and `threads[]`.
- Each thread object includes `no`, `last_modified`, and `replies`.

### 6) Full thread
- Method: `GET`
- Path: `/{board}/thread/{op_id}.json`
- Purpose: return the OP and all replies in a thread

Path parameters:
- `board` - board code
- `op_id` - numeric OP id for the thread

Response notes:
- Returns an object with `posts[]`.
- In addition to the common post fields, the docs note archival metadata such as `archived` and `archived_on` on archived OPs.

## Parameters and request model
- Path variables are the primary input model: `board`, `page`, and `op_id`.
- No query-string filters are documented for the JSON routes above.
- The docs explicitly say requests are accepted as `GET`, `HEAD`, and `OPTIONS`.

## CORS, rate limits, and transport notes
- The docs state that CORS is supported only from `boards.4chan.org` and `boards.4channel.org` over HTTP or HTTPS.
- The docs do not publish a formal numeric rate limit on the API pages reviewed.
- All examples in the official docs use HTTPS.

## Error and format notes
- The route pages reviewed only explicitly document `200` responses with `Content-Type: application/json`.
- The official docs do not publish a structured error schema on the pages reviewed.
- Archive availability is board-specific.

## fireROUTE normalization notes
- Treat `board` as a required namespace segment rather than a filter.
- `threads.json`, `catalog.json`, and `/{page}.json` are overlapping board views; preserve them as separate upstream operations.
- Response objects are intentionally sparse and field presence is conditional; adapters should tolerate missing optional properties.
