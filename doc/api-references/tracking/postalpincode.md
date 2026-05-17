# PostalPinCode

## Provider metadata
- Category: `Tracking`
- Provider slug: `postalpincode`
- Official docs used manually:
  - `http://www.postalpincode.in/Api-Details`
- Confirmed API base URL: `https://api.postalpincode.in`
- Primary response format: JSON
- Authentication: none documented
- Manually confirmed routes in this pass: `2`

## Access model
From the reviewed official page:
- the API is presented as a public JSON API for India Post lookup data
- no API key, OAuth flow, or session/login requirement is documented
- the docs focus on direct URL usage for lookups

## Confirmed API surface
The reviewed docs explicitly document these routes:
- `GET /pincode/{PINCODE}`
- `GET /postoffice/{POSTOFFICEBRANCHNAME}`

## 1) Search by postal PIN code
- Method: `GET`
- Path: `/pincode/{PINCODE}`
- Purpose: return one or more post offices matching an Indian postal PIN code

Documented path parameter:
- `PINCODE` - required postal PIN code

Documented response envelope:
- `Message`
- `Status`
- `PostOffice`

Documented `PostOffice` fields in the reviewed example:
- `Name`
- `Description`
- `BranchType`
- `DeliveryStatus`
- `Circle`
- `District`
- `Division`
- `Region`
- `State`
- `Country`

Documented error behavior:
- invalid or unknown pin codes return:
  - `Message: "No records found"`
  - `Status: "Error"`
  - `PostOffice: null`

## 2) Search by post office branch name
- Method: `GET`
- Path: `/postoffice/{POSTOFFICEBRANCHNAME}`
- Purpose: return one or more post offices matching a branch name

Documented path parameter:
- `POSTOFFICEBRANCHNAME` - required branch name text

Documented response envelope:
- `Message`
- `Status`
- `PostOffice`

Documented `PostOffice` fields in the reviewed example:
- `Name`
- `Description`
- `PINCode`
- `BranchType`
- `DeliveryStatus`
- `Circle`
- `District`
- `Division`
- `Region`
- `State`
- `Country`

Documented error behavior:
- invalid or unmatched branch names return the same documented error-style envelope with `Status: "Error"` and `PostOffice: null`

## Pagination, rate limits, and format notes
From the reviewed official page:
- response format is JSON
- no pagination model is documented
- no API rate limits are published
- no alternate response formats are documented

## fireROUTE notes
- This is a very small lookup API with two route families and a stable response envelope.
- The `PostOffice` payload differs slightly between the two route families because branch-name lookups include `PINCode` in each record.
- The official docs page states the underlying information is collected from India Post and may contain human or technical errors, so downstream consumers should avoid treating it as authoritative without validation.

## Verification notes
This file was manually rebuilt from the live official PostalPinCode API details page using browser inspection.