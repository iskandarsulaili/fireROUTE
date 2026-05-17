# Untappd

Official pages manually reviewed:
- https://untappd.com/api/docs

## Overview
- Base URL documented on the reviewed page: `https://api.untappd.com/v4`
- Authentication models documented:
  - app-level requests use `client_id` and `client_secret` query parameters
  - user-authorized requests use an OAuth 2.0 `access_token`
- Additional required request note: every API call must send a non-standard `User-Agent`
- Response format: JSON
- Public API limitation called out in the docs: venue beer/tap list data is not available in the public API; Untappd for Business uses separate docs

Manual route count confirmed from the reviewed official docs: **31** unique operation pages.

## Confirmed endpoints

### Feeds and activity
| Method | Path | Auth in docs | Purpose |
|---|---|---|---|
| GET | `/checkin/recent` | Required | Authenticated friends activity feed |
| GET | `/user/checkins/{USERNAME}` | Not required | User check-in feed |
| GET | `/beer/checkins/{BID}` | Not required | Beer activity feed |
| GET | `/brewery/checkins/{BREWERY_ID}` | Not required | Brewery activity feed |
| GET | `/venue/checkins/{VENUE_ID}` | Not required | Venue activity feed |
| GET | `/notifications` | Required | Current user's notifications |

### Info and profile lookups
| Method | Path | Auth in docs | Purpose |
|---|---|---|---|
| GET | `/beer/info/{BID}` | Not required | Beer details |
| GET | `/brewery/info/{BREWERY_ID}` | Not required | Brewery details |
| GET | `/venue/info/{VENUE_ID}` | Not required | Venue details |
| GET | `/checkin/view/{CHECKIN_ID}` | Not required | Check-in detail |
| GET | `/user/info/{USERNAME}` | Not required | User profile |
| GET | `/user/friends/{USERNAME}` | Not required | User friends |
| GET | `/user/badges/{USERNAME}` | Not required | User badges |
| GET | `/user/wishlist/{USERNAME}` | Not required | User wishlist |
| GET | `/user/beers/{USERNAME}` | Not required | User beer library |

### Search and discovery
| Method | Path | Auth in docs | Purpose |
|---|---|---|---|
| GET | `/search/beer` | Not required | Beer search |
| GET | `/search/brewery` | Not required | Brewery search |
| GET | `/beer/trending` | Not required | Trending beers |
| GET | `/venue/foursquare_lookup/{VENUE_ID}` | Not required | Translate a Foursquare venue ID to an Untappd venue |

### Check-in and social actions
| Method | Path | Auth in docs | Purpose |
|---|---|---|---|
| POST | `/checkin/add` | Required | Create a beer check-in |
| POST | `/checkin/addcomment/{CHECKIN_ID}` | Required | Add comment to a check-in |
| POST | `/checkin/deletecomment/{COMMENT_ID}` | Required | Delete comment |
| POST | `/checkin/toast/{CHECKIN_ID}` | Required | Toast / un-toast a check-in |
| GET | `/user/pending` | Required | Pending friend requests |
| GET | `/friend/accept/{TARGET_ID}` | Required | Accept friend request |
| GET | `/friend/request/{TARGET_ID}` | Required | Send friend request |
| GET | `/friend/reject/{TARGET_ID}` | Required | Reject friend request |
| GET | `/friend/remove/{TARGET_ID}` | Required | Remove friend |
| GET | `/user/wishlist/add` | Required | Add beer to wishlist |
| GET | `/user/wishlist/delete` | Required | Remove beer from wishlist |

## Confirmed parameters

### Global auth parameters
- `client_id` and `client_secret`: required together for app-level unauthenticated requests
- `access_token`: required for authenticated user actions; may also be used for read routes
- OAuth note from docs: tokens do not expire
- Non-standard `User-Agent` is required for all requests, including authentication

### Common pagination parameters on read endpoints
The reviewed docs repeatedly use:
- `limit`
- `offset` on list/profile routes
- `max_id` / `min_id` on feed-style routes

