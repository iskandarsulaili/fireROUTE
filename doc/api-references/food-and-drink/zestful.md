# Zestful

Official pages manually reviewed:
- https://zestfuldata.com/
- https://zestfuldata.com/docs/
- https://zestfuldata.com/pricing/
- https://zestfuldata.com/demo/
- https://rapidapi.com/zestfuldata/api/recipe-and-ingredient-analysis

## Overview
- Official docs page route reference: `POST /parseIngredients`
- Official distribution host shown on the reviewed RapidAPI listing: `https://zestful.p.rapidapi.com`
- Effective base URL for the published hosted API: `https://zestful.p.rapidapi.com`
- Request/response format: JSON
- Authentication model: subscription-gated RapidAPI access; Zestful's `Get Started` links send developers to the official RapidAPI listing rather than exposing a separate first-party token flow on `zestfuldata.com`
- Signed-out auth visibility note: the reviewed public pages confirmed the RapidAPI host and subscription model, but they did not expose a usable public key sample, so fireROUTE should treat credentials as caller-supplied RapidAPI account configuration

Manual route count confirmed from the reviewed official docs and official marketplace listing: **1**.

## Confirmed endpoint

| Method | Path | Purpose |
|---|---|---|
| POST | `/parseIngredients` | Parse one or more raw recipe-ingredient strings into structured ingredient JSON |

## Authentication and access
- The official `Get Started` links on the homepage, pricing page, and docs page all point to Zestful's official RapidAPI listing.
- The reviewed RapidAPI page identifies the current public DNS host as `zestful.p.rapidapi.com`.
- The reviewed public pages show a freemium/trial access model rather than an anonymous open endpoint.
- Because the public signed-out pages did not print a reusable credential example, the safest fireROUTE interpretation is: require caller-managed RapidAPI subscription credentials and host configuration.

## Request details

### POST `/parseIngredients`
Request body documented on the official docs page:
- JSON object with one required field:
  - `ingredients`: array of raw ingredient strings

Official body constraints:
- The `ingredients` array must contain between `1` and `100` elements.
- Each ingredient string must be `1,024` characters or fewer.
- Unicode strings are supported.
- Ingredient strings may be HTML-encoded or URL-encoded.
- Any HTML tags in ingredient strings are ignored.

Example request shape shown in the official docs:
```json
{
  "ingredients": [
    "3 large Granny Smith apples",
    "2 1/2 tablespoons finely chopped parsley",
    "½ tsp brown sugar"
  ]
}
```

## Response details
The official docs show a JSON response envelope with:
- `results[]`: per-ingredient parse results
- `requestsRemaining`: sandbox/free-tier remaining conversions counter
- `error`: top-level request error string or `null`

Each `results[]` item is documented with:
- `ingredientRaw`: original input string
- `ingredientParsed`: structured parse output object
- `confidence`: numeric confidence score
- `error`: per-item parse error string or `null`

Documented `ingredientParsed` fields:
- `quantity`
- `unit`
- `productSizeModifier`
- `product`
- `preparationNotes`
- `usdaInfo`

Documented nested `usdaInfo` fields visible in the official example:
- `category`
- `description`
- `fdcId`
- `matchMethod`

Important field notes stated on the docs page:
- `quantity` is `null` if no quantity is detected.
- `unit` is `null` if no unit is detected.
- Units are normalized to singular form (for example `teaspoon`, not `teaspoons`).
- `productSizeModifier` captures adjectives like `large` or `small`.
- `preparationNotes` captures user actions such as `finely chopped`.
- `product` is the food item Zestful believes the user buys to obtain the ingredient.

## Rate limits, quotas, and billing
Official pricing and quota notes confirmed from the reviewed pages:
- Trial tier: `30 ingredient parses per day`
- Professional tier: `$0.02 / ingredient`
- Enterprise tier: flat-fee private managed server with `Unlimited ingredient parses`
- The docs page says `requestsRemaining` exists on the sandbox/free demo server only.
- The docs page explicitly says paid plans have no hard daily cap on ingredient conversion requests.
- The free request quota resets every 24 hours.

## Pagination and errors
- Pagination: none documented; this is a single-operation POST parser endpoint.
- The public docs do not publish a formal HTTP status-code table.
- The docs do, however, document two error surfaces in the JSON body:
  - top-level `error` for whole-request failures
  - per-result `error` for ingredient-specific parse failures

## Known limitations
The official docs explicitly call out these unsupported inputs:
- mixtures of units in one ingredient string, such as `2 8-oz cans of canned pumpkin` or `2 Tbsp + 1 Tsp of cinnamon`
- non-numeric quantities such as `Three tablespoons`
- mixtures of multiple ingredients in one string such as `2 tsp vinegar + 1 tbsp baking powder`

## Important usage notes
- The homepage positions Zestful as a parser for recipe apps rather than a general grocery catalog API.
- The docs use USDA FoodData Central matches in example output, including `fdcId` references.
- Zestful's official marketing pages emphasize developer-friendly licensing terms:
  - unlimited data retention
  - no restrictions on resale
  - zero attribution requirement
- The docs/demo surface confirms that the endpoint accepts multiple ingredients in one request, which is the main batching mechanism.

## fireROUTE notes
- Default the hosted base URL to `https://zestful.p.rapidapi.com`.
- Model the provider as a one-route JSON POST API.
- Treat auth as RapidAPI-managed and caller-supplied.
- Do not invent pagination support.
- Preserve the documented request batching behavior through the `ingredients[]` array.
- Surface `requestsRemaining` as sandbox/free-tier metadata when present, but do not rely on it for paid-plan integrations.
