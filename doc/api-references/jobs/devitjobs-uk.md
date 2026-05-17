# DevITjobs UK

## Provider metadata
- Category: `Jobs`
- Provider slug: `devitjobs-uk`
- Official pages checked:
  - `https://devitjobs.uk/job_feed.xml`
  - `https://devitjobs.uk/`
- Final observed destination for both pages during manual review: `https://devitjobs.jobcopilot.com/signup?utm_source=dot_uk_old`
- Manually confirmed route count: `0`

## Manual review result
The formerly listed XML feed and the main site now redirect to a JobCopilot signup flow rather than exposing public feed documentation or a machine-readable job-feed contract.

## Explicit blocker note
- I manually checked both the original feed URL and the main official site.
- Both redirected to a signup page with no public API/feed specification, no endpoint list, no auth model, and no response schema documentation.
- Because the provider no longer exposes public feed docs from these official entry points, I could not confidently document any live route.

## fireROUTE note
- Treat this provider as currently blocked for public-manual documentation until an official feed/API spec is again published or linked from the official site.
