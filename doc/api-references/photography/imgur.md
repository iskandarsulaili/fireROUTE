# Imgur

## Overview
- Provider: Imgur API v3
- Category: Photography
- Official docs: `https://apidocs.imgur.com/`
- Official route source reviewed: the live public Postman collection loaded by `https://apidocs.imgur.com/api/collections/1688173/6YsWHMa?segregateAuth=true&versionTag=latest`
- Base URL: `https://api.imgur.com/3/`
- Additional official surfaces used by the docs:
  - OAuth helpers on `https://api.imgur.com/oauth2/`
  - account-block endpoints on `https://api.imgur.com/account/v1/`
- Auth:
  - public read-only and anonymous routes can use `Authorization: Client-ID YOUR_CLIENT_ID`
  - user/account/write flows use `Authorization: Bearer YOUR_ACCESS_TOKEN`
- HTTPS: yes; the docs explicitly say all requests must use HTTPS because the API uses OAuth 2.0
- Response formats: JSON by default; JSONP and XML are also documented via extension/callback support
- Pagination: plural/list endpoints are generally paged with `page` and `perPage`; docs state `page` default `0`, `perPage` default `50`, max `100`
- Rate limits:
  - approximately `12,500` requests per day per application
  - approximately `1,250` uploads per day per application
  - `1,250` POST requests per hour per IP across endpoints

## Confirmed route inventory
The official public Imgur Postman collection currently publishes 85 request entries across Account, Comment, Album, Gallery, Image, and Feed groups.

Confirmed route count: **85** collection requests.

Important note: one deprecated collection entry, "Random Gallery Images," is still present in the official collection but its current export omits a raw URL path. It is counted here because it remains a named official request in the public collection, but its exact path was not recoverable from the current export payload.

## Auth and transport notes
### OAuth helper URLs explicitly named on the intro page
The inspected intro/auth pages explicitly name these OAuth helper URLs:
- `https://api.imgur.com/oauth2/addclient`
- `https://api.imgur.com/oauth2/authorize`
- `https://api.imgur.com/oauth2/token`
- `https://api.imgur.com/oauth2/secret`

### Auth modes
- Anonymous/public-read mode:
  - `Authorization: Client-ID YOUR_CLIENT_ID`
- User-authenticated mode:
  - `Authorization: Bearer YOUR_ACCESS_TOKEN`
- The docs say OAuth `token` is the current supported response type and mark `code` and `pin` as deprecated in the auth section

## Confirmed collection routes
### Account group — 36 requests
| Name | Method | Path |
|---|---|---|
| Generate Access Token | POST | `/oauth2/token` |
| Account Base | GET | `/3/account/{username}` |
| Account Block Status | GET | `/account/v1/{username}/block` |
| Account Blocks | GET | `/3/account/me/block` |
| Account Block Create | POST | `/account/v1/{username}/block` |
| Account Block Delete | DELETE | `/account/v1/{username}/block` |
| Account Images | GET | `/3/account/me/images` |
| Account Gallery Favorites | GET | `/3/account/{username}/gallery_favorites/{page}/{favoritesSort}` |
| Account Favorites | GET | `/3/account/{username}/favorites/{page}/{favoritesSort}` |
| Account Submissions | GET | `/3/account/{username}/submissions/{page}` |
| Account Available Avatars (Un-authed / Authed) | GET | `/3/account/{username}/available_avatars` |
| Account Avatar (Authed) | GET | `/3/account/{username}/avatar` |
| Account Settings | GET | `/3/account/me/settings` |
| Change Account Settings | PUT | `/3/account/{username}/settings` |
| Account Gallery Profile | GET | `/3/account/{username}/settings` |
| Verify User's E-mail | GET | `/3/account/{username}/verifyemail` |
| Send Verification E-mail | POST | `/3/account/{username}/verifyemail` |
| Albums (Un-Authed / Authed) | GET | `/3/account/{username}/albums/{page}` |
| Album | GET | `/3/account/{username}/album/{albumHash}` |
| Album IDs (Un-Authed / Authed) | GET | `/3/account/{username}/albums/ids/{page}` |
| Album Count (Un-Authed / Authed) | GET | `/3/account/{username}/albums/count` |
| Album Deletion | DELETE | `/3/account/{username}/album/{albumHash}` |
| Comments | GET | `/3/account/{username}/comments/{commentSort}/{page}` |
| Comment | GET | `/3/account/{username}/comment/{commentId}` |
| Comment IDs | GET | `/3/account/{username}/comments/ids/{sort}/{page}` |
| Comment Count | GET | `/3/account/{username}/comments/count` |
| Comment Deletion | DELETE | `/3/account/{username}/comment/{commentId}` |
| Images | GET | `/3/account/{username}/images/{page}` |
| Image | GET | `/3/account/{username}/image/{imageId}` |
| Image IDs | GET | `/3/account/{username}/images/ids/{page}` |
| Image Count | GET | `/3/account/{username}/images/count` |
| Image Deletion | DELETE | `/3/account/{username}/image/{deleteHash}` |
| Replies | GET | `/3/account/{username}/notifications/replies` |
| Follow Tag | POST | `/3/account/me/follow/tag/{tagName}` |
| Unfollow tag | DELETE | `/3/account/me/follow/tag/{tagName}` |
| Account Delete (me) | POST | `/3/account/me/delete?client_id={clientId}` |

