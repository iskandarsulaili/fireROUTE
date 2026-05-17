# Mailsac

## Provider metadata
- Category: `Test Data`
- Provider slug: `mailsac`
- Official docs used manually:
  - `https://mailsac.com/docs/api`
- Confirmed API base URL: `https://mailsac.com/api`
- Primary response formats: JSON, plain text, HTML, and attachment/file download responses
- Authentication: API key via `Mailsac-Key` header, `_mailsacKey` query parameter, or `_mailsacKey` JSON request-body field
- Manually confirmed routes in this pass: `16`

## Authentication and access model
From the reviewed official API specification:
- API keys establish identity for the Mailsac API.
- The docs explicitly support three auth placements:
  - `Mailsac-Key` HTTP header
  - `_mailsacKey` query-string parameter
  - `_mailsacKey` JSON body field for `POST`, `PUT`, or `PATCH`
- The docs recommend the header form and describe query-string auth as the least secure option.
- Free and Indie plans allow one API key; some higher tiers allow multiple named keys.

## Important usage notes from the official docs
- By default, email sent to Mailsac is accepted and public.
- Public inboxes are recycled regularly unless messages are starred.
- Anyone can view messages in a public, non-owned inbox.
- Anyone can also delete messages from public inboxes.
- The official docs warn that throttling is frequently an issue on public inboxes and strongly recommend using a custom domain or private forwarding address.

## Confirmed API surface

### 1) Count messages in an inbox
- Method: `GET`
- Path: `/addresses/{email}/message-count`
- Required path parameter:
  - `email` - inbox address to count
- Purpose: return the number of messages for an inbox
- Documented responses:
  - `200` success
  - `401` not authorized
  - `403` requested email address is owned by another user

### 2) List messages in an inbox
- Method: `GET`
- Path: `/addresses/{email}/messages`
- Required path parameter:
  - `email`
- Documented query parameters:
  - `until` - ISO date; return messages up to this UTC timestamp
  - `limit` - integer `0..1000`, default `20`
- Purpose: list abbreviated message objects in newest-first order
- Important note:
  - the docs say a message can be checked without reserving the address first unless another user owns it

### 3) Delete all messages in an inbox
- Method: `DELETE`
- Path: `/addresses/{email}/messages`
- Required path parameter:
  - `email`
- Purpose: delete all messages for a specific inbox
- Important note:
  - starred messages are not deleted by this route

### 4) Get email message metadata
- Method: `GET`
- Path: `/addresses/{email}/messages/{messageId}`
- Required path parameters:
  - `email`
  - `messageId` - Mailsac-generated unique message identifier
- Purpose: retrieve full metadata for one message
- Important note:
  - the reviewed docs say this route includes metadata not present in inbox listings, including parsed links and attachment md5sums

### 5) Delete one email message
- Method: `DELETE`
- Path: `/addresses/{email}/messages/{messageId}`
- Required path parameters:
  - `email`
  - `messageId`
- Purpose: permanently delete one message
- Important note:
  - the docs explicitly say there is no trash or undo

### 6) Get parsed message headers
- Method: `GET`
- Path: `/addresses/{email}/messages/{messageId}/headers`
- Required path parameters:
  - `email`
  - `messageId`
- Documented query parameters:
  - `download=1` - trigger browser download
  - `messageHeadersFormat` - `json`, `json-ordered`, or `plain`
- Purpose: return pre-parsed message headers in one of the documented formats

### 7) Get sanitized HTML body
- Method: `GET`
- Path: `/body/{email}/{messageId}`
- Required path parameters:
  - `email`
  - `messageId`
- Documented query parameter:
  - `download=1`
- Purpose: return safer HTML with scripts, images, and links stripped out
- Important note:
  - when no HTML body was sent, the docs say a simple HTML body is generated

### 8) Get plaintext body
- Method: `GET`
- Path: `/text/{email}/{messageId}`
- Required path parameters:
  - `email`
  - `messageId`
- Documented query parameter:
  - `download=1`
- Purpose: return plain-text message content
- Important note:
  - if the original message contained only HTML, the docs say a simple text body is generated

