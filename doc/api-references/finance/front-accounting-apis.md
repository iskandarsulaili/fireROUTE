# Front Accounting APIs

Official docs manually reviewed:
- https://frontaccounting.com/fawiki/index.php?n=Devel.SimpleAPIModule

## Overview
FrontAccounting's "SimpleAPI" is a self-hosted REST extension for FrontAccounting rather than a single vendor-operated cloud API. The reviewed wiki page describes a Slim v2.64 REST module for FrontAccounting v2.4.x, with some endpoints marked as FA 2.3.x-only.

Key reviewed characteristics:
- No universal hosted base URL; the API is mounted inside a FrontAccounting installation.
- Canonical module mount shown by the docs: `http://YOUR_FA_URL/modules/api/`
- Example direct route from the reviewed page: `http://YOUR_FA_URL/modules/api/category/`
- The page also documents an optional external PHP bridge script (`fabridge.php` / `facurlrest.php`) that proxies requests to the mounted module.
- The reviewed page confirms **65 method/path operations**.

## Base URLs
Because this is a self-hosted module, the base URL is installation-specific.

Reviewed canonical pattern:
- `http://{frontaccounting-host}/modules/api`

Reviewed example resource URL:
- `http://YOUR_FA_URL/modules/api/category/`

Reviewed optional bridge examples:
- `http://IP_OF_OTHER_SERVER/REST_PATH/facurlrest.php?a=category`
- `http://IP_OF_OTHER_SERVER/REST_PATH/facurlrest.php?a=category&r=1`
- `http://IP_OF_OTHER_SERVER/REST_PATH/facurlrest.php?a=locations`
- `http://IP_OF_OTHER_SERVER/REST_PATH/facurlrest.php?exrates&r=INR`

The bridge URLs are examples for external access tooling, not the core module's canonical route layout.

## Authentication
The reviewed page does **not** describe OAuth despite older directory metadata elsewhere; the actual reviewed wiki instructions document credential headers.

Reviewed auth notes:
- requests from another software should send `X_company`, `X_user`, and `X_password` headers
- the bundled bridge example uses uppercase header names:
  - `X-COMPANY: {company_number}`
  - `X-USER: {username}`
  - `X-PASSWORD: {password}`
- bad credentials produce a `403 Bad Login For Company` error according to the reviewed error-code list

Because HTTP header names are case-insensitive, the prose and bridge example are functionally equivalent.

## Confirmed endpoints
The reviewed wiki page explicitly lists the following operations.

### Inventory and stock
| Method | Path | Purpose |
|---|---|---|
| GET | `/inventory/` | Get list of all inventory items |
| GET | `/inventory/:id` | Get inventory item details |
| POST | `/inventory/` | Add inventory item |
| PUT | `/inventory/:id` | Edit inventory item |
| DELETE | `/inventory/:id` | Delete inventory item |
| GET | `/movementtypes/` | Get all inventory movement types |
| GET | `/locations/` | Get all locations |
| POST | `/locations/` | Add location |
| POST | `/stock/` | Add stock adjustment |
| GET | `/itemcosts/:id` | Get item cost |
| PUT | `/itemcosts/:id` | Edit item cost |

### Item categories, tax, assets, and reference data
| Method | Path | Purpose |
|---|---|---|
| GET | `/category/` | Get all item categories |
| GET | `/category/:id` | Get item category details |
| POST | `/category/` | Add item category |
| PUT | `/category/:id` | Edit item category |
| DELETE | `/category/:id` | Delete item category |
| GET | `/taxtypes/` | Get all tax types |
| GET | `/taxtypes/:id` | Get tax type details |
| GET | `/taxgroups/` | Get all tax groups |
| GET | `/currencies/` | Get all currencies |
| GET | `/currencies/:id` | Get currency details |
| GET | `/exrates/:curr_abrev` | Get latest exchange rate for a currency abbreviation |
| GET | `/assets/:id` | Get fixed asset details |
| POST | `/assets/` | Add fixed asset |
| GET | `/assettypes/` | Get all asset types |

### Customers and suppliers
| Method | Path | Purpose |
|---|---|---|
| GET | `/customers/` | Get all customers |
| GET | `/customers/:id` | Get customer details |
| POST | `/customers/` | Add customer |
| PUT | `/customers/:id` | Edit customer |
| DELETE | `/customers/:id` | Delete customer |
| GET | `/customers/:id/branches/` | Get branches for a customer |
| GET | `/suppliers/` | Get all suppliers |
| GET | `/suppliers/:id` | Get supplier details |
| POST | `/suppliers/` | Add supplier |
| PUT | `/suppliers/:id` | Edit supplier |
| DELETE | `/suppliers/:id` | Delete supplier |
| GET | `/suppliers/:id/contacts/` | Get contacts for a supplier |

