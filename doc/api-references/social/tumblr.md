# Tumblr

## Provider metadata
- Category: `Social`
- Provider slug: `tumblr`
- Official docs pages used:
  - `https://www.tumblr.com/docs/en/api/v2`
  - `https://www.tumblr.com/developers`
  - `https://www.tumblr.com/docs/en/api_agreement`
- Main API base URL: `https://api.tumblr.com/v2`
- Auth model: mixed public-read API key support plus OAuth bearer-token access for user and write operations
- Supported request methods confirmed from the reviewed official pages: `GET`, `POST`, `PUT`, `DELETE`
- Response format documented: JSON
- Manually confirmed route count: `20`

## Authentication
- The reviewed official Tumblr API v2 page shows both `api_key` usage for public read requests and OAuth/bearer-token signals for authenticated operations.
- User and write endpoints should be modeled as authenticated operations.
- Public blog-read endpoints can use the documented `api_key` query parameter.

## Canonical endpoints

### Blog endpoints
#### 1) Get blog information
- Method: `GET`
- Path: `/blog/{blog-identifier}/`
- Purpose: return high-level blog metadata.

#### 2) List blog posts
- Method: `GET`
- Path: `/blog/{blog-identifier}/posts`
- Purpose: list posts for a blog.

Common query parameters explicitly seen in the reviewed official examples:
- `id` - retrieve a specific post
- `tag` - filter posts by tag
- `notes_info` - include note metadata
- `before` - fetch posts before a timestamp/cursor
- `offset` - offset-based paging on some list examples
- `api_key` - public-read credential

#### 3) Check which blogs follow a blog
- Method: `GET`
- Path: `/blog/{blog-identifier}/followed_by`
- Purpose: query followers/follow relationships for a blog.

Query parameters explicitly seen in the reviewed material:
- `query` - search/filter string

#### 4) Get blog notes
- Method: `GET`
- Path: `/blog/{blog-identifier}/notes`
- Purpose: retrieve note activity for a post.

Query parameters explicitly seen in the reviewed material:
- `id` - post identifier
- `mode` - note retrieval mode
- `before_timestamp` - notes pagination cursor

### Community endpoints
#### 5) List communities
- Method: `GET`
- Path: `/communities`
- Purpose: list available communities.

#### 6) Get a community
- Method: `GET`
- Path: `/communities/{community-handle}`
- Purpose: fetch one community.

#### 7) Update a community
- Method: `PUT`
- Path: `/communities/{community-handle}`
- Purpose: update a community resource.

#### 8) List community invitations
- Method: `GET`
- Path: `/communities/{community-handle}/invitations`
- Purpose: view invitation records.

#### 9) Create or update community invitations
- Method: `PUT`
- Path: `/communities/{community-handle}/invitations`
- Purpose: manage invitation state for a community.

#### 10) Delete a specific invitation
- Method: `DELETE`
- Path: `/communities/{community-handle}/invitations/{blog-identifier}`
- Purpose: remove an invitation for a blog.

#### 11) List community members
- Method: `GET`
- Path: `/communities/{community-handle}/members`
- Purpose: list members in a community.

#### 12) Add or update community members
- Method: `PUT`
- Path: `/communities/{community-handle}/members`
- Purpose: manage member state at the collection level.

#### 13) Remove a specific member
- Method: `DELETE`
- Path: `/communities/{community-handle}/members/{blog-identifier}`
- Purpose: remove a member from a community.

#### 14) Get community timeline
- Method: `GET`
- Path: `/communities/{community-handle}/timeline`
- Purpose: read the timeline/feed for a community.

### OAuth endpoints
#### 15) OAuth2 exchange endpoint
- Method: `GET`
- Path: `/oauth2/exchange`
- Purpose: token exchange endpoint documented on the Tumblr API v2 page.

#### 16) OAuth2 token endpoint
- Method: `GET`
- Path: `/oauth2/token`
- Purpose: token issuance/refresh endpoint documented on the Tumblr API v2 page.

### User filtering endpoints
#### 17) List or inspect filtered content
- Method: `GET`
- Path: `/user/filtered_content`
- Purpose: review filtered-content settings for the authenticated user.

Query parameters explicitly seen in the reviewed material:
- `filtered_content` - filtered-content selector/value

#### 18) Add filtered content
- Method: `POST`
- Path: `/user/filtered_content`
- Purpose: create filtered-content rules.

#### 19) Add filtered tags
- Method: `POST`
- Path: `/user/filtered_tags`
- Purpose: create filtered-tag rules.

#### 20) Delete a filtered tag
- Method: `DELETE`
- Path: `/user/filtered_tags/{tag}`
- Purpose: remove one filtered tag entry.

## Pagination, errors, and format notes
- The reviewed official Tumblr examples show multiple paging styles, including `before`, `before_timestamp`, `offset`, and `limit`.
- The reviewed pages use JSON response examples.
- The captured official docs did not expose a stable numeric global rate limit.
- The captured official docs did not provide a dedicated error-code matrix in the reviewed route set.

## Important usage notes
- Tumblr mixes public-read and authenticated operations in one API surface; fireROUTE should not assume one auth scheme fits every route.
- Keep path placeholders provider-specific: `blog-identifier`, `community-handle`, and user-supplied filtered-tag values are part of the documented route shapes.
- The route set here is intentionally limited to the operations that were clearly evidenced by the reviewed official Tumblr API v2 page content already captured in this workspace.
