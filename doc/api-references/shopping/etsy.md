# Etsy

## Manual review status
- Category: Shopping
- Official docs reviewed:
  - `https://developers.etsy.com/documentation/`
  - `https://developers.etsy.com/documentation/reference/`
  - `https://developers.etsy.com/documentation/essentials/authentication`
  - `https://developers.etsy.com/documentation/essentials/urlsyntax`
  - `https://developers.etsy.com/documentation/essentials/requests`
  - `https://developers.etsy.com/documentation/essentials/rate-limits`
  - `https://www.etsy.com/openapi/generated/oas/3.0.0.json`
- Manual review outcome: `manually_documented`
- Confirmed route count: `103`

## API overview
- Primary base URL: `https://api.etsy.com/v3/application`
- Equivalent official host: `https://openapi.etsy.com/v3/application`
- OpenAPI server entry: `https://openapi.etsy.com`
- Transport: HTTPS only
- Character encoding: UTF-8
- Response format: JSON
- Request bodies: mixed by endpoint; the reviewed reference includes JSON, form-encoded, and upload/media-oriented operations

## Authentication
- Every v3 request must include header `x-api-key: <keystring>:<shared_secret>`
- OAuth 2.0 Authorization Code Grant is used for user-authorized operations
- Authorization URL: `https://www.etsy.com/oauth/connect`
- Token URL: `https://openapi.etsy.com/v3/public/oauth/token`
- For scoped endpoints, the reviewed request guide says the bearer token format is `Authorization: Bearer <numeric_user_id>.<oauth_access_token>`
- PKCE is required in the OAuth authorization-code flow

## Rate limits
- Rate limiting is application-based at the API-key level
- Etsy documents both Queries Per Second (`QPS`) and Queries Per Day (`QPD`) limits
- The daily limit uses a sliding 24-hour window rather than a midnight reset
- Reviewed success-response headers:
  - `x-limit-per-second`
  - `x-remaining-this-secon` (spelled exactly this way on the official page)
  - `x-limit-per-day`
  - `x-remaining-today`
- Exceeded limits return `429` with `retry-after`
- The reviewed rate-limit guide recommends caching and exponential backoff

## Pagination and standard parameters
- Standard list parameters: `limit`, `offset`
- Default and minimum page size: `25`
- Maximum page size: `100`
- Maximum documented `offset`: `12000`
- Paginated responses include a `count` field with the total available records

## Confirmed endpoint inventory
### BuyerTaxonomy
| Method | Path |
|---|---|
| GET | `/v3/application/buyer-taxonomy/nodes` |
| GET | `/v3/application/buyer-taxonomy/nodes/{taxonomy_id}/properties` |

### Ledger Entry
| Method | Path |
|---|---|
| GET | `/v3/application/shops/{shop_id}/payment-account/ledger-entries/{ledger_entry_id}` |
| GET | `/v3/application/shops/{shop_id}/payment-account/ledger-entries` |

### Other
| Method | Path |
|---|---|
| GET | `/v3/application/openapi-ping` |
| POST | `/v3/application/scopes` |

### Payment
| Method | Path |
|---|---|
| GET | `/v3/application/shops/{shop_id}/payment-account/ledger-entries/payments` |
| GET | `/v3/application/shops/{shop_id}/receipts/{receipt_id}/payments` |
| GET | `/v3/application/shops/{shop_id}/payments` |

### Review
| Method | Path |
|---|---|
| GET | `/v3/application/listings/{listing_id}/reviews` |
| GET | `/v3/application/shops/{shop_id}/reviews` |

### SellerTaxonomy
| Method | Path |
|---|---|
| GET | `/v3/application/seller-taxonomy/nodes` |
| GET | `/v3/application/seller-taxonomy/nodes/{taxonomy_id}/properties` |

### Shop
| Method | Path |
|---|---|
| GET | `/v3/application/shops/{shop_id}` |
| PUT | `/v3/application/shops/{shop_id}` |
| GET | `/v3/application/users/{user_id}/shops` |
| GET | `/v3/application/shops` |

### Shop HolidayPreferences
| Method | Path |
|---|---|
| GET | `/v3/application/shops/{shop_id}/holiday-preferences` |
| PUT | `/v3/application/shops/{shop_id}/holiday-preferences/{holiday_id}` |

### Shop ProcessingProfiles
| Method | Path |
|---|---|
| POST | `/v3/application/shops/{shop_id}/readiness-state-definitions` |
| GET | `/v3/application/shops/{shop_id}/readiness-state-definitions` |
| DELETE | `/v3/application/shops/{shop_id}/readiness-state-definitions/{readiness_state_definition_id}` |
| GET | `/v3/application/shops/{shop_id}/readiness-state-definitions/{readiness_state_definition_id}` |
| PUT | `/v3/application/shops/{shop_id}/readiness-state-definitions/{readiness_state_definition_id}` |

