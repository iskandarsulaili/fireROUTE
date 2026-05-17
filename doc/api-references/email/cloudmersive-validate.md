# Cloudmersive Validate

Official docs manually reviewed:
- https://cloudmersive.com/validate-api
- https://docs.cloudmersive.com/ApiConsoleExample?method=post&path=/validate/email/address/full

## Overview
For the email-validation capability specifically, the reviewed official Cloudmersive docs expose a single documented email-verification route under the broader Validate API product.

Confirmed from the reviewed official docs:
- Base URL: `https://api.cloudmersive.com`
- Confirmed email-validation path: `/validate/email/address/full`
- Method: `POST`
- Authentication: API key in the `Apikey` request header
- Request format shown by the official cURL example: JSON body containing a single string email value

## Authentication
The reviewed API console explicitly configures API key auth as `Apikey`.

Confirmed cURL auth/header pattern from the official docs:

```bash
curl --location --request POST 'https://api.cloudmersive.com/validate/email/address/full' \
  --header 'Content-Type: application/json' \
  --header 'Apikey: YOUR-API-KEY-HERE' \
  --data-raw '"<string>"'
```

## Confirmed endpoint

| Method | Path | Purpose |
|---|---|---|
| POST | `/validate/email/address/full` | Perform full email-address validation |

Manual route count confirmed from the official docs reviewed for the email-validation surface: **1**.

## Request details
Confirmed from the reviewed official docs:
- request body is a JSON string representing the email address to validate
- official SDK example parameter name: `email`
- official parameter description: email address to validate, for example `support@cloudmersive.com`
- required headers shown by the official cURL example:
  - `Content-Type: application/json`
  - `Apikey: YOUR-API-KEY-HERE`

## Response format
The product page’s embedded verification example and API-console positioning confirm that the route returns structured validation results for:
- overall email validity
- mail server presence
- syntax validity
- domain validity
- mailbox validity
- catch-all detection
- free-provider detection
- disposable-address detection

The reviewed product page shows these example result labels in the interactive verifier:
- `Email Valid?`
- `Mail Server`
- `Valid Syntax?`
- `Valid Domain?`
- `Valid Mailbox?`
- `Is Catch-All?`
- `Free Provider?`
- `Is Disposable?`

## Errors
The reviewed pages do not publish a compact endpoint-specific error-code table for this email route in the visible documentation that was manually reviewed.

What is confirmed:
- the route is protected by API-key auth, so missing/invalid API keys should be treated as authentication failures
- request-body formatting matters because the official example sends a JSON string body, not a complex object

## Pagination
Not applicable. This is a single-email validation endpoint.

## Rate limits
The reviewed official pages did **not** publish a numeric per-route or global rate-limit table for this endpoint.

## Important usage notes
- Cloudmersive’s Validate API product page groups multiple validation products together; for the email category, the reviewed official route was specifically `/validate/email/address/full`.
- The official examples use a raw JSON string as the request body rather than a named JSON object.
- The product page highlights real-time mailbox, catch-all, free-provider, and disposable detection as core features.
- The same broader Validate API family also exposes phone/VAT/etc. endpoints, but those are outside this email-provider document.

## fireROUTE notes
- Model this provider as a one-route email verification provider.
- Preserve the provider-specific `Apikey` header name.
- Treat the response as a rich validation payload rather than just a boolean-validity check.
