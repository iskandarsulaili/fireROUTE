# YouTube

## Provider metadata
- Category: `Video`
- Provider slug: `youtube`
- Official docs pages used:
  - `https://developers.google.com/youtube/v3/getting-started`
  - `https://developers.google.com/youtube/v3/determine_quota_cost`
  - `https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps`
  - `https://youtube.googleapis.com/$discovery/rest?version=v3`
- Main API base URL: `https://youtube.googleapis.com`
- Main REST prefix: `/youtube/v3`
- Batch path: `/batch`
- Auth models: API key for public read operations, OAuth 2.0 for user/private/write operations, limited service-account support for content owners using `onBehalfOfContentOwner`
- Supported request methods: `GET`, `POST`, `PUT`, `DELETE`
- Default response format: JSON
- Alternate response formats from the discovery document: `json`, `media`, `proto`
- Manually confirmed route count: `83`

## Authentication
- The overview page says you need a Google Cloud project, enabled YouTube Data API v3 access, and authorization credentials before sending requests.
- The discovery document exposes the shared query parameter `key` for API-key access.
- The shared query parameters also include `access_token` and `oauth_token` for OAuth-authorized requests.
- The OAuth guide says user-facing web apps should use OAuth 2.0 authorization code flow and securely store the resulting access and refresh tokens.
- The OAuth guide also says the YouTube Data API supports service accounts only for YouTube content owners managing multiple channels, and only for methods that support the `onBehalfOfContentOwner` parameter.
- Unique OAuth scopes present in the reviewed discovery document:
  - `https://www.googleapis.com/auth/youtube`
  - `https://www.googleapis.com/auth/youtube.channel-memberships.creator`
  - `https://www.googleapis.com/auth/youtube.force-ssl`
  - `https://www.googleapis.com/auth/youtube.readonly`
  - `https://www.googleapis.com/auth/youtube.upload`
  - `https://www.googleapis.com/auth/youtubepartner`
  - `https://www.googleapis.com/auth/youtubepartner-channel-audit`

## API-wide request and response behavior
- The overview page says the `part` parameter is mandatory when retrieving or mutating resource representations.
- The overview page says the `fields` parameter can be used for partial responses to reduce payload size.
- The overview page recommends using ETags for caching and overwrite protection.
- The overview page says gzip compression is supported for bandwidth reduction.
- The discovery document defines these shared query parameters:
  - `key` - API key, required unless OAuth credentials are provided
  - `access_token` / `oauth_token` - OAuth token for the current user
  - `fields` - partial-response selector
  - `alt` - response format selector: `json`, `media`, or `proto`
  - `quotaUser` - server-side quota partitioning hint
  - `prettyPrint` - formatted output toggle
  - `uploadType` / `upload_protocol` - media upload protocol selection
  - `$.xgafv` - error format selector (`1` or `2`)

## Quota, pagination, and usage notes
- The quota page says projects that enable the API get `10,000` quota units per day by default.
- The quota page says daily quota resets at midnight Pacific Time.
- The quota page says every request, including invalid requests, costs at least `1` quota unit.
- The quota page says fetching additional result pages costs quota again for each follow-up request.
- Quota examples confirmed from the reviewed table:
  - `activities.list` -> `1`
  - `channels.list` -> `1`
  - `search.list` -> `100`
  - `captions.insert` -> `400`
  - `videos.list` -> `1`
  - `videos.insert` -> `100`
  - many write/update/delete methods -> `50`
- Pagination is resource-specific, but the reviewed discovery document repeatedly uses `maxResults` and `pageToken` on list endpoints.
- List responses in the API reference commonly return page tokens rather than numeric page numbers.

## Media upload notes
- The discovery document marks several methods as media-upload capable.
- Confirmed upload families include:
  - `POST /upload/youtube/v3/videos` and `/resumable/upload/youtube/v3/videos`
  - `POST /upload/youtube/v3/captions` and `/resumable/upload/youtube/v3/captions`
  - `POST /upload/youtube/v3/thumbnails/set` and `/resumable/upload/youtube/v3/thumbnails/set`
  - `POST /upload/youtube/v3/playlistImages` and `/resumable/upload/youtube/v3/playlistImages`
  - `POST /upload/youtube/v3/watermarks/set` and `/resumable/upload/youtube/v3/watermarks/set`
- The discovery document lists accepted upload media types such as `video/*`, subtitle text/XML, and image formats like JPEG/PNG depending on the method.

## Canonical endpoint inventory

### Moderation and abuse
- `POST /youtube/v3/abuseReports` - `abuseReports.insert`
- `GET /youtube/v3/videoAbuseReportReasons` - `videoAbuseReportReasons.list`
- `POST /youtube/v3/videos/reportAbuse` - `videos.reportAbuse`

### Activities and discovery
- `GET /youtube/v3/activities` - `activities.list`
- `GET /youtube/v3/search` - `search.list`
- `GET /youtube/v3/videoCategories` - `videoCategories.list`
- `GET /youtube/v3/i18nLanguages` - `i18nLanguages.list`
- `GET /youtube/v3/i18nRegions` - `i18nRegions.list`

