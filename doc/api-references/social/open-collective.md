# Open Collective

## Provider metadata
- Category: `Social`
- Provider slug: `open-collective`
- Official docs pages used:
  - `https://docs.opencollective.com/help/developers/api`
  - `https://docs.opencollective.com/help/contributing/development/api`
- Main confirmed base URL from the reviewed pages: `https://pdf.opencollective.com`
- Auth model confirmed on the reviewed pages: none required for the documented PDF receipt/invoice endpoints
- Primary response format confirmed on the reviewed pages: PDF file responses over HTTPS
- Manually confirmed route count: `3`

## Scope of the reviewed official docs
- The reviewed Open Collective developer/help pages surfaced a small set of directly callable PDF receipt and invoice endpoints.
- Those same pages also reference broader developer tooling, but the reviewed page set did not expose a stable non-PDF REST route catalog clearly enough to count additional routes here.
- This manual file therefore documents the official routes that were explicitly visible and stable in the reviewed pages.

## Authentication
- The reviewed PDF endpoints are presented as direct `GET` URLs and do not document an OAuth or API-key requirement for basic receipt/invoice retrieval.
- No custom auth headers were shown on the reviewed PDF examples.

## Canonical endpoints

#### 1) Get an expense invoice PDF
- Method: `GET`
- URL pattern: `https://pdf.opencollective.com/expense/{expenseUUID}/invoice.pdf`
- Purpose: return the generated invoice PDF for a specific expense
- Path parameter:
  - `expenseUUID` - the expense UUID referenced by Open Collective

#### 2) Get a collective receipt PDF for a date range
- Method: `GET`
- URL pattern: `https://pdf.opencollective.com/receipts/collectives/{fromCollective}/{host}/{fromDate}/{toDate}/receipt.pdf`
- Purpose: return a receipt PDF covering a collective/host relationship across a requested date range
- Path parameters:
  - `fromCollective` - source collective slug or identifier used by the route
  - `host` - host slug or identifier used by the route
  - `fromDate` - range start date
  - `toDate` - range end date

#### 3) Get a transaction receipt PDF
- Method: `GET`
- URL pattern: `https://pdf.opencollective.com/receipts/transactions/{transactionUUID}/receipt.pdf`
- Purpose: return the receipt PDF for a specific transaction
- Path parameter:
  - `transactionUUID` - the transaction UUID referenced by Open Collective

## Parameters, formats, and behavior notes
- All confirmed routes are path-parameter driven and use `GET`.
- The reviewed examples did not show query parameters for the documented routes.
- The returned payload is a PDF document rather than JSON.
- Because these are document-generation/download endpoints, pagination does not apply to the confirmed route set.

## Errors and usage notes
- The reviewed help pages do not publish a dedicated error-schema section for these PDF endpoints.
- Integrations should therefore expect standard HTTP success/failure handling for file downloads.
- fireROUTE should treat this provider's confirmed surface as file-delivery oriented, not as a conventional JSON REST collection API.
- If broader Open Collective API coverage is needed later, re-review the official GraphQL/developer pages and only add routes that are explicitly published on first-party documentation pages.
