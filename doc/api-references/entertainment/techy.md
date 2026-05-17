# Techy

## Manual review status
- Category: Entertainment
- Official pages reviewed:
  - `https://techy-api.vercel.app/`
  - `https://techy-api.vercel.app/api/json`
- Manual review outcome: `manually_documented`
- Confirmed route count: `0`

## Blocker summary
- The official Techy host is currently unavailable as a live deployment.
- Both the root URL and an obvious JSON-route alternative return Vercel `404: NOT_FOUND` with `DEPLOYMENT_NOT_FOUND`.
- Because the provider-controlled deployment is missing, no current official route inventory, base URL contract, parameter list, auth model, rate limit, pagination behavior, or error schema can be confirmed.

## Evidence from manual inspection
### Official page attempt 1
- URL: `https://techy-api.vercel.app/`
- Result: `404: NOT_FOUND`
- Additional visible detail: `Code: DEPLOYMENT_NOT_FOUND`

### Official page attempt 2
- URL: `https://techy-api.vercel.app/api/json`
- Result: `404: NOT_FOUND`
- Additional visible detail: `Code: DEPLOYMENT_NOT_FOUND`

## fireROUTE note
- Treat Techy as a current deployment blocker.
- Revisit only if the official Vercel deployment or a replacement provider-controlled docs host comes back online.

## Sources inspected
- `https://techy-api.vercel.app/`
- `https://techy-api.vercel.app/api/json`