### 9) List enhanced private addresses
- Method: `GET`
- Path: `/addresses`
- Purpose: list enhanced/private inbox address objects for the current account
- Important note:
  - the docs tie these addresses to addresses reserved through `POST /addresses/{email}` or the website UI

### 10) Get an address or check whether it is reserved
- Method: `GET`
- Path: `/addresses/{email}`
- Required path parameter:
  - `email`
- Purpose: fetch address details when owned or determine whether the address is not owned
- Important note:
  - if the address is owned by another account, the reviewed docs say the route returns `401`

### 11) Reserve a private address
- Method: `POST`
- Path: `/addresses/{email}`
- Required path parameter:
  - `email`
- Documented JSON body fields:
  - `info`
  - `forward`
  - `enablews`
  - `webhook`
  - `webhookSlack`
  - `webhookSlackToFrom`
- Purpose: make an address private/owned and configure forwarding or webhook behavior
- Important notes:
  - the docs say forwarding, Slack, WebSocket, and webhook delivery require a reserved address
  - public addresses and private addresses under a custom domain are described as not routeable

### 12) Check address availability/ownership
- Method: `GET`
- Path: `/addresses/{email}/availability`
- Required path parameter:
  - `email`
- Purpose: return availability and ownership status
- Documented response fields include:
  - `available`
  - `email`
  - `owned`

### 13) Validate one email address
- Method: `GET`
- Path: `/validations/addresses/{email}`
- Required path parameter:
  - `email`
- Purpose: validate format and disposable-domain status for one email address
- Documented response fields include:
  - `email`
  - `validFormat`
  - `local`
  - `domain`
  - `isDisposable`
  - `disposableDomains[]`
  - `aliases[]`

### 14) List attachments on a message
- Method: `GET`
- Path: `/addresses/{email}/messages/{messageId}/attachments`
- Required path parameters:
  - `email`
  - `messageId`
- Purpose: return attachment metadata for a message
- Documented response fields include:
  - `checksum`
  - `contentDisposition`
  - `contentId`
  - `contentType`
  - `fileName`
  - `length`
  - `transferEncoding`

### 15) Get current account details
- Method: `GET`
- Path: `/me`
- Purpose: return account information for the current API key
- Documented response fields include:
  - `_id`
  - `email`
  - `messageLimit`
  - `privateAddressCredits`
  - `apiMonthlyLimit`
  - `apiKeyName`

### 16) Get account stats
- Method: `GET`
- Path: `/me/stats`
- Documented query parameter:
  - `overrideAccountId`
- Purpose: return summary account usage and inventory information
- Documented response fields include:
  - `addresses[]`
  - `domains[]`
  - `starredMessages`
  - `storedMessages`
  - `inboxBytes`
  - `lastMonthOps`
  - `defaultDomain`

## Pagination and filtering notes
From the reviewed official spec:
- inbox and domain message listing use date-style pagination with `until` plus `limit`
- the reviewed message-listing docs explicitly cap `limit` at `1000`
- the broader stats section in the same official spec uses `skip` and `limit` on some reporting endpoints, so pagination is endpoint-specific rather than globally standardized
- no cursor-based pagination model was documented on the reviewed page

## Error and format notes
From the reviewed route pages:
- recurring documented status codes include `200`, `401`, `403`, and `404`
- many error examples use a JSON envelope with:
  - `message`
  - `error`
  - `validationErrors[]`
- message-body and header routes can return non-JSON formats depending on endpoint/options:
  - parsed headers can be `json`, `json-ordered`, or `plain`
  - sanitized HTML and plaintext body routes return rendered message content
  - attachment/file-style routes return downloadable content

## fireROUTE notes
- Mailsac mixes public disposable inbox behavior with authenticated private-address management; these should not be treated as the same trust model.
- Public inbox operations are intentionally permissive, but owned/private inboxes add authorization checks and different failure modes.
- The docs expose a much larger surface than the old zero-route note implied, including validations, attachments, domains, account stats, WebSockets, and webhooks.
- For production use, prefer header-based `Mailsac-Key` auth and avoid the query-string key form.

## Verification notes
This file was manually rebuilt after reviewing the live official Mailsac API specification in the browser.