### Comment group — 7 requests
| Name | Method | Path |
|---|---|---|
| Comment | GET | `/3/comment/{commentId}` |
| Comment Creation | POST | `/3/comment` |
| Comment Deletion | DELETE | `/3/comment/{commentId}` |
| Replies | GET | `/3/comment/{commentId}/replies` |
| Reply Creation | POST | `/3/comment/{commentId}` |
| Vote | POST | `/3/comment/{commentId}/vote/{vote}` |
| Report | POST | `/3/comment/{commentId}/report` |

### Album group — 14 requests
| Name | Method | Path |
|---|---|---|
| Album | GET | `/3/album/{albumHash}` |
| Album Images | GET | `/3/album/{albumHash}/images` |
| Album Image | GET | `/3/album/{albumHash}/image/{imageHash}` |
| Album Creation (Un-Authed / Authed) | POST | `/3/album` |
| Update Album (Un-Authed / Authed) | PUT | `/3/album/{albumHash}` |
| Album Deletion (Un-Authed) | DELETE | `/3/album/{albumDeleteHash}` |
| Album Deletion (Authed) | DELETE | `/3/album/{albumHash}` |
| Favorite Album | POST | `/3/album/{albumHash}/favorite` |
| Set Album Images (Un-Authed) | POST | `/3/album/{albumDeleteHash}` |
| Set Album Images (Authed) | POST | `/3/album/{albumHash}` |
| Add Images to an Album (Un-Authed) | POST | `/3/album/{albumDeleteHash}/add` |
| Add Images to an Album (Authed) | POST | `/3/album/{albumHash}/add` |
| Remove Images from an Album (Un-Authed) | POST | `/3/album/{albumDeleteHash}/remove_images` |
| Remove Images from an Album (Authed) | POST | `/3/album/{albumHash}/remove_images` |

### Gallery group — 21 requests
| Name | Method | Path |
|---|---|---|
| Gallery | GET | `/3/gallery/{section}/{sort}/{window}/{page}?showViral={showViral}&mature={showMature}&album_previews={albumPreviews}` |
| Subreddit Galleries | GET | `/3/gallery/r/{subreddit}/{sort}/{window}/{page}` |
| Subreddit Image | GET | `/3/gallery/r/{subreddit}/{subredditImageId}` |
| Gallery Tag | GET | `/3/gallery/t/{tagName}/{sort}/{window}/{page}` |
| Gallery Tags | GET | `/3/tags` |
| Gallery Tag Info | GET | `/3/gallery/tag_info/{tagName}` |
| Gallery Item Tags | GET | `/3/gallery/{galleryHash}/tags` |
| Update Gallery Item Tags | POST | `/3/gallery/tags/{galleryHash}` |
| Gallery Search | GET | `/3/gallery/search/{sort}/{window}/{page}` |
| Random Gallery Images | GET | path omitted in current official collection export; request marked deprecated |
| Share with Community (Image) | POST | `/3/gallery/image/{imageHash}` |
| Share with Community (Album) | POST | `/3/gallery/album/{albumHash}` |
| Remove from Gallery | DELETE | `/3/gallery/{galleryHash}` |
| Gallery Album | GET | `/3/gallery/album/{galleryHash}` |
| Gallery Image | GET | `/3/gallery/image/{galleryImageHash}` |
| Album / Image Reporting | POST | `/3/gallery/image/{galleryHash}/report` |
| Album / Image Votes | GET | `/3/gallery/{galleryHash}/votes` |
| Album / Image Voting | POST | `/3/gallery/{galleryHash}/vote/{vote}` |
| Album / Image Comments | GET | `/3/gallery/{galleryHash}/comments/{commentSort}` |
| Album / Image Comment | GET | `/3/gallery/{galleryHash}/comment/{commentId}` |
| Album / Image Comment Creation | POST | `/3/gallery/{galleryHash}/comment` |

