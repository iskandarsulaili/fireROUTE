# Tasty

Official pages manually reviewed:
- https://rapidapi.com/apidojo/api/tasty/
- https://rapidapi.com/apidojo/api/tasty/playground/apiendpoint_23367f7f-4ba6-450a-a64f-03e7634f85fa
- https://rapidapi.com/apidojo/api/tasty/playground/apiendpoint_abf1bbc2-d08d-462b-b733-17392192ca46
- https://rapidapi.com/apidojo/api/tasty/playground/apiendpoint_96b832dc-ba57-4017-b930-9b129a633829
- https://rapidapi.com/apidojo/api/tasty/playground/apiendpoint_a83ac673-5543-497e-b257-5032bf25b68d
- https://rapidapi.com/apidojo/api/tasty/playground/apiendpoint_6a571e20-67c9-4baf-bc0d-7691caa15bd6
- https://rapidapi.com/apidojo/api/tasty/playground/apiendpoint_08344ec1-bd64-4d46-a928-8445ccdf385d
- https://rapidapi.com/apidojo/api/tasty/playground/apiendpoint_2d575f5d-f855-4165-959c-388eca15e332
- https://rapidapi.com/apidojo/api/tasty/playground/apiendpoint_6af59836-4cb3-4318-af66-fde2787b7954

## Overview
- Base URL shown in the reviewed playground cURL examples: `https://tasty.p.rapidapi.com`
- All reviewed endpoints are documented as `GET`
- Response/request format signal from the reviewed cURL snippets: `application/json`
- Authentication model visible on the reviewed official pages: RapidAPI-managed access with subscription plans shown on the overview page (`BASIC`, `PRO`, `ULTRA`, `MEGA`)
- Header explicitly shown in the reviewed playground snippets: `x-rapidapi-host: tasty.p.rapidapi.com`
- Signed-out visibility note: the anonymous reviewed playground pages did not reveal a usable account key value, so RapidAPI credential material is platform-managed rather than published in the public docs snapshot

Manual route count confirmed from the reviewed official overview and endpoint playground pages: **8**.

## Confirmed endpoints

| Method | Path | Purpose |
|---|---|---|
| GET | `/recipes/auto-complete` | Autocomplete recipe search terms |
| GET | `/recipes/list` | Search/list recipes |
| GET | `/recipes/list-similarities` | List similar recipes for a recipe ID |
| GET | `/recipes/get-more-info` | Fetch detailed recipe information by ID |
| GET | `/tips/list` | List tips for a recipe/content item |
| GET | `/tags/list` | List tags usable in search/filter flows |
| GET | `/feeds/list` | Fetch feed content |
| GET | `/recipes/detail` | Deprecated older recipe-detail route |

## Confirmed parameters

### `GET /recipes/auto-complete`
- Required query parameter shown on the reviewed playground page:
  - `prefix`: autocomplete input text

### `GET /recipes/list`
- Required query parameters shown on the reviewed playground page:
  - `from`: offset for paging
  - `size`: number of items returned
- Optional query parameters shown on the reviewed playground page:
  - `tags`: tag filter; reviewed page says suitable values come from `/tags/list`
  - `q`: food or ingredient search text
  - `sort`: sort order; reviewed page says leaving it empty uses popular by default and shows `approved_at:desc|approved_at:asc` as documented values

### `GET /recipes/list-similarities`
- Required query parameter shown on the reviewed playground page:
  - `recipe_id`: recipe identifier

### `GET /recipes/get-more-info`
- Required query parameter shown on the reviewed playground page:
  - `id`: recipe identifier

### `GET /tips/list`
- Query parameters shown on the reviewed playground page:
  - `from`: paging offset
  - `size`: number of items returned
  - `id`: associated content/recipe identifier
- The reviewed playground labels expose all three fields in the live request form.

### `GET /tags/list`
- The reviewed playground page did not expose any query parameters for this route.

### `GET /feeds/list`
- Query parameters shown on the reviewed playground page:
  - `size`
  - `timezone`
  - `vegetarian`: boolean filter
  - `from`
- The reviewed example request uses `size=5`, `timezone=%2B0700`, `vegetarian=false`, and `from=0`.

### `GET /recipes/detail` (deprecated)
- Required query parameter shown on the reviewed playground page:
  - `id`: recipe identifier
- The reviewed overview explicitly marks this route as deprecated.

## Auth, rate limits, and billing notes
- The reviewed official overview page shows RapidAPI subscription plans for this API.
- The reviewed public pages did not publish a numeric per-minute or per-second rate-limit table.
- The reviewed anonymous playground pages expose the host header but not an account credential value.
- Operationally, this means fireROUTE should treat this provider as subscription-gated and require caller-supplied RapidAPI credentials/config even though the public snapshot does not print them.

## Pagination, errors, and response notes
- The reviewed cURL snippets use `application/json`.
- Pagination-style controls are exposed through `from` and `size` on list-style routes such as `/recipes/list`, `/tips/list`, and `/feeds/list`.
- The reviewed public pages did not publish a formal HTTP error/status table.
- The `/recipes/detail` route is deprecated, so new integrations should prefer `/recipes/get-more-info` where possible.

## Important usage notes
- The reviewed overview page categorizes the API under Food and describes it as a way to query recipe, plan, ingredient, and related data from Tasty.
- The reviewed overview sidebar and playground pages are enough to confirm route names and visible query parameters even in a signed-out session.
- `/tags/list` is an important bootstrap route because the reviewed `/recipes/list` page explicitly points developers there for valid tag values.
- Because this provider is published through RapidAPI rather than Tasty-hosted first-party docs on `tasty.co`, integration details should be treated as marketplace-managed and subject to RapidAPI account context.

## fireROUTE notes
- Keep the provider base URL configurable but default it to `https://tasty.p.rapidapi.com`.
- Model all confirmed routes as `GET` operations.
- Expose `from` and `size` for list endpoints as first-class pagination passthrough parameters.
- Prefer `/recipes/get-more-info` over deprecated `/recipes/detail` in any canonical mapping, but keep the deprecated route available for raw passthrough compatibility.