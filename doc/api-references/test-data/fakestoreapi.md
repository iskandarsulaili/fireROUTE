# FakeStoreAPI

## Provider metadata
- Category: `Test Data`
- Provider slug: `fakestoreapi`
- Docs used manually:
  - `https://fakestoreapi.com/`
  - `https://fakestoreapi.com/docs`
  - official downloadable OpenAPI document linked from the docs: `https://fakestoreapi.com/docs-data`
- Confirmed API base URL: `https://fakestoreapi.com`
- Authentication model surfaced in docs: no global auth scheme documented; a dedicated login route returns a JWT token for testing
- Primary response format: JSON
- Manually confirmed routes in this pass: `16`

## Authentication
- The reviewed official OpenAPI document does not publish a global `securitySchemes` section.
- Core CRUD examples for products, carts, and users are shown without API keys or bearer headers.
- The resource list on the homepage says the service includes a `Login Token` resource that returns a JWT token for testing authentication.
- The docs explicitly include a login route:
  - `POST /auth/login`
- The reviewed official docs do **not** explain any additional authenticated route family that must consume that token.

## Common request/response conventions
- Base URL: `https://fakestoreapi.com`
- The service is presented as a free fake e-commerce API for prototyping and testing.
- The official docs group routes into four resource families:
  - Products
  - Carts
  - Users
  - Auth
- The reviewed official schemas define these core object shapes:
  - `Product`
    - `id` integer
    - `title` string
    - `price` number/float
    - `description` string
    - `category` string
    - `image` string/URI
  - `Cart`
    - `id` integer
    - `userId` integer
    - `products` array
  - `User`
    - `id` integer
    - `username` string
    - `email` string
    - `password` string
  - `LoginResponse`
    - `token` string
- Route responses in the official Redoc are JSON and generally document `200`/`201` success plus `400 Bad request` for invalid requests.

## Manually confirmed endpoint set

### Products

#### 1) List products
- Method: `GET`
- Path: `/products`
- Purpose: retrieve all available products.
- Confirmed parameters: none shown on the official route page.
- Response: array of `Product` objects.

#### 2) Create product
- Method: `POST`
- Path: `/products`
- Purpose: create a new product.
- Request body fields confirmed in the official schema:
  - `id`
  - `title`
  - `price`
  - `description`
  - `category`
  - `image`
- Response: `201 Product created successfully` with a `Product`-shaped JSON object.

#### 3) Get product by ID
- Method: `GET`
- Path: `/products/{id}`
- Purpose: retrieve a product by identifier.
- Path parameters:
  - `id` - integer product ID
- Response: single `Product` object.

#### 4) Update product by ID
- Method: `PUT`
- Path: `/products/{id}`
- Purpose: update an existing product.
- Path parameters:
  - `id` - integer product ID
- Request body: `Product`-style JSON payload.
- Response: updated `Product` object.

#### 5) Delete product by ID
- Method: `DELETE`
- Path: `/products/{id}`
- Purpose: delete an existing product.
- Path parameters:
  - `id` - integer product ID
- Response: JSON success payload as documented in the Redoc route page.

### Carts

#### 6) List carts
- Method: `GET`
- Path: `/carts`
- Purpose: retrieve all available carts.
- Confirmed parameters: none shown on the official route page.
- Response: array of `Cart` objects.

#### 7) Create cart
- Method: `POST`
- Path: `/carts`
- Purpose: create a new cart.
- Request body fields confirmed from the official schema family:
  - `id`
  - `userId`
  - `products`
- Response: `201 Cart created successfully` with a `Cart` object.

#### 8) Get cart by ID
- Method: `GET`
- Path: `/carts/{id}`
- Purpose: retrieve a cart by identifier.
- Path parameters:
  - `id` - integer cart ID
- Response: single `Cart` object.

#### 9) Update cart by ID
- Method: `PUT`
- Path: `/carts/{id}`
- Purpose: update an existing cart.
- Path parameters:
  - `id` - integer cart ID
- Request body: `Cart`-style JSON payload.
- Response: updated `Cart` object.

#### 10) Delete cart by ID
- Method: `DELETE`
- Path: `/carts/{id}`
- Purpose: delete an existing cart.
- Path parameters:
  - `id` - integer cart ID
- Response: JSON success payload.

### Users

#### 11) List users
- Method: `GET`
- Path: `/users`
- Purpose: retrieve all users.
- Confirmed parameters: none shown on the official route page.
- Response: array of `User` objects.

#### 12) Create user
- Method: `POST`
- Path: `/users`
- Purpose: create a new user.
- Request body fields confirmed in the official schema:
  - `id`
  - `username`
  - `email`
  - `password`
- Response: `201 User created successfully` with a `User` object.

#### 13) Get user by ID
- Method: `GET`
- Path: `/users/{id}`
- Purpose: retrieve a user by identifier.
- Path parameters:
  - `id` - integer user ID
- Response: single `User` object.

#### 14) Update user by ID
- Method: `PUT`
- Path: `/users/{id}`
- Purpose: update an existing user.
- Path parameters:
  - `id` - integer user ID
- Request body: `User`-style JSON payload.
- Response: updated `User` object.

#### 15) Delete user by ID
- Method: `DELETE`
- Path: `/users/{id}`
- Purpose: delete an existing user.
- Path parameters:
  - `id` - integer user ID
- Response: JSON success payload.

### Auth

#### 16) Login
- Method: `POST`
- Path: `/auth/login`
- Purpose: authenticate a user and return a token.
- Request body fields confirmed in the official schema:
  - `username` - string
  - `password` - string
- Response notes:
  - returns a `LoginResponse` object
  - documented response field: `token` (string)
- Important note:
  - the homepage calls this the `Login Token` resource and describes the result as a JWT token for testing authentication

## Pagination
- The reviewed official docs do not document page, limit, offset, or cursor parameters.
- The confirmed collection routes appear to return full arrays.

## Rate limits
- No numeric rate-limit or quota policy was published on the reviewed homepage, Redoc docs, or official downloadable OpenAPI document.
- I did not infer a rate limit that the official docs did not state.

## Error handling
- The reviewed route pages consistently document `400 Bad request` as the standard client-error response.
- Success statuses vary by operation and include:
  - `200` for reads/updates/deletes
  - `201` for create operations
- The reviewed official docs did not publish a richer typed error-object schema beyond those status descriptions.

## Response format notes
- Responses are JSON.
- Collection routes return arrays of typed resource objects.
- Single-resource routes return a single typed resource object.
- The auth route returns a simple JSON token object.

## Important usage notes
- The product homepage positions the API as realistic but fake sample data for prototyping, teaching, and testing.
- The homepage's resources section says the dataset includes products, carts, users, and a login-token route.
- The official downloadable OpenAPI spec was the clearest source for the complete route inventory and base server URL, so I paired it with the official Redoc docs and homepage rather than relying on the marketing page alone.
- The current official route surface is notably compact and CRUD-oriented: three core resources plus one login route.

## Verification notes
This file was manually rebuilt from FakeStoreAPI's official homepage, official Redoc docs, and the official downloadable OpenAPI document linked from those docs.