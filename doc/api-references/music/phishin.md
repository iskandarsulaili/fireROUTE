# Phish.in

## Overview
- Provider: Phish.in API v2
- Category: Music
- Official docs: `https://phish.in/api-docs`
- Base URL: `https://phish.in/api/v2`
- Auth: no API key is required for v2 read access; authenticated user actions use JWT auth returned from login/create-user flows and referenced by the docs as the `X-Auth-Token` header
- HTTPS: yes
- Response format: JSON
- Pagination: list endpoints commonly use `page` and `per_page`
- Rate limits: no numeric rate limit published on the inspected docs pages

## Confirmed endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/announcements` | Fetch recent announcements. |
| POST | `/auth/create_user` | Create a new user and receive login/JWT-style response data. |
| POST | `/auth/login` | Login with email and password. |
| GET | `/auth/user` | Return the currently authenticated user. |
| POST | `/auth/request_password_reset` | Request a password reset email. |
| POST | `/auth/reset_password` | Reset password using email token. |
| PATCH | `/auth/change_username/{username}` | Change the current username; docs say this is limited to once per year. |
| POST | `/likes` | Like a show, track, or playlist. |
| DELETE | `/likes` | Unlike a show, track, or playlist. |
| GET | `/playlists` | List playlists with filtering, sorting, and pagination. |
| POST | `/playlists` | Create a playlist for the authenticated user. |
| GET | `/playlists/{slug}` | Fetch a playlist by slug. |
| PUT | `/playlists/{id}` | Update an existing playlist. |
| DELETE | `/playlists/{id}` | Delete a playlist. |
| GET | `/reports/missing_content` | Fetch missing/incomplete content report. |
| GET | `/search/{term}` | Search across shows, songs, venues, tags, tracks, and playlists. |
| GET | `/shows` | List shows with filters for geography, dates, year, tags, and audio state. |
| GET | `/shows/random` | Fetch one random show. |
| GET | `/shows/{date}` | Fetch a show by `YYYY-MM-DD`. |
| GET | `/shows/day_of_year/{date}` | Fetch shows that occurred on the same day-of-year. |
| POST | `/shows/request_album_zip` | Request a ZIP archive of a show's tracks. |
| GET | `/songs` | List songs. |
| GET | `/songs/{slug}` | Fetch one song. |
| GET | `/tags` | List all tags. |
| GET | `/tours` | List tours. |
| GET | `/tours/{slug}` | Fetch one tour. |
| GET | `/tracks` | List tracks. |
| GET | `/tracks/{id}` | Fetch a track by numeric ID. |
| GET | `/venues` | List venues. |
| GET | `/venues/{slug}` | Fetch one venue. |
| GET | `/years` | List year/era summary records. |

Confirmed route count from Swagger UI: **31**.

## Important parameters
- Common pagination parameters on list endpoints: `page`, `per_page`
- Common sorting parameters: `sort`
- Common filter parameters on catalog endpoints: `audio_status`
- `/search/{term}`:
  - path `term` (minimum 3 characters per docs)
  - optional `audio_status`
  - optional `scope` (`all`, `playlists`, `shows`, `songs`, `tags`, `tours`, `tracks`, `venues`)
- `/shows` optional filters include `lat`, `lng`, `distance`, `year`, `year_range`, `venue_slug`, `tag_slug`, `start_date`, `end_date`, `us_state`, `liked_by_user`
- `/songs` optional filters include `page`, `per_page`, `audio_status`, `sort`, `first_char`
- `/tracks` optional filters include `tag_slug`, `song_slug`, `liked_by_user`, `start_date`, `end_date`, `year`, `year_range`
- `/venues` optional filters include `lat`, `lng`, `distance`, `audio_status`, `sort`, `first_char`
- `/playlists` optional filters include `page`, `per_page`, `sort`, `filter`
- Auth body schemas confirmed in Swagger for user and playlist writes:
  - create user: `username`, `email`, `password`, `password_confirmation`
  - login: `email`, `password`
  - like create: `likable_type`, `likable_id`
  - playlist create/update: `name`, `slug`, `description`, `published`, `track_ids`, `starts_at_second`, `ends_at_second`
  - album ZIP request: `date`

## Auth and permission notes
- The landing docs page explicitly says: **"No API key is required to access v2 of the API."**
- Authenticated endpoints still exist for account, likes, playlist mutation, and username changes.
- The Swagger description for login/create-user says the API returns a JWT for use with the `X-Auth-Token` header.
- Read-only catalog endpoints are public.

## Response, pagination, and error notes
- Swagger advertises `application/json` responses.
- Collection endpoints use classic page-based pagination (`page`, `per_page`), typically with defaults of page `1` and per-page `10` where documented.
- The inspected Swagger pages document error/status patterns including `400`, `401`, `403`, `404`, `409`, and `422` depending on route.
- `/likes` DELETE returns `204` on success.
- `/shows/request_album_zip` documents `409` for "Download already requested".

## fireROUTE integration notes
- The public v2 API is the correct target, not the older index metadata that still claimed API-key auth.
- Public catalog/search routes are easy to normalize because they consistently use JSON and similar pagination fields.
- Authenticated actions should be split from public read operations because they require JWT state and may return authorization-specific errors.

## Sources inspected
- `https://phish.in/api-docs`
- `https://petstore.swagger.io/?url=https%3A%2F%2Fphish.in/api/v2/swagger_doc`
