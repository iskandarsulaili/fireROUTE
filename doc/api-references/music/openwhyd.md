# Openwhyd

## Overview
- Provider: Openwhyd API
- Category: Music
- Official docs: `https://openwhyd.github.io/openwhyd/API`
- Base URL: `https://openwhyd.org`
- Auth:
  - public data-export endpoints do not require auth
  - user-write and session-sensitive endpoints require the Openwhyd session cookie
- HTTPS: yes
- Response formats:
  - many endpoints support `format=json` or HTML by default
  - some export-style endpoints also support `links`
  - JSONP is documented on public list endpoints through `callback`
- Pagination: public feed/list endpoints use `limit`, `after`, and `before`; follower lists use `skip` and `limit`
- Rate limits: no numeric public quota is published; the docs ask clients to add a reasonable delay between requests

## Confirmed endpoints

### Public data export and read-only content routes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/:uHandle/[playlist/:playlistId]` | optional `format`, `callback`, `limit`, `after`, `before` | List tracks posted by a user or by one of the user's playlists using handle-based URLs. |
| GET | `/u/:uId/[playlist/:playlistId]` | optional `format`, `callback`, `limit`, `after`, `before` | Same listing flow using user ID instead of handle. |
| GET | `/[stream]` | optional `format`, `limit`, `after`, `before` | Incoming stream / homepage feed. |
| GET | `/hot` | optional `format`, `limit`, `skip` | Hot tracks feed. |
| GET | `/c/{postId}?format=json` | path `postId`; `format` | Detailed track info endpoint. |
| GET | `/{uId}/likes?format=json` | optional `after`, `before` | Likes list for a user. |

### Session and account entry routes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/logout` | optional `ajax`; legacy docs also mention `action=logout` | Clears cookie/session. Formerly `/login?action=logout`. |
| GET | `/login?action=forgot&email={email}` | `email`; optional `ajax` | Sends password-reset email flow. |
| GET | `/login?action=login&email={email}&md5={md5}` | `email`, `md5`; optional `ajax`, `includeUser` | Login flow documented as HTML/JSON form handling. |
| POST | `/register` | `name`, `email`, `password`; optional `redirect`, `ajax`, invite/referral fields | Sign-up endpoint that also starts a session on success. |

### User profile, search, and follow routes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/api/user` | optional `id`, `isSubscr`, `countPosts`, `countLikes`, `includeSubscr`, `includeTags` | Get user data; defaults to logged-in user if `id` omitted. |
| POST | `/api/user` | profile-update fields such as `name`, `img`, `cvrImg`, `pwd`, `oldPwd`, `handle`, `email`, `bio`, `loc`, social links | Update logged-in user profile. |
| GET | `/search?context=addTrack&q={q}` | `context=addTrack`, `q` | Search tracks posted by other users for repost/add-track flow. |
| GET | `/search?context=quick&q={q}` | `context=quick`, `q` | Search tracks posted by the logged-in user plus others. |
| GET | `/search?q={q}` | `q`; optional `format=json` | Combined search page for posts, users, and playlists. |
| GET | `/api/follow/fetchFollowers/{id}` | path `id`; optional `skip`, `limit`, `isSubscr` | List subscribers/followers of a user. |
| GET | `/api/follow/fetchFollowing/{id}` | path `id`; optional `skip`, `limit`, `isSubscr` | List accounts a user follows. |
| GET | `/api/follow?action=get&tId={tId}` | `tId` | Get subscription status for a target user. |
| GET | `/api/follow?action={insert|delete}&tId={tId}` | action `insert` or `delete`; `tId` | Subscribe or unsubscribe to a user. |

