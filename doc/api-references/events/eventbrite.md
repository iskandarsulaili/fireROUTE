# Eventbrite

## Provider metadata
- Category: `Events`
- Provider slug: `eventbrite`
- Official docs/pages used:
  - `https://www.eventbrite.com/platform/api/`
  - `https://jsapi.apiary.io/apis/eventbriteapiv3public.html`
  - official API Blueprint source exposed from the Apiary docs page: `https://jsapi.apiary.io/apis/eventbriteapiv3public.source`
- Current public API base URL: `https://www.eventbriteapi.com/v3`
- Auth model: OAuth 2.0; the docs also support direct private-token use
- Response format: JSON
- REST style note from official docs: REST-based, though Eventbrite uses `POST` instead of `PUT`
- Manually confirmed route count: `102`

## Authentication
The Eventbrite docs say the API uses OAuth 2.0 for authorization.

The reviewed authentication section documents:
- private-token usage for your own account
- OAuth app-partner authorization to act on behalf of users
- Bearer-token auth in the `Authorization` header
- token-in-query auth as an alternative

Officially documented auth forms:
- header: `Authorization: Bearer YOUR_TOKEN`
- query string: `/v3/users/me/?token=MYTOKEN`

Official OAuth endpoints documented in the auth section:
- authorization: `https://www.eventbrite.com/oauth/authorize`
- token exchange: `https://www.eventbrite.com/oauth/token`

## Errors
The docs say API errors return:
- an HTTP error status in the `400`-`500` range
- a JSON body containing more detail

Official example shape:

```json
{
  "error": "VENUE_AND_ONLINE",
  "error_description": "You cannot both specify a venue and set online_event",
  "status_code": 400
}
```

The docs explicitly say integrators should key error handling off the stable `error` string, not the human-readable `error_description`.

## Pagination
The `Paginated Responses` section says Eventbrite paginated responses contain:
- `pagination.object_count`
- `pagination.continuation`
- `pagination.page_count`
- `pagination.page_size`
- `pagination.has_more_items`
- `pagination.page_number`

The docs also explain continuation-token paging: repeat the same request with the returned continuation token to fetch the next page.

## Common usage notes from the official docs
- The API is REST-based but uses `POST` in places where some APIs would use `PUT`.
- Responses are always JSON.
- `expansions` and API switches are documented globally in the introduction section.
- The docs explicitly mention eventual consistency concerns on some resources.
- Some documented routes are marked deprecated in the official reference and are preserved below as such.

## Canonical endpoints
Below are the 102 operations manually confirmed from the official API Blueprint source.

### Attendee
1. `GET /events/{event_id}/attendees/{attendee_id}/`
2. `GET /events/{event_id}/attendees/`
3. `GET /organizations/{organization_id}/attendees/`

### Balance
4. `GET /balance/<public_organization_id>/events/<public_event_id>/`

### Categories
5. `GET /categories/{id}/`
6. `GET /subcategories/{subcategory_id}/`
7. `GET /categories/`
8. `GET /subcategories/`

### Discount
9. `GET /discounts/{discount_id}/`
10. `POST /organizations/{organization_id}/discounts/`
11. `POST /discounts/{discount_id}/`
12. `GET /organizations/{organization_id}/discounts/{?scope}`
13. `DELETE /discounts/{discount_id}/`

### Display Settings
14. `GET /events/{event_id}/display_settings/`
15. `POST /events/{event_id}/display_settings/`

### Event Capacity
16. `GET /events/{event_id}/capacity_tier/`
17. `POST /events/{event_id}/capacity_tier/`

### Event Description
18. `GET /events/{event_id}/description/`

### Event Schedule
19. `POST /events/{event_id}/schedules/`

### Event Search
20. `GET /events/search/` - deprecated per official docs

### Event Series
21. `GET /series/{event_series_id}/`

### Event Teams
22. `GET /events/{event_id}/teams/`
23. `GET /events/{event_id}/teams/{team_id}/`
24. `GET /events/{event_id}/teams/{team_id}/attendees/`
25. `POST /events/{event_id}/teams/create/`
26. `POST /events/{event_id}/teams/{team_id}/check_password/`
27. `GET /events/{event_id}/teams/search/?term={term}`

### Event
28. `GET /events/{event_id}/`
29. `POST /organizations/{organization_id}/events/`
30. `POST /events/{event_id}/`
31. `GET /venues/{venue_id}/events/`
32. `GET /organizations/{organization_id}/events/`
33. `GET /series/{event_series_id}/events/`
34. `POST /events/{event_id}/publish/`
35. `POST /events/{event_id}/unpublish/`
36. `POST /events/{event_id}/copy/`
37. `POST /events/{event_id}/cancel/`
38. `DELETE /events/{event_id}/`

### Formats
39. `GET /formats/{format_id}/`
40. `GET /formats/`

### Inventory Tiers
41. `GET /events/{event_id}/inventory_tiers/{inventory_tier_id}/`
42. `POST /events/{event_id}/inventory_tiers/` - create single tier
43. `POST /events/{event_id}/inventory_tiers/` - create multiple tiers
44. `POST /events/{event_id}/inventory_tiers/{inventory_tier_id}/`
45. `POST /events/{event_id}/inventory_tiers/` - update multiple tiers
46. `GET /events/{event_id}/inventory_tiers/`
47. `DELETE /events/{event_id}/inventory_tiers/{inventory_tier_id}/`

