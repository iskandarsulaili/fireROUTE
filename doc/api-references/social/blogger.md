# Blogger

## Provider metadata
- Category: `Social`
- Provider slug: `blogger`
- Official docs pages used:
  - `https://developers.google.com/blogger/docs/3.0/using`
  - `https://blogger.googleapis.com/$discovery/rest?version=v3`
- Main API base URL: `https://blogger.googleapis.com`
- Batch path documented in discovery: `/batch`
- Auth model: API key for app identification and OAuth 2.0 for authorized/private operations
- OAuth scopes confirmed in discovery:
  - `https://www.googleapis.com/auth/blogger`
  - `https://www.googleapis.com/auth/blogger.readonly`
- Supported request methods confirmed: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`
- Response format: JSON
- Manually confirmed route count: `33`

## Authentication
- The official guide says every request must identify the application with an OAuth 2.0 token and/or API key.
- The same guide distinguishes between public-data requests and requests that access or modify private Blogger data.
- The discovery document exposes the common Google API parameters including `key`, `access_token`, `oauth_token`, `fields`, and `quotaUser`.
- Use OAuth 2.0 with the `blogger` scope for write access and private account access; use `blogger.readonly` for read-only authorized access.

## Canonical endpoints

### Blogs and blog-user resources
#### 1) Get a blog by id
- Method: `GET`
- Path: `/v3/blogs/{blogId}`
- Key parameters: `blogId`, optional `maxPosts`, optional `view`

#### 2) Get a blog by URL
- Method: `GET`
- Path: `/v3/blogs/byurl`
- Key parameters: required `url`, optional `view`

#### 3) List blogs for a user
- Method: `GET`
- Path: `/v3/users/{userId}/blogs`
- Key parameters: `userId`, optional `fetchUserInfo`, `role`, `status`, `view`

#### 4) Get blog + user info pair
- Method: `GET`
- Path: `/v3/users/{userId}/blogs/{blogId}`
- Key parameters: `userId`, `blogId`, optional `maxPosts`

#### 5) Get blog pageview metrics
- Method: `GET`
- Path: `/v3/blogs/{blogId}/pageviews`
- Key parameters: `blogId`, required/meaningful `range`

### Posts
#### 6) Get a post by id
- Method: `GET`
- Path: `/v3/blogs/{blogId}/posts/{postId}`
- Key parameters: `blogId`, `postId`, optional `fetchBody`, `fetchImages`, `maxComments`, `view`

#### 7) Get a post by path
- Method: `GET`
- Path: `/v3/blogs/{blogId}/posts/bypath`
- Key parameters: `blogId`, required `path`, optional `maxComments`, `view`

#### 8) List posts
- Method: `GET`
- Path: `/v3/blogs/{blogId}/posts`
- Key parameters: `blogId`, optional `startDate`, `endDate`, `labels`, `maxResults`, `pageToken`, `orderBy`, `sortOption`, `status`, `view`, `fetchBodies`, `fetchImages`

#### 9) Search posts
- Method: `GET`
- Path: `/v3/blogs/{blogId}/posts/search`
- Key parameters: `blogId`, required `q`, optional `fetchBodies`, `orderBy`

#### 10) Insert a post
- Method: `POST`
- Path: `/v3/blogs/{blogId}/posts`
- Key parameters: `blogId`, optional `isDraft`, `fetchBody`, `fetchImages`

#### 11) Update a post
- Method: `PUT`
- Path: `/v3/blogs/{blogId}/posts/{postId}`
- Key parameters: `blogId`, `postId`, optional `publish`, `revert`, `fetchBody`, `fetchImages`, `maxComments`

#### 12) Patch a post
- Method: `PATCH`
- Path: `/v3/blogs/{blogId}/posts/{postId}`
- Key parameters: `blogId`, `postId`, optional `publish`, `revert`, `fetchBody`, `fetchImages`, `maxComments`

#### 13) Publish a post
- Method: `POST`
- Path: `/v3/blogs/{blogId}/posts/{postId}/publish`
- Key parameters: `blogId`, `postId`, optional `publishDate`

#### 14) Revert a post to draft
- Method: `POST`
- Path: `/v3/blogs/{blogId}/posts/{postId}/revert`
- Key parameters: `blogId`, `postId`

#### 15) Delete a post
- Method: `DELETE`
- Path: `/v3/blogs/{blogId}/posts/{postId}`
- Key parameters: `blogId`, `postId`, optional `useTrash`

### Pages
#### 16) Get a page
- Method: `GET`
- Path: `/v3/blogs/{blogId}/pages/{pageId}`
- Key parameters: `blogId`, `pageId`, optional `view`

#### 17) List pages
- Method: `GET`
- Path: `/v3/blogs/{blogId}/pages`
- Key parameters: `blogId`, optional `fetchBodies`, `maxResults`, `pageToken`, `status`, `view`

#### 18) Insert a page
- Method: `POST`
- Path: `/v3/blogs/{blogId}/pages`
- Key parameters: `blogId`, optional `isDraft`

#### 19) Update a page
- Method: `PUT`
- Path: `/v3/blogs/{blogId}/pages/{pageId}`
- Key parameters: `blogId`, `pageId`, optional `publish`, `revert`

#### 20) Patch a page
- Method: `PATCH`
- Path: `/v3/blogs/{blogId}/pages/{pageId}`
- Key parameters: `blogId`, `pageId`, optional `publish`, `revert`

#### 21) Publish a page
- Method: `POST`
- Path: `/v3/blogs/{blogId}/pages/{pageId}/publish`
- Key parameters: `blogId`, `pageId`

#### 22) Revert a page to draft
- Method: `POST`
- Path: `/v3/blogs/{blogId}/pages/{pageId}/revert`
- Key parameters: `blogId`, `pageId`

#### 23) Delete a page
- Method: `DELETE`
- Path: `/v3/blogs/{blogId}/pages/{pageId}`
- Key parameters: `blogId`, `pageId`, optional `useTrash`

### Comments
#### 24) Get a comment
- Method: `GET`
- Path: `/v3/blogs/{blogId}/posts/{postId}/comments/{commentId}`
- Key parameters: `blogId`, `postId`, `commentId`, optional `view`

#### 25) List comments for a post
- Method: `GET`
- Path: `/v3/blogs/{blogId}/posts/{postId}/comments`
- Key parameters: `blogId`, `postId`, optional `startDate`, `endDate`, `maxResults`, `pageToken`, `fetchBodies`, `status`, `view`

#### 26) List comments by blog
- Method: `GET`
- Path: `/v3/blogs/{blogId}/comments`
- Key parameters: `blogId`, optional `startDate`, `endDate`, `maxResults`, `pageToken`, `fetchBodies`, `status`

#### 27) Approve a comment
- Method: `POST`
- Path: `/v3/blogs/{blogId}/posts/{postId}/comments/{commentId}/approve`
- Key parameters: `blogId`, `postId`, `commentId`

#### 28) Mark a comment as spam
- Method: `POST`
- Path: `/v3/blogs/{blogId}/posts/{postId}/comments/{commentId}/spam`
- Key parameters: `blogId`, `postId`, `commentId`

#### 29) Remove comment content
- Method: `POST`
- Path: `/v3/blogs/{blogId}/posts/{postId}/comments/{commentId}/removecontent`
- Key parameters: `blogId`, `postId`, `commentId`

#### 30) Delete a comment
- Method: `DELETE`
- Path: `/v3/blogs/{blogId}/posts/{postId}/comments/{commentId}`
- Key parameters: `blogId`, `postId`, `commentId`

### User-scoped post resources
#### 31) Get post + user info pair
- Method: `GET`
- Path: `/v3/users/{userId}/blogs/{blogId}/posts/{postId}`
- Key parameters: `userId`, `blogId`, `postId`, optional `maxComments`

#### 32) List post + user info pairs
- Method: `GET`
- Path: `/v3/users/{userId}/blogs/{blogId}/posts`
- Key parameters: `userId`, `blogId`, optional `startDate`, `endDate`, `fetchBodies`, `labels`, `maxResults`, `pageToken`, `orderBy`, `status`, `view`

### Users
#### 33) Get a user
- Method: `GET`
- Path: `/v3/users/{userId}`
- Key parameters: `userId`

## Pagination and parameter notes
- Blogger list endpoints consistently use `maxResults` and `pageToken` for pagination.
- Time-window filtering appears on posts and comments via `startDate` and `endDate`.
- Several collection routes support `status`, `view`, and content-expansion toggles such as `fetchBodies` or `fetchImages`.
- The discovery document exposes common Google API control parameters including `fields` for partial responses and `quotaUser` for server-side quota accounting.

## Formats, schemas, and errors
- The reviewed discovery document is a REST description and lists JSON schemas including `Blog`, `Post`, `Page`, `Comment`, `User`, and list wrappers such as `BlogList`, `PostList`, `PageList`, and `CommentList`.
- The public guide and discovery document reviewed here do not publish a single numeric per-method rate limit.
- The reviewed sources also do not include a dedicated Blogger-specific error table on the pages used for this rewrite.

## Important usage notes
- Discovery lists both `PUT` and `PATCH` variants for posts and pages, so fireROUTE should preserve full-update vs partial-update semantics.
- `publish`, `revert`, `useTrash`, `view`, and comment-moderation routes are separate operations in the official API, not flags on a generic content endpoint.
- `blogs/byurl`, `posts/bypath`, and `posts/search` are distinct lookup surfaces and should not be collapsed into one generic finder.

## fireROUTE normalization notes
- Keep Blogger's blog/page/post/comment hierarchy explicit because path variables encode ownership and moderation scope.
- Preserve token-based pagination exactly with `pageToken` instead of inventing offset pagination.
- Expose moderation actions (`approve`, `spam`, `removecontent`) as first-class operations rather than overloading comment updates.
