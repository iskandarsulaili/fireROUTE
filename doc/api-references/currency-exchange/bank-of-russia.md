# Bank of Russia

Official docs manually reviewed:
- https://www.cbr.ru/development/SXML/
- https://www.cbr.ru/scripts/XML_daily.asp?date_req=02/03/2002
- https://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=02/03/2001&date_req2=14/03/2001&VAL_NM_RQ=R01235
- https://www.cbr.ru/scripts/XML_val.asp?d=0

## Overview
The Bank of Russia publishes a public XML-based data interface on the `cbr.ru` host. The reviewed official XML page includes several datasets, but for currency/exchange use the key routes are the daily rates feed, English daily rates feed, currency-code dictionaries, and the historical dynamic series endpoint.

- Base URL: `https://www.cbr.ru/scripts/`
- Auth: none
- Methods confirmed: `GET`
- Response format: XML
- Primary official documentation style: example URLs with query-string parameters, plus linked XSD schemas

## Authentication
The reviewed official documentation does not describe API keys, OAuth, cookies, or signed requests for these XML endpoints. They are presented as public URLs.

## Confirmed endpoints relevant to currency/exchange
| Method | Path | Purpose | Query parameters confirmed |
|---|---|---|---|
| GET | `/XML_daily.asp` | Daily exchange-rate quotation table in Russian | `date_req`; docs also show legacy `d=1` monthly mode marked obsolete |
| GET | `/XML_daily_eng.asp` | Daily exchange-rate quotation table in English | `date_req`; docs also show legacy `d=1` monthly mode marked obsolete |
| GET | `/XML_val.asp` | Currency-code reference directory | `d` where docs state `d=0` daily-set codes and `d=1` monthly-set codes |
| GET | `/XML_valFull.asp` | Currency-code directory including ISO codes | no required query parameter shown on the reviewed page |
| GET | `/XML_dynamic.asp` | Historical time series for one currency | `date_req1`, `date_req2`, `VAL_NM_RQ` |

Manual route count confirmed from the reviewed official documentation: **5** GET routes.

## Query parameters confirmed from the docs
- `date_req` — query date, documented as `dd/mm/yyyy`
- `d` — dictionary mode for `/XML_val.asp`; docs explain `0` for daily-set codes and `1` for monthly-set codes
- `date_req1` — range start date
- `date_req2` — range end date
- `VAL_NM_RQ` — unique currency code obtained from the directory feed / example 1

## Response and schema notes
The reviewed official examples and live endpoint checks confirm XML payloads such as:
- `/XML_daily.asp` returning a root like `<ValCurs ...>`
- `/XML_dynamic.asp` returning a root like `<ValCurs ID="..." DateRange1="..." DateRange2="...">`
- `/XML_val.asp` returning a root like `<Valuta ...>`

The official docs link XSD schemas from the documentation page, but the main page itself focuses on example URLs rather than a field-by-field response reference.

## Rate limits
The reviewed official documentation does **not** publish per-IP or per-account rate limits, quotas, or throttling headers.

## Pagination
No pagination model is documented.

Historical retrieval is range-based instead of page-based:
- use `date_req1` and `date_req2` for the dynamic-series endpoint
- use `date_req` for a single-day snapshot

## Errors
The reviewed XML documentation page does not publish a normalized error-code table for these endpoints.

Practical integration notes from the official examples:
- missing optional date parameters often fall back to the latest registered date
- incorrect or unsupported query values should be treated as upstream XML/HTTP failures and preserved for inspection

## Important usage notes
- The official documentation page still shows example URLs with `http://`, but the live endpoints are accessible over `https://`; use HTTPS in fireROUTE.
- `/XML_daily.asp` and `/XML_daily_eng.asp` are separate route names, not language parameters on one endpoint.
- The docs explicitly label the monthly quotation variant using `d=1` on the daily endpoint examples as **obsolete**.
- The historical dynamic endpoint requires the provider-specific `VAL_NM_RQ` identifier, which the docs say can be obtained from the currency directory feed.
- The official XML page contains many additional Bank of Russia feeds unrelated to currency exchange; this rewrite intentionally documents only the routes relevant to the provider’s `currency-exchange` categorization.

## fireROUTE notes
- Treat this provider as a public XML feed, not a JSON REST API.
- Preserve XML payloads and upstream query names exactly, especially `VAL_NM_RQ` and `date_req*`.
- For a normalized adapter, the most important flows are: latest daily rates, English daily rates, code-directory lookup, and historical time-series retrieval.