### Captions
- `GET /youtube/v3/captions` - `captions.list`
- `POST /youtube/v3/captions` - `captions.insert`
- `PUT /youtube/v3/captions` - `captions.update`
- `DELETE /youtube/v3/captions` - `captions.delete`
- `GET /youtube/v3/captions/{id}` - `captions.download`

### Channels and channel presentation
- `GET /youtube/v3/channels` - `channels.list`
- `PUT /youtube/v3/channels` - `channels.update`
- `POST /youtube/v3/channelBanners/insert` - `channelBanners.insert`
- `GET /youtube/v3/channelSections` - `channelSections.list`
- `POST /youtube/v3/channelSections` - `channelSections.insert`
- `PUT /youtube/v3/channelSections` - `channelSections.update`
- `DELETE /youtube/v3/channelSections` - `channelSections.delete`
- `GET /youtube/v3/thirdPartyLinks` - `thirdPartyLinks.list`
- `POST /youtube/v3/thirdPartyLinks` - `thirdPartyLinks.insert`
- `PUT /youtube/v3/thirdPartyLinks` - `thirdPartyLinks.update`
- `DELETE /youtube/v3/thirdPartyLinks` - `thirdPartyLinks.delete`
- `POST /youtube/v3/watermarks/set` - `watermarks.set`
- `POST /youtube/v3/watermarks/unset` - `watermarks.unset`

### Comments and community discussion
- `GET /youtube/v3/comments` - `comments.list`
- `POST /youtube/v3/comments` - `comments.insert`
- `PUT /youtube/v3/comments` - `comments.update`
- `DELETE /youtube/v3/comments` - `comments.delete`
- `POST /youtube/v3/comments/setModerationStatus` - `comments.setModerationStatus`
- `POST /youtube/v3/comments/markAsSpam` - `comments.markAsSpam`
- `GET /youtube/v3/commentThreads` - `commentThreads.list`
- `POST /youtube/v3/commentThreads` - `commentThreads.insert`
- `PUT /youtube/v3/commentThreads` - `youtube.v3.updateCommentThreads`

### Live streaming and live chat
- `GET /youtube/v3/liveBroadcasts` - `liveBroadcasts.list`
- `POST /youtube/v3/liveBroadcasts` - `liveBroadcasts.insert`
- `PUT /youtube/v3/liveBroadcasts` - `liveBroadcasts.update`
- `DELETE /youtube/v3/liveBroadcasts` - `liveBroadcasts.delete`
- `POST /youtube/v3/liveBroadcasts/bind` - `liveBroadcasts.bind`
- `POST /youtube/v3/liveBroadcasts/transition` - `liveBroadcasts.transition`
- `POST /youtube/v3/liveBroadcasts/cuepoint` - `liveBroadcasts.insertCuepoint`
- `GET /youtube/v3/liveStreams` - `liveStreams.list`
- `POST /youtube/v3/liveStreams` - `liveStreams.insert`
- `PUT /youtube/v3/liveStreams` - `liveStreams.update`
- `DELETE /youtube/v3/liveStreams` - `liveStreams.delete`
- `POST /youtube/v3/liveChat/bans` - `liveChatBans.insert`
- `DELETE /youtube/v3/liveChat/bans` - `liveChatBans.delete`
- `GET /youtube/v3/liveChat/messages` - `liveChatMessages.list`
- `POST /youtube/v3/liveChat/messages` - `liveChatMessages.insert`
- `DELETE /youtube/v3/liveChat/messages` - `liveChatMessages.delete`
- `POST /youtube/v3/liveChat/messages/transition` - `liveChatMessages.transition`
- `GET /youtube/v3/liveChat/messages/stream` - `youtube.v3.liveChat.messages.stream`
- `GET /youtube/v3/liveChat/moderators` - `liveChatModerators.list`
- `POST /youtube/v3/liveChat/moderators` - `liveChatModerators.insert`
- `DELETE /youtube/v3/liveChat/moderators` - `liveChatModerators.delete`
- `GET /youtube/v3/superChatEvents` - `superChatEvents.list`

### Members and subscriptions
- `GET /youtube/v3/members` - `members.list`
- `GET /youtube/v3/membershipsLevels` - `membershipsLevels.list`
- `GET /youtube/v3/subscriptions` - `subscriptions.list`
- `POST /youtube/v3/subscriptions` - `subscriptions.insert`
- `DELETE /youtube/v3/subscriptions` - `subscriptions.delete`

### Playlists and playlist assets
- `GET /youtube/v3/playlists` - `playlists.list`
- `POST /youtube/v3/playlists` - `playlists.insert`
- `PUT /youtube/v3/playlists` - `playlists.update`
- `DELETE /youtube/v3/playlists` - `playlists.delete`
- `GET /youtube/v3/playlistItems` - `playlistItems.list`
- `POST /youtube/v3/playlistItems` - `playlistItems.insert`
- `PUT /youtube/v3/playlistItems` - `playlistItems.update`
- `DELETE /youtube/v3/playlistItems` - `playlistItems.delete`
- `GET /youtube/v3/playlistImages` - `playlistImages.list`
- `POST /youtube/v3/playlistImages` - `playlistImages.insert`
- `PUT /youtube/v3/playlistImages` - `playlistImages.update`
- `DELETE /youtube/v3/playlistImages` - `playlistImages.delete`

