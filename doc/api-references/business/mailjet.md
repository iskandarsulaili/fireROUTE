# Mailjet

## Provider metadata
- Category: `Business`
- Provider slug: `mailjet`
- Primary official docs reviewed: `https://dev.mailjet.com/email/reference/overview/`
- Additional official pages reviewed:
  - `https://documentation.mailjet.com/hc/en-us`
  - `https://dev.mailjet.com/email/reference/send-emails/`
  - `https://dev.mailjet.com/email/reference/messages/`
  - `https://dev.mailjet.com/email/reference/segmentation/`
  - `https://dev.mailjet.com/email/reference/templates/`
  - `https://dev.mailjet.com/email/reference/statistics/`
  - `https://dev.mailjet.com/email/reference/message-events/`
  - `https://dev.mailjet.com/email/reference/webhook/`
  - `https://dev.mailjet.com/email/reference/parse/`
  - `https://dev.mailjet.com/email/reference/authentication/`
  - `https://dev.mailjet.com/email/reference/versioning/`
  - the officially linked contact-management and campaign-draft subpages opened from the same Mailjet Email API reference
- Manually confirmed route count in this review: `78`
- Counting note: `78` is a conservative minimum from the officially browsed Email API pages and tabs listed below. The docs also expose additional campaign, sender-address/domain, and settings pages that were visible in the navigation but not fully re-counted in this pass.

## What the official docs currently confirm

### Active documentation hosts
- The older support-center docs host `https://documentation.mailjet.com/hc/en-us` still stops on a Cloudflare `Performing security verification` interstitial in this environment.
- Mailjet's current developer reference at `https://dev.mailjet.com/email/reference/overview/` is publicly browsable and contains the live Email API route reference.
- Mailjet still markets a RESTful Email API, SMTP relay, event tracking/webhooks, and inbound parsing on first-party pages.

### Base URLs and versioning
From the official `Versioning` page and route pages:
- Core Email API root: `https://api.mailjet.com/v3/`
- Main REST resource family: `https://api.mailjet.com/v3/REST`
- Transactional Send API v3: `https://api.mailjet.com/v3/send`
- Transactional Send API v3.1: `https://api.mailjet.com/v3.1/send`
- SMS API root also appears in the same versioning page as `https://api.mailjet.com/v4/`, but SMS was not the focus of this business-category provider review.

### Authentication
From the official `Authentication` page:
- Email API endpoints use `HTTPS Basic Auth`.
- Username = Mailjet `API Key`.
- Password = Mailjet `API Secret Key`.
- Keys are managed in Mailjet's official API key management UI.
- The same page separately documents SMS Bearer-token auth, which is out of scope for the Email API routes below.

### Formats, errors, and common request conventions
From the official introduction page and sampled endpoint pages:
- Mailjet describes the API as RESTful and JSON-based.
- Request and response bodies are JSON, including errors.
- Reviewed collection endpoints repeatedly expose pagination and listing controls such as:
  - `Limit`
  - `Offset`
  - `countOnly`
  - `Sort`
- Reviewed filtering endpoints repeatedly expose Unix timestamp and RFC3339 timestamp support via fields such as `FromTS`, `ToTS`, `EventFromTs`, and `EventToTs`.
- Reviewed endpoint pages consistently link to a shared official `error page` for API error details.

### Rate limits
- Mailjet exposes a dedicated `Rate Limits` page in the official Email API navigation.
- In this browser session I did not obtain a stable standalone render with numeric ceilings, so no numeric request-per-second or request-per-minute cap is claimed here.
- The reviewed route pages do not embed a universal numeric ceiling next to each endpoint.

## Manually confirmed route inventory (`78` routes)

### Transactional send (`2` routes)
Base families used on the reviewed page:
- `POST https://api.mailjet.com/v3/send` — Send API v3
- `POST https://api.mailjet.com/v3.1/send` — Send API v3.1

