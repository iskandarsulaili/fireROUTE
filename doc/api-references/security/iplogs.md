# IPLogs

## Provider metadata
- Category: `Security`
- Provider slug: `iplogs`
- Docs used manually:
  - `https://iplogs.com/docs`
- Confirmed REST API base URL: `https://iplogs.com`
- Primary media type: JSON
- Authentication: none
- Manually confirmed routes in this pass: `1`

## Authentication
From the official docs page:
- no authentication is required
- the page explicitly says: `No authentication, no signup, no SDK required.`

## Common request/response conventions
- Base URL: `https://iplogs.com`
- reviewed route uses `POST`
- request content type is `application/json`
- the docs say the endpoint is CORS-enabled for browser clients
- success responses are JSON objects containing verdict, scoring, IP intel, signals, and a request ID

## Manually confirmed endpoint set

### 1) Check an IP / client fingerprint
- Method: `POST`
- Path: `/v1/check`
- Full URL: `https://iplogs.com/v1/check`
- Purpose: detect VPN/proxy/Tor/datacenter risk for an IP and optional client-side corroboration signals
- Request body fields confirmed on the docs page:
  - `ip` - optional IP to check; docs say omit it to check the caller's source IP
  - `user_agent` - optional client user-agent
  - `timezone` - optional IANA timezone for timezone mismatch checks
  - `language` - optional BCP47 language tag for language mismatch checks
  - `webrtc_ip` - optional public IP exposed by WebRTC ICE gathering
  - `tcp_rtt_ms` - optional measured TCP handshake RTT in milliseconds
  - `tls_rtt_ms` - optional measured TLS handshake RTT in milliseconds
- Response fields explicitly visible in the docs example:
  - `verdict` - one of `clean`, `suspicious`, `vpn_likely`, `vpn_detected`
  - `score`
  - `is_vpn`
  - `confidence`
  - `ip_info.ip`
  - `ip_info.asn`
  - `ip_info.org`
  - `ip_info.isp`
  - `ip_info.country`
  - `ip_info.country_code`
  - `ip_info.city`
  - `ip_info.lat`
  - `ip_info.lon`
  - `ip_info.type` - one of `datacenter`, `isp`, `hosting`, `cellular`
  - `ip_info.is_vpn`
  - `ip_info.is_proxy`
  - `ip_info.vpn_provider`
  - `signals[]` with per-signal `type`, `weight`, `matched`, `detail`
  - `request_id`
- Important usage notes from the official page:
  - the docs headline calls this a `single REST endpoint`
  - the endpoint section says `IPv4 only at the moment (IPv6 support is planned)`
  - that note conflicts slightly with the request-body table, which still describes `ip` as `IPv4 or IPv6`; I documented the inconsistency instead of guessing

## Pagination
- none published; the reviewed API surface is a single check endpoint returning one result object

## Rate limits
From the official `Rate limits` section:
- soft limit: about `60 requests per minute` per source IP
- abuse is throttled rather than hard-blocked
- clients that exceed the threshold will receive `429`
- the page says sustained high-volume workloads should contact `admin@iplogs.com` about a dedicated tier

## Error and response notes
- the reviewed docs page primarily documents the success schema in detail
- explicitly documented throttling behavior:
  - HTTP `429` when the rate-limit threshold is exceeded
- the reviewed page did not publish a full generic error-body schema
- response format for successful requests is JSON

## Important usage notes
- the docs describe the verdict as being composed from `25+` signals
- the visible signal catalog includes examples across IP intel, TCP/IP, TLS, RTT, active probing, and client-mismatch layers
- the docs market the API as a free public endpoint with no signup requirement
- because request fields like `timezone`, `language`, and `webrtc_ip` are optional corroboration signals, clients can start with simple IP-only checks and add richer telemetry later

## Verification notes
This file was manually rebuilt from the official IPLogs documentation page using browser inspection.