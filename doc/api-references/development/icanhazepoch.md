# Icanhazepoch

## Provider metadata
- Category: `Development`
- Provider slug: `icanhazepoch`
- Docs used manually:
  - `https://icanhazepoch.com`
  - `https://major.io/p/extra-icanhaz-services-going-offline/`
  - `https://github.com/major/icanhaz`
- Confirmed REST API base URL: none currently published on a live official service page
- Status in this pass: blocked / service appears retired
- Manually confirmed routes in this pass: `0`

## Authentication
- the category index says no authentication is required
- the currently reachable official surfaces do not expose any live auth or request documentation because the public service appears retired

## Official blocker summary
I manually checked the official domain from the category index and one official alternative maintained by the original author.

What the official sources show in this session:
- `https://icanhazepoch.com` now redirects to an official blog post announcing that extra icanhaz services were going offline
- that post explicitly names the extra services and says they would go offline on `August 17, 2022`
- the official GitHub repository for `major/icanhaz` is archived and read-only
- the repository README still lists `icanhazepoch.com` among the historical services, but in this session it does not provide a current hosted API reference for a live public endpoint

## Official pages reviewed
### 1) Indexed domain
- URL: `https://icanhazepoch.com`
- Final location reached in this session: `https://major.io/p/extra-icanhaz-services-going-offline/`
- Result: official shutdown announcement instead of an API response or API docs page

### 2) Official alternative page
- URL: `https://github.com/major/icanhaz`
- Result: archived official source repository confirming `icanhazepoch.com` existed as part of the icanhaz family, but not providing current public route-level documentation for a live hosted service

## What could not be confirmed manually
Because the official domain now redirects to retirement information, I could not confirm from current official live sources:
- a functioning public base URL
- request method and path for a live hosted epoch endpoint
- current response format
- rate limits
- error schema
- uptime or availability guarantees

## Important usage notes
- do not treat `https://icanhazepoch.com` as a currently documented production API in fireROUTE without separate live verification
- the original author's official shutdown notice indicates the ancillary icanhaz services were intentionally taken offline
- if support is ever needed again, the archived official source repository may be useful for historical reconstruction or self-hosting, but it does not replace current live official docs

## Verification notes
This file was manually rebuilt from the official domain redirect target, the original author's official shutdown notice, and the archived official source repository using browser inspection.