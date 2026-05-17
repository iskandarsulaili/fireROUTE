# Real Time Finance

Official pages manually reviewed:
- https://github.com/Real-time-finance/finance-websocket-API/
- https://realtimefinance.io

## Manual review result
The surviving first-party materials do **not** currently expose a stable, provider-hosted public API endpoint that can be manually confirmed.

## What was confirmed
From the official GitHub repository:
- the project describes itself as a **public websocket API** for real-time financial market data
- the README documents a CLI/client workflow using commands such as:
  - `rtf add --market="NASDAQ" --stock="NFLX"`
  - `rtf add --market="NYSE" --stock="GS"`
  - `rtf add --market="FX" --stock="EURUSD"`
- the README shows an example output payload with fields such as `price`, `volume`, `time`, `symbol`, and `market`
- the README links to `https://realtimefinance.io`

From the official domain:
- `https://realtimefinance.io` now redirects to a parked-domain style landing page (`ww1.realtimefinance.io`) rather than a live API/product site

## Why this provider is blocked
The repository README still describes the idea of a public websocket service, but it does **not** publish a concrete `ws://` or `wss://` server URL on the reviewed page. The linked official domain no longer exposes the service and instead resolves to a parked page.

Because of that, no active hosted API endpoint can be manually verified from the current first-party sources.

## Base URLs
No live public base URL or WebSocket URL was manually confirmable from the current first-party sources.

## Authentication
No current auth model was manually confirmable.

## Confirmed routes
No concrete hosted HTTP or WebSocket route was manually confirmable from the reviewed official sources.

Manual route count confirmed: **0**.

## Response format notes
The GitHub README does show a representative event shape:

```json
{
  "price": 386.70,
  "volume": 665805,
  "time": 1643359743,
  "symbol": "NFLX",
  "market": "NASDAQ"
}
```

That confirms the shape of one example message, but not an active endpoint.

## fireROUTE note
Treat this provider as **effectively defunct / unhosted** for live integration until a provider-controlled domain again publishes a reachable public WebSocket endpoint.
