# Mailboxlayer

## Provider metadata
- Category: `APILayer Featured`
- Provider slug: `mailboxlayer`
- Official docs inspected manually:
  - `https://mailboxlayer.com/`
  - `https://docs.apilayer.com/mailboxlayer/docs/quickstart-guide`
- Confirmed API base URL: `https://apilayer.net/api`
- Response format confirmed from docs: JSON
- Authentication model: query-string `access_key`
- Manually confirmed routes in this pass: `2`

## Manually confirmed endpoints
| Method | Path | Purpose | Key documented parameters |
|---|---|---|---|
| GET | `/check` | Validate one email address and return deliverability metadata | required `access_key`, required `email`; optional flags documented in quickstart/docs |
| GET | `/bulk_check` | Validate multiple email addresses in one request | required `access_key`, required `emails` |

## Response notes
The official quickstart explicitly documents fields such as:
- `email`
- `did_you_mean`
- `user`
- `domain`
- `format_valid`
- `mx_found`
- `smtp_check`
- `catch_all`
- `role`
- `disposable`
- `free`
- `score`

## Usage notes
- The quickstart uses `https://apilayer.net/api/check?access_key=...&email=...` as the canonical example.
- The docs position `/bulk_check` as a higher-tier feature for validating multiple emails in one call.
- The API focuses on syntax, MX, SMTP, catch-all, role-address, disposable-provider, and scoring checks.

## Verification notes
This file was manually rebuilt from Mailboxlayer's official site and APILayer-hosted quickstart/docs.