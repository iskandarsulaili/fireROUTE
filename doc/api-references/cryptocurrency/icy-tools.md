# icy.tools

## Provider metadata
- Category: `Cryptocurrency`
- Provider slug: `icy-tools`
- Official pages manually reviewed in this pass:
  - `https://icy.tools/`
  - `https://developers.icy.tools/`
  - redirected destination `https://www.quicknode.com/?utm_source=icy.tools`
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually re-reviewed icy.tools from the official root site and the historical developer-doc hostname. In the current official root experience, icy.tools explicitly presents itself as shut down and migrated toward QuickNode, while the old developer-doc hostname no longer exposes an icy.tools route reference and instead redirects into QuickNode marketing pages.

## What the reviewed official pages currently confirm
### `https://icy.tools/`
The reviewed first-party homepage contains an explicit shutdown / migration notice confirming that:
- icy.tools has been officially shut down
- the team shifted focus to QuickNode
- the `Developer API` was migrated to `QuickNode's Graph API`
- users were instructed to migrate by `December 31st, 2023`
- former NFT Alerts users are directed toward QuickNode `QuickAlerts`

### `https://developers.icy.tools/`
- the legacy developer-doc hostname redirects to `https://www.quicknode.com/?utm_source=icy.tools`
- the destination is a QuickNode infrastructure / marketing page, not an icy.tools route-level API reference
- the redirect does not expose a preserved icy.tools base URL, endpoint list, auth contract, or response schema

## Blocker details
Because the provider's own root now declares the original product shut down and the legacy docs hostname redirects away from an icy.tools-controlled documentation surface, there is no currently reachable first-party icy.tools API reference from which to confirm live routes.

Because of that, I could not responsibly confirm:
- a current icy.tools API base URL
- endpoint paths or HTTP methods
- authentication requirements
- pagination behavior
- rate limits
- response formats
- error models

## fireROUTE normalization notes
- Keep icy.tools marked as `manually_documented` with `0` confirmed current routes.
- Do not treat QuickNode documentation as automatic continuity for the historical icy.tools provider entry.
- Treat the official state as shutdown / migration until a current first-party icy.tools route reference reappears or the provider entry is intentionally remapped with explicit catalog approval.