Notable reviewed request details:
- v3 emphasizes higher per-call message volume.
- v3.1 is documented as providing more detailed sending-feedback/error detail.
- Reviewed body fields include `FromEmail`, `FromName`, `Sender`, and recipient arrays.

### Messages (`7` routes)
Base family: `https://api.mailjet.com/v3/REST`
- `GET /message`
- `GET /message/{message_ID}`
- `GET /messagehistory/{message_ID}`
- `GET /messageinformation`
- `GET /messageinformation/{message_ID}`
- `GET /messagesentstatistics`
- `GET /messagesentstatistics/{message_ID}`

Reviewed query/filter examples:
- `Campaign`, `Contact`, `CustomID`, `Destination`
- `FromTS`, `ToTS`
- `Limit`, `Offset`
- message-state / message-status filters

### Segmentation (`1` directly reviewed route)
- `POST /contactfilter`

Reviewed request fields:
- `Expression` (required)
- `Name` (required)
- `Description`

### Templates (`2` directly reviewed routes)
- `POST /template`
- `POST /template/{template_ID}/detailcontent`

Reviewed request fields include template metadata such as:
- `Name`
- `Author`
- `Categories`
- `EditMode`
- `Locale`
- `OwnerType`
- `Purposes`

### Statistics (`16` directly visible routes on the reviewed page)
- `GET /campaignoverview`
- `GET /campaignoverview/{IDType}|{ID}`
- `GET /contactstatistics`
- `GET /contactstatistics/{contact_ID}`
- `GET /geostatistics`
- `GET /listrecipientstatistics`
- `GET /listrecipientstatistics/{listrecipient_ID}`
- `GET /statcounters`
- `GET /statistics/link-click`
- `GET /statistics/recipient-esp`
- `GET /toplinkclicked`
- `GET /useragentstatistics`
- `GET /apikeytotals`
- `GET /campaigngraphstatistics`
- `GET /campaigngraphstatistics/{campaign_ID}`
- `GET /campaignstatistics`

The same page was visibly longer than the initially displayed table segment, so this count is intentionally conservative.

### Message events (`5` routes)
- `GET /bouncestatistics`
- `GET /bouncestatistics/{message_ID}`
- `GET /clickstatistics`
- `GET /openinformation`
- `GET /openinformation/{message_ID}`

Reviewed query examples:
- `CampaignID`, `ContactsList`
- `EventFromTs`, `EventToTs`
- `FromTS`, `ToTS`
- `Period`
- `Limit`, `Offset`

### Webhook (`1` directly reviewed route)
- `POST /eventcallbackurl`

Reviewed request fields:
- `Url` (required)
- `EventType`
- `IsBackup`
- `Status`

### Parse / inbound processing (`1` directly reviewed route)
- `POST /parseroute`

Reviewed request fields:
- `Url` (required)
- `Email`
- `APIKeyID`

The docs explain that Mailjet can generate the parse address automatically if you do not provide one.

### Contacts (`39` routes across reviewed contact-management pages)

#### Contact (`4` routes)
- `POST /contact`
- `GET /contact`
- `GET /contact/{contact_ID}`
- `PUT /contact/{contact_ID}`

Reviewed parameter patterns:
- path alternatives may accept either numeric IDs or URL-encoded email addresses
- list endpoints use `Limit`, `Offset`, `countOnly`, and `Sort`

#### Contact lists (`5` routes)
- `POST /contactslist`
- `GET /contactslist`
- `GET /contactslist/{list_ID}`
- `PUT /contactslist/{list_ID}`
- `DELETE /contactslist/{list_ID}`

#### Bulk contact management (`9` routes)
- `POST /contact/managemanycontacts`
- `POST /contactslist/{list_ID}/importlist`
- `POST /contactslist/{list_ID}/managemanycontacts`
- `POST /csvimport`
- `GET /contact/managemanycontacts/{job_ID}`
- `GET /contactslist/{list_ID}/importlist/{job_ID}`
- `GET /contactslist/{list_ID}/managemanycontacts/{job_ID}`
- `GET /csvimport/{importjob_ID}`
- `PUT /csvimport/{importjob_ID}`