### Shop ProductionPartner
| Method | Path |
|---|---|
| GET | `/v3/application/shops/{shop_id}/production-partners` |

### Shop Receipt
| Method | Path |
|---|---|
| GET | `/v3/application/shops/{shop_id}/receipts/{receipt_id}` |
| PUT | `/v3/application/shops/{shop_id}/receipts/{receipt_id}` |
| GET | `/v3/application/shops/{shop_id}/receipts` |
| POST | `/v3/application/shops/{shop_id}/receipts/{receipt_id}/tracking` |

### Shop Receipt Transactions
| Method | Path |
|---|---|
| GET | `/v3/application/shops/{shop_id}/listings/{listing_id}/transactions` |
| GET | `/v3/application/shops/{shop_id}/receipts/{receipt_id}/transactions` |
| GET | `/v3/application/shops/{shop_id}/transactions/{transaction_id}` |
| GET | `/v3/application/shops/{shop_id}/transactions` |

### Shop Return Policy
| Method | Path |
|---|---|
| POST | `/v3/application/shops/{shop_id}/policies/return/consolidate` |
| POST | `/v3/application/shops/{shop_id}/policies/return` |
| GET | `/v3/application/shops/{shop_id}/policies/return` |
| DELETE | `/v3/application/shops/{shop_id}/policies/return/{return_policy_id}` |
| GET | `/v3/application/shops/{shop_id}/policies/return/{return_policy_id}` |
| PUT | `/v3/application/shops/{shop_id}/policies/return/{return_policy_id}` |

### Shop Section
| Method | Path |
|---|---|
| POST | `/v3/application/shops/{shop_id}/sections` |
| GET | `/v3/application/shops/{shop_id}/sections` |
| DELETE | `/v3/application/shops/{shop_id}/sections/{shop_section_id}` |
| GET | `/v3/application/shops/{shop_id}/sections/{shop_section_id}` |
| PUT | `/v3/application/shops/{shop_id}/sections/{shop_section_id}` |

### Shop ShippingProfile
| Method | Path |
|---|---|
| GET | `/v3/application/shipping-carriers` |
| POST | `/v3/application/shops/{shop_id}/shipping-profiles` |
| GET | `/v3/application/shops/{shop_id}/shipping-profiles` |
| DELETE | `/v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}` |
| GET | `/v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}` |
| PUT | `/v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}` |
| POST | `/v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/destinations` |
| GET | `/v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/destinations` |
| DELETE | `/v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/destinations/{shipping_profile_destination_id}` |
| PUT | `/v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/destinations/{shipping_profile_destination_id}` |
| POST | `/v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/upgrades` |
| GET | `/v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/upgrades` |
| DELETE | `/v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/upgrades/{upgrade_id}` |
| PUT | `/v3/application/shops/{shop_id}/shipping-profiles/{shipping_profile_id}/upgrades/{upgrade_id}` |

### ShopListing
| Method | Path |
|---|---|
| POST | `/v3/application/shops/{shop_id}/listings` |
| GET | `/v3/application/shops/{shop_id}/listings` |
| DELETE | `/v3/application/listings/{listing_id}` |
| GET | `/v3/application/listings/{listing_id}` |
| GET | `/v3/application/listings/active` |
| GET | `/v3/application/shops/{shop_id}/listings/active` |
| GET | `/v3/application/listings/batch` |
| GET | `/v3/application/shops/{shop_id}/listings/featured` |
| DELETE | `/v3/application/shops/{shop_id}/listings/{listing_id}/properties/{property_id}` |
| PUT | `/v3/application/shops/{shop_id}/listings/{listing_id}/properties/{property_id}` |
| GET | `/v3/application/listings/{listing_id}/properties/{property_id}` |
| GET | `/v3/application/shops/{shop_id}/listings/{listing_id}/properties` |
| PATCH | `/v3/application/shops/{shop_id}/listings/{listing_id}` |
| GET | `/v3/application/shops/{shop_id}/receipts/{receipt_id}/listings` |
| GET | `/v3/application/shops/{shop_id}/policies/return/{return_policy_id}/listings` |
| GET | `/v3/application/shops/{shop_id}/shop-sections/listings` |

### ShopListing File
| Method | Path |
|---|---|
| DELETE | `/v3/application/shops/{shop_id}/listings/{listing_id}/files/{listing_file_id}` |
| GET | `/v3/application/shops/{shop_id}/listings/{listing_id}/files/{listing_file_id}` |
| GET | `/v3/application/shops/{shop_id}/listings/{listing_id}/files` |
| POST | `/v3/application/shops/{shop_id}/listings/{listing_id}/files` |

