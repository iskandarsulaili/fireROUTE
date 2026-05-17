# Web3 Storage

## Provider metadata
- Category: `Cloud Storage & File Sharing`
- Provider slug: `web3-storage`
- Official docs/pages reviewed manually:
  - `https://web3.storage/` -> currently redirects to `https://storacha.network/`
  - `https://storacha.network/`
  - `https://docs.storacha.network/`
  - `https://docs.storacha.network/how-to/retrieve/`
- Current first-party branding: `Storacha`
- Manually confirmed live-route count: `2`

## Overview
The historical Web3.Storage service now redirects to Storacha, and the current first-party materials describe Storacha as the continuation of `web3.storage`.

From the reviewed official sources:
- `web3.storage` now redirects to `storacha.network`
- Storacha describes itself as a decentralized hot storage layer built on IPFS and Filecoin
- the official docs still document browser-usable HTTP retrieval through the Storacha gateway
- the reviewed docs do not expose a similarly clear browser-visible method/path table for uploads, account creation, or space-management HTTP calls, so only the directly confirmed retrieval routes are counted here

## Base URL patterns manually confirmed
The reviewed retrieval guide documents Storacha's optimized public IPFS gateway host pattern:
- `https://{cid}.ipfs.storacha.link`

Where:
- `{cid}` is the content CID of the upload you want to retrieve
- additional file paths can be appended after the trailing slash to retrieve a specific file within the CID-addressed directory

## Authentication
- No authentication is documented for public retrieval through `storacha.link`
- The reviewed docs describe Storacha's broader platform auth model in terms of decentralized identity and UCANs for account/client operations, but the public gateway retrieval flow itself is presented as CID-based and unauthenticated

## Route inventory
### 1) Retrieve or browse the root of a CID via the Storacha gateway
- Method: `GET`
- URL pattern: `https://{cid}.ipfs.storacha.link/`
- Purpose: fetch or browse the root content addressed by the CID
- Parameters confirmed from the docs:
  - `{cid}` host/subdomain parameter: content CID, typically in the `bafy...` form shown in the docs
- Auth: none documented
- Response notes:
  - when the CID represents a directory, the docs say you can view a list of all files in that directory from your browser
  - output is gateway-served content rather than a JSON API envelope

### 2) Retrieve a file under a CID-addressed directory
- Method: `GET`
- URL pattern: `https://{cid}.ipfs.storacha.link/{path}`
- Purpose: fetch a specific file stored under the CID-addressed directory
- Parameters confirmed from the docs:
  - `{cid}` host/subdomain parameter
  - `{path}` path parameter for the file within the directory
- Example pattern documented by Storacha:
  - `https://{cid}.ipfs.storacha.link/not-distributed.jpg`
- Auth: none documented
- Response notes:
  - returns the addressed file bytes/content for the resolved object
  - response media type depends on the stored file rather than a fixed API JSON schema

## Rate limits
The retrieval guide explicitly states:
- `storacha.link` has a rate limit of `200 requests per minute per IP`

The reviewed pages did not publish separate numeric limits for other Storacha HTTP surfaces in this pass.

## Pagination
- No pagination is documented for the reviewed gateway retrieval routes
- The reviewed docs discuss pagination for client-side listing operations, but those were documented as client capability calls rather than browser-visible HTTP method/path routes, so they are not counted here

## Errors and format notes
- The reviewed retrieval guide does not publish a route-by-route HTTP status code table for `storacha.link`
- Storacha links to the `Trustless Gateway Specification` for the full set of gateway parameters and options
- Response format is content-oriented, not a fixed JSON API envelope:
  - directory-style browsing at the CID root
  - raw file retrieval when a file path is requested

## Important usage notes
- Storacha's docs explicitly say all data stored on the Storacha Network is publicly retrievable by anyone with the correct CID; do not store private or sensitive information unencrypted
- The reviewed remove/upload docs also warn that removing data from your account does not guarantee permanent erasure from the decentralized network
- The docs say any public IPFS gateway can be used, but `storacha.link` is the Storacha-optimized gateway used in the official examples
- The official home page says Storacha `transforms web3.storage into a community-driven, decentralized hot storage network`, so this file treats Web3 Storage as a continuity entry under current Storacha branding
- The official materials mention that developers can use an HTTP interface, but in this pass only the retrieval gateway URL patterns were directly and safely confirmable as concrete browser-visible HTTP routes

## Verification note
This file was manually rebuilt from the current first-party redirect target, the live Storacha docs root, and Storacha's official retrieval guide using browser inspection only.