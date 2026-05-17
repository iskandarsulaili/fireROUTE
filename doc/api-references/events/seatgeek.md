# SeatGeek

## Provider metadata
- Category: `Events`
- Provider slug: `seatgeek`
- Official pages manually reviewed in this pass:
  - `https://platform.seatgeek.com/`
  - `https://developer.seatgeek.com/login`
  - `https://developer.seatgeek.com/register`
  - `https://seatgeek.com/api-terms`
- Current official status confirmed from the reviewed pages: SeatGeek still operates a live API / SDK program, but the route-level documentation is gated behind a developer-portal account flow that now explicitly requires manual approval for unsolicited new accounts
- Manually confirmed current route count for this provider entry: `0`

## Manual review result
I manually rechecked SeatGeek's current public platform entrypoints, the live login / registration portal, and the public API terms page. The reviewed first-party pages clearly confirm that SeatGeek still has an active developer program, but the public web surface stops at login, signup, approval instructions, and legal terms. No public route inventory was visible in this review.

## What the reviewed official pages currently confirm
1. `https://platform.seatgeek.com/` currently resolves into SeatGeek's developer-portal login flow rather than a public endpoint catalog.
2. `https://developer.seatgeek.com/login` currently renders `Log In | Developer Portal`.
3. That login page explicitly says users who need access to the `SeatGeek public platform APIs` should send an inquiry to `tech-architecture@seatgeek.com`.
4. `https://developer.seatgeek.com/register` currently renders `Registration | Developer Portal` and says `New unsolicited Developer Accounts require manual approval`.
5. The registration page further instructs pending applicants to email `tech-architecture@seatgeek.com` with the documentation they want to access and why, and says those requests are reviewed weekly.
6. Both the login and registration pages link to SeatGeek's `API/SDK Terms` and `Privacy Notice`, confirming that the portal is part of a current maintained program rather than a dead historical artifact.
7. `https://seatgeek.com/api-terms` currently renders `Platform Terms of Use | SeatGeek` with a visible `Last updated on: March 17, 2025` notice.
8. The reviewed API terms define the `Developer Portal` as SeatGeek's public-facing developer portal, currently located at `https://developer.seatgeek.com/login`.
9. The same terms define `Documentation` as materials provided by SeatGeek that describe a SeatGeek API and provide installation, use, support, or maintenance instructions.
10. None of the reviewed public pages exposed endpoint tables, HTTP methods, parameter lists, authentication headers, pagination behavior, error schemas, or a publicly readable OpenAPI / Swagger surface.

## Current blocker
This is a manual-approval / login-gated-docs blocker, not a dead-provider case:
- SeatGeek still publicly acknowledges its APIs and SDKs
- the public platform hostname still resolves into the official developer portal
- the public registration flow now explicitly says new unsolicited developer accounts require manual approval
- the public API terms page is current and references the developer portal and documentation
- but the reviewed public surface still does not expose route-level technical documentation without portal access

Because of that gate, I could not responsibly confirm:
- production API base URL
- endpoint paths or HTTP methods
- query parameters or request bodies
- authentication header names, token formats, or signing rules
- pagination behavior
- numeric rate limits
- canonical response formats
- error envelopes

## Important usage notes
- Treat SeatGeek as an active API provider with manually approved, login-gated documentation, not as a discontinued API.
- Keep the confirmed route count at `0` until a publicly inspectable first-party route reference is visible.
- Use `https://platform.seatgeek.com/` as the category README discovery URL because it is the current public platform entrypoint, even though it leads into the gated portal.
- Do not backfill routes from historical SeatGeek examples, cached docs, or third-party SDKs.

## fireROUTE normalization notes
- Keep SeatGeek marked `manually_documented`.
- Keep the confirmed route count at `0`.
- Keep the events README docs URL pointed at `https://platform.seatgeek.com/`.
- Revisit only if SeatGeek restores a publicly readable route reference outside the manual-approval portal flow.
