# Discogs

## Overview
- Provider: Discogs API v2.0
- Category: Music
- Official docs: `https://www.discogs.com/developers/`
- Base URL: `https://api.discogs.com`
- OAuth authorize URL: `https://www.discogs.com/oauth/authorize`
- Auth:
  - public database reads can be made without OAuth, but Discogs documents lower unauthenticated limits
  - protected routes require either a Discogs user token or OAuth consumer key/secret flow
  - OAuth helper endpoints are `POST /oauth/request_token` and `POST /oauth/access_token`
- HTTPS: yes
- Response format: JSON; the docs also describe JSONP responses when a `callback` query parameter is supplied
- Pagination: collection/list endpoints are paginated; default `50` items per page, maximum `100`, with `page` and `per_page` query parameters plus RFC5988-style `Link` headers
- Rate limits: `60` requests/minute for authenticated requests and `25` requests/minute for unauthenticated requests, tracked over a moving 60-second window by source IP

## Confirmed endpoints

| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `/oauth/request_token` | OAuth consumer credentials | Starts 3-legged OAuth flow. |
| POST | `/oauth/access_token` | authorized request token/verifier | Exchanges temporary credentials for an access token. |
| GET | `/releases/{release_id}{?curr_abbr}` | `release_id`, optional `curr_abbr` | Release detail. |
| GET | `/releases/{release_id}/rating/{username}` | `release_id`, `username` | Get a user's rating for a release. |
| PUT | `/releases/{release_id}/rating/{username}` | `release_id`, `username`, rating body | Update a user's release rating. |
| DELETE | `/releases/{release_id}/rating/{username}` | `release_id`, `username` | Delete a user's release rating. |
| GET | `/releases/{release_id}/rating` | `release_id` | Community release rating summary. |
| GET | `/releases/{release_id}/stats` | `release_id` | Release collection/wantlist stats. |
| GET | `/masters/{master_id}` | `master_id` | Master release detail. |
| GET | `/masters/{master_id}/versions{?page,per_page}` | `master_id`, `page`, `per_page` | Master release versions. |
| GET | `/artists/{artist_id}` | `artist_id` | Artist detail. |
| GET | `/artists/{artist_id}/releases{?sort,sort_order}` | `artist_id`, `sort`, `sort_order` | Artist releases listing. |
| GET | `/labels/{label_id}` | `label_id` | Label detail. |
| GET | `/labels/{label_id}/releases{?page,per_page}` | `label_id`, `page`, `per_page` | Label releases listing. |
| GET | `/database/search?q={query}&{?type,title,release_title,credit,artist,anv,label,genre,style,country,year,format,catno,barcode,track,submitter,contributor}` | `q` plus database filters | Database search. |
| GET | `/users/{username}/inventory{?status,sort,sort_order}` | `username`, `status`, `sort`, `sort_order` | Marketplace inventory for a seller. |
| GET | `/marketplace/listings/{listing_id}{?curr_abbr}` | `listing_id`, optional `curr_abbr` | Listing detail. |
| POST | `/marketplace/listings/{listing_id}{?curr_abbr}` | `listing_id`, editable listing fields | Edit an existing marketplace listing. |
| DELETE | `/marketplace/listings/{listing_id}{?curr_abbr}` | `listing_id` | Delete a listing. |
| POST | `/marketplace/listings{?release_id,condition,sleeve_condition,price,comments,allow_offers,status,external_id,location,weight,format_quantity}` | listing creation fields | Create a new listing. |
| GET | `/marketplace/orders/{order_id}` | `order_id` | Order detail. |
| POST | `/marketplace/orders/{order_id}` | `order_id`, editable order fields | Edit an order. |
| GET | `/marketplace/orders{?status,created_after,created_before,sort,sort_order}` | order filters | List marketplace orders. |
| GET | `/marketplace/orders/{order_id}/messages` | `order_id` | List order messages. |
| POST | `/marketplace/orders/{order_id}/messages` | `order_id`, message body | Add a new order message. |
| GET | `/marketplace/fee/{price}` | `price` | Fee estimate in default currency context. |
| GET | `/marketplace/fee/{price}/{currency}` | `price`, `currency` | Fee estimate with explicit currency. |
| GET | `/marketplace/price_suggestions/{release_id}` | `release_id` | Marketplace price suggestions. |
| GET | `/marketplace/stats/{release_id}{?curr_abbr}` | `release_id`, optional `curr_abbr` | Marketplace release statistics. |
| POST | `/inventory/export` | export request body | Start an inventory export job. |
| GET | `/inventory/export` | none documented beyond auth | Get recent export jobs. |
| GET | `/inventory/export/{id}` | `id` | Get one export job. |
| GET | `/inventory/export/{id}/download` | `id` | Download finished export. |
| POST | `/inventory/upload/add` | CSV upload payload | Add inventory in bulk. |
| POST | `/inventory/upload/change` | CSV upload payload | Change inventory in bulk. |
| POST | `/inventory/upload/delete` | CSV upload payload | Delete inventory in bulk. |
| GET | `/inventory/upload` | none documented beyond auth | Get recent upload jobs. |
| GET | `/inventory/upload/{id}` | `id` | Get one upload job. |
| GET | `/oauth/identity` | OAuth token or user token | Authenticated identity lookup. |
| GET | `/users/{username}` | `username` | Get a user profile. |
| POST | `/users/{username}` | `username`, editable profile fields | Edit your own profile. |
| GET | `/users/{username}/submissions` | `username` | User submissions. |
| GET | `/users/{username}/contributions{?sort,sort_order}` | `username`, `sort`, `sort_order` | User contributions. |
| GET | `/users/{username}/collection/folders` | `username` | Get collection folders. |
| POST | `/users/{username}/collection/folders` | `username`, folder name | Create a collection folder. |
| GET | `/users/{username}/collection/folders/{folder_id}` | `username`, `folder_id` | Get one folder. |
| POST | `/users/{username}/collection/folders/{folder_id}` | `username`, `folder_id`, editable folder fields | Edit a folder. |
| DELETE | `/users/{username}/collection/folders/{folder_id}` | `username`, `folder_id` | Delete a folder. |
| GET | `/users/{username}/collection/releases/{release_id}` | `username`, `release_id` | Collection items by release. |
| GET | `/users/{username}/collection/folders/{folder_id}/releases` | `username`, `folder_id` | Collection items by folder. |
| POST | `/users/{username}/collection/folders/{folder_id}/releases/{release_id}` | `username`, `folder_id`, `release_id` | Add a release to a folder. |
| POST | `/users/{username}/collection/folders/{folder_id}/releases/{release_id}/instances/{instance_id}` | `username`, `folder_id`, `release_id`, `instance_id` | Change rating of a collection instance. |
| DELETE | `/users/{username}/collection/folders/{folder_id}/releases/{release_id}/instances/{instance_id}` | `username`, `folder_id`, `release_id`, `instance_id` | Delete an instance from a folder. |
| GET | `/users/{username}/collection/fields` | `username` | List custom collection fields. |
| POST | `/users/{username}/collection/folders/{folder_id}/releases/{release_id}/instances/{instance_id}/fields/{field_id}{?value}` | `username`, `folder_id`, `release_id`, `instance_id`, `field_id`, `value` | Edit a custom field value on a collection instance. |
| GET | `/users/{username}/collection/value` | `username` | Collection value summary. |
| GET | `/users/{username}/wants` | `username` | Wantlist. |
| PUT | `/users/{username}/wants/{release_id}{?notes,rating}` | `username`, `release_id`, optional `notes`, `rating` | Add a release to wantlist. |
| POST | `/users/{username}/wants/{release_id}{?notes,rating}` | `username`, `release_id`, optional `notes`, `rating` | Edit a release already in wantlist. |
| DELETE | `/users/{username}/wants/{release_id}{?notes,rating}` | `username`, `release_id` | Remove a release from wantlist. |
| GET | `/users/{username}/lists` | `username` | User-created lists. |
| GET | `/lists/{list_id}` | `list_id` | Single list detail. |

