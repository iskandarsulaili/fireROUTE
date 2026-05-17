# Lazada

## Provider metadata
- Category: `Shopping`
- Provider slug: `lazada`
- Docs used manually:
  - `https://open.lazada.com/doc/doc.htm#?nodeId=29586&docId=120248`
  - `https://open.lazada.com/apps/doc/api?path=%2Fseller%2Fget`
- Confirmed regional API base URLs from the reviewed method page:
  - `https://api.lazada.vn/rest`
  - `https://api.lazada.sg/rest`
  - `https://api.lazada.com.ph/rest`
  - `https://api.lazada.com.my/rest`
  - `https://api.lazada.co.th/rest`
  - `https://api.lazada.co.id/rest`
- Authentication model surfaced in the reviewed official method page: signed request with app credentials plus seller `access_token`
- Manually confirmed routes in this pass: `1`

## Authentication
From the official `GetSeller` method page:
- Lazada requires these common parameters on authenticated API calls:
  - `app_key` - the app ID issued by the Lazada Open Platform console
  - `timestamp` - request timestamp; the reviewed page says it must differ from UTC by less than `7200s`
  - `access_token` - API call credential for the authorized seller
  - `sign_method` - HMAC hash algorithm used to calculate the signature
  - `sign` - request signature used to verify the caller
- The reviewed route page is explicitly marked `Authorization Required`

## Request and response conventions
From the reviewed official pages:
- region-specific REST hosts are used instead of one universal host
- Lazada's official route pages expose a path that is appended to the relevant regional `/rest` host
- responses are JSON objects containing top-level fields such as `code`, `data`, and `request_id`
- the reviewed docs page also exposes a large multi-category API catalog in the left navigation, but only one route was fully expanded and verified in this pass

## Manually confirmed endpoint set

### 1) Get seller
- Method: `GET`
- Path: `/seller/get`
- Full URL pattern: `{regional-rest-base}/seller/get`
- Purpose: retrieve seller information for the currently authorized seller account
- Route-specific parameters: none; the reviewed page says `No Data` under route parameters
- Common auth/signing parameters required on the reviewed page:
  - `app_key`
  - `timestamp`
  - `access_token`
  - `sign_method`
  - `sign`
- Response fields explicitly shown in the reviewed example:
  - `code`
  - `request_id`
  - `data.name_company`
  - `data.logo_url`
  - `data.name`
  - `data.verified`
  - `data.location`
  - `data.marketplaceEaseMode`
  - `data.seller_id`
  - `data.email`
  - `data.short_code`
  - `data.cb`
  - `data.status`

## Errors
The reviewed official method page explicitly listed:
- `IllegalAccessToken` - `The specified access token is invalid or expired`

## Pagination
- No pagination parameters were documented on the reviewed `GetSeller` page
- The reviewed pages in this pass did not publish a general Lazada-wide pagination guide that I could confirm with high confidence

## Rate limits
- No numeric rate-limit quota was published on the reviewed pages used in this pass

## Important usage notes
- Lazada uses market-specific REST hosts, so fireROUTE adapters should keep the seller's market/region available at request-construction time.
- The reviewed method page documents auth as signed parameter-based requests, not as a simple bearer header.
- The official guide root visibly lists many additional API families and route names, but I counted only the fully expanded and parameterized `GET /seller/get` method as manually confirmed in this pass.

## Sources inspected
- `https://open.lazada.com/doc/doc.htm#?nodeId=29586&docId=120248`
- `https://open.lazada.com/apps/doc/api?path=%2Fseller%2Fget`
