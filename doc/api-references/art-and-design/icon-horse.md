# Icon Horse

## Manual review status
- Category: Art & Design
- Official pages reviewed:
  - `https://icon.horse/`
- Manual review outcome: `manually_documented`
- Confirmed route count: `1`

## API overview
- Base URL: `https://icon.horse`
- Authentication: none for the public Hobby tier shown on the official site
- Response format: image content suitable for direct `<img>` usage
- CORS: the category index marks CORS as supported
- Rate limits / quotas:
  - free Hobby plan: `up to 1,000 icons/month`
  - paid Pro plan: `up to 100,000 icons/month`
  - Enterprise: custom / unlimited according to the marketing page

## Confirmed endpoints
| Method | Path | Key parameters | Notes |
|---|---|---|---|
| GET | `/icon/{domain}` | `domain` path parameter | Returns the favicon for the requested site domain, with provider-managed fallbacks when no icon is available. |

## Confirmed parameters and behavior
- `domain` is the target website hostname shown in the official example, such as `discord.com` or `signal.org`
- The official page presents the API as URL-only usage: `https://icon.horse/icon/{domain}`
- The service is described as cached, fault tolerant, and designed to avoid broken images

## Response, pagination, and errors
- The reviewed official page documents image delivery rather than JSON responses
- No pagination model is documented
- No formal error schema or HTTP status table is published on the reviewed page
- The site explicitly says a fallback icon is returned even when the target website does not exist or cannot be reached

## Important usage notes
- The provider markets this as a direct favicon URL service rather than a multi-route REST API
- The official page emphasizes no cookies and no tracking on the service itself
- The free tier includes generic fallbacks for sites with no icons

## Sources inspected
- `https://icon.horse/`
