# Genius

## Overview
- Provider: Genius API
- Category: Music
- Official docs: `https://docs.genius.com/`
- Base URL: `https://api.genius.com`
- Auth helpers: `https://api.genius.com/oauth/authorize` and `https://api.genius.com/oauth/token`
- Auth: OAuth2 bearer token required for all requests; Genius also allows a client access token for read-only endpoints that do not require a scope
- HTTPS: required for all API interaction
- Response format: JSON
- Pagination: documented on list endpoints with `per_page` + `page`
- Rate limits: no numeric request-rate limit published in the official docs
- Confirmed route count: 16 total route patterns (14 API routes on `api.genius.com` plus 2 OAuth helper endpoints)

## Confirmed endpoints

| Method | Path | Scope / auth notes | Key parameters |
|---|---|---|---|
| GET | `/annotations/{id}` | bearer token | path `id`; optional `text_format` |
| POST | `/annotations` | scope `create_annotation` | JSON body with `annotation.body.markdown`, `referent.raw_annotatable_url`, `referent.fragment`, optional `referent.context_for_display.before_html/after_html`, optional `web_page.canonical_url/og_url/title` |
| PUT | `/annotations/{id}` | scope `manage_annotation` | path `id`; same payload shape as annotation creation |
| DELETE | `/annotations/{id}` | scope `manage_annotation` | path `id` |
| PUT | `/annotations/{id}/upvote` | scope `vote` | path `id` |
| PUT | `/annotations/{id}/downvote` | scope `vote` | path `id` |
| PUT | `/annotations/{id}/unvote` | scope `vote` | path `id` |
| GET | `/referents` | bearer token | `created_by_id`, `song_id`, `web_page_id`, `text_format`, `per_page`, `page` |
| GET | `/songs/{id}` | bearer token | path `id`; optional `text_format` |
| GET | `/artists/{id}` | bearer token | path `id`; optional `text_format` |
| GET | `/artists/{id}/songs` | bearer token | path `id`; `sort`, `per_page`, `page`, optional `text_format` |
| GET | `/web_pages/lookup` | bearer token | `raw_annotatable_url`, `canonical_url`, `og_url` |
| GET | `/search` | bearer token | required `q` |
| GET | `/account` | scope `me` | optional `text_format` |
| GET | `/oauth/authorize` | OAuth helper | `client_id`, `redirect_uri`, `scope`, `state`, `response_type=code` |
| POST | `/oauth/token` | OAuth helper | `code`, `client_id`, `client_secret`, `grant_type=authorization_code`, `redirect_uri`, `response_type` |

## Parameter and payload notes
- `text_format` accepts one or more of `dom`, `plain`, and `html`, comma-separated. The docs say it defaults to `dom`.
- `GET /referents` allows only one of `song_id` or `web_page_id` in the same request.
- `GET /artists/{id}/songs` supports `sort=title` (default) or `sort=popularity`.
- `GET /search` uses `q` for the search term and searches Genius-hosted songs.
- `GET /web_pages/lookup` works only for pages that already have at least one annotation. The docs explicitly recommend providing as many URL variants as possible: browser URL, canonical URL, and `og:url`.
- Annotation creation/update bodies are nested JSON objects, not flat form parameters.
- The docs' prose still references `POST /annotation` in one explanatory sentence, but the actual action headings and explorer routes use plural `/annotations` for create, update, and delete.

## OAuth and auth notes
- Genius documents the standard authorization-code flow.
- The authorization request is sent to `https://api.genius.com/oauth/authorize`.
- The token exchange is sent to `https://api.genius.com/oauth/token`.
- Requests are authenticated with `Authorization: Bearer ACCESS_TOKEN`.
- The docs say the bearer token may also be sent as a request parameter if absolutely necessary, but the header form is the standard path.
- For browser-only apps, the docs still describe the weaker implicit-style `response_type=token` redirect flow, but they explicitly call it less secure and recommend the full code exchange when possible.
- Commercial use is not allowed without a Genius license according to the official Getting Started notice.

## Response, pagination, and error notes
- List endpoints use `per_page` and `page`.
- Many rich-text fields can be returned in multiple formats through `text_format`; `dom` returns a structured object, `html` returns rendered markup, and `plain` returns plain text.
- The docs describe API errors as JSON with a top-level `meta` object containing `status` and `message`.
- The docs require HTTPS for all API traffic.
- No numeric global request quota or per-endpoint rate limit is published on the official docs page.

## Important usage notes for fireROUTE
- Treat Genius as a tightly scoped lyrics/annotation metadata API, not a full lyrics-text dump API.
- Preserve route-level scope requirements (`me`, `create_annotation`, `manage_annotation`, `vote`) in adapter metadata.
- Support `text_format` as a first-class option because it materially changes response shape.
- Normalize annotation creation/update to plural `/annotations` paths even though one prose note still mentions singular `/annotation`.

## Sources inspected
- `https://docs.genius.com/`
- `https://docs.genius.com/#/authentication`
