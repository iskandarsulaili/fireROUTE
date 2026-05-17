# Udemy Instructor API

## Manual review status
- Category: Personality
- Official pages reviewed:
  - `https://www.udemy.com/developers/instructor/`
  - `https://www.udemy.com/developers/instructor/methods/get-api-taught-courses-list/`
  - `https://www.udemy.com/developers/instructor/methods/get-api-course-question-list/`
  - `https://www.udemy.com/developers/instructor/methods/get-api-course-question-replies-list/`
  - `https://www.udemy.com/developers/instructor/methods/get-api-messagethreads-list/`
  - `https://www.udemy.com/developers/instructor/methods/get-api-messagethread-messages-list/`
  - `https://www.udemy.com/developers/instructor/methods/get-api-taught-courses-questions-list/`
  - `https://www.udemy.com/developers/instructor/methods/get-api-taught-courses-review-list/`
  - `https://www.udemy.com/developers/instructor/methods/post-api-course-question-replies-list/`
  - `https://www.udemy.com/developers/instructor/methods/post-api-messagethread-messages-list/`
  - `https://www.udemy.com/developers/instructor/methods/put-api-course-question-detail/`
  - `https://www.udemy.com/developers/instructor/methods/put-api-course-question-replies-detail/`
  - `https://www.udemy.com/developers/instructor/methods/put-api-messagethreads-detail/`
  - `https://www.udemy.com/developers/instructor/methods/delete-api-course-question-detail/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `13`

## API overview
- Base URL: `https://www.udemy.com/instructor-api/v1/`
- Authentication:
  - bearer-token auth via `Authorization: bearer <secret_token>`
  - the overview says you must create an API client in your Udemy profile
  - the API client is tied to a Udemy user account
- Transport and format:
  - HTTPS only
  - JSON responses, including errors
- Pagination:
  - most APIs are paginated
  - `page_size` default: `12`
  - `page_size` maximum: `100`
  - `page` selects later pages
  - list responses include `count`, `next`, `previous`, `results`, and `aggregations`
- Rate limits:
  - `100` requests per `10` seconds across the Instructor API
  - requests over the limit return `429`
- Error notes:
  - conventional HTTP status codes are used
  - `2xx` = success, `4xx` = client/request problems, `5xx` = server problems
  - the docs explicitly warn that excessive errors can lead to blocking
  - when `503` is returned, Udemy asks clients to halt requests for an hour before retrying
