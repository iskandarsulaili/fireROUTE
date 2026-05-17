# Transport for Denver, US

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-denver-us`
- Provider identified from the reviewed official pages as: `Regional Transportation District (RTD) Denver`
- Official pages reviewed manually in this pass:
  - assigned docs URL: `http://www.rtd-denver.com/gtfs-developer-guide.shtml`
  - official alternative page: `https://www.rtd-denver.com/developers`

## Manual review result
- Status for this pass: `manual_blocked`
- Confirmed route count for fireROUTE publication: `0`

## Verified findings from official pages
- The assigned RTD developer guide redirected to `https://www.rtd-denver.com/gtfs-developer-guide.shtml`.
- The assigned page loaded a Cloudflare interstitial with title `Attention Required! | Cloudflare`.
- The visible official page text says: `Sorry, you have been blocked` and `You are unable to access rtd-denver.com`.
- The same official block page explains RTD is using a security service to protect the site from online attacks.
- The official alternative page `https://www.rtd-denver.com/developers` produced the same Cloudflare block page in this pass.
- Because both official pages are blocked before documentation renders, no RTD route-level API contract was readable in this pass.

## fireROUTE publication fields
- Provider API base URL: not publicly confirmed from readable official RTD documentation in this pass.
- Endpoint paths: not publicly confirmed.
- HTTP methods: not publicly confirmed.
- Parameters or request bodies: not publicly confirmed.
- Authentication: not publicly confirmed.
- Rate limits: not publicly confirmed.
- Pagination: not publicly confirmed.
- Errors:
  - both reviewed official pages were blocked by Cloudflare before documentation became readable
- Response formats: not publicly confirmed.
- Important usage notes:
  - the indexed RTD documentation is currently inaccessible in this browser environment because of Cloudflare blocking
  - the official alternative page is blocked in the same way

## Why this provider remains blocked
- I manually retried the indexed RTD guide and an official RTD alternative page in this pass.
- Both official pages were blocked by Cloudflare before route-level documentation could be read.
- Without readable official documentation, fireROUTE cannot safely publish endpoint details, auth requirements, parameters, pagination rules, response formats, or a confirmed fine-grained route count, so this provider remains `manual_blocked`.

## Sources inspected
- `http://www.rtd-denver.com/gtfs-developer-guide.shtml`
- `https://www.rtd-denver.com/developers`
