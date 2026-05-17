# Flickr

## Overview
- Provider: Flickr API
- Category: Photography
- Official docs: `https://www.flickr.com/services/api/`
- Primary base URLs:
  - `https://www.flickr.com/services/rest/` — main API transport
  - `https://up.flickr.com/services/upload/` — binary photo upload
  - `https://up.flickr.com/services/replace/` — binary photo replacement
- OAuth base endpoints:
  - `https://www.flickr.com/services/oauth/request_token`
  - `https://www.flickr.com/services/oauth/authorize`
  - `https://www.flickr.com/services/oauth/access_token`
- Auth:
  - OAuth 1.0a for authenticated calls
  - OAuth signing is required with `HMAC-SHA1`; the auth guide says Flickr currently supports only HMAC-SHA1 signatures
  - upload and replace both require authenticated write permission
- HTTPS: yes
- Response formats:
  - REST/XML is the default transport response
  - JSON is available with `format=json`
  - raw JSON requires `nojsoncallback=1`
  - custom callback names use `jsoncallback=...`
  - docs also publish XML-RPC, SOAP, PHP, and JSON response-format pages
- Pagination: no single global pagination chapter was published on the inspected pages; many individual list/search methods expose their own page/per-page parameters in method-specific docs
- Rate limits: no numeric API-wide request-rate limits were published on the inspected pages; the upload docs point developers to `flickr.people.getUploadStatus` for file/bandwidth limits

## Confirmed endpoint architecture
### Core REST transport
All standard Flickr API methods are invoked against one endpoint:
- `GET` or `POST https://www.flickr.com/services/rest/?method=flickr.some.method&...`

The request-format page shows this canonical example:
- `https://www.flickr.com/services/rest/?method=flickr.test.echo&name=value`

### Binary media endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| POST | `https://up.flickr.com/services/upload/` | multipart `photo`, optional `title`, `description`, `tags`, `is_public`, `is_friend`, `is_family`, `safety_level`, `content_type`, `hidden` | Upload a new photo. Write auth required. |
| POST | `https://up.flickr.com/services/replace/` | multipart `photo`, required `photo_id`, optional `async` | Replace an existing photo. Write auth required. |

### OAuth flow endpoints
The auth guide documents these OAuth 1.0a endpoints:
- `https://www.flickr.com/services/oauth/request_token`
- `https://www.flickr.com/services/oauth/authorize`
- `https://www.flickr.com/services/oauth/access_token`

## Confirmed REST method inventory
The official API index currently lists **224** named Flickr REST methods on the shared `/services/rest/` endpoint. Adding the 2 binary media endpoints above yields a confirmed fireROUTE route count of **226**.

### REST method family counts
| Family | Methods |
|---|---:|
| `flickr.activity` | 2 |
| `flickr.auth` | 6 |
| `flickr.blogs` | 3 |
| `flickr.cameras` | 2 |
| `flickr.collections` | 2 |
| `flickr.commons` | 1 |
| `flickr.contacts` | 4 |
| `flickr.favorites` | 5 |
| `flickr.galleries` | 10 |
| `flickr.groups` | 5 |
| `flickr.groups.discuss` | 8 |
| `flickr.groups.members` | 1 |
| `flickr.groups.pools` | 5 |
| `flickr.interestingness` | 1 |
| `flickr.machinetags` | 5 |
| `flickr.panda` | 2 |
| `flickr.people` | 10 |
| `flickr.photos` | 34 |
| `flickr.photos.comments` | 5 |
| `flickr.photos.geo` | 9 |
| `flickr.photos.licenses` | 4 |
| `flickr.photos.notes` | 3 |
| `flickr.photos.suggestions` | 5 |
| `flickr.photosets` | 14 |
| `flickr.photosets.comments` | 4 |
| `flickr.places` | 15 |
| `flickr.prefs` | 5 |
| `flickr.profile` | 1 |
| `flickr.push` | 4 |
| `flickr.reflection` | 2 |
| `flickr.stats` | 16 |
| `flickr.tags` | 9 |
| `flickr.test` | 3 |
| `flickr.testimonials` | 13 |
| `flickr.urls` | 6 |

## Shared request and auth parameters
### REST transport parameters
The inspected request/response pages document these shared transport/query controls:
- `method` — Flickr method name such as `flickr.test.echo`
- `format=json` — request JSON instead of default REST/XML-style output
- `nojsoncallback=1` — return raw JSON without wrapper function
- `jsoncallback=YOUR_FUNCTION` — wrap JSON in a named callback function

### OAuth 1.0a parameters
The auth guide examples use these standard OAuth parameters:
- `oauth_consumer_key`
- `oauth_nonce`
- `oauth_timestamp`
- `oauth_signature_method=HMAC-SHA1`
- `oauth_version=1.0`
- `oauth_signature`
- `oauth_callback` for request-token step
- `oauth_token`
- `oauth_verifier`