### Post and engagement routes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/api/post?action=insert` | required `eId`, `name`; optional `_id`, `pId`, `text`, `img`, `pl`, `src` | Add a track, edit a post, or repost an existing post depending on parameters. |
| GET | `/api/post?action=delete` | `_id` | Delete a post. |
| GET | `/api/post?action=toggleLovePost` | `pId` | Like or unlike a post. |
| GET | `/api/post?action=lovers` | `pId` | Fetch users who liked a post. |
| GET | `/api/post?action=reposts` | `pId` | Fetch users who reposted a post. |
| GET | `/api/post?action=incrPlayCounter` | `pId`; optional `logData` | Log play start/failure analytics. |
| GET | `/api/post?action=scrobble` | `pId`, `timestamp`; optional `trackDuration` | Scrobble to Last.fm for connected users. |
| GET | `/api/post?action=addComment` | `pId`, `text` | Add a comment to a post. |
| GET | `/api/post?action=deleteComment` | `_id` | Delete a comment. |
| POST | `/api/post/{pId}/sendToUsers` | path `pId`; body `uidList[]` | Share a post to selected Openwhyd users. |

### Playlist and upload routes
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/api/playlist/{id}` | path `id` in `<uid>_<playlist-number>` form | Get one playlist. |
| GET | `/api/playlist?id={id1}&id={id2}` | one or more `id` values | Bulk playlist lookup. |
| POST | `/api/playlist` | `action=create`, `name` | Create playlist. |
| POST | `/api/playlist` | `action=rename`, `id`, `name` | Rename playlist. |
| POST | `/api/playlist` | `action=delete`, `id` | Delete playlist and move tracks back to default stream. |
| POST | `/api/playlist` | `action=setOrder`, `id`, `order[]` | Reorder playlist tracks. |
| POST | `/api/playlist` | `action=update`, `id`, `img` | Update playlist cover after upload. |
| POST | `/api/playlist` | `action=sendToUsers`, `plId`, `uidList[]` | Share playlist to users. |
| POST | `/upload` | file field; optional `thumbDims` | Upload a file to Openwhyd's file server for avatars, banners, playlist covers, etc. |
| POST | `/upload` | `action=delete`, `id` | Delete an uploaded file. |

Confirmed route count: **39**.

## Parameter and behavior notes
- Public list/feed endpoints share `limit`, `after`, and `before` for pagination-like navigation.
- Public export routes can return:
  - HTML
  - JSON through `format=json`
  - links lists on some export routes
  - JSONP through `callback`
- Search flows are split by context:
  - `context=addTrack` for repost/add-track suggestions
  - `context=quick` for mixed own+others search
  - plain `/search?q=` for the full combined search page
- Many write actions are action-style GET requests under `/api/post` or `/api/follow` rather than resource-style REST paths.

## Auth and usage notes
- The docs distinguish between a public Data Export API and a User API.
- User-sensitive operations depend on the logged-in session cookie rather than an API key.
- Login docs mention `md5`-hashed passwords for the documented `/login?action=login` flow.
- Uploads are a prerequisite for updating user avatars, cover images, and playlist images.

## Response and error notes
- Many endpoints return JSON objects or arrays; some login/form endpoints can return either HTML or JSON depending on `ajax` or `format` parameters.
- The docs explicitly document optional `error` fields on many write routes.
- The password-reset and login flows document human-readable error messages in form/JSON responses.
- The post-like endpoint returns `loved`, `lovers`, and sometimes a `post` object.

## Important usage notes
- The public docs explicitly ask clients to use export routes responsibly and add a reasonable delay between requests.
- Openwhyd's API mixes classic path routes with query-driven action dispatch; preserve the documented `action=` variants instead of collapsing them.
- The same `/api/playlist` and `/upload` paths each implement multiple distinct operations depending on the supplied action/body.
- Track identifiers use Openwhyd-specific `eId` syntax such as `/yt/...`, `/sc/...`, `/bc/...`, and others documented in the appendix.

## fireROUTE integration notes
- Model Openwhyd as two distinct surfaces: no-auth public export/feed routes and cookie-authenticated user/write routes.
- Preserve `action=`-specific post/follow/playlist operations as separate route patterns because they correspond to different behaviors and payloads.
- For read adapters, the most reusable endpoints are the user/playlist track listings, `hot`, detailed post lookup, and likes export.
- Do not invent API-key auth or numeric quotas; the official page documents neither.

## Sources inspected
- `https://openwhyd.github.io/openwhyd/API`