### ShopListing Image
| Method | Path |
|---|---|
| DELETE | `/v3/application/shops/{shop_id}/listings/{listing_id}/images/{listing_image_id}` |
| GET | `/v3/application/listings/{listing_id}/images/{listing_image_id}` |
| GET | `/v3/application/listings/{listing_id}/images` |
| POST | `/v3/application/shops/{shop_id}/listings/{listing_id}/images` |

### ShopListing Inventory
| Method | Path |
|---|---|
| GET | `/v3/application/listings/{listing_id}/inventory` |
| PUT | `/v3/application/listings/{listing_id}/inventory` |

### ShopListing Offering
| Method | Path |
|---|---|
| GET | `/v3/application/listings/{listing_id}/products/{product_id}/offerings/{product_offering_id}` |

### ShopListing Personalization
| Method | Path |
|---|---|
| DELETE | `/v3/application/shops/{shop_id}/listings/{listing_id}/personalization` |
| POST | `/v3/application/shops/{shop_id}/listings/{listing_id}/personalization` |
| GET | `/v3/application/listings/{listing_id}/personalization` |

### ShopListing Product
| Method | Path |
|---|---|
| GET | `/v3/application/listings/{listing_id}/inventory/products/{product_id}` |

### ShopListing Translation
| Method | Path |
|---|---|
| POST | `/v3/application/shops/{shop_id}/listings/{listing_id}/translations/{language}` |
| GET | `/v3/application/shops/{shop_id}/listings/{listing_id}/translations/{language}` |
| PUT | `/v3/application/shops/{shop_id}/listings/{listing_id}/translations/{language}` |

### ShopListing VariationImage
| Method | Path |
|---|---|
| GET | `/v3/application/shops/{shop_id}/listings/{listing_id}/variation-images` |
| POST | `/v3/application/shops/{shop_id}/listings/{listing_id}/variation-images` |

### ShopListing Video
| Method | Path |
|---|---|
| DELETE | `/v3/application/shops/{shop_id}/listings/{listing_id}/videos/{video_id}` |
| GET | `/v3/application/listings/{listing_id}/videos/{video_id}` |
| GET | `/v3/application/listings/{listing_id}/videos` |
| POST | `/v3/application/shops/{shop_id}/listings/{listing_id}/videos` |

### User
| Method | Path |
|---|---|
| GET | `/v3/application/users/{user_id}` |
| GET | `/v3/application/users/me` |

### UserAddress
| Method | Path |
|---|---|
| DELETE | `/v3/application/user/addresses/{user_address_id}` |
| GET | `/v3/application/user/addresses/{user_address_id}` |
| GET | `/v3/application/user/addresses` |

## Important parameters and request notes
- Standard header auth parameter: `x-api-key`
- Standard pagination parameters: `limit`, `offset`
- OAuth authorization request parameters called out on the official auth guide:
  - `response_type=code`
  - `client_id`
  - `redirect_uri`
  - `scope`
  - `state`
  - `code_challenge`
  - `code_challenge_method=S256`
- Asset ID path parameters are used widely across shops, listings, receipts, transactions, images, videos, policies, shipping destinations, and upgrades
- The reviewed URL syntax guide says enum values outside the documented list cause an error

## Errors and format notes
- The reviewed request guide requires HTTPS and UTF-8
- The current OpenAPI spec publishes at least these HTTP response codes across the route set: `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, `422`, `500`, `501`, `503`
- The reviewed rate-limit guide separately documents `429` with `retry-after`
- Response bodies on list endpoints include `count` for total results

## Important usage notes
- New apps start with personal access and the introduction page says personal access supports up to `5` shops
- The introduction page says an app with no successful Open API request for `6` months is marked dormant and banned
- The docs expose a separate webhooks guide, but webhook routes were not counted here because the browsed route inventory was taken from the main OpenAPI reference
- The URL syntax guide uses an example path with singular `/shop/{shop_id}/...`, while the current OpenAPI reference consistently publishes plural `/shops/{shop_id}/...`; fireROUTE should prefer the OpenAPI reference paths

## Sources inspected
- `https://developers.etsy.com/documentation/`
- `https://developers.etsy.com/documentation/reference/`
- `https://developers.etsy.com/documentation/essentials/authentication`
- `https://developers.etsy.com/documentation/essentials/urlsyntax`
- `https://developers.etsy.com/documentation/essentials/requests`
- `https://developers.etsy.com/documentation/essentials/rate-limits`
- `https://www.etsy.com/openapi/generated/oas/3.0.0.json`