### Banking and general ledger
| Method | Path | Purpose |
|---|---|---|
| GET | `/bankaccounts/` | Get bank accounts |
| GET | `/bankaccounts/:id` | Get bank account details |
| POST | `/bankaccounts/` | Add bank account |
| PUT | `/bankaccounts/:id` | Edit bank account |
| DELETE | `/bankaccounts/:id` | Delete bank account |
| GET | `/glaccounts/` | Get all GL accounts |
| GET | `/glaccounts/:id` | Get GL account details |
| POST | `/glaccounts/` | Add GL account |
| PUT | `/glaccounts/:id` | Edit GL account |
| DELETE | `/glaccounts/:id` | Delete GL account |
| GET | `/glaccounttypes/` | Get GL account types |

### Sales, dimensions, and journals
| Method | Path | Purpose |
|---|---|---|
| POST | `/salesquotes/` | Add sales quote |
| GET | `/salesquotes/:id` | Get sales quote |
| POST | `/sales/` | Add sales header and details |
| GET | `/sales/:trans_no/:trans_type` | Get sales header and details |
| PUT | `/sales/:trans_no/:trans_type` | Edit sales header and details |
| DELETE | `/sales/:branch_id/:uuid` | Cancel sales entry |
| GET | `/sales/:trans_type/` | Get all sales header/details for a transaction type |
| GET | `/dimensions/` | Get all dimensions |
| GET | `/dimensions/:ref` | Get dimension details |
| POST | `/dimensions/` | Add dimension |
| PUT | `/dimensions/:ref` | Edit dimension |
| DELETE | `/dimensions/:ref` | Delete dimension |
| GET | `/journal/` | Get all journals |
| GET | `/journal/:type/:id` | Get journal details |
| POST | `/journal/` | Add journal |
| PUT | `/journal/:id` | Edit journal |
| DELETE | `/journal/:type/:id` | Delete journal |

Manual route count confirmed from the reviewed page: **65 operations**.

## Confirmed parameters and request details
The reviewed page does **not** publish full JSON body schemas for every POST/PUT route. Instead, it explicitly says the actual field names for add/edit/delete payloads must be taken from the module's corresponding `*.inc` files. Still, the page does confirm the following request controls and path variables.

### Path parameters confirmed
- `:id` — used for inventory items, categories, customers, suppliers, bank accounts, GL accounts, tax types, currencies, assets, item costs, and sales quotes
- `:curr_abrev` — currency abbreviation for `/exrates/:curr_abrev`
- `:ref` — dimension reference for `/dimensions/:ref`
- `:trans_no` and `:trans_type` — sales transaction identifiers
- `:branch_id` and `:uuid` — identifiers for sales cancellation
- `:type` and `:id` — journal type and journal id

### Pagination confirmed
The reviewed page explicitly states that routes described as "get list of all" are paginated.

Confirmed pagination model:
- add `?page=XX` to list URLs
- the API is hard-coded to return **2 items per page**

### External bridge query parameters confirmed
The optional `facurlrest.php` bridge example documents:
- `m` — HTTP method selector where `g`, `p`, `t`, `d` map to GET, POST, PUT, DELETE
- `a` — action/resource name
- `r` — record id/value
- `f` — optional filter

### Example body guidance confirmed by the reviewed page
The reviewed page says:
- for `m=t`, `m=p`, or `m=d`, the `$data` array must contain the relevant field values
- the field subscripts depend on the underlying module include files rather than being fully restated in the wiki page

## Errors
The reviewed page publishes these SimpleAPI error codes:
- `200 OK`
- `201 Create Response`
- `400 Invalid table ID`
- `403 Bad Login For Company`
- `412 Field is required`
- `500 Could Not Change Database Contents`

## Rate limits
No rate limits were published on the reviewed wiki page.

## Pagination
Confirmed directly from the reviewed page:
- list endpoints are paginated with `?page=XX`
- the implementation returns **2 items per page**
- no total-count or cursor fields were documented on the reviewed page

## Response format
The reviewed examples show JSON responses from the module.

The category-list example on the page shows fields such as:
- `category_id`
- `description`
- `dflt_tax_type`
- `dflt_units`
- `dflt_mb_flag`
- `dflt_sales_act`
- `dflt_cogs_act`
- `dflt_inventory_act`
- `dflt_adjustment_act`
- `dflt_assembly_act`
- `dflt_no_sale`

The optional PHP bridge example then decodes JSON into PHP arrays and prints them, which is why the page also shows PHP-array output examples.

## Important usage notes
- This API is an add-on module that must be copied into FrontAccounting's `modules/api` directory.
- The reviewed quick-start instructs operators to disable Apache `MultiViews` for the mounted API location and provides a `mod_rewrite` rule that rewrites requests to `index.php`.
- The reviewed page explicitly warns to "use it at your own risk."
- Some endpoints are marked as FA 2.3.x-only even though the page also references a Slim v2.64 API for FA v2.4.x.
- The module is best treated as a self-hosted FrontAccounting integration surface, not a hosted multi-tenant SaaS API.

## fireROUTE notes
- fireROUTE should treat FrontAccounting SimpleAPI as a self-hosted provider requiring per-installation base URL configuration.
- Header-based auth should use the reviewed company/user/password header model, not the stale directory-level OAuth label.
- List endpoints need explicit page iteration because the reviewed implementation hard-codes very small page sizes.
- POST/PUT adapters should remain provider-specific because the reviewed page does not normalize full request schemas and instead delegates them to FrontAccounting module internals.
