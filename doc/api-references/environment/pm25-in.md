# PM25.in

## Provider metadata
- Category: `Environment`
- Provider slug: `pm25-in`
- Official docs inspected manually:
  - `http://www.pm25.in/api_doc`
  - resulting HTTPS domain page `https://www.pm25.in/api_doc`
- Manual review outcome: domain no longer serves public API docs
- Manually confirmed routes in this pass: `0`

## Blocker note
The documented PM25.in API documentation URL no longer exposes an API reference. During this pass it resolved to a parked/domain-owner contact page rather than a developer portal or endpoint documentation. No official alternative documentation path was surfaced from the inspected official host.

## What was still confirmed
- The original PM25.in documentation host is no longer serving the API docs.
- No official base URL, auth model, parameters, pagination rules, or error schema could be confirmed from the current official host.

## fireROUTE note
Treat this provider as blocked until an official PM25.in API reference reappears or an official successor documentation host is identified.