# UK Companies House

## Provider metadata
- Category: `Government`
- Provider slug: `uk-companies-house`
- Official docs pages used:
  - `https://developer.company-information.service.gov.uk/`
  - `https://developer-specs.company-information.service.gov.uk/`
  - `https://developer-specs.company-information.service.gov.uk/guides/authorisation`
  - `https://developer-specs.company-information.service.gov.uk/guides/rateLimiting`
  - `https://developer-specs.company-information.service.gov.uk/companies-house-public-data-api/reference`
- Current public API base URL: `https://api.company-information.service.gov.uk`
- Auth model: HTTP Basic authentication using the API key as username and blank password for public-data requests
- Response format: JSON
- Default rate limit: `600 requests per 5 minutes` per application
- Manually confirmed route count: `34`

## Authentication
- The official authorisation guide says every Companies House API request must include authentication credentials.
- For public-data requests, send the API key using HTTP Basic auth.
- Username = API key.
- Password = blank / ignored.

Example from the docs:
```bash
curl -XGET -u my_api_key: https://api.company-information.service.gov.uk/company/00000006
```

## Rate limiting
- Default limit: `600 requests within a five-minute period`.
- Exceeding the limit returns `429 Too Many Requests` for the rest of the current window.
- The docs warn that applications that regularly exceed or try to bypass limits may be banned without notice.

## Canonical endpoints
### Registered office address
1. `GET /company/{companyNumber}/registered-office-address`

### Company profile
2. `GET /company/{companyNumber}`

### Search
3. `GET /advanced-search/companies`
4. `GET /search`
5. `GET /search/companies`
6. `GET /search/officers`
7. `GET /search/disqualified-officers`
8. `GET /alphabetical-search/companies`
9. `GET /dissolved-search/companies`

### Officers
10. `GET /company/{company_number}/officers`
11. `GET /company/{company_number}/appointments/{appointment_id}`

### Registers
12. `GET /company/{company_number}/registers`

### Charges
13. `GET /company/{company_number}/charges/{charge_id}`
14. `GET /company/{company_number}/charges`

### Filing history
15. `GET /company/{company_number}/filing-history/{transaction_id}`
16. `GET /company/{company_number}/filing-history`

### Insolvency
17. `GET /company/{company_number}/insolvency`

### Exemptions
18. `GET /company/{company_number}/exemptions`

### Officer disqualifications
19. `GET /disqualified-officers/corporate/{officer_id}`
20. `GET /disqualified-officers/natural/{officer_id}`

### Officer appointments
21. `GET /officers/{officer_id}/appointments`

### UK establishments
22. `GET /company/{company_number}/uk-establishments`

### Persons with significant control (PSC)
23. `GET /company/{company_number}/persons-with-significant-control/corporate-entity-beneficial-owner/{notification_id}`
24. `GET /company/{company_number}/persons-with-significant-control/corporate-entity/{notification_id}`
25. `GET /company/{company_number}/persons-with-significant-control/individual-beneficial-owner/{notification_id}`
26. `GET /company/{company_number}/persons-with-significant-control/individual/{notification_id}`
27. `GET /company/{company_number}/persons-with-significant-control/legal-person-beneficial-owner/{notification_id}`
28. `GET /company/{company_number}/persons-with-significant-control/legal-person/{notification_id}`
29. `GET /company/{company_number}/persons-with-significant-control-statements/{statement_id}`
30. `GET /company/{company_number}/persons-with-significant-control/super-secure-beneficial-owner/{super_secure_id}`
31. `GET /company/{company_number}/persons-with-significant-control/super-secure/{super_secure_id}`
32. `GET /company/{company_number}/persons-with-significant-control`
33. `GET /company/{company_number}/persons-with-significant-control-statements`

### PSC notifications
34. `GET /company/{company_number}/persons-with-significant-control/{psc_id}/notifications`

## Parameter notes
Common path parameters confirmed across the reference:
- `companyNumber` / `company_number` - Companies House company number
- `appointment_id` - officer appointment identifier
- `charge_id` - charge identifier
- `transaction_id` - filing-history transaction identifier
- `officer_id` - officer identifier
- `notification_id` - PSC notification identifier
- `statement_id` - PSC statement identifier
- `super_secure_id` - super-secure PSC identifier
- `psc_id` - PSC identifier for notification lists

## Usage notes
- The public-data reference is read-only; all confirmed routes on the public-data API reference page are `GET` operations.
- The developer suite notes that Companies House publishes OpenAPI specifications for public APIs.
- The public-data API covers company records, officer data, filing history, insolvency, charges, and PSC disclosures.

## Error notes
- The rate-limiting guide explicitly documents `429 Too Many Requests`.
- The route reference page itself focuses on operation inventory rather than a shared error schema.

## fireROUTE normalization notes
- Auth is Basic auth with API key as username, which should be normalized separately from OAuth 2.0 filing flows.
- Public-data routes are highly resource-oriented and consistent; they map well to entity-based adapters (`company`, `officer`, `charge`, `filing-history`, `psc`).
- The official reference mixes `{companyNumber}` and `{company_number}` path casing; downstream normalization should preserve functionality while standardizing naming internally.