- Other important notes:
  - the overview says the API is in maintenance mode and Udemy does not currently plan new features in the next few months
  - the docs note a current browser CORS restriction
  - field filtering is supported with `fields[...]` query parameters plus `@min`, `@default`, and `@all` field lists

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/taught-courses/courses/` | optional `fields[course]`, `fields[user]`, `student`, `ordering`, `page`, `page_size` | Lists courses taught by the authenticated instructor. |
| GET | `/courses/{course_id}/questions/` | `course_id`, optional `fields[question]`, `fields[answer]`, `fields[user]`, `ordering`, `page`, `page_size` | Lists questions for one course. |
| GET | `/courses/{course_id}/questions/{question_id}/replies/` | `course_id`, `question_id`, optional `fields[answer]`, `fields[user]`, `ordering`, `page`, `page_size` | Lists replies/answers for one question. |
| GET | `/message-threads/` | optional `status`, `other_user`, `fields[message_thread]`, `fields[message]`, `fields[user]`, `page`, `page_size` | Lists direct-message threads. |
| GET | `/message-threads/{message_thread_id}/messages/` | `message_thread_id`, optional `fields[message]`, `fields[user]`, `page`, `page_size` | Lists messages in one thread. |
| GET | `/taught-courses/questions/` | optional `status`, `course`, `fields[question]`, `fields[answer]`, `fields[user]`, `ordering`, `page`, `page_size` | Lists matching questions across taught courses. |
| GET | `/taught-courses/reviews/` | optional `status`, `course`, `star`, `fields[course_review]`, `fields[user]`, `ordering`, `page`, `page_size` | Lists matching reviews across taught courses. |
| POST | `/courses/{course_id}/questions/{question_id}/replies/` | `course_id`, `question_id`, form `body`, optional form `ignore_warnings` | Creates a new reply to a question. |
| POST | `/message-threads/{message_thread_id}/messages/` | `message_thread_id`, form `content` | Adds a message to an existing thread. |
| PUT | `/courses/{course_id}/questions/{pk}/` | `course_id`, `pk`, form `is_read` | Marks a course question read/unread. |
| PUT | `/courses/{course_id}/questions/{question_id}/replies/{pk}/` | `course_id`, `question_id`, `pk`, body/form `body`, form `is_top_answer` | Updates a question reply and can mark it the top answer. |
| PUT | `/message-threads/{pk}/` | `pk`, body flags `is_read`, `is_starred`, `is_deleted`, `is_muted` | Updates message-thread state. |
| DELETE | `/courses/{course_id}/questions/{pk}/` | `course_id`, `pk` | Deletes a course question. |

## Confirmed parameter and behavior notes
### Common auth and field-selection behavior
- Every reviewed method page includes an `Authorization` header parameter.
- The overview documents bearer-token auth using the instructor API client secret token.
- The reviewed list endpoints consistently support field filtering such as:
  - `fields[course]`
  - `fields[user]`
  - `fields[question]`
  - `fields[answer]`
  - `fields[message]`
  - `fields[message_thread]`
  - `fields[course_review]`

### Course and Q&A routes
- `GET /taught-courses/courses/`
  - optional `student` filter accepts a Udemy user id or `url_title`
  - ordering values documented: `is_published`, `published_time`, `created`, `title`, `admin_rating`
- `GET /courses/{course_id}/questions/`
  - ordering values documented: `id`, `created`, `last_activity`, `popularity`
- `GET /courses/{course_id}/questions/{question_id}/replies/`
  - ordering values documented: `is_top_answer`, `num_upvotes`, `created`
- `GET /taught-courses/questions/`
  - `status` can combine `unread`, `unanswered`, `unresponded`, and `no_instructor_response`
  - `course` accepts comma-separated course ids
  - ordering values documented: `created`, `popularity`, `newest`, `oldest`, `upvotes`
- `GET /taught-courses/reviews/`
  - `status` can combine `unresponded` and `commented`
  - `course` accepts comma-separated course ids
  - `star` accepts comma-separated integer star filters such as `2,3,4`
  - ordering values documented: `user_modified`, `created`
- `POST /courses/{course_id}/questions/{question_id}/replies/`
  - required form field: `body`
  - optional boolean form field: `ignore_warnings`
  - docs say `ignore_warnings=true` is required when a reply contains a link and the link is free educational content
- `PUT /courses/{course_id}/questions/{pk}/`
  - boolean `is_read` toggles question read/unread state
- `PUT /courses/{course_id}/questions/{question_id}/replies/{pk}/`
  - boolean `is_top_answer` marks the reply as the top answer
  - `body` updates reply content
- `DELETE /courses/{course_id}/questions/{pk}/`
  - reviewed page documents only auth plus the two path parameters

### Messaging routes
- `GET /message-threads/`
  - `status` can combine `starred`, `unread`, `unreplied`, and `not_automated`
  - `other_user` filters to the thread matching a particular user id
- `GET /message-threads/{message_thread_id}/messages/`
  - supports message/user field filtering plus standard pagination
- `POST /message-threads/{message_thread_id}/messages/`
  - form field `content` is documented as HTML message content
- `PUT /message-threads/{pk}/`
  - the reviewed page documents boolean body flags `is_read`, `is_starred`, `is_deleted`, and `is_muted`
  - the page also references `PublicMessageThreadSerializer` as the body serializer

## Response, pagination, and errors
- Reviewed method pages describe paginated list responses on the list endpoints.
- The overview provides an example response envelope with:
  - `count`
  - `next`
  - `previous`
  - `results`
  - `aggregations`
- The overview says all responses, including errors, are JSON.
- The docs explicitly call out `429` throttling responses and `503` maintenance responses.

## Important usage notes
- The reviewed overview says instructors had historically used unsupported internal Udemy APIs and that this supported instructor surface was created to replace that pattern.
- The docs provide an instructor-support contact: `instructorsupport@udemy.com`.
- The overview states the API is in maintenance mode, so adapters should expect stability rather than rapid expansion.
- Because browser CORS is still noted as restricted in the docs, server-side integration is the safer assumption.

## Sources inspected
- `https://www.udemy.com/developers/instructor/`
- `https://www.udemy.com/developers/instructor/methods/get-api-taught-courses-list/`
- `https://www.udemy.com/developers/instructor/methods/get-api-course-question-list/`
- `https://www.udemy.com/developers/instructor/methods/get-api-course-question-replies-list/`
- `https://www.udemy.com/developers/instructor/methods/get-api-messagethreads-list/`
- `https://www.udemy.com/developers/instructor/methods/get-api-messagethread-messages-list/`
- `https://www.udemy.com/developers/instructor/methods/get-api-taught-courses-questions-list/`
- `https://www.udemy.com/developers/instructor/methods/get-api-taught-courses-review-list/`
- `https://www.udemy.com/developers/instructor/methods/post-api-course-question-replies-list/`
- `https://www.udemy.com/developers/instructor/methods/post-api-messagethread-messages-list/`
- `https://www.udemy.com/developers/instructor/methods/put-api-course-question-detail/`
- `https://www.udemy.com/developers/instructor/methods/put-api-course-question-replies-detail/`
- `https://www.udemy.com/developers/instructor/methods/put-api-messagethreads-detail/`
- `https://www.udemy.com/developers/instructor/methods/delete-api-course-question-detail/`
