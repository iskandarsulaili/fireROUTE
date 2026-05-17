# Drupal.org

## Provider metadata
- Category: `Open Source Projects`
- Provider slug: `drupal-org`
- Official docs/pages manually reviewed in this pass:
  - `https://www.drupal.org/drupalorg/docs/api`
  - `https://www.drupal.org/drupalorg/docs/apis/rest-and-other-apis`
  - `https://www.drupal.org/drupalorg/docs/apis/update-status-xml`
  - `https://api.drupal.org/`
- Confirmed API route count in this review: `20` concrete `GET` route templates
- Current access posture: public, read-only HTTP endpoints with no login or API key required on the reviewed pages

## What the official docs currently show
Drupal.org does expose a current public HTTP API surface. The earlier blocker state is no longer accurate in this browser session.

The reviewed official docs split the public route surface into three main families:
1. `api-d7` REST-style entity endpoints on `www.drupal.org`
2. project release-history XML endpoints on `updates.drupal.org`
3. contribution-record helper endpoints on `new.drupal.org`

The reviewed docs also make two important platform-wide points:
- only read access is allowed for the documented Drupal.org REST endpoints
- automation is allowed only if used respectfully: appropriate user agent, single-threaded access, and local caching where possible

## Base URLs and access model

| Surface | Base URL / host | Auth | Notes |
|---|---|---|---|
| Drupal.org REST entity API | `https://www.drupal.org/api-d7` | none | public read-only JSON / XML endpoints |
| Project maintainer helper | `https://www.drupal.org/project` | none | project-specific maintainer JSON |
| Release-history / update-status API | `https://updates.drupal.org/release-history` | none | XML feeds for current / legacy release history |
| Contribution-record helpers | `https://new.drupal.org` | none | helper endpoints over contribution-record data |

## Authentication
- No API key or OAuth flow is documented on the reviewed pages.
- The REST entity API is explicitly documented as read-only.
- Format negotiation for the `api-d7` REST endpoints requires either:
  - `Accept: application/json` or `Accept: application/xml`, or
  - a `.json` / `.xml` extension on the request path.

## Confirmed route inventory

### 1) Drupal.org REST entity API (`11` `GET` routes)

| Method | Path | Official purpose |
|---|---|---|
| `GET` | `/api-d7/node/{nid}.json` | fetch one node |
| `GET` | `/api-d7/node.json` | query node resources |
| `GET` | `/api-d7/node.xml` | query node resources in XML |
| `GET` | `/api-d7/comment.json` | query comment resources |
| `GET` | `/api-d7/comment.xml` | query comment resources in XML |
| `GET` | `/api-d7/user.json` | query user resources |
| `GET` | `/api-d7/user.xml` | query user resources in XML |
| `GET` | `/api-d7/file/{fid}.json` | fetch one file record |
| `GET` | `/project/{project_id}/maintainers.json` | fetch maintainers for a project |
| `GET` | `/api-d7/taxonomy_vocabulary.json` | query taxonomy vocabularies |
| `GET` | `/api-d7/taxonomy_term.json` | query taxonomy terms |

The reviewed docs explicitly say Drupal.org exposes these entity/resource types through RestWS:
- `node`
- `comment`
- `user`
- `file`
- `taxonomy_vocabulary`
- `taxonomy_term`

Important route-family notes from the docs:
- Drupal.org prepends `api-d7/` to these paths and explicitly warns that this prefix may be removed in the future.
- The docs show node, user, and comment query routes with `.json` / `.xml` variants.
- The docs only explicitly show a JSON example for specific file and node detail lookups in the reviewed pages.

### 2) Release-history / update-status XML API (`6` `GET` routes)
Base: `https://updates.drupal.org/release-history/{project}`

| Method | Path | Official purpose |
|---|---|---|
| `GET` | `/release-history/{project}/current` | current supported release-history XML |
| `GET` | `/release-history/{project}/all` | legacy all-release XML |
| `GET` | `/release-history/{project}/5.x` | legacy branch-specific XML |
| `GET` | `/release-history/{project}/6.x` | legacy branch-specific XML |
| `GET` | `/release-history/{project}/7.x` | legacy branch-specific XML |
| `GET` | `/release-history/{project}/8.x` | legacy branch-specific XML |