### Image group — 6 requests
| Name | Method | Path |
|---|---|---|
| Image | GET | `/3/image/{imageHash}` |
| Image Upload | POST | `/3/image` |
| Image Deletion (Un-Authed) | DELETE | `/3/image/{imageDeleteHash}` |
| Image Deletion (Authed) | DELETE | `/3/image/{imageHash}` |
| Update Image Information | POST | `/3/image/{imageHash}` |
| Favorite an Image | POST | `/3/image/{imageHash}/favorite` |

### Feed group — 1 request
| Name | Method | Path |
|---|---|---|
| Feed | GET | `/3/feed` |

## Shared parameters and usage notes
### Pagination
The intro page states:
- plural actions are generally pageable
- `page` is optional and defaults to `0`
- `perPage` is optional and defaults to `50`
- `perPage` maximum is `100`
- exceptions called out explicitly by the docs:
  - `/gallery` endpoints do not support `perPage`
  - `/album/{id}/images` is not paged

### Common route variables seen in the official collection
- account/group variables: `username`, `page`, `favoritesSort`, `commentSort`, `sort`, `tagName`
- comment variables: `commentId`, `vote`
- album/image variables: `albumHash`, `albumDeleteHash`, `imageHash`, `imageDeleteHash`, `imageId`, `deleteHash`
- gallery variables: `section`, `sort`, `window`, `page`, `showViral`, `showMature`, `albumPreviews`, `subreddit`, `galleryHash`, `galleryImageHash`
- search routes may also use the documented `callback` parameter for JSONP

### Response and format notes
- Responses are wrapped in a top-level `data` field, with companion `status` and `success` values according to the intro docs
- JSON is the default response format
- JSONP can be requested with `callback=...`
- XML can be requested by appending an extension such as `.xml`

### Rate-limit headers documented on the official page
- `X-RateLimit-UserLimit`
- `X-RateLimit-UserRemaining`
- `X-RateLimit-UserReset`
- `X-RateLimit-ClientLimit`
- `X-RateLimit-ClientRemaining`
- POST rate-limit headers:
  - `X-Post-Rate-Limit-Limit`
  - `X-Post-Rate-Limit-Remaining`
  - `X-Post-Rate-Limit-Reset`

### Other important official notes
- The docs say uploads cost more credits than standard requests
- OAuth calls do not deduct credits according to the rate-limit section
- The docs recommend using ETags with `If-None-Match` for cache validation, but note those requests still count against rate limits
- Commercial usage is documented separately and points developers to a RapidAPI-hosted endpoint, but the core official docs still present `https://api.imgur.com/3/` as the main API root

## fireROUTE integration notes
- Model Imgur as a JSON-first API rooted at `/3/`, but preserve the documented XML/JSONP output options as provider-specific capabilities
- Keep anonymous `Client-ID` access separate from bearer-token account mutations
- Surface paging and gallery-specific route variables prominently; this API uses path parameters heavily rather than only query strings
- Treat the official public Postman collection as the best current route inventory source, and treat the single pathless deprecated gallery request as a documentation edge case rather than a stable route to depend on

## Sources inspected
- `https://apidocs.imgur.com/`
- `https://apidocs.imgur.com/api/collections/1688173/6YsWHMa?segregateAuth=true&versionTag=latest`
