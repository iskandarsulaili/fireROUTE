# GitGuardian

## Provider metadata
- Category: `Security`
- Provider slug: `gitguardian`
- Docs used manually:
  - `https://docs.gitguardian.com/api-docs/home`
  - `https://docs.gitguardian.com/api-docs/authentication`
  - `https://docs.gitguardian.com/api-docs/usage-and-quotas`
  - `https://docs.gitguardian.com/api-docs/pagination`
  - `https://api.gitguardian.com/docs`
  - `https://api.gitguardian.com/doc` -> legacy index URL currently returns `404`; the active official API reference is now at `/docs`
- Confirmed API base URLs:
  - `https://api.gitguardian.com/v1`
  - `https://api.eu1.gitguardian.com/v1`
- Confirmed self-hosted base URL pattern from the official docs:
  - `https://dashboard.gitguardian.<your-domain>/exposed/v1`
- Authentication model confirmed in this pass: `Authorization: Token {API_KEY}` using either a service account token or a personal access token
- Primary request/response format: JSON over HTTPS
- Timestamp format note from the official docs: ISO-8601
- Manually confirmed routes in this pass: `166`

## Authentication
- The official authentication page says the GitGuardian API uses API keys.
- The reviewed docs describe two supported API-key types:
  - service accounts
  - personal access tokens
- The official authentication scheme is header-based:
  - `Authorization: Token ${TOKEN}`
- Official example from the docs:
  - `curl -H "Authorization: Token ${TOKEN}" https://api.gitguardian.com/v1/health`
- The official auth page also documents scope families including incidents, sources, honeytokens, members, teams, api_tokens, audit_logs, ip_allowlist, custom_tags, secrets, and NHI-related scopes.

## Rate limits and quotas
From the official `Usage and quotas` page:
- quotas are consumed only by scan-scope API calls
- `/scan` consumes `1` quota per request and scans one document
- `/multiscan` consumes `1` quota per request and can scan up to `20` documents
- scan quota usage is based on request count, not content size
- quotas use a rolling month, not a calendar month
- quota is enforced at the workspace level, not per individual API key
- plan-level scan quotas published on the reviewed docs page:
  - Free: `10,000 calls/month`
  - Business: `100,000 calls/month`
  - Enterprise: `Unlimited`
- published API rate limits from the same page:
  - Personal access token / Free: `50 requests/minute`
  - Personal access token / Business: `200 requests/minute`
  - Personal access token / Enterprise: `2000 requests/minute`
  - Service account / Business: `1000 requests/minute`
  - Service account / Enterprise: `10000 requests/minute`
  - Service accounts are not available on the Free plan
- the same page says self-hosted instances do not apply API rate limiting by default

## Pagination
From the official pagination page:
- GitGuardian uses cursor-based pagination
- the first request returns the first page of results
- subsequent pages are discovered through the HTTP `Link` header using `rel="next"`
- when no `Link` header is present, there is no next page
- collection routes commonly use:
  - `cursor`
  - `per_page`
- the audit-log route explicitly documents `per_page` range `1..100` with default `20`

## Error handling and format notes
- The reviewed docs say data is sent and received as JSON by default.
- Route pages reviewed in the official reference commonly document:
  - `400` invalid data
  - `401` invalid API key
  - `403` permission denied or quota limit reached depending on route
  - `429` rate limit exceeded (documented on the usage-and-quotas page)
  - `503` API under maintenance
- Scan endpoints documented in this pass explicitly use `403` for `Quota limit reached`.
- The docs state all returned timestamps are ISO-8601 compliant.

## Important usage notes
- The catalog's old docs URL `/doc` is obsolete; the current official interactive API reference is `/docs`.
- The scan endpoints are documented as stateless: scanned documents and found secrets are not stored when using the scan API, though GitGuardian stores some metadata for quota/accounting purposes.
- `/v1/multiscan` is limited to `20` documents per request, and the reviewed docs say individual documents should not exceed `1MB`.
- `/v1/scan/create-incidents` is explicitly marked beta in the reviewed API reference.
- For self-hosted deployments, the official docs say API paths move under `/exposed/v1` on the dashboard host.

