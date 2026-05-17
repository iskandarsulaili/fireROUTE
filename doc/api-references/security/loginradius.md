# LoginRadius

## Provider metadata
- Category: `Security`
- Provider slug: `loginradius`
- Docs used manually:
  - `https://www.loginradius.com/docs/api/openapi/customer-identity-api/`
  - `https://www.loginradius.com/docs/api/openapi/user-registration-by-sott-email-phone-user-name/`
  - `https://www.loginradius.com/docs/api/openapi/email-by-login-user-name-phone/`
  - `https://www.loginradius.com/docs/api/openapi/passwordless-login-by-email/`
- Confirmed API base URL: `https://api.loginradius.com`
- Primary response format: JSON
- Authentication surfaces seen in the reviewed docs:
  - tenant API key / secret
  - route-specific `APIKey` or `ClientId` auth selector in the docs playground
  - `SOTT` for registration flows
- Manually confirmed routes in this pass: `4`

## Authentication
The reviewed official LoginRadius pages split auth requirements across overview prose, route playground controls, and endpoint examples.

Confirmed auth details from the official docs:
- The overview page tells users to retrieve an **API Key** and **API Secret** from the LoginRadius Admin Console under tenant API configuration
- Registration-by-SOTT routes require a **Secure One-Time Token (SOTT)**
  - it can be passed as query parameter `sott`
  - or header `X-LoginRadius-Sott`
- The overview page states SOTTs are time-bound and that automatically generated SOTTs expire after **10 minutes** by default
- Route playgrounds on the reviewed endpoint pages expose an authentication selector with:
  - `APIKey`
  - `ClientId`
- The overview page's concrete cURL example for account-identity lookup uses query auth:
  - `apikey=YOUR_API_KEY`
  - `apisecret=YOUR_API_SECRET`

Auth ambiguity worth preserving:
- The public docs clearly show several auth knobs, but they do not present one single canonical "all routes use exactly this auth transport" summary page in the reviewed material. I documented only the auth methods that were directly visible on the official pages reviewed here.

## Common request/response conventions
- Base URL shown in the official route playgrounds: `https://api.loginradius.com`
- Query-heavy design:
  - many operations place operational controls in query parameters
  - sampled routes use query params for templates, verification URLs, webhook suppression, and challenge/anti-bot fields
- Response tabs on sampled routes consistently show these status families:
  - `200`
  - `400`
  - `401`
  - `403`
  - `404`
  - `500`
- The sampled login route returns token-style JSON fields such as:
  - `access_token`
  - `refresh_token`
  - `expires_in`
  - optional second-factor/MFA objects

## Manually confirmed endpoint set

### 1) Register by email, phone, or username via SOTT
- Method: `POST`
- Path: `/identity/v2/auth/register`
- Full URL: `https://api.loginradius.com/identity/v2/auth/register`
- Purpose: create a new account using email, phone, or username with SOTT protection
- Auth/verification requirements confirmed on the official route page:
  - docs playground auth selector: `APIKey` or `ClientId`
  - SOTT must be supplied in either:
    - query param `sott`
    - header `X-LoginRadius-Sott`
- Important query parameters confirmed on the page:
  - `emailtemplate`
  - `sott`
  - `welcomeemailtemplate`
  - `verificationurl`
  - `smstemplate`
  - `prevent_webhook`
  - `fields`
  - `options`
  - `invitation_token`
  - `isvoiceotp`
- Header parameters confirmed:
  - `X-PreventWebhook`
  - `X-LoginRadius-Sott`
- Request body:
  - official schema is large and profile-oriented
  - reviewed body fields shown directly on the page include examples for:
    - `UserName`
    - `PhoneId`
    - `Gender`
    - `BirthDate`
    - `FirstName`
    - `MiddleName`
    - `LastName`
    - `Email`
    - and many other profile attributes
- Confirmed responses:
  - `200`
  - `400`
  - `403`
  - `404`
  - `500`

### 2) Login with credentials
- Method: `POST`
- Path: `/identity/v2/auth/login`
- Full URL: `https://api.loginradius.com/identity/v2/auth/login`
- Purpose: authenticate with email, username, or phone and receive tokens for later API use
- Auth surface shown by the docs playground:
  - `APIKey`
  - `ClientId`
