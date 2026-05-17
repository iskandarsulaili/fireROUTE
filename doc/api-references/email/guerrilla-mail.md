# Guerrilla Mail

Official docs manually reviewed:
- https://www.guerrillamail.com/GuerrillaMailAPI.html
- https://docs.google.com/document/d/1Qw5KQP1j57BPTDmms5nspe-QAjNEsNg8cQHpAAycYNM/edit?hl=en (linked as the latest version from the official page)

## Overview
Guerrilla Mail exposes a function-style JSON API behind one AJAX endpoint. Operations are selected with the `f` parameter rather than separate REST paths.

- Base URL: `http://api.guerrillamail.com/ajax.php`
- Protocol: HTTP JSON API (the official page documents the API URL as `http://...`)
- Auth: no API key; session state is maintained with cookies
- Response format: JSON-encoded strings / JSON objects according to the reviewed docs

## Authentication and session model
The reviewed docs require cookie handling rather than API-key auth.

Confirmed cookies/usage notes:
- `PHPSESSID` must be stored and sent on subsequent requests to maintain mailbox state
- `SUBSCR` may be returned for subscribed addresses and should be preserved if present

The docs explicitly say each request should include the function selector parameter `f`, and that GET is typically used for reads while POST is used for setting/deleting data, though this is not strictly enforced.

## Confirmed endpoint surface
All confirmed operations below use the same upstream path:
- Method: `GET` or `POST`
- Path: `/ajax.php`
- Routing: query or form parameter `f=<function_name>`

| Function (`f`) | Purpose | Key arguments |
|---|---|---|
| `get_email_address` | Initialize or resume a mailbox session | `lang`, optional `SUBSCR`; `PHPSESSID` cookie handling required |
| `set_email_user` | Set mailbox username / switch address | `email_user`, `lang`; requires `PHPSESSID` cookie |
| `check_email` | Poll for new email since a sequence id | `seq` |
| `get_email_list` | Fetch mailbox contents by offset | `offset`, optional `seq` |
| `fetch_email` | Retrieve one email body | `email_id` |
| `forget_me` | Forget current mailbox without killing session | `email_addr` |
| `del_email` | Delete one or more emails | `email_ids` as integer or array |
| `extend` | Extend mailbox lifetime by one hour | none |

Manual route count confirmed from the reviewed official docs: **8** function operations on one upstream path.

## Common request parameters
The reviewed introduction page shows a sample request:

```text
http://api.guerrillamail.com/ajax.php?f=get_email_address&ip=127.0.0.1&agent=Mozilla_foo_bar
```

Confirmed common inputs/signals:
- `f` — function selector
- `ip` — shown in the example request
- `agent` — shown in the example request
- `lang` — documented for `get_email_address` and `set_email_user`
- cookie `PHPSESSID` — required to preserve session state
- cookie/parameter `SUBSCR` — used for subscribed addresses

## Function details

### `f=get_email_address`
Confirmed arguments:
- `lang` — supported values listed on the page: `en`, `fr`, `nl`, `ru`, `tr`, `uk`, `ar`, `ko`, `jp`, `zh`, `zh-hant`
- `SUBSCR` — subscriber cookie data from a previous session

Confirmed behavior:
- initializes a session and assigns an email address
- if a session already exists, returns the current session’s address details
- may create a new random address if no session/subscription is found
- generates a welcome email for new addresses

### `f=set_email_user`
Confirmed arguments:
- `email_user` — username portion of the address
- `lang`

Confirmed notes:
- `PHPSESSID` must be passed as a cookie
- switching addresses does not delete the old address immediately

Confirmed response fields called out by the docs include:
- `email_addr`
- `email_timestamp`
- `s_active`
- `s_date`
- `s_time`
- `s_time_expires`

### `f=check_email`
Confirmed arguments:
- `seq` — sequence number of the oldest email

Confirmed response signals:
- `list[]` of messages
- per-message fields include `mail_id`, `mail_from`, `mail_subject`, `mail_excerpt`, `mail_timestamp`, `mail_read`, `mail_date`
- `count`
- `email`

The docs warn clients not to poll too aggressively and to stop checking after mailbox expiry.

### `f=get_email_list`
Confirmed arguments:
- `offset`
- optional `seq`

Confirmed behavior:
- returns up to 20 messages
- `offset=0` fetches the first 10 emails
- `offset=10` fetches the next 10
- response is identical to `check_email`

### `f=fetch_email`
Confirmed arguments:
- `email_id`

Confirmed behavior/notes:
- returns email contents
- HTML is filtered for safety
- images are proxied/blocked through `http://www.guerrillamail.com/res.php`

### `f=forget_me`
Confirmed arguments:
- `email_addr`

Confirmed behavior:
- forgets the current email address without ending the session
- subsequent `get_email_address` can fetch a new address
- `set_email_user` can be used to set a new address manually
- `SUBSCR` is deleted after success but `PHPSESSID` persists

### `f=del_email`
Confirmed arguments:
- `email_ids` as an integer or array
- documented example encoding: `email_ids[]=425&email_ids[]=426&email_ids[]=427`

Confirmed return shape:
- array of deleted email IDs

### `f=extend`
Confirmed arguments:
- none

Confirmed behavior:
- extends mailbox lifetime by 1 hour
- maximum of 2 hours can be extended

Confirmed response fields:
- `expired`
- `email_timestamp`
- `affected`

## Rate limits and expiry behavior
The reviewed docs explicitly state:
- the API may be rate limited
- Guerrilla Mail does not publish its exact rate limits
- mailbox sessions can expire after about 18 minutes of inactivity
- messages remain until the address expires or the message is 1 hour old

## Pagination
No formal pagination object exists, but mailbox listing uses offset-style retrieval:
- `offset`
- optional `seq`

## Errors
The reviewed official page does not publish a dedicated shared error schema.

## Important usage notes
- This is not a resource-oriented REST API; it is a single endpoint with function dispatch via `f`.
- Cookie persistence is mandatory for correct mailbox/session behavior.
- The official API URL is documented as plain HTTP, so callers should account for non-HTTPS upstream transport if using the exact documented endpoint.

## fireROUTE notes
- Model Guerrilla Mail as a function-dispatch provider rather than trying to invent separate REST resources.
- Preserve session cookies or equivalent state if fireROUTE ever proxies mailbox workflows.
- Be conservative with polling because the provider explicitly warns about rate limiting.
