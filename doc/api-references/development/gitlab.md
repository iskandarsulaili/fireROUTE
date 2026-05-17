# GitLab

## Provider metadata
- Category: `Development`
- Provider slug: `gitlab`
- Docs used manually:
  - `https://docs.gitlab.com/api/rest/`
  - `https://docs.gitlab.com/api/projects/`
  - `https://docs.gitlab.com/api/merge_requests/`
  - `https://docs.gitlab.com/api/repository_files/`
  - `REST API authentication` page reached from the official GitLab Docs sidebar
- Confirmed REST API root pattern: `https://{gitlab_host}/api/v4`
- Primary response format: JSON
- Secondary format note: the REST overview says some endpoints also support plain text
- Manually confirmed routes in this pass: `8`

## Authentication
GitLab's official authentication docs say most API requests require authentication, while a smaller set returns only public data without it.

Officially documented auth methods confirmed in this pass:
- OAuth 2.0 token via query parameter: `access_token=...`
- OAuth 2.0 token via header: `Authorization` header using Bearer auth
- Personal, project, and group access tokens
- Session cookie
- `CI_JOB_TOKEN` / job-token-based auth for specific endpoints only
- Administrator impersonation tokens
- Administrator `sudo`

Other official auth notes:
- Invalid or missing authentication returns `401` and the docs show a JSON body with `{"message":"401 Unauthorized"}`
- The `/projects/:id` endpoint is explicitly called out as a public-readable example when the project is public
- Deploy tokens cannot be used with the GitLab public API

## Common REST conventions
From the REST overview:
- Requests start with the GitLab instance hostname plus `/api/v4`
- The API uses standard HTTP methods
- JSON is the default response format for the REST API
- Request parameters may be sent via query string, form data, or JSON depending on the endpoint

## Manually confirmed endpoint set

### 1) List all projects
- Method: `GET`
- Path: `/projects`
- Full pattern: `https://{gitlab_host}/api/v4/projects`
- Purpose: list projects accessible to the current caller
- Auth note:
  - authenticated users see projects accessible to them
  - unauthenticated callers only get public projects and a limited subset of attributes
- Pagination note from the endpoint docs:
  - offset pagination works up to `50,000` projects
  - keyset pagination is the documented option beyond that threshold
- Confirmed query attributes include:
  - `archived`
  - `id_after`
  - `id_before`
  - `imported`
  - `include_hidden`
  - `include_pending_delete`
  - `last_activity_after`
  - `last_activity_before`
  - `membership`
  - `min_access_level`
  - `order_by`
  - `owned`
  - `repository_storage`
  - `search_namespaces`
  - `search`
  - `simple`
  - `sort`
  - `starred`
  - `statistics`
  - `topic_id`
- Date fields are documented as ISO 8601

### 2) Retrieve a project
- Method: `GET`
- Path: `/projects/:id`
- Full pattern: `https://{gitlab_host}/api/v4/projects/:id`
- Purpose: retrieve one project by numeric ID or URL-encoded path
- Path/query attributes confirmed in docs:
  - `id` - required; integer or URL-encoded path
  - `license`
  - `statistics`
  - `with_custom_attributes`
- Official note:
  - this endpoint can be accessed without authentication when the project is publicly accessible
- Confirmed response details shown in docs include:
  - `id`, `description`, `name`, `name_with_namespace`, `path`, `path_with_namespace`, `default_branch`, `topics`, `ssh_url_to_repo`, `http_url_to_repo`, `web_url`, `readme_url`, `star_count`, `visibility`
  - `_links.self`, `_links.issues`, `_links.merge_requests`

### 3) Create a project
- Method: `POST`
- Path: `/projects`
- Full pattern: `https://{gitlab_host}/api/v4/projects`
- Purpose: create a new project owned by the authenticated user
- Required attributes:
  - `name` or `path` (one is required if the other is not provided)
- Frequently used optional attributes confirmed in docs:
  - `description`
  - `default_branch`
  - `initialize_with_readme`
  - `import_url`
  - `visibility`
  - `topics`
  - `ci_config_path`
  - `build_timeout`
  - `auto_devops_enabled`
  - `container_expiration_policy_attributes`
- Important creation notes from the page:
  - if `import_url` is used, `initialize_with_readme=true` must not also be set
  - if a fully qualified default branch ref is provided, GitLab strips `refs/heads/`

### 4) List project merge requests
- Method: `GET`
- Path: `/projects/:id/merge_requests`
- Full pattern: `https://{gitlab_host}/api/v4/projects/:id/merge_requests`
- Purpose: list merge requests for a specific project
- Confirmed query attributes include:
  - `iids[]`
  - `approved_by_ids[]`
  - `approved_by_usernames[]`
  - `approver_ids[]`
  - `assignee_id`
  - `assignee_username[]`
  - `author_id`
  - `author_username`
  - `created_after`
  - `created_before`
  - `deployed_after`
  - `deployed_before`
  - `environment`
  - `in`
  - `labels`
  - `merge_user_id`
  - `merge_user_username`
  - `milestone`
  - `my_reaction_emoji`
  - `not`
  - `order_by`
  - `scope`
  - `search`
  - `sort`
  - `state`
  - `updated_after`
  - `updated_before`
  - `view`
  - `with_labels_details`
  - pagination fields from the REST overview (`page`, `per_page`) also apply
