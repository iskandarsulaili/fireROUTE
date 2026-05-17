# GitHub ReadMe Stats

## Provider metadata
- Category: `Open Source Projects`
- Provider slug: `github-readme-stats`
- Docs used manually:
  - `https://github.com/anuraghazra/github-readme-stats`
- Public hosted base used throughout the official README: `https://github-readme-stats.vercel.app`
- Primary response format: generated SVG cards served over HTTP with query-parameter customization
- Authentication model: none for public card rendering; self-hosted deployments may use a GitHub token for private data access
- Manually confirmed routes in this pass: `5`

## Authentication
From the official README:
- the public hosted instance does not require caller auth for normal card rendering URLs
- private GitHub statistics are not available from the public instance by default
- to include private stats, the README instructs users to self-host and provide their own GitHub Personal Access Token
- self-hosting guidance documents:
  - classic token scopes: `repo` and `read:user`
  - a fine-grained-token alternative with read-only repository scopes such as commit statuses, contents, issues, metadata, and pull requests
- the GitHub Actions setup section also documents using `GITHUB_TOKEN` for public stats and a PAT secret when private stats are needed

## Common request/response conventions
- Public base URL used in the official examples: `https://github-readme-stats.vercel.app`
- reviewed endpoints are all `GET`
- the service returns rendered card assets rather than JSON API envelopes in the published examples
- most customization happens through query parameters shared across routes
- shared/common options explicitly documented include:
  - `title_color`
  - `text_color`
  - `icon_color`
  - `border_color`
  - `bg_color`
  - `hide_border`
  - `theme`
  - `cache_seconds` - documented min `21600`, max `86400`
  - `locale`
  - `border_radius`
- official cache defaults documented in the README:
  - stats card: `24 hours`
  - top languages: `144 hours (6 days)`
  - pin card: `240 hours (10 days)`
  - gist card: `48 hours (2 days)`
  - WakaTime card: `24 hours`

## Manually confirmed endpoint set

### 1) GitHub stats card
- Method: `GET`
- Path: `/api`
- Full URL pattern: `https://github-readme-stats.vercel.app/api`
- Purpose: render a user's main GitHub stats card
- Required/primary query parameter confirmed in the official README:
  - `username` - GitHub username
- Additional route-specific query parameters explicitly documented:
  - `hide` - hide stats such as `stars`, `commits`, `prs`, `issues`, `contribs`
  - `show` - show additional stats such as `reviews`, `discussions_started`, `discussions_answered`, `prs_merged`, `prs_merged_percentage`
  - `show_icons` - enable icons
  - `commits_year` - count only commits from the specified year
  - `hide_title`
  - `card_width`
  - `hide_rank`
  - `rank_icon`
  - `include_all_commits`
  - `line_height`
  - `exclude_repo`
  - `custom_title`
  - `text_bold`
  - `disable_animations`
  - `ring_color`
  - `number_format`
  - `number_precision`
- Important usage notes from the official README:
  - public cards show public-repository stats by default
  - private stats require self-hosting with a GitHub token
  - the public Vercel instance is explicitly described as best-effort and potentially unreliable under rate limits and traffic spikes

### 2) Repository pin card
- Method: `GET`
- Path: `/api/pin`
- Full URL pattern: `https://github-readme-stats.vercel.app/api/pin`
- Purpose: render a pinned-repository card
- Query parameters explicitly documented in the official README:
  - `username` - repository owner username
  - `repo` - repository name
  - `show_owner` - include owner username on the card
  - `description_lines_count` - clamp description lines between `1` and `3`
- Important usage notes from the official README:
  - this feature exists to let profiles pin more than GitHub's normal six repositories
  - common options also apply here

### 3) Gist pin card
- Method: `GET`
- Path: `/api/gist`
- Full URL pattern: `https://github-readme-stats.vercel.app/api/gist`
- Purpose: render a gist card
- Query parameters explicitly documented in the official README:
  - `id` - gist ID
  - `show_owner` - include gist owner username on the card
- Important usage notes from the official README:
  - common options also apply here
  - the official example uses a direct gist ID in the query string rather than a path parameter

### 4) Top languages card
- Method: `GET`
- Path: `/api/top-langs`
- Full URL pattern: `https://github-readme-stats.vercel.app/api/top-langs`
- Purpose: render a user's most-used-languages card
- Required/primary query parameter confirmed in the official README:
  - `username` - GitHub username
- Additional route-specific query parameters explicitly documented:
  - `hide`
  - `hide_title`
  - `layout` - `normal`, `compact`, `donut`, `donut-vertical`, or `pie`
  - `card_width`
  - `langs_count` - integer between `1` and `20`
  - `exclude_repo`
  - `custom_title`
  - `disable_animations`
  - `hide_progress`
  - `size_weight`
  - `count_weight`
  - `stats_format` - percentages or bytes
- Important usage notes from the official README:
  - public cards only reflect public repositories unless self-hosted with a private token
  - the card reports language usage for the user's own non-fork repositories
  - the current public implementation only considers the first `100` repositories because of GitHub API limitations
  - `hide_progress=true` automatically switches behavior to the compact-style output without bars/percentages

### 5) WakaTime stats card
- Method: `GET`
- Path: `/api/wakatime`
- Full URL pattern: `https://github-readme-stats.vercel.app/api/wakatime`
- Purpose: render a coding-activity card from WakaTime-compatible profile data
- Primary query parameter confirmed in the official README:
  - `username` - WakaTime username
- Additional route-specific query parameters explicitly documented:
  - `hide`
  - `hide_title`
  - `card_width`
  - `line_height`
  - `hide_progress`
  - `custom_title`
  - `layout` - `default` or `compact`
  - `langs_count`
  - `api_domain` - custom API domain such as Hakatime or Wakapi
  - `display_format` - `time` or `percent`
  - `disable_animations`
- Important usage notes from the official README:
  - the README warns that only public WakaTime profiles currently work
  - it explicitly says both public-code-time and public-languages/editors/OS/categories settings must be enabled
  - newly created WakaTime accounts may take up to `24 hours` before data appears on the card

## Pagination
- none documented
- reviewed routes render single card resources and are configured through query parameters rather than paginated list responses

## Rate limits and caching
From the official README:
- the public Vercel instance is best-effort and can be unreliable because of rate limits and traffic spikes
- the README explicitly references GitHub API pressure and mentions the historical `5k requests per hour` limit as a practical concern for the shared public deployment
- caching is a first-class part of the design
- callers can manually set `cache_seconds` within the documented `21600` to `86400` bounds on supported routes
- self-hosted deployments can override caching with the `CACHE_SECONDS` environment variable

## Error and operational notes
- the reviewed README does not publish a structured JSON error schema
- the main operational advice is to self-host for reliability, fresher control over caching, and private-data support
- additional self-hosting environment variables documented in the README include:
  - `CACHE_SECONDS`
  - `WHITELIST`
  - `GIST_WHITELIST`
  - `EXCLUDE_REPO`
  - `FETCH_MULTI_PAGE_STARS`

## Important usage notes
- this is not a conventional JSON business-data API; it is a parameterized card-rendering service
- URI escaping matters for values such as custom titles and some language names; the README explicitly calls this out
- GitHub theme cannot be inferred server-side once cards are cached and re-served by GitHub, so the docs recommend URL/theme-tag workarounds and HTML `<picture>` usage for dynamic theming
- the public deployment is intentionally not the recommended production path for reliable usage

## Verification notes
This file was manually rebuilt from the official GitHub ReadMe Stats repository README using browser inspection.