Important reviewed behavior:
- bulk jobs return job IDs for polling
- CSV import jobs support in-progress updates / abort behavior through `PUT /csvimport/{importjob_ID}`

#### Contact properties (`9` routes)
- `POST /contactmetadata`
- `GET /contactdata`
- `GET /contactdata/{contact_ID}`
- `GET /contactmetadata`
- `GET /contactmetadata/{contactmetadata_ID}`
- `PUT /contactdata/{contact_ID}`
- `PUT /contactmetadata/{contactmetadata_ID}`
- `DELETE /contactdata/{contact_ID}`
- `DELETE /contactmetadata/{contactmetadata_ID}`

Reviewed property-related request details:
- metadata creation includes `Name`, `Datatype`, and `NameSpace`
- contact-data updates assign property `Name` / `Value` pairs to individual contacts

#### Subscriptions (`10` routes)
- `POST /contact/{contact_ID}/managecontactslists`
- `POST /contactslist/{list_ID}/managecontact`
- `POST /listrecipient`
- `GET /contact/{contact_ID}/getcontactslists`
- `GET /contactslistsignup`
- `GET /contactslistsignup/{signuprequest_ID}`
- `GET /listrecipient`
- `GET /listrecipient/{listrecipient_ID}`
- `PUT /listrecipient/{listrecipient_ID}`
- `DELETE /listrecipient/{listrecipient_ID}`

Reviewed subscription-management semantics:
- route bodies repeatedly use per-list `Action` values such as add/remove/unsub-style operations
- `PUT /listrecipient/{listrecipient_ID}` updates recipient unsubscribe state
- `DELETE /listrecipient/{listrecipient_ID}` removes a contact from a list

#### Verification jobs (`2` routes)
- `POST /contactslist/{list_ID}/verify`
- `GET /contactslist/{list_ID}/verify/{job_ID}`

Reviewed job behavior:
- verification is asynchronous
- Mailjet recommends polling roughly every 30 seconds
- docs say jobs typically finish within about 5 minutes

### Campaign drafts (`4` directly reviewed routes)
The campaigns navigation visibly exposes both `Drafts` and `Sent Campaigns`; only the Drafts create page was directly counted in this pass.
- `POST /campaigndraft`
- `POST /campaigndraft/{draft_ID}/detailcontent`
- `POST /newsletter`
- `POST /newsletter/{newsletter_ID}/detailcontent`

Reviewed draft fields include:
- `EditMode`
- `ReplyEmail`
- `SenderName`
- `TemplateID`
- `Title`
- `ContactsListID`

## Pagination and filtering notes
Patterns repeatedly confirmed on reviewed collection endpoints:
- Offset-style pagination via `Limit` + `Offset`
- lightweight counting via `countOnly=true`
- server-side ordering via `Sort`
- timestamp filtering via Unix timestamps or RFC3339 datetimes
- object-specific filters such as campaign IDs, contact IDs, list IDs, and event-period selectors

## Important usage notes for fireROUTE
- Prefer the developer-doc host `dev.mailjet.com` over the older support-center host for current endpoint work.
- Normalize Mailjet Email API REST routes under `https://api.mailjet.com/v3/REST`, while treating transactional send as separate versioned roots at `/v3/send` and `/v3.1/send`.
- Use HTTPS Basic Auth for Email API calls.
- Expect JSON bodies and JSON error responses.
- Many Mailjet resources accept either numeric IDs or URL-encoded email/list-address alternatives; preserve both in route documentation when present.
- Bulk import / verification operations are asynchronous and job-polled rather than immediate.
- This file intentionally records a conservative minimum route count (`78`) from the directly reviewed Email API pages; future quality-improvement passes can still expand the inventory by exhaustively counting the remaining campaign, sender-domain, and settings pages.
