# Codeship

## Provider metadata
- Category: `Continuous Integration`
- Provider slug: `codeship`
- Docs used manually:
  - `https://docs.cloudbees.com/docs/cloudbees-codeship/latest/api-overview/`
  - `https://docs.cloudbees.com/docs/cloudbees-common/latest/cloudbees-codeship-eol`
- Confirmed REST API base URL: none; no live official Codeship API reference remained available in the reviewed official surfaces
- Primary media type: unknown from the currently reachable official pages
- Status in this pass: blocked / end-of-life
- Manually confirmed routes in this pass: `0`

## Authentication
- the category index says `apiKey`
- the currently reachable official CloudBees material no longer exposes a live route reference that confirms header names, query names, or token issuance endpoints

## Official blocker summary
I manually checked the official docs URL from the category index and one official alternative page on the same vendor docs host.

What the official pages currently show:
- the indexed docs URL now redirects to CloudBees' official Codeship end-of-life announcement page
- the reachable CloudBees page is an end-of-life notice rather than an API reference
- no request paths, base URLs, schemas, pagination rules, or error models are published on the reviewed official pages in this session

## Official pages reviewed
### 1) Indexed docs URL
- URL: `https://docs.cloudbees.com/docs/cloudbees-codeship/latest/api-overview/`
- Final location reached in this session: `https://docs.cloudbees.com/docs/cloudbees-common/latest/cloudbees-codeship-eol`
- Result: official CloudBees end-of-life announcement page, not an API reference

### 2) Official alternative page
- URL: `https://docs.cloudbees.com/docs/cloudbees-common/latest/cloudbees-codeship-eol`
- Result: reachable official announcement page confirming product end-of-life, but it does not expose route-level API documentation

## What could not be confirmed manually
Because the official product docs now resolve to end-of-life content, I could not confirm any of the following from current official sources:
- production API base URL
- endpoint paths or methods
- auth header or query parameter names
- pagination format
- error schema
- response envelopes
- current rate limits

## Important usage notes
- treat Codeship as effectively deprecated from a documentation standpoint unless an archived official API reference is restored by CloudBees
- do not implement new fireROUTE mappings from the previously indexed URL alone; there is no current route-level official documentation there anymore
- if this provider must be supported later, it will likely require a separately located official archive or vendor-supplied legacy documentation

## Verification notes
This file was manually rebuilt from the currently reachable official CloudBees documentation pages using browser inspection. The provider remains blocked because the official API reference has been replaced by end-of-life material.