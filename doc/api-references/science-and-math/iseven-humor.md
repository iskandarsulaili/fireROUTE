# isEven (humor)

## Provider metadata
- Category: `Science & Math`
- Provider slug: `iseven-humor`
- Description: `Check if a number is even`
- Official docs/pages used:
  - `https://isevenapi.xyz/` (official homepage and public API docs)
  - `https://api.isevenapi.xyz/api/iseven/6/` (official example endpoint linked from the homepage)
- Current public API base URL: `https://api.isevenapi.xyz/api`
- Auth model: the reviewed homepage presents a free public tier with no sign-in or key requirement for the documented public route; paid `Premium` and `Enterprise` plans are advertised, but the reviewed page does not publish a separate auth mechanism for them
- Methods officially documented on the reviewed pages: `GET`
- Response formats officially documented on the reviewed pages: JSON
- Rate limits: no numeric request-per-time-window limit was published on the reviewed official pages
- Manually confirmed route count: `1`

## API shape and behavior
- The homepage labels the public API URL as `https://api.isevenapi.xyz/api/`.
- The only route explicitly documented on the reviewed homepage is `GET /iseven/<number>/`.
- The homepage says `number` is the number you want to check.
- The linked example request is `https://api.isevenapi.xyz/api/iseven/6/`.

## Canonical endpoint
1. `GET /iseven/{number}/`
   - Return whether the supplied number is even.

## Confirmed parameters
### Path parameters
- `number` - required numeric value to test for parity

### Pricing / range notes published on the reviewed homepage
- `Public` tier range: `0 - 999,999`
- `Premium` tier range: `0 - 999,999,999`
- `Enterprise` tier range: `0 - 999,999,999,999`

## Response and error notes
### Example success response shown on the reviewed homepage
```json
{
  "iseven": true,
  "ad": "Buy isEvenCoin, the hottest new cryptocurrency!"
}
```

- The reviewed official homepage does not publish a formal error schema or HTTP status-code table.
- The reviewed pages do not describe pagination because this is a single-item compute/lookup endpoint rather than a listing API.

## Important usage notes
- Preserve the trailing-slash route shape shown in the official examples.
- Treat this provider as a one-route GET API with plan-dependent numeric-range limits rather than as a broader math service.
- The reviewed homepage markets paid plans but does not document a public API key header, query parameter, or OAuth flow on the reviewed public docs surface.

## fireROUTE normalization notes
- Use `https://api.isevenapi.xyz/api` as the canonical base URL.
- Preserve the exact path pattern `/iseven/{number}/`.
- Keep the documented JSON response lightweight around `iseven` and the provider's humorous `ad` field instead of inventing a richer schema.
