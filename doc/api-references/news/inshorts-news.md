# Inshorts News

## Overview
- Provider: Inshorts
- Category: News
- Official site reviewed: `https://inshorts.com/en/read`
- Indexed docs URL from category row: `https://github.com/cyberboysumanjay/Inshorts-News-API` (not first-party; used only as the legacy row reference, not as documentation)
- Base URL: `https://inshorts.com`
- Public content API base observed from the official site frontend: `https://inshorts.com/api`
- Auth: none observed for public news/trending-topic reads; the official contact form code posts a reCAPTCHA-backed JSON payload to `/api/contactUs`
- HTTPS: yes
- Response format: JSON
- Pagination: cursor-like on `/api/{lang}/news` via `news_offset`; page-number based on `/api/{lang}/search/trending_topics/{tag}` via `page`
- Rate limits: no first-party published rate-limit documentation was exposed on the official site during this pass

## Confirmed endpoints

| Method | Path | Parameters | Notes |
|---|---|---|---|
| GET | `/api/{lang}/news` | required/expected `category`; optional `max_limit` (frontend default `10`), `include_card_data` (frontend default `true`), `news_offset` | Main article-feed endpoint used by the official web client. Confirmed live with `en` and `hi`. |
| GET | `/api/{lang}/search/trending_topics` | optional/official-frontend header `X-REGION-ID` | Returns trending topic/tag metadata such as `label`, `tag`, `type`, and image URLs. |
| GET | `/api/{lang}/search/trending_topics/{tag}` | required query `page`, `type`; official frontend also sends `X-REGION-ID` | Returns topic-specific result sets with `total_page`, `total_cards`, `page_num`, `suggested_news`, and `news_list`. |
| POST | `/api/contactUs` | JSON body from the official contact form; official site JS adds reCAPTCHA token field `token` before submit | Non-content endpoint, but confirmed in the official frontend bundle and via a live JSON response. |

## Parameters and behavior notes
- The official page HTML and JS bundles exposed a serialized `window.__STATE__` payload plus live requests to `https://inshorts.com/api/en/search/trending_topics` and `https://inshorts.com/api/en/news?...`.
- The official frontend derives `{lang}` from the tenant/language code and currently exposes at least `en` and `hi` routes.
- `category` values are tied to the site navigation/feed buckets. The official page visibly exposes categories such as `India`, `Business`, `Politics`, `Sports`, `Technology`, `Startups`, `Entertainment`, `International`, `Science`, `Travel`, `Health & Fitness`, and others; the web client also uses `top_stories`.
- `/api/{lang}/news` responses currently contain top-level keys `data` and `error`. Confirmed `data` keys include `min_news_id`, `news_list`, `reload_required`, and `feed_type`.
- `news_offset` paginates older content. In a live check, the first `top_stories` response returned `min_news_id` `d31wxqqk-1`; replaying that value as `news_offset` returned a different next batch of stories.
- `/api/{lang}/search/trending_topics/{tag}` returned empty arrays with `total_page: 0` and `page_num: 0` for an invalid tag instead of an HTTP error.
- A bad `category` on `/api/{lang}/news` returned HTTP `500` with JSON body `{"error":true,"message":"Something happened"}` in this environment.
- The official desktop bundle also contains an internal `POST /api/getFeed` call with JSON body and app/device/location headers, but a generic manual replay returned `500 Internal Server Error`; I am not counting it in the confirmed public route total.

## Usage notes
- This provider does not expose a formal first-party developer portal, but the official site itself currently uses a stable same-origin JSON API that is directly inspectable in-browser.
- The cleanest fireROUTE surface is the read-only content trio: feed, trending-topic list, and trending-topic detail.
- `/api/contactUs` exists, but it is a site-form submission route rather than a news retrieval endpoint.
- Preserve the provider’s native pagination contracts instead of flattening them away: `news_offset` for feed continuation and `page` for topic pages.
- Treat `X-REGION-ID` as an implementation detail used by the official frontend for trending-topic calls; it was not accompanied by standalone docs or a published country-code table.

## Route-count note
- The official site currently exposes `4` confirmed route families that could be manually verified from first-party frontend/network behavior, with `3` of them being content-retrieval routes.

## Sources inspected
- `https://inshorts.com/en/read`
- `https://inshorts.com/hi/read`
- Official frontend assets observed from the live site, including `https://inshorts.com/assets/public/desktop.bundle.js`
- Indexed legacy row URL reviewed only to confirm it is unofficial: `https://github.com/cyberboysumanjay/Inshorts-News-API`
