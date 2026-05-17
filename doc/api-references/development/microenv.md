# MicroENV

## Provider metadata
- Category: `Development`
- Provider slug: `microenv`
- Docs used manually:
  - `https://microenv.com/`
  - `https://app.microenv.com/docs`
- Confirmed REST API base URL: `https://app.microenv.com`
- Primary media types: configurable per generated method; the docs explicitly mention `Content-Type` selection and examples/reference text including `application/json` and `application/xml`, plus other custom structures such as HTML
- Authentication model surfaced in docs: no separate header/token auth is documented for invoking generated endpoints; access is controlled by the generated `{projectKey}` embedded in the request path, and the docs explicitly say anyone with that key can access the methods in the project's controllers
- Manually confirmed routes in this pass: `1`

## Authentication
From the official docs reviewed here:
- creating and managing projects/controllers/methods requires a MicroENV account and access to the app/dashboard
- public invocation of generated REST methods is documented through a path-scoped project key, not through a documented Bearer token or API-key header
- the docs explicitly state: `Anyone with this key will be able to access the methods within the controllers and invoke them.`
- the project defaults to an inactive state after creation; the docs say it must be set to active/public before it is publicly visible

## Common request/response conventions
- Base URL: `https://app.microenv.com`
- Confirmed REST path template: `/backend/key/{projectKey}/rest/{controller}/{method}`
- Confirmed HTTP methods available for generated methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Path parameters confirmed in the docs:
  - `{projectKey}` - generated unique project key
  - `{controller}` - controller path segment
  - `{method}` - method path segment
- Example published by the docs:
  - template: `https://app.microenv.com/backend/key/{projectKey}/rest/{controller}/{method}`
  - concrete example: `https://app.microenv.com/backend/key/123/rest/api/user/all`
- Method-definition fields confirmed in the docs:
  - HTTP method
  - name
  - description
  - URL/path
  - `Content-Type`
  - input model
  - output model
- Additional behavior/settings confirmed in the docs:
  - response delay can be configured in seconds
  - returned HTTP status is configurable and defaults to `200`
  - request/response header parameters can be edited in the controller method view
- Response format note:
  - MicroENV is not one fixed business API; each generated method returns the user-defined structure configured for that project/method

## Manually confirmed endpoint set

### 1) Generated project REST method
- Methods: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- Path template: `/backend/key/{projectKey}/rest/{controller}/{method}`
- Full base pattern: `https://app.microenv.com/backend/key/{projectKey}/rest/{controller}/{method}`
- Purpose: invoke a generated mock/static REST method that belongs to a specific MicroENV project/controller/method definition
- Path parameters:
  - `{projectKey}` - project-scoping key exposed by the MicroENV project
  - `{controller}` - controller route portion configured in the project
  - `{method}` - method route portion configured inside the controller
- Request/body behavior confirmed in docs:
  - request method is chosen when the endpoint is created
  - input/output structure is defined by the project author
  - content type is selected during method creation
- Response behavior confirmed in docs:
  - response body shape is whatever output model the project author configured
  - response delay can be intentionally added
  - returned status code is configurable per method and defaults to `200`

## Pagination
- the reviewed official docs do not describe pagination primitives such as page numbers, cursors, or offsets for MicroENV itself
- generated endpoints may of course implement their own payload schema, but no platform-level pagination contract was documented

## Rate limits and quotas
- the reviewed public docs do not publish a request-rate or concurrency limit for invoking generated REST methods
- the docs instead focus on account/subscription quotas for how many projects/controllers/methods can be created under a plan

## Error and response notes
- the reviewed docs do not publish a shared status-code/error-envelope table for generated endpoint invocation
- the strongest route-level behavior the docs confirm is that each generated method can be configured with a custom HTTP status and optional response delay
- because payloads are user-defined, fireROUTE should not assume one fixed global JSON schema across all MicroENV-generated endpoints

## Important usage notes
- MicroENV documents one dynamic route family rather than a fixed catalogue of product-owned resource endpoints
- the platform is best understood as a generated mock/static API host: the stable part is the URL pattern, while the actual controller/method combinations depend on each project
- the docs also state controllers/methods can be downloaded as generated source code, including complete project/dockerized output for some stacks
- for fireROUTE purposes, treat MicroENV as a route-template provider whose runtime surface is project-specific

## Verification notes
This file was manually rebuilt from the public MicroENV homepage and the official app/docs surface using browser inspection only.