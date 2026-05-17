# EVA

Official sites manually reviewed:
- https://eva.pingutil.com/
- https://pingutil.com/

## Manual review result
The original EVA endpoint/site referenced by the provider index could not be recovered as a current standalone official API documentation surface.

What was confirmed during manual review:
- `https://eva.pingutil.com/` failed DNS resolution during review
- the obvious official alternative root, `https://pingutil.com/`, now serves a **different** current product branded simply as `pingutil`
- the current pingutil homepage documents a different API centered on domain/email intelligence and enrichment, with a `POST /v1/lookup` example, rather than the older EVA-specific email-validation product/docs

## Blocker details
Because the original EVA docs host is gone and the surviving official root now documents a materially different API/product, I could not responsibly confirm current EVA-specific base URLs, route surface, parameters, or response contracts for the original provider.

This is therefore a **documentation blocker / product drift** case rather than a normal incomplete scrape.

## What was visible on the current official alternative site
The current pingutil homepage explicitly shows:
- bearer-auth API usage
- example route: `POST /v1/lookup`
- example request body shape: `{ "input": "jane@stripe.com", "refresh?": ..., "include_raw?": ... }`

However, that appears to be the current pingutil product and not the historical EVA email-validator described by this provider file.

## Confirmed route count for the original EVA provider
Manual route count confirmed for the original EVA provider from currently available official docs: **0**.

## Recommendation
- Keep this provider flagged as blocked/deprecated unless a current official EVA-specific reference URL is recovered.
- Do **not** silently swap EVA to the newer pingutil `/v1/lookup` API without an intentional provider rename/migration decision.

## fireROUTE notes
- This provider should not be implemented from memory or from third-party mirrors.
- If the project wants to support the new pingutil API, it should likely be introduced as a separate provider rather than as a quiet rewrite of EVA.
