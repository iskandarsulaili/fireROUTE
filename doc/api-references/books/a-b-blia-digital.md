# A Bíblia Digital

Official pages manually reviewed:
- https://www.abibliadigital.com.br/en
- https://raw.githubusercontent.com/omarciovsena/abibliadigital/master/README.md
- https://raw.githubusercontent.com/omarciovsena/abibliadigital/master/DOCUMENTATION.md

## Overview
- Public API base URL: `https://www.abibliadigital.com.br/api`
- Authentication: optional bearer token for unlimited usage; many read endpoints also work without auth
- Default unauthenticated limit shown in the official docs: **20 requests/hour/IP**
- Authenticated usage is described as unlimited and free
- Response format: JSON

Manual route count confirmed from the official docs: **16**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/books` | List all Bible books |
| GET | `/books/:abbrev` | Get one book by abbreviation |
| GET | `/verses/:version/:abbrev/:chapter` | Get all verses in one chapter |
| GET | `/verses/:version/:abbrev/:chapter/:number` | Get one verse |
| GET | `/verses/:version/random` | Get a random verse from a translation |
| GET | `/verses/:version/:abbrev/random` | Get a random verse from one book |
| POST | `/verses/search` | Search verses by keyword |
| GET | `/versions` | List Bible versions |
| POST | `/users` | Create a user and receive token |
| GET | `/users/:email` | Get a user profile |
| GET | `/users/stats` | Get authenticated user stats |
| PUT | `/users/token` | Exchange email/password for token |
| DELETE | `/users` | Delete a user |
| POST | `/users/password/:email` | Resend/reset user password |
| GET | `/requests/:range` | List authenticated request history for `month`, `week`, or `day` |
| GET | `/requests/amount/:range` | Summarize request counts for `month`, `week`, or `day` |

## Parameters and auth
- `:version` is the Bible version slug, such as `nvi`, `acf`, `bbe`, or `kjv`
- `:abbrev` is the book abbreviation
- `:chapter` and `:number` are numeric chapter and verse identifiers
- `POST /verses/search` expects JSON like `{ "version": "nvi", "search": "terra" }`
- Authenticated endpoints use `Authorization: Bearer <token>`
- User-creation and token-refresh endpoints use JSON request bodies with `Content-Type: application/json`

## Response notes
- Book records include `abbrev`, `author`, `chapters`, `group`, `name`, and `testament`
- Chapter responses return `book`, `chapter`, and `verses[]`
- Single-verse responses return `book`, `chapter`, `number`, and `text`
- Search responses return `occurrence`, `version`, and `verses[]`
- Version responses return objects with `version` and `verses`

## Rate limits
- No auth: **20 requests/hour/IP**
- With user token: official docs say usage is unlimited

## Pagination
No pagination scheme is documented on the reviewed pages.

## Errors
The reviewed docs do not publish a dedicated status-code table.

## Important usage notes
- The homepage advertises 7 versions and 4 languages.
- The project describes auth as an identification mechanism rather than a paid feature.
- Some endpoints are user/account-management endpoints; fireROUTE may only need the public content routes.

## fireROUTE notes
- The public content surface is centered on `/books`, `/versions`, and `/verses/*`.
- Keep `/verses/search` as a POST passthrough because the official docs define it with a JSON body.
- Treat the `/users*` and `/requests*` endpoints as provider-specific extensions rather than canonical Bible routes.
