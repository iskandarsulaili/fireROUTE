# Chinese Text Project

## Provider metadata
- Category: `Dictionaries`
- Provider slug: `chinese-text-project`
- Official pages reviewed manually:
  - `https://ctext.org/tools/api`
  - `https://ctext.org/`
- Current extraction outcome: explicit official access blocker
- Manually confirmed route count: `0`

## What the official pages currently show
Both reviewed first-party URLs now return the same provider-controlled access-block page instead of public API documentation.

Visible page title on both reviewed URLs:
- `Access unavailable`

Visible blocker details on both reviewed URLs:
- `Access to ctext.org is unavailable from your current location.`
- `Please note that the use of automatic download software on this website is strictly prohibited.`
- the page links to an institutional subscription page at `https://ctext.org/tools/subscribe`
- the page also presents a first-party `To request that this ban be removed, please click here.` message

The blocker page is bilingual and repeats the same availability warning in Chinese.

## Blocker summary
Because both the indexed API page and the official site root are currently replaced by the same first-party access-ban page, I could not manually confirm any live public API contract for this provider in this environment.

That means I could not reliably confirm:
- a usable API base URL
- endpoint paths
- HTTP methods
- request parameters
- authentication requirements
- rate limits
- pagination rules
- response or error schemas

## Official pages reviewed
### 1) Indexed API page
- URL: `https://ctext.org/tools/api`
- Result in this review: first-party `Access unavailable` block page

### 2) Official alternative page
- URL: `https://ctext.org/`
- Result in this review: same first-party `Access unavailable` block page

## Important usage notes
- This is not a dead-domain or unrelated-redirect situation in the current pass.
- The current blocker is explicit provider-side access denial from `ctext.org` itself.
- The page specifically warns against automated downloading and says access is unavailable from the current location.
- Re-review should start with the same two first-party URLs and only continue if the site begins serving public docs again.

## Verification note
This file was rebuilt manually from the current official API page and official root page using browser-based review only. No routes were counted because both first-party pages currently return an explicit access-block message.