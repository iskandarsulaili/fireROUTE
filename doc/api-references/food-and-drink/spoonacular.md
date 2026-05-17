# Spoonacular

Official pages manually reviewed:
- https://spoonacular.com/food-api
- https://spoonacular.com/food-api/docs
- https://spoonacular.com/food-api/faq

## Overview
- Base URL documented on the reviewed docs page: `https://api.spoonacular.com`
- Authentication: API key required on every request
- API key placement documented by Spoonacular:
  - query parameter: `apiKey`
  - header alternative: `x-api-key`
- Response formats seen in the reviewed docs: primarily JSON, with some image/widget endpoints returning HTML, SVG-like rendered content, or PNG assets
- Official docs note: parameters are case-sensitive and must use `apiKey`, not `apikey`

Manual route count confirmed from the reviewed official docs HTML: **107** unique method/path operations.

## Confirmed endpoints

### Core recipe routes
| Method | Path |
|---|---|
| GET | `/recipes/search` |
| GET | `/recipes/findByIngredients` |
| GET | `/recipes/findByNutrients` |
| GET | `/recipes/complexSearch` |
| GET | `/recipes/{id}/information` |
| GET | `/recipes/informationBulk` |
| GET | `/recipes/{id}/similar` |
| GET | `/recipes/random` |
| GET | `/recipes/autocomplete` |
| GET | `/recipes/{id}/analyzedInstructions` |
| GET | `/recipes/extract` |
| POST | `/recipes/analyze` |
| GET | `/recipes/{id}/summary` |
| GET | `/recipes/{id}/card` |
| POST | `/recipes/analyzeInstructions` |
| POST | `/recipes/cuisine` |
| GET | `/recipes/queries/analyze` |
| GET | `/recipes/convert` |
| POST | `/recipes/parseIngredients` |
| GET | `/recipes/guessNutrition` |
| POST | `/recipes/estimateNutrients` |
| GET | `/recipes/quickAnswer` |

### Recipe widgets, visualization, and nutrition/taste assets
| Method | Path |
|---|---|
| GET | `/recipes/{id}/tasteWidget.json` |
| GET | `/recipes/{id}/equipmentWidget.json` |
| GET | `/recipes/{id}/priceBreakdownWidget.json` |
| GET | `/recipes/{id}/ingredientWidget.json` |
| GET | `/recipes/{id}/nutritionLabel` |
| GET | `/recipes/{id}/nutritionLabel.png` |
| GET | `/recipes/{id}/nutritionWidget.json` |
| GET | `/recipes/{id}/ingredientWidget` |
| GET | `/recipes/{id}/ingredientWidget.png` |
| GET | `/recipes/{id}/tasteWidget` |
| GET | `/recipes/{id}/tasteWidget.png` |
| GET | `/recipes/{id}/equipmentWidget` |
| GET | `/recipes/{id}/equipmentWidget.png` |
| GET | `/recipes/{id}/priceBreakdownWidget` |
| GET | `/recipes/{id}/priceBreakdownWidget.png` |
| GET | `/recipes/{id}/nutritionWidget` |
| GET | `/recipes/{id}/nutritionWidget.png` |
| POST | `/recipes/visualizeTaste` |
| POST | `/recipes/visualizeNutrition` |
| POST | `/recipes/visualizePriceEstimator` |
| POST | `/recipes/visualizeEquipment` |
| POST | `/recipes/visualizeRecipe` |
| POST | `/recipes/visualizeIngredients` |

### Ingredient routes
| Method | Path |
|---|---|
| GET | `/food/ingredients/autocomplete` |
| GET | `/food/ingredients/search` |
| GET | `/food/ingredients/substitutes` |
| GET | `/food/ingredients/{id}/substitutes` |
| GET | `/food/ingredients/{id}/amount` |
| GET | `/food/ingredients/{id}/information` |
| POST | `/food/ingredients/glycemicLoad` |
| POST | `/food/ingredients/map` |

### Grocery product routes
| Method | Path |
|---|---|
| GET | `/food/products/{id}` |
| GET | `/food/products/search` |
| GET | `/food/products/upc/{upc}` |
| GET | `/food/products/upc/{upc}/comparable` |
| GET | `/food/products/suggest` |
| POST | `/food/products/classify` |
| POST | `/food/products/classifyBatch` |
| GET | `/food/products/{id}/nutritionLabel` |
| GET | `/food/products/{id}/nutritionLabel.png` |
| GET | `/food/products/{id}/nutritionWidget` |
| GET | `/food/products/{id}/nutritionWidget.png` |

### Custom foods
| Method | Path |
|---|---|
| GET | `/food/customFoods/search` |
| POST | `/food/customFoods/add` |

### Menu item routes
| Method | Path |
|---|---|
| GET | `/food/menuItems/suggest` |
| GET | `/food/menuItems/search` |
| GET | `/food/menuItems/{id}` |
| GET | `/food/menuItems/{id}/nutritionLabel` |
| GET | `/food/menuItems/{id}/nutritionLabel.png` |
| GET | `/food/menuItems/{id}/nutritionWidget` |
| GET | `/food/menuItems/{id}/nutritionWidget.png` |