- Date/time values are documented as ISO 8601

### 5) Create a merge request
- Method: `POST`
- Path: `/projects/:id/merge_requests`
- Full pattern: `https://{gitlab_host}/api/v4/projects/:id/merge_requests`
- Purpose: create a new merge request
- Required attributes:
  - `id`
  - `source_branch`
  - `target_branch`
  - `title`
- Confirmed optional attributes include:
  - `allow_collaboration`
  - `allow_maintainer_to_push`
  - `assignee_id`
  - `assignee_ids`
  - `description`
  - `labels`
  - `merge_after`
  - `milestone_id`
  - `remove_source_branch`
  - `reviewer_ids`
  - `squash`
  - `target_project_id`
- Response example fields shown in docs include:
  - `id`, `iid`, `project_id`, `title`, `description`, `state`, `created_at`, `updated_at`, `target_branch`, `source_branch`

### 6) Retrieve a repository file
- Method: `GET`
- Path: `/projects/:id/repository/files/:file_path`
- Full pattern: `https://{gitlab_host}/api/v4/projects/:id/repository/files/:file_path?ref=...`
- Purpose: retrieve file metadata and Base64-encoded content
- Required attributes:
  - `id`
  - `file_path` - URL-encoded full path such as `lib%2Fclass%2Erb`
  - `ref` - branch, tag, commit, or `HEAD` for the default branch
- Official notes:
  - public repositories can be accessed without authentication
  - blobs larger than 10 MB are rate-limited to `5 requests/minute`
- Confirmed response fields include:
  - `blob_id`, `commit_id`, `content`, `content_sha256`, `encoding`, `execute_filemode`, `file_name`, `file_path`, `last_commit_id`, `ref`, `size`

### 7) Retrieve repository file metadata only
- Method: `HEAD`
- Path: `/projects/:id/repository/files/:file_path`
- Purpose: return metadata only in response headers instead of the JSON file body
- Confirmed metadata headers documented on the page:
  - `X-Gitlab-Blob-Id`
  - `X-Gitlab-Commit-Id`
  - `X-Gitlab-Content-Sha256`
  - `X-Gitlab-Encoding`
  - `X-Gitlab-File-Name`
  - `X-Gitlab-File-Path`
  - `X-Gitlab-Last-Commit-Id`
  - `X-Gitlab-Ref`
  - `X-Gitlab-Size`
  - `X-Gitlab-Execute-Filemode`

### 8) Create a repository file
- Method: `POST`
- Path: `/projects/:id/repository/files/:file_path`
- Full pattern: `https://{gitlab_host}/api/v4/projects/:id/repository/files/:file_path`
- Purpose: create a file in a repository
- Required body attributes:
  - `branch`
  - `commit_message`
  - `content`
  - `file_path`
  - `id`
- Confirmed optional attributes:
  - `author_email`
  - `author_name`
  - `encoding` - can be changed to `base64`
  - `execute_filemode`
  - `start_branch`
- Endpoint-specific limits from the docs:
  - requests larger than the default `300 MB` limit are rejected
  - requests over `20 MB` are rate-limited to `3 requests every 30 seconds`
- Confirmed success response:
  - `201 Created`
  - example response fields include `file_path` and `branch`

## Pagination
From the official REST overview:
- GitLab supports both offset-based and keyset-based pagination
- Offset pagination uses:
  - `page` - default `1`
  - `per_page` - default `20`, max `100`
- GitLab recommends keyset pagination for large collections when available
- Keyset pagination uses:
  - `pagination=keyset`
  - `order_by` - required
  - `sort` - required (`asc` or `desc`)
  - `per_page`
- Link headers are returned with `rel="prev"`, `rel="next"`, `rel="first"`, `rel="last"`
- Additional pagination headers documented:
  - `x-next-page`
  - `x-page`
  - `x-per-page`
  - `x-prev-page`
  - `x-total`
  - `x-total-pages`
- The docs note that some pagination headers may be absent on GitLab.com

## Rate limits
Official GitLab docs do not give one universal REST number for all endpoints on the REST overview page; instead they say:
- REST API requests are subject to instance and GitLab.com-specific rate limit settings
- some endpoints have their own resource-specific limits
- repository file endpoints explicitly document blob-size and request-size/rate limits, captured above

## Error and response notes
- Missing or invalid auth: `401 Unauthorized` JSON body
- Route-specific pages rely on standard HTTP status codes such as `200 OK` and `201 Created`
- The REST overview says status codes should be used as the first troubleshooting signal

## Important usage notes
- Project IDs can frequently be supplied either as numeric IDs or URL-encoded full paths
- GitLab list endpoints are inconsistent in total size, so using server-provided Link headers is safer than generating page URLs manually
- Repository file content is Base64-encoded in the JSON retrieval endpoint

## Verification notes
This file was manually rebuilt from the official GitLab docs with browser inspection, replacing the earlier low-fidelity autogenerated summary.