### Media
48. `GET /media/{media_id}/{?width,height}`
49. `POST /media/upload/`
50. `GET /media/upload/`

### Order
51. `GET /orders/{order_id}/`
52. `GET /organizations/{organization_id}/orders/`
53. `GET /events/{event_id}/orders/`
54. `GET /users/{user_id}/orders/`

### Organization members and roles
55. `GET /organizations/{organization_id}/members/`
56. `GET /organizations/{organization_id}/roles/`

### Organization
57. `GET /users/me/organizations/`
58. `GET /users/{user_id}/organizations/`

### Pricing
59. `POST /pricing/calculate_price_for_item/`
60. `GET /pricing/fee_rates{?country,currency,plan,payment_type,channel,item_type}`

### Questions
61. `GET /events/{event_id}/canned_questions/`
62. `GET /event/{event_id}/canned_questions/{question_id}`
63. `POST /events/{event_id}/canned_questions/`
64. `POST /event/{event_id}/canned_questions/{question_id}`
65. `DELETE /event/{event_id}/canned_questions/{question_id}`
66. `GET /events/{event_id}/questions/`
67. `POST /events/{event_id}/questions/`
68. `GET /events/{event_id}/questions/{question_id}/`
69. `DELETE /events/{event_id}/questions/{question_id}/`

### Reports
70. `GET /reports/sales/`
71. `GET /reports/attendees/`

### Seat Map
72. `GET /organizations/{organization_id}/seatmaps/{?venue_id,venue_name_filter}`
73. `POST /events/{event_id}/seatmaps/`

### Structured Content
74. `GET /events/{id}/structured_content/`
75. `GET /events/{id}/structured_content/edit/`
76. `POST /events/{id}/structured_content/{version}/`

### Text Overrides
77. `GET /organizations/{organization_id}/text_overrides/{?locale,event_id,venue_id,text_codes}`
78. `POST /organizations/{organization_id}/text_overrides/`

### Ticket Buyer Settings
79. `GET /events/{event_id}/ticket_buyer_settings/`
80. `POST /events/{event_id}/ticket_buyer_settings/`

### Ticket Class
81. `GET /events/{event_id}/ticket_classes/{ticket_class_id}/`
82. `POST /events/{event_id}/ticket_classes/`
83. `POST /events/{event_id}/ticket_classes/{ticket_class_id}/`
84. `GET /events/{event_id}/ticket_classes/`
85. `GET /events/{event_id}/ticket_classes/for_sale/`

### Ticket Group
86. `GET /ticket_groups/{ticket_group_id}/`
87. `POST /organizations/{organization_id}/ticket_groups/`
88. `POST /ticket_groups/{ticket_group_id}/`
89. `POST /organizations/{organization_id}/events/{event_id}/ticket_classes/{ticket_class_id}/ticket_groups/`
90. `GET /organizations/{organization_id}/ticket_groups/`
91. `DELETE /ticket_groups/{ticket_group_id}/`

### User
92. `GET /users/{user_id}/`
93. `GET /users/me/`

### Venue
94. `GET /venues/{venue_id}/`
95. `POST /organizations/{organization_id}/venues/`
96. `POST /venues/{venue_id}/`
97. `GET /organizations/{organization_id}/venues/`

### Webhooks
98. `POST /organizations/{organization_id}/webhooks/`
99. `POST /webhooks/` - deprecated per official docs
100. `GET /organizations/{organization_id}/webhooks/`
101. `GET /webhooks/` - deprecated per official docs
102. `DELETE /webhooks/{id}/`

## Common path/query/body patterns
### Common path parameters
The published reference repeatedly uses identifiers such as:
- `event_id`
- `organization_id`
- `attendee_id`
- `discount_id`
- `event_series_id`
- `team_id`
- `inventory_tier_id`
- `media_id`
- `order_id`
- `question_id`
- `ticket_class_id`
- `ticket_group_id`
- `user_id`
- `venue_id`
- `id`
- `version`

### Common query patterns documented in route templates
Examples visible directly in official route templates include:
- `scope`
- `term`
- `width`
- `height`
- `country`
- `currency`
- `plan`
- `payment_type`
- `channel`
- `item_type`
- `venue_id`
- `venue_name_filter`
- `locale`
- `event_id`
- `venue_id`
- `text_codes`

### Pagination parameters
The general pagination section documents use of Eventbrite's pagination object and continuation-token workflow. Many list endpoints are explicitly described as returning paginated responses.

### Body/update notes
The official docs use `POST` for creation and updates across much of the API instead of `PUT`.

## Important usage notes
- `GET /events/search/` is explicitly marked deprecated and the docs say access was shut down in December 2019.
- Generic `/webhooks/` create/list operations are also marked deprecated in the official reference; the organization-scoped webhook routes are the current documented path family.
- Many list endpoints in the official descriptions explicitly say `Returns a paginated response`.

## fireROUTE normalization notes
- Normalize Eventbrite as a large OAuth-protected REST API rooted at `/v3`.
- Preserve the resource families as separate adapters rather than flattening them into a single event-only surface; the official API is much broader than public event discovery.
- Preserve deprecated routes in reference metadata, but prefer current organization-scoped webhook and non-deprecated event-management families for new integrations.
- Carry both Bearer-header auth and query-token auth in compatibility layers, while preferring Bearer auth for new integrations.