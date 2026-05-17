# Portfolio Optimizer

Official docs manually reviewed:
- https://portfoliooptimizer.io/
- https://docs.portfoliooptimizer.io/index.html

## Overview
Portfolio Optimizer is a portfolio-analysis and optimization API. The official homepage presents it as a free financial-optimization web API, while the official API documentation host exposes a much larger OpenAPI-style catalog of analytical operations under version `v1`.

## Confirmed base URL and version
From the official API docs landing text:
- base URL: `https://api.portfoliooptimizer.io/`
- current version: `v1`

## Confirmed authentication model
The official API docs currently describe two access modes:
- anonymous usage: no authentication required, with "strict (but reasonable) API limits"
- authenticated usage: API key required in HTTP headers, with higher API limits

The reviewed docs text did **not** expose a numeric public rate-limit value during this pass.

## Confirmed endpoint
| Method | Path | Purpose | Confirmed body/parameters |
|---|---|---|---|
| POST | `/v1/portfolios/optimization/minimum-variance` | Compute a long-only minimum-variance portfolio | JSON body with `assets` and `assetsCovarianceMatrix` confirmed on the homepage example |

Manual route count confirmed directly from the reviewed official pages: **1** route.

## Confirmed request example
The official homepage currently shows this example call:

```text
POST https://api.portfoliooptimizer.io/v1/portfolios/optimization/minimum-variance
Content-Type: application/json
```

With example body fields:

```json
{
  "assets": 2,
  "assetsCovarianceMatrix": [[0.0025, 0.0005], [0.0005, 0.0100]]
}
```

## Response, errors, and pagination
What could be confirmed from the reviewed official pages:
- requests and responses use JSON
- the API documentation has dedicated sections for response codes and API status
- no pagination model was visible for the confirmed optimization endpoint

Because the reviewed pages were much more focused on the operation catalog than on a single shared error schema, this rewrite does not claim a universal error-body contract beyond the existence of dedicated response-code documentation.

## Important usage notes
- The homepage explicitly markets the service as free and usable without registration.
- The separate official docs host confirms that the service has many more analytical operations than the single homepage example shown here.
- This rewrite only counts the concrete route manually confirmed from the reviewed official pages; it does not infer the full route count from the docs navigation alone.
