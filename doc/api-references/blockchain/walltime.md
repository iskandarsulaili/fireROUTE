# Walltime

Official docs manually reviewed:
- https://walltime.info/api.html
- https://walltime.info/

## Manual review result
Both the official API page and the provider root were unreachable during browser-based manual review:
- `https://walltime.info/api.html` → `ERR_NAME_NOT_RESOLVED`
- `https://walltime.info/` → `ERR_NAME_NOT_RESOLVED`

## Blocker
I could not reach any provider-controlled documentation or product page, so I could not manually confirm:
- a live base URL
- endpoint paths
- methods
- parameters
- authentication model
- rate limits
- response or error schema

## Current status for fireROUTE
Treat Walltime as **blocked/unverifiable** pending recovery of an official provider-controlled site or another clearly official first-party API reference.