The guide says:
- all requests must be signed
- Flickr currently supports only HMAC-SHA1 signatures
- the base string is the HTTP verb + request URL + all request parameters sorted lexicographically

### Upload parameters
The upload spec documents:
- required `photo`
- optional `title`
- optional `description`
- optional `tags`
- optional visibility flags `is_public`, `is_friend`, `is_family`
- optional `safety_level` (`1` safe, `2` moderate, `3` restricted)
- optional `content_type` (`1` photo, `2` screenshot, `3` other)
- optional `hidden` (`1` keep in global search, `2` hide from public searches)

### Replace parameters
The replace spec documents:
- required `photo`
- required `photo_id`
- optional `async`

## OAuth flow notes
The official auth page documents this 3-step flow:
1. Get request token from `.../oauth/request_token`
2. Redirect user to `.../oauth/authorize`
3. Exchange approved request token at `.../oauth/access_token`

The examples show:
- request-token response fields such as `oauth_callback_confirmed`, `oauth_token`, `oauth_token_secret`
- access-token response fields such as `fullname`, `oauth_token`, `oauth_token_secret`, `user_nsid`, `username`
- authenticated API calls are then sent to `/services/rest` with OAuth parameters plus `method=...`

## Response and error notes
### JSON response behavior
The JSON format page documents:
- successful JSON responses default to `jsonFlickrApi({...});`
- failures also call `jsonFlickrApi(...)` unless raw JSON is requested
- raw JSON requires `nojsoncallback=1`
- a custom wrapper uses `jsoncallback=...`
- top-level JSON includes `stat`, and on errors includes simplified fields like `code` and `message`

Example failure shape from the docs:
- `{"stat":"fail","code":"97","message":"Missing signature"}`

### Upload success/error behavior
Upload success returns REST-style XML:
- `<photoid>1234</photoid>`

The upload page lists these upload-specific error codes:
- `2` no photo specified
- `3` general upload failure
- `4` filesize was zero
- `5` filetype not recognized
- `6` upload limit reached
- `7` user exceeded video upload limit
- `8` filesize too large
- `9` duplicate photo/video detected
- `10` invalid external image URL
- `11` fetch from external image failed
- `12` invalid clone metadata source photo
- `13` clone source does not belong to uploader
- `14` auto upload disabled / server at capacity / non-pro desktop upload wait case
- `15` non-safe content not allowed
- plus common platform/auth errors `95`, `96`, `97`, `98`, `99`, `100`, `105`, `106`, `116`

### Replace success/error behavior
Replace success returns XML like:
- `<photoid secret="abcdef" originalsecret="abcdef">1234</photoid>`

The replace page lists these replace-specific error codes:
- `1` not a pro account
- `2` no photo specified
- `3` general upload failure
- `4` filesize was zero
- `5` filetype not recognized
- `6` upload limit reached
- `15` non-safe content not allowed
- plus common platform/auth errors `95`, `96`, `97`, `98`, `99`, `100`, `105`, `106`, `116`

## Important usage notes
- Flickr's normal method surface is not path-expanded REST; almost everything is multiplexed through `/services/rest/` with the `method` parameter.
- Upload and replace are separate binary POST services outside the normal REST transport.
- The upload and replace specs both say the binary `photo` field must not be included in the OAuth signature; other POST parameters should be signed.
- After uploading sets of photos, the upload page recommends redirecting users to `http://www.flickr.com/photos/upload/edit/?ids=1,2,3` with comma-separated uploaded IDs.
- The developer guide emphasizes community-oriented use and explicitly frames Flickr as more than generic photo storage or stock-image infrastructure.
- The API keys page exists at `https://www.flickr.com/services/api/keys/`, but on this run it redirected to a Flickr login page rather than exposing public key-registration instructions without authentication.

## fireROUTE integration notes
- Model Flickr as a method-multiplexed API rather than a large set of independent URL paths.
- Preserve the `method=` parameter verbatim because it is the real operation selector for the 224 documented REST methods.
- Keep upload and replace as separate binary-capable routes with multipart handling and write-scope auth.
- Prefer raw JSON mode (`format=json&nojsoncallback=1`) when building adapters.
- Treat pagination as method-specific metadata instead of assuming one global rule for all REST methods.
- Do not advertise numeric API-wide request-rate guarantees; the inspected official pages did not publish one.

## Sources inspected
- `https://www.flickr.com/services/api/`
- `https://www.flickr.com/services/api/request.rest.html`
- `https://www.flickr.com/services/api/auth.oauth.html`
- `https://www.flickr.com/services/api/response.json.html`
- `https://www.flickr.com/services/api/upload.api.html`
- `https://www.flickr.com/services/api/replace.api.html`
- `https://www.flickr.com/services/developer/`
- `https://www.flickr.com/services/api/keys/` (redirected to Flickr login)