### Meal planner and shopping list routes
| Method | Path |
|---|---|
| GET | `/mealplanner/generate` |
| GET | `/mealplanner/{username}/week/{start-date}` |
| GET | `/mealplanner/{username}/day/{date}` |
| POST | `/mealplanner/{username}/items` |
| DELETE | `/mealplanner/{username}/day/{date}` |
| DELETE | `/mealplanner/{username}/items/{id}` |
| GET | `/mealplanner/{username}/templates` |
| GET | `/mealplanner/public-templates` |
| GET | `/mealplanner/{username}/templates/{id}` |
| POST | `/mealplanner/{username}/templates` |
| DELETE | `/mealplanner/{username}/templates/{id}` |
| GET | `/mealplanner/{username}/shopping-list` |
| POST | `/mealplanner/{username}/shopping-list/{start-date}/{end-date}` |
| POST | `/mealplanner/shopping-list/compute` |
| POST | `/mealplanner/{username}/shopping-list/items` |
| DELETE | `/mealplanner/{username}/shopping-list/items/{id}` |
| POST | `/users/connect` |

### Wine routes
| Method | Path |
|---|---|
| GET | `/food/wine/dishes` |
| GET | `/food/wine/pairing` |
| GET | `/food/wine/description` |
| GET | `/food/wine/recommendation` |

### Image, video, and text-analysis routes
| Method | Path |
|---|---|
| POST | `/food/images/classify` |
| GET | `/food/images/classify` |
| POST | `/food/images/analyze` |
| GET | `/food/images/analyze` |
| POST | `/food/detect` |
| GET | `/food/search` |
| GET | `/food/videos/search` |
| GET | `/food/site/search` |
| GET | `/food/converse` |
| GET | `/food/converse/suggest` |
| GET | `/food/jokes/random` |
| GET | `/food/trivia/random` |
| GET | `/food/restaurants/search` |

## Confirmed parameters

### Global auth
- `apiKey` is required on every request according to the reviewed docs.
- Spoonacular explicitly says parameters are case-sensitive.
- The docs also allow `x-api-key` as a header alternative.

### Frequently documented search/list parameters
Across the reviewed docs, Spoonacular repeatedly documents:
- `query`
- `number`
- `offset`
- `sort`
- `include-tags`
- `exclude-tags`
- `includeNutrition`
- `addTasteData`
- `addWinePairing`
- `fields`

### Endpoint-specific examples confirmed in the reviewed docs
- `/recipes/complexSearch`: `query`, `cuisine`, `excludeCuisine`, `diet`, `intolerances`, plus many additional filters documented on the page
- `/recipes/findByNutrients`: nutrient min/max filters like `minCarbs`, `maxCarbs`, and `number`
- `/recipes/findByIngredients`: `ingredients`, `number`
- `/recipes/{id}/information`: optional `includeNutrition`
- `/recipes/random`: `number`, `include-tags`, `exclude-tags`
- `/recipes/convert`: `ingredientName`, `sourceAmount`, `sourceUnit`, `targetUnit`
- `/food/ingredients/search`: `query`, `number`, `sort`, `sortDirection`
- `/food/products/search`: `query`, `number`
- `/food/products/upc/{upc}`: UPC path parameter
- `/food/menuItems/search`: `query`, `number`
- `/checkin`-style routes do not exist here; all auth is API-key based rather than OAuth user scopes
- meal-planner routes use `username`, date path parameters, and shopping-list item/template identifiers as documented in the path strings

## Rate limits and quota notes
The reviewed official docs explicitly state:
- requests consume daily quota points
- typical cost is `1 point` plus `0.01 points` per result returned, but many endpoints are exceptions
- free-plan exhaustion returns HTTP `402`
- per-response quota headers:
  - `X-API-Quota-Request`
  - `X-API-Quota-Used`
  - `X-API-Quota-Left`
- rate limits depend on plan:
  - Free: `60 requests in 1 minute`
  - Starter: `120 requests in 1 minute`
  - Cook: `5 requests per second`
  - Culinarian: `10 requests per second`
  - Chef: `20 requests per second`
- exceeding request-rate limits returns HTTP `429`

## Response and format notes
- Core data endpoints return JSON.
- Widget/label/image endpoints can return rendered assets or PNGs rather than plain JSON.
- The reviewed docs expose per-endpoint quota costs at the bottom of each endpoint description.
- The docs page itself is HTML-rendered but contains the full official endpoint reference inline.

## Important usage notes
- The reviewed docs explicitly recommend `apiKey` in the query string or `x-api-key` header.
- Spoonacular's docs include a very broad surface area beyond search: meal planning, widgets, visualizations, grocery products, image analysis, conversational helpers, and restaurant search.
- The public docs page sometimes behaves inconsistently when loaded interactively, but the official docs HTML still contains the complete endpoint list and parameter tables.
- Widget/image endpoints should not be normalized as ordinary JSON endpoints.

## fireROUTE notes
- Treat `/recipes/complexSearch`, `/recipes/{id}/information`, `/food/ingredients/search`, `/food/products/search`, `/food/menuItems/search`, and `/mealplanner/generate` as the highest-value canonical routes.
- Preserve raw query passthrough on search endpoints because Spoonacular exposes many documented filters.
- Keep widget/image/PNG endpoints in a separate capability group from JSON data endpoints.
- Preserve quota headers and 402/429 handling because the official docs make them part of normal client behavior.