Confirmed from the official update-status XML page:
- responses are XML, not JSON
- the top-level payload contains `<project>` with metadata like title, short name, creator, type, supported branches, project status, and link
- `<releases>` contains per-release metadata including version, tag, release link, download link, files, checksums, sizes, security coverage, and core compatibility

### 3) Contribution-record helper API (`3` `GET` routes)
Base: `https://new.drupal.org`

| Method | Path | Official purpose |
|---|---|---|
| `GET` | `/contribution-records-by-user` | contribution records filtered by user |
| `GET` | `/contribution-records-by-organization` | contribution records filtered by organization |
| `GET` | `/contribution-records-by-organization-by-user` | contribution records filtered by organization + user |

The docs say contribution credit moved to its own `Contribution Record` content type and that these helper routes sit alongside underlying JSON:API endpoints.

## Parameters, filters, and query behavior

### Shared `api-d7` query controls
The REST docs explicitly document these meta parameters:
- `limit`
- `page`
- `sort`
- `direction`

The docs also show filter-style query parameters such as:
- `type`
- `field_status`
- `field_project`
- `field_issue_status`
- `field_issue_version`
- `field_issue_priority`
- `taxonomy_forums`
- `node` (for comment lookups)
- `vid`
- `vocabulary`
- membership and organization filters like `field_da_ind_membership[value][]` and `field_org_membership_status[value][]`

### Extra node metadata flags
The docs explicitly show these optional query args on node detail routes:
- `drupalorg_extra_credit=1`
- `related_mrs=1`

### Contribution-record helper parameters
The docs say these helper endpoints accept most of the following parameters:
- `username`
- `organization`
- `machine_name`
- `page`
- `months`
- `is_sa`
- `csv_export`

## Pagination, rate limits, and automation notes

### Pagination
The official docs contain two pagination-related statements that should both be preserved:
- one section says query endpoints return up to `100` resources, paged
- a later section says there is a hard-coded limit of `50`, and larger result sets require pagination

Because those two official statements conflict, integrators should treat pagination limits as documentation-inconsistent and test the exact endpoint behavior they rely on.

### Rate limits / usage restrictions
No numeric request-per-second or request-per-hour quota is published on the reviewed pages.
Instead, Drupal.org gives usage guidance:
- use an appropriate user agent string
- make requests from a single thread
- cache results locally whenever possible
- abuse will be blocked as needed

## Response-format and schema notes
- `api-d7` endpoints support JSON or XML.
- release-history endpoints return XML.
- contribution-record helper endpoints are documented as helper reads over contribution-record data; the reviewed page does not publish a formal schema table for every response field.
- the REST docs mention convenience additions beyond base Drupal entity output, including:
  - project `machine_name`
  - `sa_risk` on security-advisory nodes
  - optional issue credit metadata and related merge-request metadata

## Error notes
- The reviewed pages do not publish a formal error-body schema or numeric error-code table.
- The main operational warning is behavioral rather than schema-based: abusive automation may be blocked.
- The contribution-record helper docs warn that unbounded all-time requests may take longer or even time out if `months` is not supplied.

## Important usage notes
- The `api-d7` prefix is explicitly described as something that may be removed in the future.
- Only read access is documented for the public Drupal.org REST API.
- For issue-queue filtering, the docs publish important numeric mappings such as issue priority, issue status, and issue category values.
- Security advisories are split between newer `sa` content-type nodes and older forum-taxonomy based records.
- Many Drupal.org pages expose RSS feeds discoverable through alternate feed links, but the reviewed docs do not publish one fixed RSS route template for every page type.

## fireROUTE normalization notes
- Keep this provider marked `manually_documented` with the public Drupal.org HTTP route surface, not the PHP-code API reference on `api.drupal.org` alone.
- Prefer explicit concrete paths from the current Drupal.org docs over inferred generic RestWS routes that were not directly shown.
- Preserve the documentation inconsistency around pagination limits instead of smoothing it away.
- Revisit if Drupal.org removes or renames the `api-d7` prefix, because the docs explicitly warn that it may disappear in the future.
