# Shibe.Online

## Manual review status
- Category: Animals
- Official docs URL from index: `http://shibe.online/`
- Manual review outcome: `manual_blocked`
- Route count confirmed: `0`

## What I checked
- Official root URL (HTTPS): `https://shibe.online/`
- Historical direct API path: `https://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`

## Blocker summary
- The provider-controlled host no longer exposes documentation or API responses.
- Both the root URL and the historical API path now redirect off-domain into parking/click-tracking infrastructure instead of returning Shibe content.
- In this run both requests landed on `click-v4.junclikrmedi.com` tracking URLs rather than on a Shibe-controlled page or JSON response.
- Because the official host has fallen into third-party redirect/parking behavior, I cannot confirm any live base URL, parameters, auth rules, pagination behavior, rate limits, or response format from first-party material.

## Evidence from manual browser inspection
- Visiting `https://shibe.online/` redirected away from the provider domain and ended on a `click-v4.junclikrmedi.com/click2?...` URL with no provider content.
- Visiting `https://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true` produced the same off-domain click-tracking outcome instead of JSON.

## fireROUTE note
- Keep Shibe.Online blocked until the official domain again serves provider-controlled docs or live API responses.
- Re-check both the root and a historical `/api/shibes` request before restoring any route assumptions.

## Sources inspected
- `https://shibe.online/`
- `https://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true`
