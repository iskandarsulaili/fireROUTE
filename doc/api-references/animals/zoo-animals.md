# Zoo Animals

## Manual review status
- Category: Animals
- Official docs URL from index: `https://zoo-animal-api.herokuapp.com/`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## What I checked
- Historical official root URL: `https://zoo-animal-api.herokuapp.com/`
- Historical direct API path: `https://zoo-animal-api.herokuapp.com/animals/rand`

## Blocker summary
- Both reviewed official URLs now return Heroku's `No such app` page.
- Because the provider's historical host no longer exists, I cannot confirm any live base URL, route inventory, parameters, auth requirements, pagination rules, or response contract from first-party material.

## Evidence from manual browser inspection
- Visiting `https://zoo-animal-api.herokuapp.com/` loaded title `No such app`.
- Visiting `https://zoo-animal-api.herokuapp.com/animals/rand` produced the same `No such app` result instead of JSON.

## fireROUTE note
- Keep Zoo Animals blocked until the maintainer republishes the API on a current first-party host or restores the Heroku app.
- Re-check both the root and `/animals/rand` before restoring any route assumptions.

## Sources inspected
- `https://zoo-animal-api.herokuapp.com/`
- `https://zoo-animal-api.herokuapp.com/animals/rand`
