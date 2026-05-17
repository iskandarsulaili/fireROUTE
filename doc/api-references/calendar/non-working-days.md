# Non-Working Days

## Provider metadata
- Category: `Calendar`
- Provider slug: `non-working-days`
- Official docs used manually:
  - `https://github.com/gadael/icsdb`
  - `https://github.com/gadael/icsdb/tree/master/build`
- Confirmed source/download bases in this pass:
  - `https://github.com/gadael/icsdb`
  - `https://raw.githubusercontent.com/gadael/icsdb/master/build`
- Primary response/content types confirmed in this pass: GitHub HTML for docs pages, ICS calendar files for published build artifacts
- Authentication model confirmed from the reviewed official materials: none
- Manually confirmed routes in this pass: `0`

## Authentication
- The reviewed official materials do not mention API keys, OAuth, bearer tokens, signed URLs, or any project-specific authentication.
- Published calendar assets are exposed as public GitHub/raw files.

## Confirmed delivery model and blocker
- The repository README describes the project as an "Open repository of static calendar ICS files".
- The README explicitly instructs consumers to use the raw GitHub link and says that only files in the `build` subfolder should be used.
- The reviewed official materials expose static downloadable ICS assets such as:
  - `https://raw.githubusercontent.com/gadael/icsdb/master/build/en-US/belgium-nonworkingdays.ics`
  - `https://raw.githubusercontent.com/gadael/icsdb/master/build/fr-FR/france-nonworkingdays.ics`
- The build tree is organized by locale (`en-US`, `fr-FR`) and then by country/region-specific `.ics` filenames.
- No parameterized REST endpoints, JSON routes, RPC methods, query-driven API paths, auth rules, or published HTTP error schema were documented on the reviewed official pages.
- Because this provider is a static ICS repository rather than an HTTP API, the confirmed fireROUTE route count remains `0`.

## Access pattern notes
- Published raw file prefix: `https://raw.githubusercontent.com/gadael/icsdb/master/build/{locale}/{filename}.ics`
- The reviewed build tree currently exposes `en-US` and `fr-FR` locale folders.
- The repository README lists coverage counts for Belgium, France, Germany, Ireland, Switzerland, the United Kingdom, and the United States.
- The project README warns that the files may move to a dedicated domain in the future, so GitHub raw URLs should be treated as current-source links rather than permanent guaranteed API endpoints.

## Pagination
- Not applicable.
- The reviewed official materials document direct static-file access, not paginated API list routes.

## Rate limits
- The project itself does not publish a rate-limit contract.
- Any effective throttling would be inherited from GitHub and `raw.githubusercontent.com`, not from a project-defined API policy.

## Error handling
- No project-level API error model is documented.
- Missing-file, moved-file, or hosting failures would rely on normal GitHub/raw HTTP behavior rather than a provider-specific JSON error schema.

## Response format notes
- The published artifacts are ICS calendar files rather than JSON.
- The README notes that some recurring dates are materialized via `RDATE` because the iCalendar spec does not cover all holiday recurrence rules they need.
- The README also notes that recurring dates start from 1970 or later to avoid compatibility issues with some iCalendar libraries.

## Important usage notes
- Use files from the `build` subfolder, not the source-data directories, if you need the generated calendars.
- Consumers need an ICS-capable library that can interpret `RRULE` and `RDATE` properties.
- Similar dates are documented as sharing the same `UID` across calendars.
- This provider is useful as a static calendar-data source, but it does not expose a documented HTTP API surface for fireROUTE passthrough routing.

## Verification notes
This file was manually rebuilt after reviewing the official repository README and the official build tree. The provider was documented as a zero-route static-data source rather than left in a generic pre-review status.