## Confirmed route inventory
The official Redoc API reference at `https://api.gitguardian.com/docs` exposed `166` route/method combinations during this manual review.

### Audit logs
- `GET /v1/audit_logs`
- `GET /v1/audit_logs/event_names`
- Audit-log query parameters explicitly documented on the reviewed route page:
  - `cursor`
  - `per_page`
  - `date_before`
  - `date_after`
  - `event_name`
  - `member_id`
  - `member_name`
  - `member_email`
  - `api_token_id`
  - `ip_address`

### Custom tags management
- `GET /v1/custom_tags`
- `POST /v1/custom_tags`
- `PATCH /v1/custom_tags`
- `DELETE /v1/custom_tags`
- `GET /v1/custom_tags/{custom_tag_id}`
- `PUT /v1/custom_tags/{custom_tag_id}`
- `PATCH /v1/custom_tags/{custom_tag_id}`
- `DELETE /v1/custom_tags/{custom_tag_id}`

### Health checks management
- `GET /v1/health-checks`
- `GET /v1/health-checks/{type}/{instance_id}`
- `POST /v1/health-checks/{type}/{instance_id}/trigger`

### Honeytokens management
- `GET /v1/honeytokens`
- `POST /v1/honeytokens`
- `POST /v1/honeytokens/with-context`
- `GET /v1/honeytokens/{honeytoken_id}`
- `PATCH /v1/honeytokens/{honeytoken_id}`
- `POST /v1/honeytokens/{honeytoken_id}/reset`
- `POST /v1/honeytokens/{honeytoken_id}/revoke`
- `POST /v1/honeytokens/prefixes`

### Honeytoken events, notes, and sources
- `GET /v1/honeytokens_events`
- `GET /v1/honeytokens/{honeytoken_id}/notes`
- `POST /v1/honeytokens/{honeytoken_id}/notes`
- `PATCH /v1/honeytokens/{honeytoken_id}/notes/{note_id}`
- `DELETE /v1/honeytokens/{honeytoken_id}/notes/{note_id}`
- `GET /v1/honeytokens/{honeytoken_id}/sources`

### IP allowlist and IP addresses
- `GET /v1/ip-allowlist`
- `POST /v1/ip-allowlist`
- `GET /v1/ip-allowlist/{ip_allowlist_rule_id}`
- `PATCH /v1/ip-allowlist/{ip_allowlist_rule_id}`
- `DELETE /v1/ip-allowlist/{ip_allowlist_rule_id}`
- `GET /v1/ips`

### Internal secret incidents and related resources
- `GET /v1/incidents/secrets`
- `GET /v1/incidents/secrets/{incident_id}`
- `PATCH /v1/incidents/secrets/{incident_id}`
- `GET /v1/incidents/secrets/{incident_id}/leaks`
- `POST /v1/incidents/secrets/{incident_id}/assign`
- `POST /v1/incidents/secrets/{incident_id}/unassign`
- `POST /v1/incidents/secrets/{incident_id}/resolve`
- `POST /v1/incidents/secrets/{incident_id}/ignore`
- `POST /v1/incidents/secrets/{incident_id}/reopen`
- `POST /v1/incidents/secrets/{incident_id}/share`
- `POST /v1/incidents/secrets/{incident_id}/unshare`
- `POST /v1/incidents/secrets/{incident_id}/grant_access`
- `POST /v1/incidents/secrets/{incident_id}/revoke_access`
- `GET /v1/incidents/secrets/{incident_id}/members`
- `GET /v1/incidents/secrets/{incident_id}/teams`
- `GET /v1/incidents/secrets/{incident_id}/invitations`
- `GET /v1/incidents/secrets/{incident_id}/impacted_perimeter`
- `GET /v1/incidents/secrets/{incident_id}/vaults`
- `GET /v1/secret-incidents/{incident_id}/members`
- `GET /v1/secret-incidents/{incident_id}/teams`
- `GET /v1/secret-incidents/{incident_id}/invitations`
- `GET /v1/secrets/{secret_id}`
- `GET /v1/sources/{source_id}/incidents/secrets`
- `GET /v1/teams/{team_id}/incidents/secrets`
- `GET /v1/occurrences/secrets`
- `GET /v1/incidents/secrets/{incident_id}/notes`
- `POST /v1/incidents/secrets/{incident_id}/notes`
- `PATCH /v1/incidents/secrets/{incident_id}/notes/{note_id}`
- `DELETE /v1/incidents/secrets/{incident_id}/notes/{note_id}`