Confirmed route count: **62**.

## Auth and usage notes
- Discogs documents two auth modes for protected work:
  - user token flow for easy access to your own account data
  - consumer key/secret plus OAuth 1.0a for third-party apps
- Discogs tells developers to register an application or token in Developer Settings before using protected endpoints.
- The docs recommend sending a unique `User-Agent` string and explicitly say that doing so is required to achieve the maximum requests-per-minute allowance.
- JSONP is supported by adding a `callback` query parameter, but JSON is the primary response format.

## Pagination and filtering notes
- Default page size is `50`.
- Maximum `per_page` is `100`.
- Paginated responses include a `Link` header with relations such as `next`, `first`, `last`, and `prev`.
- Common documented filters include:
  - database search fields like `type`, `artist`, `label`, `genre`, `style`, `country`, `year`, `format`, `barcode`, `track`, `submitter`, and `contributor`
  - marketplace listing/order fields like `status`, `created_after`, `created_before`, `sort`, and `sort_order`
  - collection/search pagination fields like `page` and `per_page`

## Rate limits
- Authenticated: `60` requests per minute.
- Unauthenticated: `25` requests per minute.
- Limit tracking is a moving average over a 60-second window.
- The docs publish these response headers:
  - `X-Discogs-Ratelimit`
  - `X-Discogs-Ratelimit-Used`
  - `X-Discogs-Ratelimit-Remaining`

## Response and error notes
- Successful responses are JSON by default.
- JSONP responses wrap the payload and expose a `meta.status` field because browser JSONP cannot read HTTP status codes directly.
- The docs explicitly describe these statuses:
  - `200 OK`
  - `201 Continue` for successful creation of a new resource via POST
  - `204 No Content`
  - `401 Unauthorized`
  - `403 Forbidden`
  - `404 Not Found`
  - `405 Method Not Allowed`
- The docs' examples show `meta.status` in JSONP responses and empty bodies for `204 No Content` responses.

## fireROUTE integration notes
- Treat Discogs as one of the larger music providers in this category: there are database, marketplace, identity, collection, wantlist, list, import/export, and OAuth helper surfaces behind one base URL.
- Preserve method distinctions for shared paths such as listing detail/edit/delete, order detail/edit, inventory export create/list, and wantlist add/edit/delete.
- Keep the Discogs authorize URL outside the route count because it is part of the web OAuth handoff, not an API base route on `api.discogs.com`.
- Expose `curr_abbr` as an optional currency-context query field on the release/listing/stats routes that publish it.
- Require a caller-configurable `User-Agent` override in any production adapter so fireROUTE users can stay inside Discogs' documented rate policy.

## Sources inspected
- `https://www.discogs.com/developers/`
- `https://www.discogs.com/developers/#page:authentication`
- `https://www.discogs.com/developers/#page:database`
- `https://www.discogs.com/developers/#page:marketplace`
- `https://www.discogs.com/developers/#page:user-collection`
