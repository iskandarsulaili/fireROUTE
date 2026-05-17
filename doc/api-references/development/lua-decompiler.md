# Lua Decompiler

## Manual review status
- Category: `Development`
- Provider slug: `lua-decompiler`
- Official docs URL from index: `https://lua-decompiler.ferib.dev/`
- Official alternative page checked: `https://ferib.dev/`
- Manual review outcome: `manual_blocked`
- Manually confirmed routes in this pass: `0`

## Manual first-party review
### Indexed official page
- URL: `https://lua-decompiler.ferib.dev/`
- Manual browser review did not reach provider-owned documentation.
- Navigation failed before content loaded with `net::ERR_NAME_NOT_RESOLVED`.
- No route list, auth guide, examples, or response-format documentation was reachable from the indexed host.

### Official alternative page
- URL: `https://ferib.dev/`
- Manual browser review of the maintainer's first-party site loaded successfully.
- The rendered title was `Ferib - Cyber Security Researcher`.
- The visible projects list referenced `Online Lua (5.1) Decompiler (demo)`, but only as a struck-through / ceased project entry rather than a live API reference.
- The checked first-party alternative did not publish a base URL, endpoint inventory, HTTP methods, parameters, authentication rules, rate limits, pagination behavior, or response schemas for a current public API.

## Route-level findings
No trustworthy route-level API contract could be confirmed from current first-party material in this pass.

### Base URL
- None currently verifiable.

### Endpoint paths and methods
- None currently verifiable.

### Parameters and request bodies
- None currently verifiable.

### Authentication
- None currently verifiable.

### Pagination
- None currently verifiable.

### Rate limits
- None currently verifiable.

### Errors and format notes
- The indexed docs/demo hostname currently fails with DNS resolution errors.
- The checked maintainer site confirms project history but does not expose a current route-level API contract.
- No trustworthy first-party request examples, response schemas, documented error payloads, or payload-format notes were reachable in this environment.

### Important usage notes
- Do not reconstruct Lua Decompiler routes from old demos, mirrors, blog posts, or memory while the current first-party API surface is unavailable.
- Reattempt only if the project restores a reachable provider-controlled API reference.

## Why this remains blocked
- The indexed docs/demo host no longer resolves.
- The checked first-party maintainer site references the project only as a struck-through historical demo and does not document a current public API.
- Because no trustworthy provider-controlled documentation surface was reachable, fireROUTE could not safely verify base URL, route inventory, parameters, authentication, pagination rules, rate limits, errors, response formats, or usage notes.

## fireROUTE status
- Keep this provider as `manual_blocked` with `0` confirmed routes until Lua Decompiler restores readable first-party documentation.

## Verification notes
This file was manually rewritten from live official-site browser review plus file edits only.
