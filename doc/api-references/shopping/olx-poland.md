# OLX Poland

## Manual review status
- Category: Shopping
- Official pages reviewed:
  - `https://developer.olx.pl/api/doc#section/`
  - `https://developer.olx.pl/swagger/v2/partner_api.yaml`
- Manual review outcome: `manually_documented`
- Confirmed route count: `54`

## API overview
- Primary API base URL from the official OpenAPI spec: `https://www.olx.pl/api/partner`
- Separate OAuth token endpoint documented outside the partner base: `POST /api/open/oauth/token`
- API style: JSON REST API with OAuth 2.0 bearer tokens
- Common request headers documented on the reviewed pages:
  - `Authorization: Bearer ACCESS_TOKEN`
  - `Version: 2.0` - explicitly required
  - `Accept-Language: xx` - optional in multilingual countries
- OAuth grant types documented:
  - `authorization_code`
  - `client_credentials`
  - `refresh_token`
- Scope values documented in examples/text:
  - `v2`
  - `read`
  - `write`
- Token lifetime notes from the official docs:
  - `access_token` example lifetime: `86400` seconds
  - `refresh_token` lifetime: `2592000` seconds
- Response format: JSON
- Rate limits: no public numeric rate-limit quota was published on the reviewed docs page or downloadable spec

## Confirmed endpoints
### Authentication
| Method | Path | Notes |
|---|---|---|
| POST | `/api/open/oauth/token` | Exchanges credentials for access and refresh tokens. |

### Users
| Method | Path | Notes |
|---|---|---|
| GET | `/users/me` | Gets the authenticated user. |
| GET | `/users/{id}` | Gets any user by ID. |
| GET | `/users/me/account-balance` | Gets account balance. |
| GET | `/users/me/payment-methods` | Gets available payment methods. |

### Cities and districts
| Method | Path | Notes |
|---|---|---|
| GET | `/regions` | Lists country regions. |
| GET | `/regions/{regionId}` | Gets one region. |
| GET | `/cities` | Lists cities. |
| GET | `/cities/{cityId}` | Gets one city. |
| GET | `/cities/{cityId}/districts` | Lists districts for a city. |
| GET | `/districts` | Lists districts. |
| GET | `/districts/{districtId}` | Gets one district. |
| GET | `/locations` | Resolves a location from latitude/longitude. |

### Languages and currencies
| Method | Path | Notes |
|---|---|---|
| GET | `/languages` | Lists available languages. |
| GET | `/currencies` | Lists available currencies. |

### Delivery
| Method | Path | Notes |
|---|---|---|
| GET | `/delivery/settings` | Gets delivery settings and eligible category/shipping information. |

### Categories and attributes
| Method | Path | Notes |
|---|---|---|
| GET | `/categories` | Lists categories. |
| GET | `/categories/{categoryId}` | Gets one category. |
| GET | `/categories/{categoryId}/attributes` | Gets category attributes. |
| GET | `/categories/suggestion` | Gets category suggestions. |

### Threads and messages
| Method | Path | Notes |
|---|---|---|
| GET | `/threads` | Lists threads. |
| GET | `/threads/{threadId}` | Gets one thread. |
| GET | `/threads/{threadId}/messages` | Lists thread messages. |
| POST | `/threads/{threadId}/messages` | Posts a message to a thread. |
| GET | `/threads/{threadId}/messages/{messageId}` | Gets one message. |
| POST | `/threads/{threadId}/commands` | Performs thread actions such as mark-as-read or set-favourite. |

### Paid features
| Method | Path | Notes |
|---|---|---|
| GET | `/paid-features` | Lists available paid features. |
| GET | `/adverts/{advertId}/paid-features` | Lists active paid features on an advert. |
| POST | `/adverts/{advertId}/paid-features` | Purchases a paid feature for an advert. |

### Adverts
| Method | Path | Notes |
|---|---|---|
| GET | `/adverts` | Lists the user's adverts. |
| POST | `/adverts` | Creates an advert. |
| GET | `/adverts/{advertId}` | Gets one advert. |
| PUT | `/adverts/{advertId}` | Updates an advert. |
| DELETE | `/adverts/{advertId}` | Permanently removes an advert after deactivation. |
| POST | `/adverts/{advertId}/commands` | Performs advert actions such as activate/deactivate. |

### Advert logos
| Method | Path | Notes |
|---|---|---|
| GET | `/adverts/{advertId}/logos` | Lists advert logos. |
| POST | `/adverts/{advertId}/logos` | Adds a logo. |
| DELETE | `/adverts/{advertId}/logos/{logoId}` | Deletes one logo. |

### Users Business
| Method | Path | Notes |
|---|---|---|
| GET | `/users-business/me` | Gets business-profile data for the authenticated user. |
| PUT | `/users-business/me` | Updates business-profile data. |
| GET | `/users-business/me/logos` | Lists business logos. |
| POST | `/users-business/me/logos` | Sets a business logo. |
| DELETE | `/users-business/me/logos/{logoId}` | Removes a business logo. |
| GET | `/users-business/me/banners` | Lists business banners. |
| POST | `/users-business/me/banners` | Sets a business banner. |
| DELETE | `/users-business/me/banners/{bannerId}` | Removes a business banner. |

### Packets
| Method | Path | Notes |
|---|---|---|
| GET | `/packets` | Lists available packets. |
| GET | `/zones` | Lists location zones for regional pricing; docs note this is available in UA. |
| GET | `/users/me/packets` | Lists bought packets. |
| POST | `/users/me/packets` | Purchases a category packet. |
| POST | `/adverts/{advertId}/packets` | Purchases a packet for a specific advert. |