### Public secret incidents and related resources
- `GET /v1/public-incidents/secrets`
- `GET /v1/public-incidents/secrets/{incident_id}`
- `POST /v1/public-incidents/secrets/{incident_id}/resolve`
- `POST /v1/public-incidents/secrets/{incident_id}/ignore`
- `POST /v1/public-incidents/secrets/{incident_id}/reopen`
- `POST /v1/public-incidents/secrets/{incident_id}/assign`
- `POST /v1/public-incidents/secrets/{incident_id}/unassign`
- `POST /v1/public-incidents/secrets/{incident_id}/share`
- `POST /v1/public-incidents/secrets/{incident_id}/unshare`
- `POST /v1/public-incidents/secrets/{incident_id}/set_severity`
- `POST /v1/public-incidents/secrets/{incident_id}/set_custom_tags`
- `GET /v1/public-incidents/secrets/{incident_id}/vaults`
- `GET /v1/public-incidents/secrets/{incident_id}/notes`
- `POST /v1/public-incidents/secrets/{incident_id}/notes`
- `PATCH /v1/public-incidents/secrets/{incident_id}/notes/{note_id}`
- `DELETE /v1/public-incidents/secrets/{incident_id}/notes/{note_id}`
- `GET /v1/public-incidents/secrets/{incident_id}/occurrences`
- `GET /v1/public-incidents/secrets/{incident_id}/occurrences/{occurrence_id}`

### Other / health
- `GET /v1/health`
- Official usage note: the auth docs recommend this route for checking token validity.

### Internal perimeter management
- `GET /v1/sources`
- `GET /v1/sources/{source_id}`
- `PATCH /v1/sources/{source_id}`
- `POST /v1/sources/scans`
- `GET /v1/sources/custom-sources`
- `POST /v1/sources/custom-sources`
- `GET /v1/sources/custom-sources/{custom_source_id}`
- `PATCH /v1/sources/custom-sources/{custom_source_id}`
- `DELETE /v1/sources/custom-sources/{custom_source_id}`

### Public perimeter management
- `GET /v1/public-perimeter/developers`

### SCIM users
- `POST /v1/scim/v2/Users`
- `GET /v1/scim/v2/Users`
- `GET /v1/scim/v2/Users/{id}`
- `PUT /v1/scim/v2/Users/{id}`
- `PATCH /v1/scim/v2/Users/{id}`
- `DELETE /v1/scim/v2/Users/{id}`

### SCIM groups
- `GET /v1/scim/v2/Groups`
- `POST /v1/scim/v2/Groups`
- `GET /v1/scim/v2/Groups/{id}`
- `PUT /v1/scim/v2/Groups/{id}`
- `PATCH /v1/scim/v2/Groups/{id}`
- `DELETE /v1/scim/v2/Groups/{id}`

### SCIM metadata
- `GET /v1/scim/v2/ServiceProviderConfig`
- `GET /v1/scim/v2/ResourceTypes`
- `GET /v1/scim/v2/ResourceTypes/{name}`
- `GET /v1/scim/v2/Schemas`
- `GET /v1/scim/v2/Schemas/{name}`