### Key endpoint-specific parameters confirmed in the docs
- `/user/checkins/{USERNAME}`: `USERNAME`, `max_id`, `min_id`, `limit`
- `/beer/checkins/{BID}`: `BID`, `max_id`, `min_id`, `limit`
- `/brewery/checkins/{BREWERY_ID}`: `BREWERY_ID`, `max_id`, `min_id`, `limit`
- `/venue/checkins/{VENUE_ID}`: `VENUE_ID`, `max_id`, `min_id`, `limit`
- `/beer/info/{BID}`: `BID`, optional `compact=true`
- `/brewery/info/{BREWERY_ID}`: `BREWERY_ID`, optional `compact=true`
- `/venue/info/{VENUE_ID}`: `VENUE_ID`, optional `compact=true`
- `/user/info/{USERNAME}`: optional `USERNAME`, optional `compact=true`
- `/user/friends/{USERNAME}`: optional `USERNAME`, `offset`, `limit`
- `/user/badges/{USERNAME}`: optional `USERNAME`, `offset`, `limit`
- `/user/wishlist/{USERNAME}`: optional `USERNAME`, `offset`, `limit`, `sort`
- `/user/beers/{USERNAME}`: optional `USERNAME`, `offset`, `limit`, `sort`, `start_date`, `end_date`
- `/search/beer`: `q`, `offset`, `limit`, `sort`
- `/search/brewery`: `q`, `offset`, `limit`
- `/checkin/add`: `access_token`, `gmt_offset`, `timezone`, `bid`, plus optional `foursquare_id`, `geolat`, `geolng`, `shout`, `rating`, `facebook`, `twitter`, `foursquare`
- `/checkin/addcomment/{CHECKIN_ID}`: `access_token`, `CHECKIN_ID`, `comment`
- `/checkin/deletecomment/{COMMENT_ID}`: `access_token`, `COMMENT_ID`
- `/checkin/toast/{CHECKIN_ID}`: `access_token`, `CHECKIN_ID`
- `/friend/*/{TARGET_ID}`: `access_token`, `TARGET_ID`
- `/user/wishlist/add` and `/user/wishlist/delete`: `access_token`, `bid`
- `/venue/foursquare_lookup/{VENUE_ID}`: docs describe `VENUE_ID` as the Foursquare venue v2 ID to translate

## Rate limits
The reviewed docs explicitly state:
- default public API limit is `100 calls per hour per key`
- when using authentication, the limit is applied to the user instead of the API key
- response headers:
  - `X-Ratelimit-Limit`
  - `X-Ratelimit-Remaining`

## Response and error notes
- Successful responses use a top-level JSON envelope with `meta`, `notifications`, and `response`.
- The docs show `meta.code` and `meta.response_time` in successful responses.
- Error responses return the relevant HTTP status plus a JSON `meta` object with:
  - `code`
  - `error_detail`
  - `error_type`
  - optional `developer_friendly`
  - `response_time`
- The docs recommend using `developer_friendly` when present instead of `error_detail` for user-facing messaging.

## Important usage notes
- Feed-style endpoints note default page sizes around 25 results, with route-specific maxima documented inline.
- Several profile routes allow omitting `USERNAME` when a valid `access_token` is supplied, causing the API to operate on the authenticated user.
- Search routes are public, but the docs still require either OAuth token or `client_id` + `client_secret`.
- The beer search docs explicitly recommend queries in the form `Brewery Name + Beer Name`.
- The public API docs repeatedly describe social mutations as GET or POST exactly as listed above; fireROUTE should preserve those official method choices rather than normalizing them.

## fireROUTE notes
- Treat `/user/checkins/{USERNAME}`, `/beer/info/{BID}`, `/brewery/info/{BREWERY_ID}`, `/venue/info/{VENUE_ID}`, `/search/beer`, and `/search/brewery` as the main read routes.
- Preserve Untappd's dual auth mode: app credentials for app-level access and `access_token` for user actions.
- Always send a custom `User-Agent` from any adapter.
- Keep feed pagination compatible with `max_id` / `min_id` cursors and list pagination compatible with `offset` / `limit`.