### Videos and thumbnails
- `GET /youtube/v3/videos` - `videos.list`
- `POST /youtube/v3/videos` - `videos.insert`
- `PUT /youtube/v3/videos` - `videos.update`
- `DELETE /youtube/v3/videos` - `videos.delete`
- `POST /youtube/v3/videos/rate` - `videos.rate`
- `GET /youtube/v3/videos/getRating` - `videos.getRating`
- `POST /youtube/v3/thumbnails/set` - `thumbnails.set`
- `GET /youtube/v3/videoTrainability` - `videoTrainability.get`

### Miscellaneous / internal exposure in discovery doc
- `POST /youtube/v3/tests` - `tests.insert`

## Frequently used method parameters

### `search.list`
- Method/path: `GET /youtube/v3/search`
- Required parameters:
  - `part`
- Common optional parameters confirmed in the discovery doc:
  - `q`
  - `type`
  - `order`
  - `relevanceLanguage`
  - `videoDimension`
  - `videoDefinition`
  - `videoLicense`
  - `videoDuration`
  - `videoCaption`
  - `videoEmbeddable`
  - `videoSyndicated`
  - `videoCategoryId`
  - `maxResults`
  - `pageToken`

### `videos.list`
- Method/path: `GET /youtube/v3/videos`
- Required parameters:
  - `part`
- Common optional parameters:
  - `id`
  - `chart`
  - `myRating`
  - `videoCategoryId`
  - `regionCode`
  - `hl`
  - `locale`
  - `maxResults`
  - `pageToken`
  - `onBehalfOfContentOwner`

### `videos.insert`
- Method/path: `POST /youtube/v3/videos`
- Required parameters:
  - `part`
- Important optional parameters:
  - `notifySubscribers`
  - `autoLevels`
  - `stabilize`
  - `onBehalfOfContentOwner`
  - `onBehalfOfContentOwnerChannel`
- Usage note: media uploads use the upload endpoints documented above rather than the plain JSON path alone.

### `channels.list`
- Method/path: `GET /youtube/v3/channels`
- Required parameters:
  - `part`
- Common optional parameters:
  - `mine`
  - `id`
  - `forUsername`
  - `forHandle`
  - `mySubscribers`
  - `managedByMe`
  - `categoryId`
  - `hl`
  - `maxResults`
  - `pageToken`
  - `onBehalfOfContentOwner`

### `playlists.list`
- Method/path: `GET /youtube/v3/playlists`
- Required parameters:
  - `part`
- Common optional parameters:
  - `id`
  - `mine`
  - `channelId`
  - `hl`
  - `maxResults`
  - `pageToken`
  - `onBehalfOfContentOwner`
  - `onBehalfOfContentOwnerChannel`

### `playlistItems.list`
- Method/path: `GET /youtube/v3/playlistItems`
- Required parameters:
  - `part`
- Common optional parameters:
  - `id`
  - `playlistId`
  - `videoId`
  - `maxResults`
  - `pageToken`
  - `onBehalfOfContentOwner`

### `commentThreads.list`
- Method/path: `GET /youtube/v3/commentThreads`
- Required parameters:
  - `part`
- Common optional parameters:
  - `id`
  - `videoId`
  - `postId`
  - `channelId`
  - `allThreadsRelatedToChannelId`
  - `moderationStatus`
  - `searchTerms`
  - `textFormat`
  - `order`
  - `maxResults`
  - `pageToken`

### `subscriptions.list`
- Method/path: `GET /youtube/v3/subscriptions`
- Required parameters:
  - `part`
- Common optional parameters:
  - `id`
  - `mine`
  - `channelId`
  - `forChannelId`
  - `order`
  - `mySubscribers`
  - `myRecentSubscribers`
  - `maxResults`
  - `pageToken`
  - `onBehalfOfContentOwner`
  - `onBehalfOfContentOwnerChannel`

### `liveBroadcasts.list`
- Method/path: `GET /youtube/v3/liveBroadcasts`
- Required parameters:
  - `part`
- Common optional parameters:
  - `broadcastStatus`
  - `broadcastType`
  - `mine`
  - `id`
  - `maxResults`
  - `pageToken`
  - `onBehalfOfContentOwner`
  - `onBehalfOfContentOwnerChannel`

## Error and normalization notes
- The reviewed official pages emphasize quota accounting, OAuth requirements, and shared Google API parameters, but they do not publish a single YouTube-specific error-envelope page among the sources reviewed for this pass.
- The discovery document exposes `$.xgafv` as an error-format selector and `alt` as a response-format selector.
- fireROUTE should preserve Google-style query parameters such as `part`, `fields`, `quotaUser`, and `pageToken` rather than trying to collapse them into a generic schema.
- Upload-capable operations should be modeled separately from plain metadata-only calls because they can switch to `/upload/...` or `/resumable/upload/...` paths.
