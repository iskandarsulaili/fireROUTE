# Transport for Manchester, England

## Provider metadata
- Category: `Transportation`
- Provider slug: `transport-for-manchester-england`
- Provider identity confirmed from reviewed official pages as: `Transport for Greater Manchester (TfGM)` / `Bee Network`
- Official sources reviewed manually in this pass:
  - assigned docs URL: `https://developer.tfgm.com/`
  - official redirect target reached from the assigned docs URL: `https://tfgm.com/data-analytics-and-insight/open-data-portal?utm_source=redirect&utm_medium=referral&utm_campaign=developer_tfgm/`
  - official alternative page: `https://tfgm.com/data-analytics-and-insight`

## Manual review result
- Status: `manual_blocked`
- Confirmed route count for this exact provider row: `0`

## Verified findings from official pages
- The assigned docs URL `https://developer.tfgm.com/` currently redirects to the official Bee Network / TfGM page titled `Open Data Portal | Bee Network | Powered by TfGM`.
- That official page states: `Our Open Data Portal providing real time data feeds is no longer in operation.`
- The same page also states:
  - `Current API keys for real time Metrolink data will continue to function`
  - `the creation of new subscriptions or new keys is not possible`
  - TfGM is exploring a new solution and will provide updates on that page and by email to registered API subscribers
- The page publishes the official contact address `opendata@tfgm.com`.
- The official alternative page titled `Data, analytics and insight | Bee Network | Powered by TfGM` does not restore a current TfGM-hosted API catalogue.
- Instead, the alternative page points users to broader or external data sources, including:
  - the `TfGM data.gov.uk page`
  - the `DfT Bus Open Data Scheme`
  - the national stop and station dataset on `data.gov.uk`
  - the `Beryl open data page`
- Across the reviewed official pages, no active public route inventory, operation reference, request examples, or onboarding flow for new TfGM API consumers was exposed.

## fireROUTE publication fields
- Assigned docs URL confirmed: `https://developer.tfgm.com/`
- Official redirect target observed during review: `https://tfgm.com/data-analytics-and-insight/open-data-portal?utm_source=redirect&utm_medium=referral&utm_campaign=developer_tfgm/`
- Official alternative page: `https://tfgm.com/data-analytics-and-insight`
- Provider API base URL: not publicly documented on the reviewed official pages.
- Endpoint paths: not publicly documented.
- HTTP methods: not publicly documented.
- Parameters or request bodies: not publicly documented.
- Authentication:
  - the reviewed official portal page confirms legacy real-time Metrolink API keys still function for previously issued keys
  - the same page confirms new subscriptions and new keys cannot currently be created
  - no current auth contract for new consumers was exposed
- Rate limits: not publicly documented.
- Pagination: not publicly documented.
- Errors: no public error model was exposed on the reviewed official pages.
- Response formats: not publicly documented.
- Important usage notes:
  - the former TfGM open-data portal is retired rather than functioning as a current public developer reference
  - the official TfGM data page now points users toward external or broader datasets instead of a current TfGM-hosted route catalogue

## Why this provider remains blocked
- I manually checked the assigned official entrypoint and one official alternative TfGM page.
- The reviewed official portal explicitly states that the former real-time data portal is no longer in operation.
- Existing keys may continue working for prior users, but the reviewed official flow does not allow new subscriptions or new keys.
- Because the reviewed official pages do not expose a current public base URL, route inventory, auth workflow for new consumers, or operation-level reference for this exact provider row, this provider remains `manual_blocked`.

## Sources inspected
- `https://developer.tfgm.com/`
- `https://tfgm.com/data-analytics-and-insight/open-data-portal?utm_source=redirect&utm_medium=referral&utm_campaign=developer_tfgm/`
- `https://tfgm.com/data-analytics-and-insight`
