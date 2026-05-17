# Open Skills

## Provider metadata
- Category: `Jobs`
- Provider slug: `open-skills`
- Official docs pages used:
  - `https://github.com/workforce-data-initiative/skills-api/wiki/API-Overview`
  - official references listed from that page:
    - `http://api.dataatwork.org/v1/`
    - `http://api.dataatwork.org/v1/spec/skills-api.json`
    - `http://api.dataatwork.org/v1/spec/`
- Current documented base URL: `http://api.dataatwork.org/v1/`
- Auth model: no auth required in the documented version
- Response format: JSON only
- Manually confirmed route count: `14`

## API-wide notes
- The wiki explicitly says the current version only supports JSON requests and responses.
- The wiki explicitly says no user auth is required for the current version.
- Versioning is documented three ways:
  1. path-based versioning (`/v1/...`)
  2. custom `api-version` header
  3. media-type versioning via `Accept: application/vnd.openskills.v1+json`
- The same wiki notes that only the first method was reliably active for testing.

## Canonical endpoints
### Jobs
1. `GET /jobs/autocomplete`
   - Purpose: autocomplete job titles.
   - Query patterns shown: `begins_with`, `contains`, `ends_with`.

2. `GET /jobs/normalize`
   - Purpose: normalize an entered job title to canonical job titles.
   - Query parameter shown: `job_title`.

3. `GET /jobs/{onet_soc_code}`
   - Purpose: retrieve canonical job data by O*NET SOC code.

4. `GET /jobs/{uuid}/related_skills`
   - Purpose: get associated skills for a job UUID.

5. `GET /jobs/{uuid}/related_jobs`
   - Purpose: get associated jobs for a job UUID.

6. `GET /jobs/{uuid}`
   - Purpose: get job details by job UUID.

7. `GET /jobs`
   - Purpose: retrieve all jobs.

### Skills
8. `GET /skills/autocomplete`
   - Purpose: autocomplete skill names.
   - Query patterns shown: `begins_with`, `contains`, `ends_with`.

9. `GET /skills/normalize`
   - Purpose: normalize a skill name.
   - Query parameter shown: `skill_name`.

10. `GET /skills/{onet_soc_code}`
    - Purpose: get normalized skill UUIDs associated with a skill O*NET code.

11. `GET /skills/{uuid}/related_jobs`
    - Purpose: get jobs associated with a skill UUID.

12. `GET /skills/{uuid}/related_skills`
    - Purpose: get skills associated with a skill UUID.

13. `GET /skills/{uuid}`
    - Purpose: retrieve one skill's name/frequency by skill UUID.

14. `GET /skills`
    - Purpose: retrieve all skills.

## Query and parameter notes
### Autocomplete endpoints
- `begins_with`
- `contains`
- `ends_with`

### Normalization endpoints
- `/jobs/normalize` uses `job_title`
- `/skills/normalize` uses `skill_name`

### Path parameters
- `{onet_soc_code}` is used on both `/jobs/{onet_soc_code}` and `/skills/{onet_soc_code}`
- `{uuid}` is used across job and skill relationship/detail endpoints

## Response and schema notes
### Common job fields seen in the docs
- `uuid`
- `onet_soc_code`
- `title`
- `description`
- `related_job_titles`
- `unusual_job_titles`

### Common skill fields seen in the docs
- `uuid`
- `skill_name` or `name`
- `count`
- `skills[]`

### Relationship response patterns
- `/jobs/{uuid}/related_skills` returns `skills[]` with `skill_uuid`
- `/jobs/{uuid}/related_jobs` returns `related_job_titles[]`
- `/skills/{uuid}/related_jobs` returns `jobs[]` with `job_uuid`
- `/skills/{uuid}/related_skills` returns `skills[]` with both `skill_uuid` and `skill_name`

## Error notes
The wiki repeatedly documents these statuses across endpoints:
- `200` success
- `400` bad request / incorrect parameter
- `404` not found

Not every endpoint explicitly repeats all three, but these are the documented patterns on the manual wiki page.

## Pagination / scale notes
- The docs explicitly warn that `GET /skills` is a huge collection and may take a while to return.
- The wiki says pagination still needed to be added in future sprints, so consumers should treat full-collection calls cautiously.

## fireROUTE normalization notes
- The provider is an unauthenticated taxonomy/normalization API rather than a vacancy board.
- The route surface is symmetrical across `/jobs` and `/skills`, which makes it a good fit for grouped normalization/relationship capabilities.
- Some docs use placeholder angle-bracket path forms such as `/jobs/<uuid>`; those have been normalized here to `{uuid}`.
