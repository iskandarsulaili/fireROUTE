# Srp Energy

## Provider metadata
- Category: `Environment`
- Provider slug: `srp-energy`
- Official docs inspected manually:
  - assigned index URL: `https://srpenergy-api-client-python.readthedocs.io/en/latest/api.html`
  - official provider surface inferred from that page: `https://myaccount.srpnet.com/myaccountapi/api/usage/hourlydetail`
- Manual review outcome: no official SRP public API reference located; assigned docs URL is an unofficial client project
- Manually confirmed routes in this pass: `0`

## Blocker note
The assigned documentation URL is an unofficial Read the Docs page for a community Python client, and it explicitly describes itself as unofficial. It exposes a likely customer-portal endpoint (`https://myaccount.srpnet.com/myaccountapi/api/usage/hourlydetail`) plus login/XSRF-token steps, but this is not an official SRP developer reference. During this pass no official SRP public API documentation page with terms, auth model, request schema, pagination, or supported endpoint catalog was available from the assigned official source path.

## What was still confirmed
- The unofficial client documents a three-step workflow: log into the SRP site, fetch an XSRF token, then call the hourly usage detail endpoint.
- The visible usage endpoint is `GET /myaccountapi/api/usage/hourlydetail` on `myaccount.srpnet.com` with query parameters such as `billaccount`, `beginDate`, and `endDate`, and it requires an `x-xsrf-token` header.

## fireROUTE note
Because the only route-level material found during this pass was explicitly unofficial, treat SRP Energy as blocked pending an official SRP developer or customer API reference.