- Important query parameters confirmed on the route page:
  - `emailtemplate`
  - `loginurl`
  - `verificationurl`
  - `smstemplate`
  - `isvoiceotp`
  - `g-recaptcha-response`
  - `breachedpasswordemailtemplate`
  - `breachedpasswordsmstemplate`
  - `prevent_webhook`
  - `fields`
  - `options`
  - multiple RBA template parameters such as:
    - `rbabrowseremailtemplate`
    - `rbaoneclickemailtemplate`
    - `rbacityemailtemplate`
    - `rbacountryemailtemplate`
    - `rbaipemailtemplate`
    - `rbadeviceemailtemplate`
    - SMS counterparts for some RBA flows
  - `invitation_token`
  - `emailtemplate2fa`
  - `duoredirecturi`
- Confirmed responses:
  - `200`
  - `400`
  - `401`
  - `403`
  - `404`
  - `500`
- Confirmed response fields on the official schema panel:
  - `access_token`
  - `refresh_token`
  - `expires_in`
  - optional `SecondFactorAuthentication`
  - profile object in successful auth responses

### 3) Initiate passwordless login by email
- Method: `GET`
- Path: `/identity/v2/auth/login/passwordlesslogin/email`
- Full URL: `https://api.loginradius.com/identity/v2/auth/login/passwordlesslogin/email`
- Purpose: start a passwordless email login flow
- Auth surface shown by the docs playground:
  - `APIKey`
  - `ClientId`
- Query parameters confirmed on the route page:
  - `email`
  - `username`
  - `passwordlesslogintemplate`
  - `verificationurl`
  - `prevent_webhook`
  - `g-recaptcha-response`
  - `g_recaptcha_response`
  - `qq_recaptcha_ticket`
  - `qq_recaptcha_randstr`
  - `h-captcha-response`
- Header parameter confirmed:
  - `X-PreventWebhook`
- Confirmed responses:
  - `200`
  - `400`
  - `401`
  - `403`
  - `404`
  - `500`
- Response note:
  - the reviewed schema panel shows a minimal success envelope with `IsPosted` boolean semantics

### 4) Get linked identities for an account
- Method: `GET`
- Path: `/identity/v2/manage/account/identities`
- Full URL: `https://api.loginradius.com/identity/v2/manage/account/identities`
- Purpose: retrieve all identities linked to a specified account
- Confirmation source:
  - the official overview page's API Playground section and sample cURL request
- Confirmed auth/query pattern from the official example:
  - `apikey=YOUR_API_KEY`
  - `apisecret=YOUR_API_SECRET`
  - account selector such as `email=user@example.com`
- Reviewed official cURL example:
  - `curl -X GET "https://api.loginradius.com/identity/v2/manage/account/identities?apikey=YOUR_API_KEY&apisecret=YOUR_API_SECRET&email=user@example.com" -H "Accept: application/json"`
- Important usage note from the overview page:
  - this is one of the example routes the official docs explicitly use to demonstrate the LoginRadius API Playground workflow

## Pagination
- No pagination model was documented on the reviewed route pages for the four sampled endpoints above
- The official public pages reviewed in this pass did not expose page/limit/cursor semantics for these operations

## Rate limits
- I did **not** find a public numeric rate-limit table on the official LoginRadius pages reviewed in this pass
- Because the job requires manual confirmation from the official site, I am intentionally not inventing per-minute or per-second quotas

## Error and response notes
Confirmed from the reviewed official route pages:
- The sampled route pages consistently expose response tabs for `200`, `400`, `401`, `403`, `404`, and `500`
- The login route's successful response schema includes token-bearing auth fields (`access_token`, `refresh_token`, `expires_in`)
- The docs are more explicit about request parameters than about fully expanded error-body JSON schemas in anonymous browsing mode

## Important usage notes
- SOTT is central to the reviewed registration flow and expires after `10` minutes by default according to the official overview page
- LoginRadius exposes many anti-bot / challenge parameters on auth routes, including Google reCAPTCHA variants, QQ captcha fields, and hCaptcha on the passwordless-email initiation route
- The overview page explicitly recommends using the official API Playground / Postman collection to test the exact route and parameter combinations for a tenant
- The route pages reviewed here show a wide set of branding/template parameters (`emailtemplate`, `smstemplate`, RBA templates, etc.), so consumers should expect tenant-specific notification behavior to be configured at request time

## Verification notes
This file was manually rebuilt from the official LoginRadius documentation pages reachable in this browser session, replacing the earlier low-fidelity generated summary.