### Secrets scanning and detector metadata
- `POST /v1/scan`
- `POST /v1/multiscan`
- `POST /v1/scan/create-incidents`
- `GET /v1/secret_detectors`
- `GET /v1/secret_detectors/{detector_name}`
- `GET /v1/quotas`
- Scan request-body fields explicitly documented on the reviewed `/scan` and `/multiscan` pages:
  - `filename`
  - `document`

### Severity rules
- `GET /v1/severity-rules`

### Team management
- `GET /v1/teams`
- `POST /v1/teams`
- `GET /v1/teams/{team_id}`
- `DELETE /v1/teams/{team_id}`
- `PATCH /v1/teams/{team_id}`
- `GET /v1/teams/{team_id}/{resource_type}/{resource_id}`
- `PUT /v1/teams/{team_id}/{resource_type}/{resource_id}`
- `DELETE /v1/teams/{team_id}/{resource_type}/{resource_id}`
- `GET /v1/teams/{team_id}/secret-incidents`
- `GET /v1/teams/{team_id}/team_invitations`
- `POST /v1/teams/{team_id}/team_invitations`
- `PATCH /v1/teams/{team_id}/team_invitations/{team_invitation_id}`
- `DELETE /v1/teams/{team_id}/team_invitations/{team_invitation_id}`
- `GET /v1/teams/{team_id}/team_memberships`
- `POST /v1/teams/{team_id}/team_memberships`
- `PATCH /v1/teams/{team_id}/team_memberships/{team_membership_id}`
- `DELETE /v1/teams/{team_id}/team_memberships/{team_membership_id}`
- `GET /v1/teams/{team_id}/team_requests`
- `POST /v1/teams/{team_id}/team_requests`
- `DELETE /v1/teams/{team_id}/team_requests/{team_request_id}`
- `POST /v1/teams/{team_id}/team_requests/{team_request_id}/accept`
- `GET /v1/members/{member_id}/team_requests`
- `GET /v1/teams/{team_id}/sources`
- `POST /v1/teams/{team_id}/sources`

### Tokens management
- `GET /v1/api_tokens/self`
- `DELETE /v1/api_tokens/self`
- `GET /v1/api_tokens`
- `GET /v1/api_tokens/{token_id}`
- `DELETE /v1/api_tokens/{token_id}`
- `POST /v1/auth/jwt`

### User management: members
- `GET /v1/members`
- `GET /v1/members/{member_id}`
- `DELETE /v1/members/{member_id}`
- `PATCH /v1/members/{member_id}`
- `GET /v1/members/{member_id}/teams`
- `GET /v1/members/{member_id}/{resource_type}/{resource_id}`
- `PUT /v1/members/{member_id}/{resource_type}/{resource_id}`
- `DELETE /v1/members/{member_id}/{resource_type}/{resource_id}`
- `GET /v1/members/{member_id}/secret-incidents`
- `GET /v1/members/{member_id}/email_notifications`
- `PATCH /v1/members/{member_id}/email_notifications`
- `GET /v1/members/{member_id}/team_memberships`

### User management: invitations
- `GET /v1/invitations`
- `POST /v1/invitations`
- `GET /v1/invitations/{invitation_id}`
- `DELETE /v1/invitations/{invitation_id}`
- `POST /v1/invitations/{invitation_id}/resend`
- `GET /v1/invitations/{invitation_id}/{resource_type}/{resource_id}`
- `PUT /v1/invitations/{invitation_id}/{resource_type}/{resource_id}`
- `DELETE /v1/invitations/{invitation_id}/{resource_type}/{resource_id}`
- `GET /v1/invitations/{invitation_id}/secret-incidents`

## Verification notes
- The legacy catalog URL `https://api.gitguardian.com/doc` returned a JSON `404` during this review.
- The current official docs site at `https://docs.gitguardian.com/api-docs/...` and the current official Redoc reference at `https://api.gitguardian.com/docs` both loaded successfully in this environment.
- The route count, base URLs, auth scheme, quota/rate-limit details, pagination model, and route inventory in this file were rebuilt from those current official pages.