### Payments
| Method | Path | Notes |
|---|---|---|
| GET | `/users/me/billing` | Gets billing data. |
| GET | `/users/me/prepaid-invoices` | Gets prepaid invoices. |
| GET | `/users/me/postpaid-invoices` | Gets postpaid invoices. |

## Confirmed parameters and request details
### OAuth token request
- `POST /api/open/oauth/token` body fields documented in the auth section:
  - `grant_type`
  - `client_id`
  - `client_secret`
  - `scope`
- The docs say grant-specific fields are additionally required depending on grant type.
- Token response fields shown:
  - `access_token`
  - `expires_in`
  - `token_type`
  - `scope`
  - `refresh_token`

### Global protocol notes
- `Version` header is required on API requests.
- `Authorization: Bearer ACCESS_TOKEN` is required for protected endpoints.
- `Accept-Language` is the documented language-selection mechanism for multilingual markets.

### Representative query/path parameters confirmed in the reviewed spec
- `GET /cities`
  - `offset`
  - `limit` - docs say default `1000`
- `GET /locations`
  - `latitude` - required
  - `longitude` - required
- `GET /adverts`
  - `offset`
  - `limit`
  - `external_id`
  - `category_ids` - comma-separated list
- `GET /users/me/packets`
  - `limit` - docs say default `50`
  - `offset`
  - `availability` - `active` or `inactive`
  - `sort_by` - `expired_at` or `activated_at`
- Representative path parameters:
  - `regionId`
  - `cityId`
  - `districtId`
  - `categoryId`
  - `threadId`
  - `messageId`
  - `advertId`
  - `logoId`
  - `bannerId`

### Message and command bodies
- `POST /threads/{threadId}/messages`
  - required `text`
  - optional `attachments[].url`
- `POST /threads/{threadId}/commands`
  - required `command`
  - documented command values: `mark-as-read`, `set-favourite`
  - `is_favourite` is required for `set-favourite`

### Advert creation and update
The reviewed spec shows the same main structure for `POST /adverts` and `PUT /adverts/{advertId}`.
- Required top-level fields:
  - `advertiser_type`
  - `attributes`
  - `category_id`
  - `contact`
  - `description`
  - `location`
  - `title`
- Additional documented fields include:
  - `external_url`
  - `external_id`
  - `images[].url`
  - `price.value`
  - `price.currency`
  - `price.negotiable`
  - `price.trade`
  - `price.budget`
  - `salary.value_from`
  - `salary.value_to`
  - `salary.currency`
  - `salary.negotiable`
  - `salary.type` - `hourly` or `monthly`
  - `attributes[].code`
  - `attributes[].value`
  - `attributes[].values[]`
  - `courier`
  - `ad_delivery.delivery_package_ids[]`
  - `auto_extend_enabled`
  - `product_safety_regulation`
- Validation/lifecycle notes explicitly documented:
  - title length `16` to `150`
  - description length `80` to `9000`
  - repeated punctuation and excessive capitals are restricted
  - email addresses and phone numbers are not allowed in title/description
  - advert statuses documented include `new`, `active`, `limited`, `removed_by_user`, `outdated`, `unconfirmed`, `unpaid`, `moderated`, `blocked`, `disabled`, `removed_by_moderator`

### Paid features and packets
- `POST /adverts/{advertId}/paid-features`
  - required `code`
  - required `payment_method` - `account` or `postpaid`
- `POST /users/me/packets`
  - required `category_id`
  - required `payment_method` - `account` or `postpaid`
  - required `size`
  - optional `type` - `base` or `mega`
  - optional `zone_id` for regional pricing categories (docs note UA availability)
- `POST /adverts/{advertId}/packets`
  - required `payment_method` - `account` or `postpaid`
  - optional `is_premium`

### Users Business media bodies
- `POST /users-business/me/logos`
  - required `url`
- `POST /users-business/me/banners`
  - required `url`
- `POST /adverts/{advertId}/logos`
  - reviewed spec section confirms JSON-body upload pattern on the advert-logo route family

## Response, pagination, and error notes
- Responses are JSON except for empty-success operations that return `204`.
- The reviewed spec shows a mix of `200` and `204` success statuses.
- The packet-purchase routes explicitly document `400` responses returning arrays of `Error` objects.
- Pagination/filtering is route-specific rather than globally standardized:
  - `offset` and `limit` are used on routes such as `/cities` and `/adverts`
  - packet listing also supports `availability` and `sort_by`
- No single provider-wide public error-code table or public numeric rate-limit table was found in the reviewed official sources.

## Important usage notes
- The official documentation says the API surface is shared across OLX Europe, while this provider entry keeps the Poland production base URL published by the current spec.
- The new delivery endpoints announced on the docs front page are described as currently available only in Poland.
- Regional pricing / `zones` are separately marked as available in UA in the reviewed spec.
- The docs emphasize that access tokens should be treated like passwords.
- For adverts that return `limited` status, the docs say additional packet purchase and activation steps are required before the advert becomes active.
- The docs explicitly require the `Version` header; this is easy to miss and should be mandatory in any fireROUTE adapter.

## Sources inspected
- `https://developer.olx.pl/api/doc#section/`
- `https://developer.olx.pl/swagger/v2/partner_api.yaml`
