# Data.parliament.uk

## Provider metadata
- Category: `Government`
- Provider slug: `data-parliament-uk`
- Official docs/pages used:
  - `https://explore.data.parliament.uk/?learnmore=Members`
  - `https://explore.data.parliament.uk/`
  - live official endpoint checks during this pass:
    - `https://lda.data.parliament.uk/members.json?_pageSize=1`
    - `https://lda.data.parliament.uk/lordsregisteredinterests.json?member=4304&_pageSize=1`
- Current documented API host: `https://lda.data.parliament.uk`
- Auth model for reviewed routes: no API key or sign-in requirement was published or observed
- Response formats confirmed from the official pages: JSON, XML, CSV, HTML
- Manually confirmed route count: `7`

## Official usage notes
- The assigned official page loaded as `Dataset Explorer` and exposed a Members-specific API table.
- That official API table listed these APIs directly on the page: `commonsmembers`, `lordsmembers`, `members`, `members/{id}`, `commonsregisteredinterests`, `lordsregisteredinterests`, and `lordsregisteredinterests?member={id}`.
- The same official page linked to live format examples for the Members dataset at:
  - `https://lda.data.parliament.uk/members.json`
  - `https://lda.data.parliament.uk/members.xml`
  - `https://lda.data.parliament.uk/members.csv`
  - `https://lda.data.parliament.uk/members.html`
- The official query-options table on the assigned page documented generic filter and paging controls including `[qsName]=value`, `min-[qsName]`, `max-[qsName]`, `minEx-[qsName]`, `maxEx-[qsName]`, `exists-[qsName]`, `_pageSize`, `_page`, `_sort`, `_search`, `_view`, and `_properties`.
- The official alternative page `https://explore.data.parliament.uk/` remained the dataset-explorer catalogue and showed many additional datasets, but this file only documents the routes explicitly exposed on the assigned Members page and the live linked-data host verified from that page in this pass.
- Live browser checks of `members.json?_pageSize=1` and `lordsregisteredinterests.json?member=4304&_pageSize=1` both returned machine-readable JSON on the official `lda.data.parliament.uk` host.

## Canonical endpoints confirmed from the official site
1. `GET /commonsmembers`
   - Base URL: `https://lda.data.parliament.uk`
   - Purpose: list all Commons members.

2. `GET /lordsmembers`
   - Base URL: `https://lda.data.parliament.uk`
   - Purpose: list all Lords members.

3. `GET /members`
   - Base URL: `https://lda.data.parliament.uk`
   - Purpose: list all members.
   - Live confirmation:
     - `GET /members.json?_pageSize=1` returned a linked-data JSON document with collection metadata including `format`, `version`, `result`, `first`, and `items`.

4. `GET /members/{id}`
   - Base URL: `https://lda.data.parliament.uk`
   - Purpose: fetch one member by ID.
   - Path parameter:
     - `{id}` - member identifier.

5. `GET /commonsregisteredinterests`
   - Base URL: `https://lda.data.parliament.uk`
   - Purpose: return Commons financial interests.

6. `GET /lordsregisteredinterests`
   - Base URL: `https://lda.data.parliament.uk`
   - Purpose: return Lords financial interests.

7. `GET /lordsregisteredinterests?member={id}`
   - Base URL: `https://lda.data.parliament.uk`
   - Purpose: return Lords financial interests filtered by member ID.
   - Query parameter:
     - `member` - member identifier used to restrict results to one member.
   - Live confirmation:
     - `GET /lordsregisteredinterests.json?member=4304&_pageSize=1` returned linked-data JSON on the official host.

## Query, paging, and field notes
- The assigned official Members page documented the following filter shapes:
  - `[qsName]=value`
  - `min-[qsName]=value`
  - `max-[qsName]=value`
  - `minEx-[qsName]=value`
  - `maxEx-[qsName]=value`
  - `exists-[qsName]=[true|false]`
- The same page documented these generic control parameters:
  - `_pageSize` - maximum record count per page, up to `500`
  - `_page` - page number
  - `_sort` - ordered field list
  - `_search` - Lucene-style text search query
  - `_view` - view selector
  - `_properties` - field selection helper used with `_view=basic`
- The Members page also published example queryable field names such as `additionalName`, `birthDate`, `constituency`, `familyName`, `fullName`, `gender`, `party`, `published`, and `twitter`.

## Format, auth, rate-limit, and error notes
- The official Members page explicitly linked JSON, XML, CSV, and HTML representations for the Members dataset.
- The live route checks in this pass confirmed JSON responses on the official linked-data host.
- No API key, login requirement, or OAuth flow was published on the reviewed official pages for these public routes.
- No public rate-limit policy was published on the reviewed official pages.
- No shared structured error schema was published on the reviewed official pages.

## fireROUTE normalization notes
- Treat `https://lda.data.parliament.uk` as the canonical machine host for this provider record.
- Keep this provider scoped to the routes explicitly listed on the reviewed Members dataset page until additional dataset pages are manually reviewed and confirmed.
- Preserve the documented linked-data query controls (`_pageSize`, `_page`, `_sort`, `_search`, `_view`, `_properties`) as provider-level query conventions for this reviewed surface.
